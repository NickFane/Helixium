# ========================================
# DOMAIN CONFIGURATION FOR HELIXIUM
# Configures helixium.nicholasfane.com
# ========================================

# ========================================
# 1. SSL CERTIFICATE
# ========================================

# Request SSL certificate from AWS Certificate Manager
resource "aws_acm_certificate" "helixium" {
  domain_name       = "${var.subdomain}.${var.domain_name}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name    = "helixium-cert"
    Project = "helixium"
  }
}

# Certificate validation records (you'll need to add these to your DNS)
output "certificate_validation_records" {
  description = "DNS records to add to your domain for certificate validation"
  value = {
    for dvo in aws_acm_certificate.helixium.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }
}

# ========================================
# 2. APPLICATION LOAD BALANCER
# ========================================

# Security group for ALB
resource "aws_security_group" "alb" {
  name        = "helixium-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = aws_vpc.helixium.id

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "helixium-alb-sg"
    Project = "helixium"
  }
}

# Application Load Balancer
resource "aws_lb" "helixium" {
  name               = "helixium-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false

  tags = {
    Name    = "helixium-alb"
    Project = "helixium"
  }
}

# ALB Target Group
resource "aws_lb_target_group" "helixium" {
  name        = "helixium-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.helixium.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name    = "helixium-tg"
    Project = "helixium"
  }
}

# HTTP Listener (redirects to HTTPS)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.helixium.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# HTTPS Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.helixium.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.helixium.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.helixium.arn
  }
}

# ========================================
# 3. ECS SERVICE UPDATES
# ========================================

# Note: The ECS service is updated in ecs.tf to use the ALB
# This ensures we don't have duplicate resource definitions

# ========================================
# 4. OUTPUTS
# ========================================

output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.helixium.dns_name
}

output "domain_url" {
  description = "Your application URL"
  value       = "https://${var.subdomain}.${var.domain_name}"
}

output "certificate_arn" {
  description = "ARN of the SSL certificate"
  value       = aws_acm_certificate.helixium.arn
}
