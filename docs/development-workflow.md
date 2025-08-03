# Development Workflow

> **Generated:** August 3, 2025  
> **Note:** This documentation was generated using Cursor AI. Please validate the information for accuracy when reading or scanning at future points in time.

This document outlines the development workflow, CI/CD pipeline, and best practices for the Helixium project.

## Development Environment

### Prerequisites

- **Node.js** - Version specified in `.nvmrc` (24.5.0)
- **Yarn** - Package manager for dependency management
- **Git** - Version control

### Local Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Helixium
   ```

2. **Install dependencies**

   ```bash
   cd helixum-web
   yarn install
   ```

3. **Start development server**
   ```bash
   yarn dev
   ```

## Available Scripts

### Development

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn preview` - Preview production build locally

### Code Quality

- `yarn lint` - Run ESLint for code quality checks
- `yarn lint:fix` - Automatically fix linting issues

## CI/CD Pipeline

### GitHub Actions Workflow

The project uses GitHub Actions for continuous integration and deployment. The workflow is defined in `.github/workflows/helixum-web-ci.yml`.

#### Workflow Triggers

- **Pull Requests** - Runs on PRs to `main` or `master` branches
- **Push Events** - Runs on pushes to `main` or `master` branches
- **Path Filtering** - Only triggers when files in `helixum-web/` directory change

#### Workflow Steps

1. **Checkout** - Gets the latest code
2. **Setup Node.js** - Installs Node.js version from `.nvmrc`
3. **Cache Dependencies** - Uses Yarn cache for faster builds
4. **Install Dependencies** - Runs `yarn install --frozen-lockfile`
5. **Lint** - Runs `yarn lint` for code quality
6. **Build** - Runs `yarn build` to validate production build

#### Workflow Benefits

- **Consistent Environment** - Uses the same Node.js version as local development
- **Fast Builds** - Yarn caching reduces build times
- **Quality Gates** - Ensures code quality and build success before merging
- **Path Filtering** - Only runs when relevant files change

## Code Quality Standards

### ESLint Configuration

The project uses ESLint with TypeScript support for code quality:

- **TypeScript-aware rules** - Leverages TypeScript for better linting
- **React-specific rules** - Includes React hooks and refresh rules
- **Consistent formatting** - Enforces consistent code style

### TypeScript Configuration

- **Strict mode** - Enables all strict TypeScript checks
- **Modern JavaScript** - Targets ES2022 for modern features
- **Module resolution** - Uses bundler mode for Vite compatibility

## Branch Strategy

### Main Branches

- `main` - Production-ready code
- `develop` - Integration branch for features (if needed)

### Feature Development

1. **Create feature branch** from `main`
2. **Develop and test** locally
3. **Create pull request** to `main`
4. **CI/CD validation** - Automated checks run
5. **Code review** - Team review and approval
6. **Merge** - Feature integrated into main branch

## Pull Request Process

### Before Creating a PR

1. **Local testing** - Ensure all scripts pass locally

   ```bash
   yarn lint
   yarn build
   ```

2. **Code quality** - Follow project coding standards
3. **Documentation** - Update docs if needed

### PR Requirements

- **Descriptive title** - Clear summary of changes
- **Detailed description** - Explain what and why
- **CI/CD passing** - All automated checks must pass
- **Code review** - At least one approval required

## Development Best Practices

### Code Organization

1. **Follow folder structure** - Use the established Bulletproof React structure
2. **Component naming** - Use PascalCase for components
3. **File naming** - Use kebab-case for files
4. **Import organization** - Group imports logically

### TypeScript Usage

1. **Type everything** - Define types for all functions and components
2. **Use interfaces** - Prefer interfaces over types for object shapes
3. **Avoid `any`** - Use proper typing instead of `any`
4. **Leverage generics** - Use generics for reusable components

### Component Development

1. **Functional components** - Use function components with hooks
2. **Props interface** - Define props interface for each component
3. **Default props** - Use default parameters for optional props
4. **Error boundaries** - Implement error boundaries for production

### State Management

1. **Local state first** - Use `useState` for component-specific state
2. **Custom hooks** - Extract reusable state logic
3. **Context sparingly** - Use React Context for global state
4. **Future consideration** - Plan for state management library

## Testing Strategy

### Current State

- **Manual testing** - Development server testing
- **Build validation** - CI/CD ensures build success
- **Lint validation** - Code quality checks

### Future Testing

- **Unit tests** - Component and utility testing
- **Integration tests** - Feature workflow testing
- **E2E tests** - User journey testing
- **Visual regression** - UI consistency testing

## Deployment

### Current Setup

- **Local development** - `yarn dev` for development
- **Production build** - `yarn build` for deployment
- **Preview** - `yarn preview` for local production testing

### Future Deployment

- **Staging environment** - Pre-production testing
- **Production environment** - Live application
- **CDN integration** - Static asset optimization
- **Monitoring** - Performance and error tracking

## Troubleshooting

### Common Issues

1. **Build failures** - Check TypeScript errors and dependencies
2. **Lint errors** - Run `yarn lint:fix` or fix manually
3. **Hot reload issues** - Restart development server
4. **Dependency issues** - Clear cache and reinstall

### Debug Commands

```bash
# Clear all caches
yarn cache clean
rm -rf node_modules
yarn install

# Check for TypeScript errors
yarn tsc --noEmit

# Run linting with verbose output
yarn lint --debug
```

## Related Documentation

- [Project Setup](project-setup.md) - Initial setup and configuration
- [README.md](../README.md) - Project overview
- [helixum-web/README.md](../helixum-web/README.md) - Web application details
