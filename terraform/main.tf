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


