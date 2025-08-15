# Development Environment Infrastructure for Feature Branch Deployments

# Additional ECS Service for Development
resource "aws_ecs_service" "helixium_dev" {
  name            = "helixium-dev-service"
  cluster         = aws_ecs_cluster.helixium.id
  task_definition = aws_ecs_task_definition.helixium_dev.arn
  desired_count   = 0 # Start with 0, scale up during deployments
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.helixium_dev.arn
    container_name   = "helixium-web-dev"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.https]

  tags = {
    Name        = "helixium-dev-service"
    Project     = "helixium"
    Environment = "development"
  }
}

# Development Task Definition
resource "aws_ecs_task_definition" "helixium_dev" {
  family                   = "helixium-dev"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "helixium-web-dev"
      image = "${aws_ecr_repository.helixium_web_dev.repository_url}:latest"

      portMappings = [
        {
          containerPort = 80
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = "development"
        },
        {
          name  = "DEPLOYMENT_ENV"
          value = "dev"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.helixium_dev.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "wget --quiet --tries=1 --spider http://localhost/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name        = "helixium-dev-task-def"
    Project     = "helixium"
    Environment = "development"
  }
}

# Development Target Group
resource "aws_lb_target_group" "helixium_dev" {
  name     = "helixium-dev-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.helixium.id

  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  tags = {
    Name        = "helixium-dev-target-group"
    Project     = "helixium"
    Environment = "development"
  }
}

# Development CloudWatch Log Group
resource "aws_cloudwatch_log_group" "helixium_dev" {
  name              = "/ecs/helixium-dev"
  retention_in_days = 3 # Shorter retention for dev

  tags = {
    Name        = "helixium-dev-logs"
    Project     = "helixium"
    Environment = "development"
  }
}

# Additional ALB Listener Rule for dev subdomain
resource "aws_lb_listener_rule" "dev_subdomain" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.helixium_dev.arn
  }

  condition {
    host_header {
      values = ["dev.helixium.nicholasfane.com"]
    }
  }

  tags = {
    Name        = "helixium-dev-listener-rule"
    Project     = "helixium"
    Environment = "development"
  }
}

# Outputs for development environment
output "dev_service_name" {
  description = "Name of the development ECS service"
  value       = aws_ecs_service.helixium_dev.name
}

output "dev_task_definition_family" {
  description = "Family name of the development task definition"
  value       = aws_ecs_task_definition.helixium_dev.family
}

output "dev_target_group_arn" {
  description = "ARN of the development target group"
  value       = aws_lb_target_group.helixium_dev.arn
}
