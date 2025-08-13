# Terraform Infrastructure for Helixium ECR

This directory contains Terraform configuration to set up AWS ECR repositories and IAM permissions for GitHub Actions.

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform installed (v1.0 or higher)

## Setup Instructions

1. **Configure AWS credentials**:
   ```bash
   aws configure
   ```

2. **Copy the example variables file**:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. **Edit terraform.tfvars** to set your preferred AWS region:
   ```hcl
   aws_region = "us-west-2"  # or your preferred region
   ```

4. **Initialize Terraform**:
   ```bash
   terraform init
   ```

5. **Review the plan**:
   ```bash
   terraform plan
   ```

6. **Apply the configuration**:
   ```bash
   terraform apply
   ```

## What this creates

- **ECR Repositories**:
  - `helixium-web` - for production Docker images
  - `helixium-web-dev` - for development Docker images

- **IAM User**: `github-actions-helixium` with permissions to push to ECR

## After deployment

1. **Get the IAM user access keys**:
   ```bash
   aws iam create-access-key --user-name github-actions-helixium
   ```

2. **Add the following secrets to your GitHub repository**:
   - `AWS_ACCESS_KEY_ID` - The access key ID from step 1
   - `AWS_SECRET_ACCESS_KEY` - The secret access key from step 1
   - `AWS_REGION` - Your AWS region (e.g., us-east-1)
   - `ECR_REPOSITORY_URL` - The ECR repository URL (output from terraform)

## Cleanup

To destroy the infrastructure:
```bash
terraform destroy
```

## Security Notes

- The IAM user has minimal permissions required for ECR operations
- ECR repositories have image scanning enabled
- Consider using OIDC instead of access keys for production environments
