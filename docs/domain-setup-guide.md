# Domain Setup Guide for Helixium

This guide walks you through setting up a custom domain name for your Helixium application.

## Overview

Currently, your app is accessible via the ECS task's public IP address. To use a proper domain name, you'll need to:

1. **Purchase a domain** (external to this repo)
2. **Configure Terraform** to use domain mode
3. **Add an Application Load Balancer** (ALB) to your infrastructure
4. **Set up SSL certificate** using AWS Certificate Manager
5. **Configure DNS** to point to your ALB
6. **Update ECS service** to use the ALB instead of direct public IP

## Step 1: Purchase a Domain

**Options:**

- **AWS Route 53**: $12/year, integrates well with AWS
- **Namecheap**: ~$10-15/year, good value
- **GoDaddy**: ~$12-15/year, widely used
- **Google Domains**: ~$12/year, simple interface

**Recommendation**: AWS Route 53 for seamless integration, or Namecheap for cost savings.

## Step 2: Configure Terraform

### 2.1 Create terraform.tfvars

Copy the example configuration:

```bash
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
```

### 2.2 Update terraform.tfvars

Set your domain configuration:

```hcl
# AWS Region
aws_region = "ap-southeast-2"

# Domain Configuration
domain_name = "nicholasfane.com"
subdomain   = "helixium"
```

### 2.3 Understanding the Configuration

This will create:

- **Application Load Balancer** for `https://helixium.nicholasfane.com`
- **SSL certificate** from AWS Certificate Manager
- **ECS service** configured to use the ALB

## Step 3: Deploy Infrastructure

### 3.1 Deploy with Domain Support

```bash
cd terraform
terraform plan
terraform apply
```

### 3.2 Get Certificate Validation Records

If using domain mode, you'll need to add DNS records for certificate validation:

```bash
terraform output certificate_validation_records
```

## Step 4: DNS Configuration

### 4.1 Certificate Validation

Add the CNAME record from the Terraform output to your domain's DNS settings:

```
Name: _abc123.helixium
Type: CNAME
Value: _abc123.def456.ghijklmnop.acm-validations.aws.
TTL: 300
```

### 4.2 Main DNS Record

After certificate validation (5-30 minutes), add the main A record:

```
Name: helixium
Type: A
Value: [Get from: terraform output alb_dns_name]
Alias: Yes (if supported)
```

## Step 5: Deploy Application

Once DNS is configured, deploy your application:

```bash
git add .
git commit -m "Configure domain for helixium.nicholasfane.com"
git push origin main
```

## Step 6: Testing

1. **Wait for DNS propagation** (can take up to 48 hours, usually much faster)
2. **Test HTTPS**: Visit `https://helixium.nicholasfane.com`
3. **Test HTTP redirect**: Visit `http://helixium.nicholasfane.com` (should redirect to HTTPS)
4. **Test health endpoint**: Visit `https://helixium.nicholasfane.com/health`

## Cost Impact

Adding a domain will increase your monthly costs by approximately:

- **ECS Fargate**: ~$5-10/month
- **Application Load Balancer**: ~$16/month
- **Route 53**: ~$0.50/month
- **Data Transfer**: ~$1-3/month
- **SSL Certificate**: Free (AWS Certificate Manager)

**Total**: ~$22-30/month

**Additional cost**: ~$16-17/month compared to direct IP access

## Troubleshooting

### Certificate Validation Fails

1. **Check DNS propagation**: Use `dig` or online tools
2. **Verify CNAME record**: Ensure it matches exactly
3. **Wait longer**: DNS changes can take time

### ALB Health Checks Fail

1. **Check security groups**: Ensure ALB can reach ECS tasks
2. **Verify health endpoint**: Ensure `/health` returns 200
3. **Check target group**: Verify ECS tasks are registered

### Domain Not Resolving

1. **Check DNS records**: Verify A record points to ALB
2. **Wait for propagation**: DNS changes take time
3. **Test with dig**: `dig helixium.nicholasfane.com`

## Security Considerations

- **HTTPS only**: HTTP automatically redirects to HTTPS
- **Security groups**: ALB only allows HTTP/HTTPS traffic
- **SSL policy**: Uses modern TLS 1.2+ only
- **Certificate auto-renewal**: AWS handles this automatically

## Next Steps

Once your domain is working:

1. **Update documentation** with your new URL
2. **Configure monitoring** for the domain
3. **Set up alerts** for certificate expiration
4. **Consider CDN** (CloudFront) for global performance
5. **Add custom error pages** for better UX

## Example URLs

After setup, your app will be accessible at:

- **Production URL**: `https://helixium.nicholasfane.com`
- **HTTP redirect**: `http://helixium.nicholasfane.com` → `https://helixium.nicholasfane.com`

The old public IP access will no longer be used.
