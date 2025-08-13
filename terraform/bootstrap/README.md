# Terraform Backend Bootstrap

This directory contains the Terraform configuration to bootstrap the backend infrastructure needed for the main Terraform deployment.

## What This Creates

- **S3 Bucket**: `helixium-terraform-state` - Stores Terraform state files
- **DynamoDB Table**: `helixium-terraform-locks` - Provides state locking for concurrent operations

## Security Features

- **Encryption**: S3 bucket uses AES256 encryption
- **Versioning**: S3 bucket has versioning enabled for state file history
- **Public Access Blocked**: S3 bucket blocks all public access
- **State Locking**: DynamoDB table prevents concurrent state modifications

## Usage

### Option 1: GitHub Actions (Recommended)

1. Go to your GitHub repository
2. Navigate to "Actions" → "Bootstrap Terraform Backend"
3. Click "Run workflow"
4. Type "bootstrap" in the confirmation field
5. Click "Run workflow"

### Option 2: Manual Steps

```bash
cd terraform/bootstrap
terraform init
terraform plan
terraform apply
```

## After Bootstrap

Once the backend infrastructure is created:

1. **Update main Terraform backend**:

   ```bash
   cd terraform
   terraform init -migrate-state
   ```

2. **Verify state migration**:

   ```bash
   terraform state list
   ```

3. **Deploy main infrastructure**:
   ```bash
   terraform plan
   terraform apply
   ```

## Cost

- **S3 Bucket**: ~$0.023 per GB per month (minimal for state files)
- **DynamoDB Table**: Pay-per-request (minimal for locking operations)

Total cost: ~$1-2 per year for the backend infrastructure.

## Cleanup

To destroy the backend infrastructure:

```bash
cd terraform/bootstrap
terraform destroy
```

**Warning**: This will delete the S3 bucket and all state files. Only do this if you want to completely remove the infrastructure.
