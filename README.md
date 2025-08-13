# Helixium

Configurable UI Journeys

[![Build and Deploy Application](https://github.com/NickFane/Helixium/actions/workflows/build-and-deploy-application.yml/badge.svg)](https://github.com/NickFane/Helixium/actions/workflows/build-and-deploy-application.yml)[![Build and Deploy Terraform Infrastructure](https://github.com/NickFane/Helixium/actions/workflows/build-and-deploy-terraform.yml/badge.svg)](https://github.com/NickFane/Helixium/actions/workflows/build-and-deploy-terraform.yml)

## Project Structure

- **helixium-web/**: Contains the web/UI application built with React, TypeScript, and Vite. This is the frontend component of the Helixium project.
- **docs/**: Comprehensive project documentation including setup guides, development workflow, and state management patterns.

## Key Features

- **Modern Tech Stack**: React 19, TypeScript, Vite
- **State Management**: Jotai implementation with atom sharing and store isolation
- **Scalable Architecture**: Bulletproof React folder structure
- **Type Safety**: Full TypeScript integration
- **Containerization**: Docker multi-stage builds with Nginx for production deployment

## Quick Start

### Local Development

```bash
# Clone and setup
git clone <repository-url>
cd Helixium/helixium-web
yarn install
yarn dev
```

### Docker Development

```bash
# Production build
docker compose up --build
# Access at http://localhost:3000

# Development with hot reloading
docker compose --profile dev up --build
# Access at http://localhost:5173
```

## Documentation

For detailed information about the web application setup and development, see [helixium-web/README.md](helixium-web/README.md).

For comprehensive project documentation including state management patterns and Docker implementation, see [docs/README.md](docs/README.md).

For Docker-specific documentation and usage instructions, see [docs/docker-implementation.md](docs/docker-implementation.md).
