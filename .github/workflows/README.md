# GitHub Actions Workflows

This directory contains the GitHub Actions workflows for the Helixium project.

## Workflows

### 1. `deploy-and-build.yml` - Unified Deployment and Build

**Purpose**: Handles complete infrastructure deployment and Docker image building in a single workflow.

**Triggers**:

- Push to `main` or `master` branch
- Changes to `terraform/**`, `Dockerfile*`, or application files
- Manual workflow dispatch

**What it does**:

#### Part 1: Infrastructure Deployment

1. **Bootstrap Backend**: Creates S3 bucket and DynamoDB table for Terraform state (if they don't exist)
2. **Deploy Infrastructure**: Creates all AWS resources (ECR, ECS, VPC, etc.)
3. **Verify ECR Repositories**: Ensures ECR repositories are created before proceeding
4. **Get Outputs**: Extracts ECR repository URLs and ECS information

#### Part 2: Docker Build and Push

1. **Login to ECR**: Authenticates with Amazon ECR
2. **Build Production Images**: For main/master branch
3. **Build Development Images**: For main/master and pull requests
4. **Push Images**: Pushes to the correct ECR repositories

#### Part 3: Verification and Summary

1. **Verify Deployment**: Checks all resources are working
2. **Deployment Summary**: Provides comprehensive output

**Resources Created**:

- S3 Bucket: `helixium-terraform-state`
- DynamoDB Table: `helixium-terraform-locks`
- ECR Repositories: `helixium-web`, `helixium-web-dev`
- ECS Cluster: `helixium-cluster`
- ECS Service: `helixium-service`
- VPC, Subnets, Security Groups
- IAM Roles for ECS
- CloudWatch Log Group

**Images Built and Pushed**:

- Production: `helixium-web:latest`, `helixium-web:{sha}`
- Development: `helixium-web-dev:{sha}`
- PR Images: `helixium-web-dev:pr-{number}-{sha}`

### 2. `deploy-application.yml` - Application Deployment

**Purpose**: Deploys the application to ECS.

### 3. `docker-validation.yml` - Docker Validation

**Purpose**: Validates Docker configurations.

### 4. `helixium-web-ci.yml` - Frontend CI

**Purpose**: Runs CI checks for the frontend application.

## Workflow Flow

```
deploy-and-build.yml → deploy-application.yml
```

1. **deploy-and-build.yml** creates infrastructure and builds images

   - Creates all AWS infrastructure (S3, DynamoDB, ECR, ECS, VPC, etc.)
   - Builds and pushes Docker images to ECR
   - Provides comprehensive verification and summary

2. **deploy-application.yml** deploys the application
   - Deploys the application to ECS using the built images

## Environment Variables Required

### Repository Variables

- `AWS_REGION`: AWS region (e.g., `ap-southeast-2`)

### Repository Secrets

- `AWS_ACCESS_KEY_ID`: AWS access key for GitHub Actions user
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for GitHub Actions user

## Usage

### First Time Setup

1. Ensure AWS credentials are configured in repository secrets
2. Push to main branch or manually trigger `deploy-and-build.yml`
3. The workflow will create all necessary infrastructure and build images

### Regular Development

1. Push changes to trigger the unified workflow
2. Infrastructure and Docker changes trigger `deploy-and-build.yml`
3. Application changes trigger `deploy-application.yml`

## Benefits of Unified Workflow

- **Single Workflow**: Everything runs together in the correct order
- **No Dependencies**: No need to coordinate between separate workflows
- **Better Error Handling**: All steps in one place with comprehensive error reporting
- **Cleaner State Management**: Consistent state handling across all resources
- **Easier Debugging**: All logs in one place
- **Guaranteed Order**: Infrastructure is always created before images are built
- **Simplified Management**: One workflow to rule them all
