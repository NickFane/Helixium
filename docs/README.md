# Helixium Documentation

Welcome to the Helixium project documentation. This documentation provides comprehensive information about the project setup, development workflow, and architecture decisions.

## What is Helixium?

Helixium is a "Configurable UI Journeys" project built with React, TypeScript, and Vite. The project aims to provide a framework for creating customizable user interface experiences and step-by-step workflows.

## Documentation Index

### 📋 [Project Setup](project-setup.md)

Comprehensive guide covering:

- Initial Vite.js + React + TypeScript setup
- Bulletproof React folder structure implementation
- Configuration files and their purposes
- Development environment setup

### 🔄 [Development Workflow](development-workflow.md)

Detailed information about:

- CI/CD pipeline with GitHub Actions
- Development best practices
- Code quality standards
- Pull request process
- Troubleshooting guide
- Docker build validation in CI/CD

### 🧠 [Jotai State Management](jotai-state-management.md)

Advanced state management implementation covering:

- Atom architecture and patterns
- Multiple store isolation
- Reducer-based state updates
- Derived atoms for computed values
- Performance optimization techniques

### 🐳 [Docker Implementation](docker-implementation.md)

Complete containerization guide covering:

- Multi-stage production builds
- Development environment with hot reloading
- Nginx configuration for React SPAs
- Docker Compose orchestration
- Performance optimization and security
- Deployment strategies
- File structure and overview

### 🚀 [CI/CD Pipeline](ci-cd-pipeline.md)

Comprehensive CI/CD documentation covering:

- AWS infrastructure provisioning with Terraform
- GitHub Actions workflows and automation
- ECR repository management and image tagging
- Security considerations and best practices
- Troubleshooting and maintenance procedures
- Future enhancement roadmap

## Project Structure

```
Helixium/
├── docs/                    # Project documentation
│   ├── README.md           # This file
│   ├── project-setup.md    # Setup and configuration guide
│   ├── development-workflow.md # Development workflow guide
│   ├── docker-implementation.md # Docker containerization guide
│   └── ci-cd-pipeline.md   # CI/CD pipeline documentation
├── helixium-web/            # Web application
│   ├── src/                # Source code
│   │   ├── app/            # Core application files
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-based modules
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Third-party library configs
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── providers/      # React context providers
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page-level components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   │   └── atoms/      # Jotai atom definitions
│   │   └── assets/         # Static assets
│   └── ...                 # Configuration files
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development build with hot reloading
├── docker-compose.yml      # Docker Compose orchestration
├── nginx.conf              # Nginx configuration for production
├── .dockerignore           # Docker build exclusions
├── DOCKER_README.md        # Docker usage instructions
├── .github/                # GitHub configuration
│   └── workflows/          # CI/CD workflows
├── terraform/              # Infrastructure as Code
│   ├── main.tf            # AWS ECR and IAM resources
│   ├── variables.tf       # Terraform variables
│   └── setup.sh           # Automated deployment script
└── README.md               # Project overview
```

## Quick Start

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Helixium
   ```

2. **Install dependencies**

   ```bash
   cd helixium-web
   yarn install
   ```

3. **Start development server**

   ```bash
   yarn dev
   ```

4. **Build for production**
   ```bash
   yarn build
   ```

### Docker Development

1. **Start with Docker Compose (Production)**

   ```bash
   docker compose up --build
   # Access at http://localhost:3000
   ```

2. **Start with Docker Compose (Development)**
   ```bash
   docker compose --profile dev up --build
   # Access at http://localhost:5173
   ```

For detailed Docker instructions, see [Docker Implementation](docker-implementation.md).

## Key Features

- **Modern Tech Stack** - React 19, TypeScript, Vite
- **Scalable Architecture** - Bulletproof React folder structure
- **Containerization** - Docker multi-stage builds with Nginx
- **CI/CD Pipeline** - Automated testing and validation
- **Type Safety** - Full TypeScript integration
- **Code Quality** - ESLint with TypeScript support

## Development Guidelines

### Code Organization

- Follow the established Bulletproof React structure
- Use TypeScript for all new code
- Implement proper error handling
- Write clean, maintainable code

### Pull Request Process

1. Create feature branch from `main`
2. Develop and test locally
3. Create pull request with descriptive title
4. Ensure CI/CD checks pass
5. Get code review approval
6. Merge to main branch

## Contributing

When contributing to the project:

1. **Read the documentation** - Understand the project structure and guidelines
2. **Follow coding standards** - Use TypeScript and follow established patterns
3. **Update documentation** - Keep docs current with code changes
4. **Test thoroughly** - Ensure all scripts pass before submitting PR

## Getting Help

- **Documentation** - Check the docs folder for detailed guides
- **Issues** - Create GitHub issues for bugs or feature requests
- **Discussions** - Use GitHub discussions for questions and ideas

## Related Links

- [Project README](../README.md) - Main project overview
- [Web App README](../helixium-web/README.md) - Web application details
- [GitHub Repository](https://github.com/your-org/helixium) - Source code

---

_This documentation is maintained as part of the Helixium project. For questions or suggestions, please create an issue or discussion on GitHub._
