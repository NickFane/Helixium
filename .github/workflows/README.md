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
  - Development image (main/master branch)
- Updates ECS task definition with new image
- Deploys to ECS and waits for stability
- Provides application URL for testing

**Note:** This workflow only runs on main/master branches. PR validation is handled separately by the `helixium-web-ci-cd.yml` workflow.

**When to use:**

- Application code changes
- Docker configuration changes
- New application deployments

### 3. Helixium Web CI/CD (Test, Build & Deploy)

**File:** `helixium-web-ci-cd.yml`

**Purpose:** Complete CI/CD pipeline that tests, builds, validates, and deploys the frontend application to development environment.

**Triggers:**

- **Push** to `feature/**`, `cursor/**`, `main`, and `master` branches
- Changes to `helixium-web/**`, Docker files, workflows, or Terraform files
- Changes to Docker-related files (`Dockerfile*`, `docker-compose.yml`, `nginx.conf`, `.dockerignore`)
- Manual trigger for testing

**What it does:**

#### Frontend Validation:

- Installs dependencies with Yarn
- Runs ESLint for code quality
- Performs TypeScript type checking
- Builds the application for production

#### Docker Validation:

- Validates Docker Compose configuration
- Tests production and development Docker builds
- Verifies container startup functionality
- Validates Nginx configuration
- Reports Docker image sizes
- Cleans up test images

#### PR Quality Gate Benefits:

- **Pre-Merge Validation**: Ensures code quality before PR merge
- **Comprehensive Testing**: Validates both frontend and Docker changes
- **Quality Assurance**: Prevents broken builds from reaching main branch
- **Clear Feedback**: Detailed reporting for PR reviewers
- **Manual Override**: Can be triggered manually for testing
- **No ECR Pushes**: PRs do NOT push images to ECR, only validate locally

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

### Workflow Linking

The application deployment workflow is linked to the infrastructure workflow using the `workflow_run` trigger. This means:

- **When infrastructure changes:** Terraform workflow runs → Application workflow waits and then runs
- **When only application changes:** Application workflow runs immediately (no waiting)
- **Manual triggers:** Application workflow can be triggered manually at any time

### Trigger Logic

The application workflow will run when:

1. **Direct push trigger:** Changes to `helixium-web/**`, `Dockerfile*`, etc.
2. **Workflow dependency:** Infrastructure workflow completes successfully
3. **Manual trigger:** Manual workflow dispatch

The workflow includes a condition to only run when:

- It's a manual trigger, OR
- It's a direct push trigger, OR
- It's triggered by a successful infrastructure workflow run

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
