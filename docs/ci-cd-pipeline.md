# CI/CD Pipeline Documentation

## Overview

This document describes the complete CI/CD pipeline for Helixium, including AWS infrastructure provisioning with Terraform, Docker image building, and automated deployment to Amazon ECR.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  GitHub Actions │───▶│   AWS ECR       │
│                 │    │                 │    │                 │
│ feature/*       │    │ Build & Push    │    │ helixium-web    │
│ main/master     │    │ Workflow        │    │ helixium-web-dev│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Terraform     │
                       │ Infrastructure  │
                       │                 │
                       │ • ECR Repos     │
                       │ • IAM Users     │
                       │ • Permissions   │
                       └─────────────────┘
```

## Infrastructure (Terraform)

### Location: `terraform/`

**Purpose**: Provision AWS infrastructure for CI/CD pipeline

### Components

#### ECR Repositories

- **`helixium-web`** - Production Docker images
- **`helixium-web-dev`** - Development Docker images

#### IAM Configuration

- **User**: `github-actions-helixium`
- **Policy**: `helixium-ecr-access`
- **Permissions**: ECR push/pull operations only

### Setup Instructions

1. **Prerequisites**

   ```bash
   brew install terraform awscli
   aws configure  # Set up AWS credentials
   ```

2. **Deploy Infrastructure**

   ```bash
   cd terraform
   ./setup.sh
   ```

3. **Create IAM Access Keys**
   ```bash
   aws iam create-access-key --user-name github-actions-helixium
   ```

### Configuration Files

- **`main.tf`** - Core infrastructure resources
- **`variables.tf`** - Variable definitions
- **`terraform.tfvars.example`** - Configuration template
- **`setup.sh`** - Automated deployment script

## GitHub Actions Workflows

### 1. Docker Validation (`docker-validation.yml`)

**Trigger**: PRs and pushes to main/master with Docker-related changes

**Purpose**: Validate Docker builds and configurations before deployment

**Actions**:

- Validate Docker Compose configuration
- Build production and development images
- Test container startup
- Validate Nginx configuration
- Check image sizes
- Cleanup test images

### 2. Build and Push to ECR (`build-and-push.yml`)

**Trigger**:

- `push` to `main/master` - Builds both production and development images
- `pull_request` to `main/master` - Builds only development images

**Environment**: `dev` (GitHub environment with secrets)

**Actions**:

- Configure AWS credentials
- Login to Amazon ECR
- Build and push Docker images with conditional logic

## Workflow Logic

### Pull Request Events

```
┌─────────────────┐
│   Pull Request  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Build Dev Image │
│ Tag: pr-{PR}-{SHA} │
└─────────────────┘
```

### Push to Main/Master

```
┌─────────────────┐
│ Push to Main    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐
│ Build Prod Image│    │ Build Dev Image │
│ Tags: latest,   │    │ Tag: {SHA}      │
│ {SHA}, semver   │    └─────────────────┘
└─────────────────┘
```

## Environment Variables

### GitHub Environment: `dev`

#### Secrets (Sensitive Data)

- `AWS_ACCESS_KEY_ID` - IAM user access key
- `AWS_SECRET_ACCESS_KEY` - IAM user secret key

#### Variables (Non-sensitive)

- `AWS_REGION` - AWS region (e.g., `ap-southeast-2`)
- `ECR_REPOSITORY_URL` - ECR repository URL

## Image Tagging Strategy

### Production Images (`helixium-web`)

- **`latest`** - Latest production build
- **`{SHA}`** - Commit-specific build
- **`{major}.{minor}`** - Semantic versioning
- **`{version}`** - Full semantic version

### Development Images (`helixium-web-dev`)

- **`pr-{PR_NUMBER}-{SHA}`** - Pull request builds
- **`{SHA}`** - Main/master branch builds

## Security Considerations

### IAM Permissions

- Minimal required permissions for ECR operations
- No access to other AWS services
- Principle of least privilege

### GitHub Security

- Secrets stored in GitHub environment
- Environment protection rules (if configured)
- No sensitive data in logs

### Docker Security

- Multi-stage builds reduce attack surface
- Non-root user in production images
- Image scanning enabled in ECR

## Troubleshooting

### Common Issues

1. **AWS Region Not Provided**

   - Ensure `AWS_REGION` is set in GitHub environment variables
   - Check environment configuration in repository settings

2. **ECR Login Failed**

   - Verify IAM credentials are correct
   - Check IAM user has ECR permissions
   - Ensure AWS region matches ECR repository region

3. **Workflow Not Triggering**
   - Check branch name matches trigger conditions
   - Verify file paths in trigger configuration
   - Ensure workflow file is in correct location

### Debug Steps

1. **Check Environment Variables**

   ```yaml
   - name: Debug environment
     run: |
       echo "Event: ${{ github.event_name }}"
       echo "Branch: ${{ github.ref_name }}"
       echo "AWS Region configured: ${{ vars.AWS_REGION != '' }}"
   ```

2. **Verify AWS Configuration**
   ```yaml
   - name: Verify AWS configuration
     run: aws sts get-caller-identity
   ```

## Maintenance

### Regular Tasks

1. **Rotate IAM Access Keys** (every 90 days)

   ```bash
   aws iam create-access-key --user-name github-actions-helixium
   # Update GitHub secrets with new keys
   aws iam delete-access-key --user-name github-actions-helixium --access-key-id OLD_KEY
   ```

2. **Update Terraform State**

   ```bash
   cd terraform
   terraform plan
   terraform apply
   ```

3. **Clean Up Old Images**
   - ECR lifecycle policies (if configured)
   - Manual cleanup of old PR images

### Monitoring

- GitHub Actions workflow status
- ECR repository usage and costs
- Docker build times and success rates
- AWS CloudWatch metrics (if enabled)

## Future Enhancements

### Potential Improvements

1. **OIDC Authentication**

   - Replace IAM access keys with OIDC
   - More secure authentication method

2. **Multi-Environment Support**

   - Staging environment
   - Production environment
   - Environment-specific configurations

3. **Advanced Tagging**

   - Git tag-based releases
   - Automated semantic versioning
   - Release candidate builds

4. **Security Scanning**

   - Trivy vulnerability scanning
   - Container image signing
   - SBOM generation

5. **Deployment Automation**
   - ECS/Fargate deployment
   - Blue-green deployments
   - Rollback capabilities

## Related Documentation

- [Docker Implementation](docker-implementation.md) - Container configuration
- [Development Workflow](development-workflow.md) - Development practices
- [Project Setup](project-setup.md) - Initial setup guide
