# ECS Cluster
resource "aws_ecs_cluster" "helixium" {
  name = "helixium-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name    = "helixium-cluster"
    Project = "helixium"
  }
}

# Load Balancer removed for cost optimization
# Direct access via ECS task public IP

# ECS Task Definition
resource "aws_ecs_task_definition" "helixium" {
  family                   = "helixium"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256 # Minimum for Fargate
  memory                   = 512 # Minimum for Fargate
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "helixium-web"
      image = "${aws_ecr_repository.helixium_web.repository_url}:latest"

      portMappings = [
        {
          containerPort = 80
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.helixium.name
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
    Name    = "helixium-task-def"
    Project = "helixium"
  }
}

# ECS Service (Updated to use ALB)
resource "aws_ecs_service" "helixium" {
  name            = "helixium-service"
  cluster         = aws_ecs_cluster.helixium.id
  task_definition = aws_ecs_task_definition.helixium.arn
  desired_count   = 1 # Minimum for availability
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false # No longer needed with ALB
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.helixium.arn
    container_name   = "helixium-web"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.https]

  tags = {
    Name    = "helixium-service"
    Project = "helixium"
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "helixium" {
  name              = "/ecs/helixium"
  retention_in_days = 7

  tags = {
    Name    = "helixium-logs"
    Project = "helixium"
  }
}

# IAM Role for ECS Execution
resource "aws_iam_role" "ecs_execution_role" {
  name = "helixium-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name    = "helixium-ecs-execution-role"
    Project = "helixium"
  }
}

# Attach ECS execution policy
resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# IAM Role for ECS Tasks
resource "aws_iam_role" "ecs_task_role" {
  name = "helixium-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name    = "helixium-ecs-task-role"
    Project = "helixium"
  }
}

# Outputs
output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.helixium.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.helixium.name
}

output "access_instructions" {
  description = "Instructions for accessing the application"
  value       = "Access your application via the ECS task public IP. Use 'aws ecs describe-tasks --cluster ${aws_ecs_cluster.helixium.name} --tasks $(aws ecs list-tasks --cluster ${aws_ecs_cluster.helixium.name} --service-name ${aws_ecs_service.helixium.name} --query 'taskArns[0]' --output text) --query 'tasks[0].attachments[0].details[?name==`publicIp`].value' --output text' to get the public IP."
}
