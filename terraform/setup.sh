#!/bin/bash

# Helixium ECR Terraform Setup Script

set -e

echo "🚀 Setting up Helixium ECR infrastructure with Terraform..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   brew install awscli"
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first:"
    echo "   brew install terraform"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured. Please run:"
    echo "   aws configure"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Copy example terraform.tfvars if it doesn't exist
if [ ! -f terraform.tfvars ]; then
    echo "📝 Creating terraform.tfvars from example..."
    cp terraform.tfvars.example terraform.tfvars
    echo "⚠️  Please edit terraform.tfvars to set your preferred AWS region"
    echo "   Press Enter when ready to continue..."
    read
fi

# Initialize Terraform
echo "🔧 Initializing Terraform..."
terraform init

# Plan the deployment
echo "📋 Planning Terraform deployment..."
terraform plan

echo ""
echo "🤔 Do you want to apply this configuration? (y/N)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🚀 Applying Terraform configuration..."
    terraform apply -auto-approve
    
    echo ""
    echo "✅ Infrastructure deployed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Create IAM access keys for GitHub Actions:"
    echo "   aws iam create-access-key --user-name github-actions-helixium"
    echo ""
    echo "2. Add the following secrets to your GitHub repository:"
    echo "   - AWS_ACCESS_KEY_ID"
    echo "   - AWS_SECRET_ACCESS_KEY"
    echo "   - AWS_REGION"
    echo "   - ECR_REPOSITORY_URL"
    echo ""
    echo "3. The ECR repository URLs are:"
    terraform output -raw ecr_repository_url
    terraform output -raw ecr_dev_repository_url
else
    echo "❌ Deployment cancelled"
fi
