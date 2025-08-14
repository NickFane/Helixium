# Docker Implementation Guide

This document provides comprehensive information about the Docker containerization setup for the Helixium project, including production builds, development environments, deployment strategies, and file references.

## Overview

The Helixium Docker implementation provides a complete containerization solution with:

- **Multi-stage production builds** for optimized deployment
- **Development environment** with hot reloading support
- **Nginx configuration** optimized for React SPAs
- **Docker Compose orchestration** for easy management
- **Security and performance optimizations**

## File Structure and Overview

### Project Docker Files

```
Helixium/
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development build with hot reloading
├── docker-compose.yml      # Docker Compose orchestration
├── nginx.conf              # Nginx configuration for production
├── .dockerignore           # Docker build exclusions
├── DOCKER_README.md        # Quick reference guide
└── docs/
    └── docker-implementation.md    # This comprehensive guide
```

### File Descriptions

#### Core Docker Files

**`Dockerfile`**

- **Purpose**: Production multi-stage build for the React application
- **Stages**:
  - `deps`: Install dependencies
  - `builder`: Build the application
  - `runner`: Serve with Nginx
- **Output**: Optimized production image with Nginx
- **Size**: ~50MB final image

**`Dockerfile.dev`**

- **Purpose**: Development environment with hot reloading
- **Features**:
  - Volume mounting for live code changes
  - Vite dev server with host binding
  - Full development dependencies
- **Output**: Development image with hot reloading
- **Size**: ~200MB (includes dev dependencies)

**`docker-compose.yml`**

- **Purpose**: Orchestrate both production and development environments
- **Services**:
  - `helixium-web`: Production service (port 3000)
  - `helixium-web-dev`: Development service (port 5173, profile: dev)
- **Features**: Health checks, environment variables, restart policies

#### Configuration Files

**`nginx.conf`**

- **Purpose**: Nginx configuration optimized for React SPAs
- **Features**:
  - SPA routing support (`try_files`)
  - Gzip compression
  - Security headers
  - Static asset caching (1 year)
  - Health check endpoint (`/health`)

**`.dockerignore`**

- **Purpose**: Exclude unnecessary files from Docker build context
- **Excludes**:
  - `node_modules`, `dist`, build outputs
  - Environment files (`.env*`)
  - IDE files (`.vscode`, `.idea`)
  - Git files (`.git`)
  - Documentation (`docs/`, `*.md`)
  - Logs and cache files

#### Documentation Files

**`DOCKER_README.md`**

- **Purpose**: Quick reference guide for Docker usage
- **Content**:
  - Quick start commands
  - Manual Docker commands
  - Troubleshooting guide
  - Configuration options

### Key Features by File

| File                 | Multi-stage Build | Hot Reloading | SPA Routing | Security Headers | Health Checks |
| -------------------- | ----------------- | ------------- | ----------- | ---------------- | ------------- |
| `Dockerfile`         | ✅                | ❌            | ✅          | ✅               | ✅            |
| `Dockerfile.dev`     | ❌                | ✅            | ✅          | ❌               | ❌            |
| `nginx.conf`         | N/A               | N/A           | ✅          | ✅               | ✅            |
| `docker-compose.yml` | N/A               | ✅ (dev)      | N/A         | N/A              | ✅            |

## Architecture

### Multi-Stage Build Strategy

The production Dockerfile uses a three-stage build process:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dependencies  │    │     Builder     │    │     Runner      │
│                 │    │                 │    │                 │
│ • Install deps  │───▶│ • Build app     │───▶│ • Serve with    │
│ • Cache layers  │    │ • TypeScript    │    │   Nginx         │
│ • Optimize size │    │ • Vite build    │    │ • Static files  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Production Build

### Dockerfile Analysis

```dockerfile
# Multi-stage build for Helixium React application
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies using yarn
COPY helixium-web/package.json helixium-web/yarn.lock* ./
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY helixium-web/ .

# Generate route tree and build the application
RUN yarn build

# Production image, copy all the files and run the app
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Key Features

1. **Dependency Caching**: Dependencies are installed in a separate stage and cached
2. **Yarn Package Manager**: Uses yarn exclusively for dependency management
3. **Build Optimization**: Only rebuilds when source code changes
4. **Security**: No build tools in final production image
5. **Size Optimization**: Final image only contains runtime dependencies

## Development Environment

### Dockerfile.dev Analysis

```dockerfile
# Development Dockerfile for Helixium React application
FROM node:20-alpine

# Install dependencies for development
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY helixium-web/package.json helixium-web/yarn.lock* ./

# Install dependencies
RUN yarn install

# Copy source code
COPY helixium-web/ .

# Expose Vite dev server port
EXPOSE 5173

# Start development server with host binding for Docker
CMD ["yarn", "dev", "--host", "0.0.0.0"]
```

### Development Features

- **Hot Reloading**: Live code changes without container restart
- **Volume Mounting**: Source code mounted for real-time updates
- **Vite Dev Server**: Fast development experience
- **Host Binding**: Accessible from host machine

## Nginx Configuration

### Production Optimizations

The `nginx.conf` file is optimized for React SPAs:

```nginx
# Gzip compression for better performance
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;

# SPA routing support
location / {
    try_files $uri $uri/ /index.html;
}

# Static asset caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Key Features

1. **SPA Routing**: Handles client-side routing properly
2. **Static Asset Caching**: 1-year cache for static files
3. **Gzip Compression**: Reduces transfer sizes
4. **Security Headers**: Protects against common vulnerabilities
5. **Health Check Endpoint**: `/health` for monitoring

### Health Check Implementation

The nginx configuration includes a dedicated health check endpoint:

```nginx
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

This endpoint:

- Returns HTTP 200 with "healthy" message
- Disables access logging to reduce noise
- Used by ECS, Docker, and load balancer health checks
- Responds quickly without database or application logic

## Docker Compose Orchestration

### Production Configuration

```yaml
version: "3.8"

services:
  helixium-web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--quiet",
          "--tries=1",
          "--spider",
          "http://localhost/health",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Development Configuration

```yaml
helixium-web-dev:
  build:
    context: .
    dockerfile: Dockerfile.dev
  ports:
    - "5173:5173"
  volumes:
    - ./helixium-web:/app
    - /app/node_modules
  environment:
    - NODE_ENV=development
  profiles:
    - dev
```

## Usage Instructions

### Quick Start Commands

#### Production Commands

```bash
# Build and run
docker compose up --build

# Run in background
docker compose up -d --build

# Stop services
docker compose down

# View logs
docker compose logs -f
```

#### Development Commands

```bash
# Build and run with hot reloading
docker compose --profile dev up --build

# Access development server
open http://localhost:5173

# View development logs
docker compose logs -f helixium-web-dev
```

### Manual Docker Commands

#### Production Build

```bash
# Build production image
docker build -t helixium-web .

# Run container
docker run -p 3000:80 helixium-web

# Run with custom environment
docker run -p 3000:80 -e NODE_ENV=production helixium-web
```

#### Development Build

```bash
# Build development image
docker build -f Dockerfile.dev -t helixium-web-dev .

# Run with volume mounting
docker run -p 5173:5173 -v $(pwd)/helixium-web:/app helixium-web-dev
```

## Environment Variables

### Production

- `NODE_ENV=production`
- `VITE_API_URL` (if applicable)

### Development

- `NODE_ENV=development`
- Hot reloading enabled
- Volume mounting for live updates

## Ports

- **Production**: `3000:80` (host:container)
- **Development**: `5173:5173` (host:container)
- **Health Check**: Available at `/health` endpoint

## Performance Optimization

### Build Optimizations

1. **Layer Caching**: Dependencies cached separately from source code
2. **Multi-stage Builds**: Reduces final image size
3. **Alpine Linux**: Minimal base image for smaller size
4. **Dockerignore**: Excludes unnecessary files from build context

### Runtime Optimizations

1. **Nginx Static Serving**: Optimized for static file delivery
2. **Gzip Compression**: Reduces bandwidth usage
3. **Asset Caching**: Long-term caching for static assets
4. **Connection Pooling**: Efficient resource utilization

### Memory and CPU

- **Production**: Minimal resource usage with Nginx
- **Development**: Higher resource usage for hot reloading
- **Scaling**: Horizontal scaling supported via Docker Compose

## Security Considerations

### Production Security

1. **Non-root User**: Nginx runs as non-root user
2. **Security Headers**: XSS, clickjacking, and MIME type protection
3. **Minimal Attack Surface**: No build tools in production image
4. **Regular Updates**: Base images updated regularly

### Development Security

1. **Volume Mounting**: Source code mounted read-write
2. **Development Tools**: Full development environment available
3. **Network Isolation**: Containerized network stack

## Monitoring and Health Checks

### Health Check Configuration

```yaml
healthcheck:
  test:
    [
      "CMD",
      "wget",
      "--quiet",
      "--tries=1",
      "--spider",
      "http://localhost/health",
    ]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Monitoring Endpoints

- **Health Check**: `GET /health` - Returns 200 OK
- **Application**: `GET /` - Main application
- **Static Assets**: `GET /assets/*` - Cached static files

### Logging

```bash
# View container logs
docker compose logs -f helixium-web

# View nginx logs
docker exec helixium-helixium-web-1 tail -f /var/log/nginx/access.log

# View error logs
docker exec helixium-helixium-web-1 tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t helixium-web .

# Check build context
docker build --progress=plain -t helixium-web .
```

#### Port Conflicts

```bash
# Check port usage
lsof -i :3000

# Use different port
docker run -p 3001:80 helixium-web
```

#### Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Run with proper user
docker run -u $(id -u):$(id -g) -p 3000:80 helixium-web
```

### Debug Commands

```bash
# Access container shell
docker exec -it helixium-helixium-web-1 /bin/sh

# Check container status
docker ps

# Inspect container
docker inspect helixium-helixium-web-1

# View container resources
docker stats helixium-helixium-web-1
```

## Deployment Strategies

### Local Development

- Use `docker compose --profile dev up` for development
- Hot reloading enabled with volume mounting
- Access via `http://localhost:5173`

### Production Deployment

- Use `docker compose up --build` for production
- Nginx serves optimized static files
- Access via `http://localhost:3000`

### CI/CD Integration

The project includes comprehensive Docker validation in GitHub Actions:

#### Main CI Workflow (`helixium-web-ci.yml`)

```yaml
# Docker validation steps in main CI
- name: Setup Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Validate Production Docker Build
  run: docker build -t helixium-web-test .

- name: Validate Development Docker Build
  run: docker build -f Dockerfile.dev -t helixium-web-dev-test .

- name: Validate Docker Compose Configuration
  run: docker compose config
```

#### Dedicated Docker Validation Workflow (`docker-validation.yml`)

- **Triggers**: On Docker file changes or manual dispatch
- **Validations**:
  - Docker Compose configuration syntax
  - Production and development Docker builds
  - Container startup testing
  - Nginx configuration validation
  - Image size reporting
  - Automatic cleanup

#### What Gets Validated

1. **Dockerfile Syntax**: Ensures both production and development Dockerfiles are valid
2. **Build Process**: Verifies all build stages complete successfully
3. **Docker Compose**: Validates compose file syntax and configuration
4. **Nginx Config**: Tests nginx configuration syntax
5. **Container Startup**: Ensures containers can start and run
6. **Image Sizes**: Reports final image sizes for optimization tracking

### Cloud Deployment

- **AWS ECS**: Use task definitions with the Docker image
- **Google Cloud Run**: Deploy as containerized service
- **Azure Container Instances**: Serverless container deployment
- **Kubernetes**: Deploy with deployment manifests

## Best Practices

### Development

1. **Use Development Profile**: Always use `--profile dev` for development
2. **Volume Mounting**: Mount source code for live updates
3. **Hot Reloading**: Leverage Vite's fast refresh capabilities
4. **Debug Logging**: Enable verbose logging when troubleshooting

### Production

1. **Multi-stage Builds**: Use for optimized production images
2. **Security Scanning**: Scan images for vulnerabilities
3. **Resource Limits**: Set appropriate CPU and memory limits
4. **Health Checks**: Implement proper health check endpoints
5. **Logging**: Configure structured logging for production

### Maintenance

1. **Regular Updates**: Keep base images updated
2. **Security Patches**: Apply security updates promptly
3. **Performance Monitoring**: Monitor resource usage
4. **Backup Strategies**: Implement data backup procedures

## Future Enhancements

### Planned Improvements

1. **Multi-architecture Support**: ARM64 and AMD64 builds
2. **Environment-specific Configs**: Staging and production variants
3. **Monitoring Integration**: Prometheus and Grafana setup
4. **SSL/TLS Support**: HTTPS configuration
5. **Load Balancing**: Multiple instance support

### Advanced Features

1. **Blue-Green Deployment**: Zero-downtime deployment strategy
2. **Canary Releases**: Gradual rollout capabilities
3. **Auto-scaling**: Dynamic resource allocation
4. **Service Mesh**: Advanced networking with Istio

## Related Documentation

- [Project Setup](project-setup.md) - Initial project configuration
- [Development Workflow](development-workflow.md) - Development practices
- [Jotai State Management](jotai-state-management.md) - State management patterns
- [DOCKER_README.md](../DOCKER_README.md) - Quick reference guide

---

_This Docker implementation guide is maintained as part of the Helixium project. For questions or suggestions, please create an issue or discussion on GitHub._
