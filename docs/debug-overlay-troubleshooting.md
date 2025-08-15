# Debug Overlay Troubleshooting Guide

This guide helps troubleshoot issues with the debug overlay visibility in different deployment environments.

## Overview

The debug overlay consists of two components:
1. **TanStack Router Devtools** - Router debugging overlay at the bottom of the page
2. **Debug Panel** - Custom development tools panel (blue arrow button on the left side)

Both are controlled by the `DEPLOYMENT_ENV` environment variable:
- `DEPLOYMENT_ENV=dev` → Debug tools are **visible**
- `DEPLOYMENT_ENV=prod` → Debug tools are **hidden**

## Environment Indicator

A new environment indicator has been added to the bottom of every page showing:
```
ENV: dev | Runtime: dev | Vite: N/A | Mode: production | Dev: false | HasRuntime: true
```

This helps immediately identify:
- **ENV**: The resolved deployment environment
- **Runtime**: Value from `window.__RUNTIME_CONFIG__.DEPLOYMENT_ENV`
- **Vite**: Value from `import.meta.env.VITE_RUNTIME_DEPLOYMENT_ENV`
- **Mode**: Vite build mode
- **Dev**: Whether `import.meta.env.DEV` is true
- **HasRuntime**: Whether `window.__RUNTIME_CONFIG__` exists

## Quick Diagnosis

### ✅ Working Dev Environment
```
ENV: dev | Runtime: dev | Vite: N/A | Mode: production | Dev: false | HasRuntime: true
```
**Console logs:**
```
[RuntimeConfig] Using runtime config: dev
[RuntimeConfig] Debug tools: ENABLED (env: dev)
```

### ❌ Broken Dev Environment (showing prod values)
```
ENV: prod | Runtime: prod | Vite: N/A | Mode: production | Dev: false | HasRuntime: true
```
**Console logs:**
```
[RuntimeConfig] Using runtime config: prod
[RuntimeConfig] Debug tools: DISABLED (env: prod)
```

## Troubleshooting Steps

### 1. Check the Environment Indicator

Look at the bottom of the page for the environment indicator. This shows exactly what values the application is seeing.

**Expected values for dev.helixium.nicholasfane.com:**
```
ENV: dev | Runtime: dev | Vite: N/A | Mode: production | Dev: false | HasRuntime: true
```

**Expected values for production:**
```
ENV: prod | Runtime: prod | Vite: N/A | Mode: production | Dev: false | HasRuntime: true
```

### 2. Check Browser Console

Open browser developer tools and look for `[RuntimeConfig]` log messages:
```
[RuntimeConfig] Using runtime config: dev
[RuntimeConfig] Debug tools: ENABLED (env: dev)
```

### 3. Check ECS Deployment Status

Use the deployment check script to verify ECS configuration:

```bash
# Check dev environment
./scripts/check-ecs-deployment.sh dev

# Check production environment
./scripts/check-ecs-deployment.sh prod
```

This will show:
- Current service status
- Task definition environment variables
- Running tasks
- Recent deployment events

### 4. Check Docker Container Logs

If the environment indicator shows incorrect values, check the Docker container logs:

```bash
# For ECS deployments
aws logs tail /aws/ecs/helixium-dev --follow

# For local Docker
docker logs <container-id>
```

Look for entrypoint script output:
```
🚀 Starting Helixium container...
📋 Environment Variables:
   DEPLOYMENT_ENV: dev
   NODE_ENV: development
✅ Placeholder {{DEPLOYMENT_ENV}} found in index.html
🔧 Injecting runtime environment variables...
✅ Environment variable injection successful
```

### 5. Common Issues and Solutions

#### Issue: Environment shows "prod" on dev.helixium.nicholasfane.com

**Root Cause:** The GitHub Actions deployment process was not properly setting environment variables in the ECS task definition.

**Fixed in:** The deployment workflow now explicitly sets environment variables when updating the task definition:
```bash
.containerDefinitions[0].environment = [
  {"name": "NODE_ENV", "value": "development"},
  {"name": "DEPLOYMENT_ENV", "value": "dev"}
]
```

**If still occurring:**
1. Check if the latest deployment workflow ran successfully
2. Verify the task definition has correct environment variables:
   ```bash
   aws ecs describe-task-definition --task-definition helixium-dev \
     --query 'taskDefinition.containerDefinitions[0].environment'
   ```
3. Force a new deployment:
   ```bash
   aws ecs update-service --cluster helixium-cluster --service helixium-dev-service --force-new-deployment
   ```

#### Issue: Wrong ECS service is running

**Possible causes:**
1. Production service is running instead of development service
2. Load balancer is routing to wrong target group

**Solutions:**
1. Check which service is actually running:
   ```bash
   aws ecs describe-services --cluster helixium-cluster --services helixium-dev-service
   aws ecs describe-services --cluster helixium-cluster --services helixium-service
   ```
2. Check load balancer listener rules:
   ```bash
   aws elbv2 describe-rules --listener-arn <listener-arn>
   ```

#### Issue: Environment indicator shows "HasRuntime: false"

**Possible causes:**
1. Docker entrypoint script didn't run
2. HTML file doesn't contain the runtime config placeholder
3. Build process removed the placeholder

**Solutions:**
1. Check if the built HTML contains the placeholder:
   ```bash
   grep -A 3 "window.__RUNTIME_CONFIG__" dist/index.html
   ```
2. Rebuild and redeploy the application
3. Check Docker container logs for entrypoint script errors

#### Issue: Placeholder not replaced (Runtime shows "{{DEPLOYMENT_ENV}}")

**Possible causes:**
1. Docker entrypoint script failed
2. `sed` command in entrypoint script didn't work
3. File permissions issue

**Solutions:**
1. Check container logs for entrypoint script errors
2. Verify the container is using the correct entrypoint script
3. Test the sed command manually in the container

### 6. Manual Testing

You can manually test the runtime injection locally:

```bash
# Build the application
cd helixium-web && yarn build

# Test with dev environment
docker run -e DEPLOYMENT_ENV=dev -p 8080:80 helixium-web:latest

# Test with prod environment
docker run -e DEPLOYMENT_ENV=prod -p 8081:80 helixium-web:latest
```

Then check `http://localhost:8080` and `http://localhost:8081` to see the different behaviors.

## Recent Fixes

### ECS Deployment Environment Variables (Fixed)

**Issue:** Feature branch deployments were showing `prod` environment instead of `dev`.

**Root Cause:** The GitHub Actions workflow was only updating the Docker image in the ECS task definition but not preserving/setting the environment variables.

**Fix:** Updated `.github/workflows/helixium-web-validation.yml` to explicitly set environment variables:
```bash
.containerDefinitions[0].environment = [
  {"name": "NODE_ENV", "value": "development"},
  {"name": "DEPLOYMENT_ENV", "value": "dev"}
]
```

**Verification:** The deployment workflow now includes verification steps that show the environment variables in the updated task definition.

## Getting Help

If the debug overlay is still not working after following these steps:

1. **Collect Information:**
   - Screenshot of the environment indicator
   - Browser console logs (look for `[RuntimeConfig]` messages)
   - Docker container logs
   - ECS deployment check script output (`./scripts/check-ecs-deployment.sh dev`)

2. **Check Recent Changes:**
   - Was there a recent deployment?
   - Were there changes to the task definition?
   - Did the Docker image build successfully?

3. **Contact Support:**
   - Include all collected information
   - Specify which environment is affected
   - Describe expected vs actual behavior