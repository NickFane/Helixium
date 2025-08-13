terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ECR Repository for Helixium Docker images
resource "aws_ecr_repository" "helixium_web" {
  name                 = "helixium-web"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "helixium-web"
    Environment = "production"
    Project     = "helixium"
  }
}

# ECR Repository for development images
resource "aws_ecr_repository" "helixium_web_dev" {
  name                 = "helixium-web-dev"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "helixium-web-dev"
    Environment = "development"
    Project     = "helixium"
  }
}

# IAM User for GitHub Actions
resource "aws_iam_user" "github_actions" {
  name = "github-actions-helixium"
  path = "/system/"

  tags = {
    Name    = "github-actions-helixium"
    Project = "helixium"
  }
}

# IAM Policy for ECR access
resource "aws_iam_policy" "ecr_access" {
  name        = "helixium-ecr-access"
  description = "Policy for GitHub Actions to push to ECR"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = [
          aws_ecr_repository.helixium_web.arn,
          aws_ecr_repository.helixium_web_dev.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      }
    ]
  })
}

# Attach policy to IAM user
resource "aws_iam_user_policy_attachment" "github_actions_ecr" {
  user       = aws_iam_user.github_actions.name
  policy_arn = aws_iam_policy.ecr_access.arn
}

# Outputs
output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.helixium_web.repository_url
}

output "ecr_dev_repository_url" {
  description = "URL of the ECR development repository"
  value       = aws_ecr_repository.helixium_web_dev.repository_url
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}


