# Feature Branch Development Deployment Pipeline

## Overview

This document details the complete feature/cursor branch development deployment pipeline implemented for Helixium. Every push to a `feature/*` or `cursor/*` branch automatically deploys a preview environment to `https://dev.helixium.nicholasfane.com`.

## 🎯 What We Built

### Automated Development Pipeline
- **Trigger**: Any push to `feature/*` or `cursor/*` branches
- **Process**: Validation → Build → Deploy → Test → Notify
- **Result**: Live preview environment within 5-10 minutes
- **Cost**: Optimized with auto-scaling (0 when not needed)

## 🏗️ Architecture

### Infrastructure Components

#### AWS Resources
```
├── ECR Repository: helixium-web-dev
├── ECS Service: helixium-dev-service (Fargate)
├── ECS Task Definition: helixium-dev
├── ALB Target Group: helixium-dev-tg
├── ALB Listener Rule: dev.helixium.nicholasfane.com
├── Route 53 CNAME: dev.helixium.nicholasfane.com
└── ACM Certificate: *.helixium.nicholasfane.com (multi-domain)
```

#### Infrastructure as Code
- **`terraform/dev-environment.tf`**: Dev-specific ECS resources
- **`terraform/domain.tf`**: SSL certificate with dev subdomain support
- **Deployment**: Via CI/CD pipeline (never manual terraform apply)

### GitHub Actions Workflow

#### Single Optimized Workflow
**File**: `.github/workflows/helixium-web-ci-cd.yml`

**Jobs**:
1. **Test-Build** (🔍 Test, Build & Validate)
2. **Deploy-Dev** (🚀 Deploy to Dev Environment) 
3. **Summary** (📋 CI/CD Summary)

## 🔄 Workflow Deep Dive

### Triggers
```yaml
on:
  push:
    branches:
      - "feature/**"  # All feature branches
      - "cursor/**"   # All cursor branches
      - "main"        # Production deployment
      - "master"      # Production deployment
    paths:
      - "helixium-web/**"
      - "Dockerfile*"
      - "docker-compose.yml"
      - "nginx.conf"
      - ".dockerignore"
      - ".github/workflows/**"
      - "terraform/**"
```

### Job 1: Test, Build & Validate  
**Purpose**: Complete CI pipeline - test, build, and validate all components

**Key Optimizations**:
- **Single Docker build** with dual tags (validation + deployment)
- **Artifact creation** for seamless handoff to deployment
- **Comprehensive validation** (lint, typecheck, E2E tests)

```yaml
# Single build with multiple tags - ELIMINATES DUPLICATION
- name: Build production Docker image (validation + deployment)
  uses: docker/build-push-action@v5
  with:
    tags: |
      helixium-web-test           # For validation
      helixium-web:${{ github.sha }}  # For deployment
```

### Job 2: Development Deployment
**Purpose**: Deploy feature branch to dev environment

**Deployment Flow**:
1. **Download artifact** (pre-built Docker image)
2. **Tag for dev ECR** (`feature-branch-name-SHA` + `feature-branch-name-latest`)
3. **Push to dev ECR** 
4. **Update ECS task definition** with new image
5. **Auto-scale service** (0→1 if needed)
6. **Deploy with zero-downtime** (rolling update)
7. **Health check** (test HTTPS endpoint)
8. **Slack notification** with `@here`

**Deployment Conditions**:
```yaml
if: needs.test-build.result == 'success' && (startsWith(github.ref, 'refs/heads/feature/') || startsWith(github.ref, 'refs/heads/cursor/'))
```

**Cost Optimization**:
- Service starts at `desired_count: 0`
- Auto-scales to 1 only when deploying
- Cleaned up when PR is closed

## 🚀 Developer Workflow

### Typical Development Cycle

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/awesome-new-feature
   # or
   git checkout -b cursor/awesome-new-feature
   ```

2. **Make Changes & Push**
   ```bash
   git add .
   git commit -m "implement awesome feature"
   git push -u origin feature/awesome-new-feature
   # or
   git push -u origin cursor/awesome-new-feature
   ```

3. **Automatic Pipeline**
   - ✅ Test & Build runs (5-8 minutes)
   - ✅ Deployment runs (3-5 minutes)
   - ✅ Slack notification sent
   - ✅ Environment live at `https://dev.helixium.nicholasfane.com`

4. **Test & Iterate**
   - Every subsequent push updates the same dev environment
   - Zero manual intervention required

5. **Create Pull Request**
   - One workflow run (no duplicates!)
   - Dev environment remains active for testing

6. **Merge & Cleanup**
   - Feature branch cleanup workflow scales service to 0
   - Old Docker images pruned automatically

## 🎨 Key Engineering Decisions

### 1. Single Workflow Strategy
**Problem**: Multiple workflows causing duplicate runs and complexity
**Solution**: Merged everything into `helixium-web-ci-cd.yml`
**Benefit**: Predictable, efficient, maintainable

### 2. Docker Build Optimization  
**Problem**: Building same image twice (validation + deployment)
**Solution**: Single build with multiple tags
**Benefit**: ~50% faster CI, consistent images

### 3. Artifact-Based Deployment
**Problem**: Rebuilding images in different jobs
**Solution**: Build once, save as artifact, deploy from artifact
**Benefit**: Guaranteed consistency, faster deployment

### 4. Push-Only Triggers
**Problem**: Duplicate workflow runs (push + PR synchronize)
**Solution**: Use only push triggers, remove pull_request
**Benefit**: Single workflow run per push

### 5. Infrastructure as Code
**Problem**: Manual AWS resource management
**Solution**: Complete Terraform definition with CI/CD deployment
**Benefit**: Reproducible, version-controlled infrastructure

## 📊 Performance Metrics

### Build Times
- **Before Optimization**: ~8-12 minutes (duplicate builds)
- **After Optimization**: ~5-8 minutes (single build)
- **Improvement**: ~40% faster

### Deployment Times
- **Full Pipeline**: 8-13 minutes (validation + deployment)
- **Deployment Only**: 3-5 minutes (after validation)
- **Health Check**: 30 seconds - 5 minutes

### Cost Efficiency
- **Idle Cost**: $0 (service scaled to 0)
- **Active Cost**: ~$0.10/hour during development
- **Auto-cleanup**: Automatic scaling on PR close

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### 1. "Unable to describe task definition"
**Cause**: Dev infrastructure not deployed
**Solution**: Deploy terraform via CI/CD or manually

#### 2. "Certificate must have fully-qualified domain name"
**Cause**: SSL certificate not validated
**Solution**: Add DNS validation records to Route 53

#### 3. ECR repository not found
**Cause**: `helixium-web-dev` repository doesn't exist
**Solution**: Apply terraform to create ECR resources

#### 4. Deployment timeout
**Cause**: Service taking too long to start
**Check**: ECS service health, target group health, security groups

#### 5. "Deployment was skipped"
**Cause**: Conditional logic preventing deployment
**Solution**: Verify branch name matches `feature/*` or `cursor/*` pattern

### Debugging Commands

```bash
# Check certificate status
aws acm describe-certificate --certificate-arn <arn>

# Check ECS service status  
aws ecs describe-services --cluster helixium-cluster --services helixium-dev-service

# Check ECR repository
aws ecr describe-repositories --repository-names helixium-web-dev

# Test dev endpoint
curl -I https://dev.helixium.nicholasfane.com
```

## 🔐 Security Considerations

### Access Control
- **GitHub Environments**: `dev` environment for deployment approval
- **AWS IAM**: Least-privilege access for CI/CD
- **Secrets Management**: All credentials via GitHub secrets

### Network Security
- **ALB**: HTTPS-only with ACM certificate
- **ECS**: Private subnets with ALB ingress only
- **Security Groups**: Restricted to necessary ports

### Image Security
- **Base Images**: Official Node.js images
- **Scanning**: Dependabot enabled for vulnerability detection
- **Registry**: Private ECR repositories

## 📝 Monitoring & Observability

### CloudWatch Integration
- **ECS Logs**: `/ecs/helixium-dev`
- **ALB Logs**: Access and error logging
- **Metrics**: Service health, response times

### Slack Notifications
- **Deployment Success**: `@here` notifications with deployment URL
- **Deployment Failure**: Error details and workflow links
- **Cleanup Events**: Branch cleanup confirmations

### GitHub Actions Insights
- **Workflow Status**: Real-time deployment tracking
- **Artifact Management**: Automatic cleanup after deployment
- **Performance Metrics**: Build time tracking

## 🚀 Future Enhancements

### Planned Improvements
1. **Multi-Environment Support**: staging, qa environments
2. **Database Seeding**: Automated test data for feature branches  
3. **Performance Testing**: Automated lighthouse audits
4. **Preview Comments**: PR comments with deployment links
5. **Advanced Monitoring**: Application-level health checks

### Scalability Considerations
- **Multiple Feature Branches**: Path-based routing (`/feature-name/`)
- **Resource Limits**: Auto-scaling limits and quotas
- **Cost Controls**: Automatic shutdown policies

## 📚 Related Documentation

- **Project Setup**: `docs/project-setup.md`
- **CI/CD Pipeline**: `docs/ci-cd-pipeline.md`  
- **Docker Implementation**: `docs/docker-implementation.md`
- **Development Workflow**: `docs/development-workflow.md`

## 🎉 Success Metrics

This implementation successfully delivers:

- ✅ **Zero-click deployments** for feature branches
- ✅ **Sub-10-minute delivery** from push to live environment  
- ✅ **Cost-optimized** infrastructure with auto-scaling
- ✅ **Production-like testing** environment
- ✅ **Automated cleanup** and resource management
- ✅ **Team notifications** via Slack integration
- ✅ **Infrastructure as Code** with full CI/CD

---

*Built with determination, optimized through iteration, and delivered with excellence.* 🚀
