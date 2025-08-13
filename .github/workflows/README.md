# Helixium CI/CD Workflows

This directory contains the GitHub Actions workflows for the Helixium project. The workflows have been refactored to provide clear separation of concerns and better maintainability.

## Workflow Overview

### 1. Build and Deploy Terraform Infrastructure

**File:** `build-and-deploy-terraform.yml`

**Purpose:** Deploy and manage AWS infrastructure using Terraform.

**Triggers:**

- Push to `main` or `master` branch with changes to:
  - `terraform/**` files
  - The workflow file itself
- Manual trigger via workflow_dispatch

**What it does:**

- Bootstraps Terraform backend (S3 + DynamoDB)
- Deploys AWS infrastructure:
  - VPC, subnets, security groups
  - ECR repositories for Docker images
  - ECS cluster, task definitions, and services
  - IAM roles and CloudWatch log groups
- Verifies infrastructure deployment
- Outputs ECR repository URLs and ECS service information

**When to use:**

- Initial infrastructure setup
- Infrastructure changes (networking, ECS configuration, etc.)
- Adding new AWS resources

### 2. Build and Deploy Application

**File:** `build-and-deploy-application.yml`

**Purpose:** Build Docker images and deploy the application to ECS.

**Triggers:**

- Push to `main` or `master` branch with changes to:
  - `helixium-web/**` files
  - `Dockerfile*` files
  - `docker-compose.yml`
  - `nginx.conf`
  - `.dockerignore`
  - The workflow file itself
- Manual trigger via workflow_dispatch (with optional image tag)

**What it does:**

- Verifies infrastructure is deployed
- Retrieves ECR repository URLs from Terraform outputs
- Builds and pushes Docker images:
  - Production image (main/master branch)
  - Development image (all branches)
- Updates ECS task definition with new image
- Deploys to ECS and waits for stability
- Provides application URL for testing

**When to use:**

- Application code changes
- Docker configuration changes
- New application deployments

### 3. Docker Validation

**File:** `docker-validation.yml`

**Purpose:** Validate Docker builds and configurations.

**Triggers:**

- Pull requests
- Changes to Docker-related files

**What it does:**

- Validates Dockerfile syntax
- Tests Docker builds
- Checks for security vulnerabilities

### 4. Helixium Web CI

**File:** `helixium-web-ci.yml`

**Purpose:** Run tests and linting for the React application.

**Triggers:**

- Changes to `helixium-web/**` files
- Pull requests

**What it does:**

- Installs dependencies
- Runs linting
- Executes tests
- Builds the application

## Workflow Dependencies

```
Infrastructure Deployment (Terraform)
           ↓
    ECR Repositories Created
           ↓
    Application Deployment
           ↓
    ECS Service Running
```

## Environment Variables

### Required Secrets

- `AWS_ACCESS_KEY_ID`: AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for deployment

### Optional Variables

- `AWS_REGION`: AWS region (defaults to `ap-southeast-2`)

## Deployment Process

### First Time Setup

1. **Deploy Infrastructure:**

   - Push changes to `terraform/` folder
   - This triggers `build-and-deploy-terraform.yml`
   - Creates all AWS resources including ECR repositories

2. **Deploy Application:**
   - Push changes to `helixium-web/` folder
   - This triggers `build-and-deploy-application.yml`
   - Builds Docker images and deploys to ECS

### Ongoing Development

- **Infrastructure changes:** Modify `terraform/` files → triggers infrastructure deployment
- **Application changes:** Modify `helixium-web/` files → triggers application deployment
- **Docker changes:** Modify Dockerfiles → triggers application deployment

## Best Practices

1. **Infrastructure First:** Always deploy infrastructure before application
2. **Test Locally:** Use `terraform plan` to preview infrastructure changes
3. **Monitor Deployments:** Check workflow logs for any issues
4. **Use Manual Triggers:** For testing specific image tags or configurations
5. **Review Changes:** Always review Terraform plans before applying

## Troubleshooting

### Common Issues

1. **Infrastructure Not Deployed:**

   - Run the infrastructure workflow first
   - Check AWS credentials and permissions

2. **ECR Repository Not Found:**

   - Ensure infrastructure deployment completed successfully
   - Check Terraform outputs for correct repository URLs

3. **ECS Service Not Starting:**

   - Check task definition and container configuration
   - Verify security groups and networking
   - Review CloudWatch logs for container errors

4. **Region Mismatch:**
   - Ensure all workflows use the same AWS region
   - Check Terraform state and backend configuration

### Debugging Steps

1. Check workflow logs for specific error messages
2. Verify AWS resources exist in the correct region
3. Test Terraform commands locally
4. Check ECS service events and task logs
5. Verify ECR repository access and image tags

## Security Considerations

- AWS credentials are stored as GitHub secrets
- ECR repositories are private by default
- Security groups restrict access appropriately
- IAM roles follow least privilege principle
- Terraform state is encrypted and stored securely

## Cost Optimization

- ECS tasks use minimum Fargate resources (256 CPU, 512MB memory)
- CloudWatch logs have 7-day retention
- S3 bucket lifecycle policies can be added for cost management
- Consider using Spot instances for development environments
