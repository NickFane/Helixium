# Helixium Documentation

Welcome to the Helixium project documentation. This documentation provides comprehensive information about the project setup, development workflow, and architecture decisions.

## What is Helixium?

Helixium is a "Configurable UI Journeys" project built with React, TypeScript, and Vite. The project aims to provide a framework for creating customizable user interface experiences and step-by-step workflows.

## 🚀 Production Deployment

**Live Application**: https://helixium.nicholasfane.com

The application is deployed to AWS with:

- ✅ **Custom Domain**: `helixium.nicholasfane.com`
- ✅ **SSL Certificate**: Auto-managed by AWS Certificate Manager
- ✅ **Load Balancer**: Application Load Balancer with HTTPS
- ✅ **Container Orchestration**: ECS Fargate for scalability
- ✅ **CI/CD Pipeline**: Automated deployments on main branch
- ✅ **Slack Notifications**: Real-time deployment status updates

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

### 🌐 [Domain Setup Guide](domain-setup-guide.md)

Complete guide for custom domain configuration:

- Domain purchase and DNS setup
- SSL certificate management with AWS ACM
- Application Load Balancer configuration
- HTTPS enforcement and security
- Cost analysis and optimization

### 🎭 [Page Transitions & Debug System](page-transitions-debug.md)

Advanced UI features covering:

- Smooth page transitions with Framer Motion
- Drawer-style debug panel system
- Animation speed controls with type-safe enums
- Modular debug component architecture
- Development tools and utilities

### 🧪 [Playwright E2E Testing](playwright-e2e-testing.md)

Comprehensive end-to-end testing framework covering:

- Playwright setup and configuration
- Cross-browser testing capabilities (optimized for Chromium)
- Interactive UI mode for test development and debugging
- CI/CD integration with automated testing
- Test structure and best practices
- Performance optimization and troubleshooting
- Debugging tools and artifact analysis

## Project Structure

```
Helixium/
├── docs/                    # Project documentation
│   ├── README.md           # This file
│   ├── project-setup.md    # Setup and configuration guide
│   ├── development-workflow.md # Development workflow guide
│   ├── docker-implementation.md # Docker containerization guide
│   ├── ci-cd-pipeline.md   # CI/CD pipeline documentation
│   ├── domain-setup-guide.md # Custom domain configuration
│   ├── page-transitions-debug.md # Page transitions and debug system
│   └── playwright-e2e-testing.md # End-to-end testing documentation
├── helixium-web/            # Web application
│   ├── src/                # Source code
│   │   ├── app/            # Core application files
│   │   ├── components/     # Reusable UI components
│   │   │   └── PageTransition.tsx # Page transition wrapper
│   │   ├── features/       # Feature-based modules
│   │   │   ├── development-tools/ # Development debug system
│   │   │   │   ├── index.tsx # Main debug container
│   │   │   │   ├── types.ts # Shared debug types
│   │   │   │   └── components/
│   │   │   │       └── AnimationSpeedControl/ # Animation speed controls
│   │   │   ├── clickDashboard/ # Click tracking feature
│   │   │   ├── navbar/     # Navigation component
│   │   │   └── sample-form/ # Form handling feature
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
│   ├── tests/              # E2E testing suite
│   │   ├── homepage.spec.ts # Homepage functionality tests
│   │   ├── development-tools.spec.ts # Debug panel tests
│   │   └── navigation.spec.ts # Navigation and routing tests
│   ├── playwright.config.ts # Playwright configuration
│   └── ...                 # Configuration files
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development build with hot reloading
├── docker-compose.yml      # Docker Compose orchestration
├── nginx.conf              # Nginx configuration for production
├── .dockerignore           # Docker build exclusions
├── DOCKER_README.md        # Docker usage instructions
├── .cursor/                # Cursor IDE configuration
│   └── rules/              # Cursor development rules
│       └── playwright-e2e-testing.mdc # E2E testing guidelines
├── .github/                # GitHub configuration
│   └── workflows/          # CI/CD workflows
│       ├── build-and-deploy-application.yml # Main deployment workflow
│       ├── build-and-deploy-terraform.yml   # Infrastructure deployment
│       ├── helixium-web-validation.yml      # PR quality gate
│       └── README.md       # Workflow documentation
├── terraform/              # Infrastructure as Code
│   ├── main.tf            # AWS ECR and IAM resources
│   ├── ecs.tf             # ECS cluster, service, and task definitions
│   ├── networking.tf      # VPC, subnets, and security groups
│   ├── domain.tf          # ALB, SSL certificate, and domain configuration
│   ├── variables.tf       # Terraform variables
│   ├── terraform.tfvars.example # Configuration template
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

4. **Run E2E tests**

   ```bash
   yarn test:e2e
   # Or with interactive UI
   yarn test:e2e:ui
   ```

5. **Build for production**
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

## Production Infrastructure

### AWS Resources

- **ECS Cluster**: `helixium-cluster` (Fargate)
- **ECS Service**: `helixium-service` with load balancer integration
- **Application Load Balancer**: `helixium-alb` with HTTPS
- **Target Group**: `helixium-tg` with health checks
- **SSL Certificate**: Auto-managed by AWS Certificate Manager
- **ECR Repositories**: `helixium-web` and `helixium-web-dev`
- **VPC**: Custom VPC with public subnets for ALB and ECS tasks

### CI/CD Pipeline

- **Infrastructure Deployment**: Automated Terraform deployment
- **Application Deployment**: Docker build and ECS deployment
- **E2E Testing**: Automated Playwright tests in CI/CD
- **PR Validation**: Quality gates with comprehensive testing
- **Slack Notifications**: Real-time deployment status updates

### Security Features

- **HTTPS Only**: HTTP automatically redirects to HTTPS
- **Security Groups**: Restricted access between ALB and ECS tasks
- **IAM Roles**: Least privilege access for ECS tasks
- **Private ECR**: Secure Docker image storage

## Key Features

- **Modern Tech Stack** - React 19, TypeScript, Vite
- **Scalable Architecture** - Bulletproof React folder structure
- **Containerization** - Docker multi-stage builds with Nginx
- **CI/CD Pipeline** - Automated testing and validation
- **E2E Testing** - Playwright framework with cross-browser support
- **Type Safety** - Full TypeScript integration
- **Code Quality** - ESLint with TypeScript support
- **Production Ready** - Custom domain with SSL
- **Monitoring** - Slack notifications and health checks
- **Smooth Transitions** - Page transitions with Framer Motion
- **Debug Tools** - Integrated development debug panel
- **Test Automation** - Comprehensive E2E test suite with CI integration

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
4. Ensure CI/CD checks pass (no ECR pushes on PRs)
5. Get code review approval
6. Merge to main branch (triggers deployment)

### Deployment Process

1. **Infrastructure Changes**: Modify `terraform/` files → triggers infrastructure deployment
2. **Application Changes**: Modify `helixium-web/` files → triggers application deployment
3. **Slack Notifications**: Automatic deployment status updates

## Contributing

When contributing to the project:

1. **Read the documentation** - Understand the project structure and guidelines
2. **Follow coding standards** - Use TypeScript and follow established patterns
3. **Update documentation** - Keep docs current with code changes
4. **Test thoroughly** - Ensure all scripts pass before submitting PR
5. **Check PR validation** - PRs validate Docker builds without pushing to ECR

## Getting Help

- **Documentation** - Check the docs folder for detailed guides
- **Issues** - Create GitHub issues for bugs or feature requests
- **Discussions** - Use GitHub discussions for questions and ideas
- **Slack** - Deployment notifications provide real-time status

## Related Links

- [Project README](../README.md) - Main project overview
- [Web App README](../helixium-web/README.md) - Web application details
- [GitHub Repository](https://github.com/your-org/helixium) - Source code
- [Live Application](https://helixium.nicholasfane.com) - Production deployment

---

_This documentation is maintained as part of the Helixium project. For questions or suggestions, please create an issue or discussion on GitHub._
