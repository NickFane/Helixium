# GitHub Actions Workflows

This directory contains the GitHub Actions workflows for the Helixium project.

## Workflows

### 1. `terraform-deploy.yml` - Unified Terraform Deployment

**Purpose**: Handles both bootstrap and infrastructure deployment in a single workflow.

**Triggers**:

- Push to `main` or `master` branch
- Changes to `terraform/**` files
- Manual workflow dispatch

**What it does**:

1. **Bootstrap Backend**: Creates S3 bucket and DynamoDB table for Terraform state (if they don't exist)
2. **Deploy Infrastructure**: Creates all AWS resources (ECR, ECS, VPC, etc.)
3. **Verify Deployment**: Checks that all resources were created successfully
4. **Output Summary**: Provides deployment information and next steps

**Resources Created**:

- S3 Bucket: `helixium-terraform-state`
- DynamoDB Table: `helixium-terraform-locks`
- ECR Repositories: `helixium-web`, `helixium-web-dev`
- ECS Cluster: `helixium-cluster`
- ECS Service: `helixium-service`
- VPC, Subnets, Security Groups
- IAM Roles for ECS
- CloudWatch Log Group

### 2. `build-and-push.yml` - Docker Image Building

**Purpose**: Builds and pushes Docker images to ECR.

**Triggers**:

- Push to `main` or `master` branch
- Pull requests
- Changes to Docker-related files
- Manual workflow dispatch

**What it does**:

- Builds production images for main/master branch
- Builds development images for pull requests
- Pushes images to appropriate ECR repositories

### 3. `deploy-application.yml` - Application Deployment

**Purpose**: Deploys the application to ECS.

### 4. `docker-validation.yml` - Docker Validation

**Purpose**: Validates Docker configurations.

### 5. `helixium-web-ci.yml` - Frontend CI

**Purpose**: Runs CI checks for the frontend application.

## Workflow Dependencies

```
terraform-deploy.yml → build-and-push.yml → deploy-application.yml
```

1. **terraform-deploy.yml** creates the infrastructure
2. **build-and-push.yml** builds and pushes Docker images
3. **deploy-application.yml** deploys the application

## Environment Variables Required

### Repository Variables

- `AWS_REGION`: AWS region (e.g., `ap-southeast-2`)

### Repository Secrets

- `AWS_ACCESS_KEY_ID`: AWS access key for GitHub Actions user
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for GitHub Actions user

## Usage

### First Time Setup

1. Ensure AWS credentials are configured in repository secrets
2. Push to main branch or manually trigger `terraform-deploy.yml`
3. The workflow will create all necessary infrastructure

### Regular Development

1. Push changes to trigger appropriate workflows
2. Infrastructure changes trigger `terraform-deploy.yml`
3. Docker changes trigger `build-and-push.yml`
4. Application changes trigger `deploy-application.yml`

## Benefits of Unified Workflow

- **Simplified Management**: Single workflow handles both bootstrap and deployment
- **No Dependencies**: No need to run workflows in sequence
- **Better Error Handling**: All steps in one place with proper error reporting
- **Cleaner State Management**: Consistent state handling across all resources
- **Easier Debugging**: All logs in one place
