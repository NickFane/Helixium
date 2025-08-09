# Docker Setup for Helixium

This document provides instructions for containerizing and running the Helixium application using Docker.

## Overview

The Docker setup includes:

- **Production build**: Multi-stage Dockerfile optimized for production deployment
- **Development build**: Dockerfile for development with hot reloading
- **Nginx configuration**: Optimized for serving React SPAs
- **Docker Compose**: Easy orchestration for both development and production

## Quick Start

### Production Build

1. **Build and run the production container:**

   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`

### Development Build

1. **Run the development container with hot reloading:**

   ```bash
   docker-compose --profile dev up --build
   ```

2. **Access the development server:**
   - Open your browser and navigate to `http://localhost:5173`

## Manual Docker Commands

### Production

```bash
# Build the production image
docker build -t helixium-web .

# Run the container
docker run -p 3000:80 helixium-web

# Run in detached mode
docker run -d -p 3000:80 --name helixium-web helixium-web
```

### Development

```bash
# Build the development image
docker build -f Dockerfile.dev -t helixium-web-dev .

# Run the development container
docker run -p 5173:5173 -v $(pwd)/helixium-web:/app helixium-web-dev
```

## Docker Compose Commands

```bash
# Start production services
docker-compose up

# Start development services
docker-compose --profile dev up

# Build and start in detached mode
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose down && docker-compose up --build
```

## Configuration

### Environment Variables

The application supports the following environment variables:

- `NODE_ENV`: Set to `production` or `development`
- `VITE_API_URL`: API endpoint URL (if applicable)

### Port Configuration

- **Production**: Port 80 (mapped to host port 3000)
- **Development**: Port 5173 (mapped to host port 5173)

### Health Check

The production container includes a health check endpoint at `/health` that returns a 200 status when the application is running properly.

## File Structure

```
.
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development build with hot reloading
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf              # Nginx configuration for production
├── .dockerignore           # Files to exclude from Docker build
└── DOCKER_README.md        # This file
```

## Build Optimization

The production Dockerfile uses multi-stage builds to:

1. **Dependencies stage**: Install only the necessary dependencies
2. **Builder stage**: Build the application with TypeScript compilation
3. **Runner stage**: Serve the built application with Nginx

This approach results in:

- Smaller final image size
- Better security (no build tools in production)
- Faster builds through layer caching

## Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   # Check what's using the port
   lsof -i :3000

   # Use a different port
   docker run -p 3001:80 helixium-web
   ```

2. **Build fails:**

   ```bash
   # Clean Docker cache
   docker system prune -a

   # Rebuild without cache
   docker build --no-cache -t helixium-web .
   ```

3. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Logs and Debugging

```bash
# View container logs
docker-compose logs -f helixium-web

# Access container shell
docker exec -it <container_name> /bin/sh

# Check container health
docker ps
```

## Security Considerations

- The production image runs as a non-root user
- Security headers are configured in Nginx
- Build tools are excluded from the final image
- Environment variables are properly handled

## Performance Optimization

- Static assets are cached for 1 year
- Gzip compression is enabled
- Nginx is configured for optimal SPA serving
- Multi-stage builds reduce image size

## Next Steps

1. **CI/CD Integration**: Add Docker builds to your CI/CD pipeline
2. **Environment-specific configs**: Create separate compose files for staging/production
3. **Monitoring**: Add logging and monitoring solutions
4. **SSL/TLS**: Configure HTTPS for production deployments

## Related Documentation

For comprehensive Docker documentation including detailed architecture, troubleshooting, and best practices, see [Docker Implementation Guide](docs/docker-implementation.md).
