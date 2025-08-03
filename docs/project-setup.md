# Project Setup Documentation

> **Generated:** August 3, 2025  
> **Note:** This documentation was generated using Cursor AI. Please validate the information for accuracy when reading or scanning at future points in time.

This document outlines the setup and configuration of the Helixium project, including the initial Vite.js setup and the implementation of a Bulletproof React folder structure.

## Overview

Helixium is a "Configurable UI Journeys" project built with React, TypeScript, and Vite. The project follows modern development practices with a scalable folder structure.

## Initial Setup

### Vite.js + React + TypeScript Setup

The project was initialized with a modern Vite.js template that includes:

- **React 19** - Latest React version with new features
- **TypeScript** - For type safety and better developer experience
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting with TypeScript support
- **Yarn** - Package manager with lockfile for consistent dependencies

### Key Configuration Files

- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite build configuration
- `tsconfig.app.json` - TypeScript configuration for the app
- `eslint.config.js` - ESLint rules and TypeScript integration
- `index.html` - Entry point for the application

## Project Structure

### Bulletproof React Architecture

The project implements a Bulletproof React folder structure for scalability and maintainability:

```
helixum-web/src/
├── app/                    # Core application files
│   ├── App.tsx            # Main application component
│   ├── App.css            # Application styles
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── components/             # Reusable UI components
├── features/              # Feature-based modules
├── hooks/                 # Custom React hooks
├── lib/                   # Third-party library configurations
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
├── providers/             # React context providers
├── layouts/               # Layout components
├── pages/                 # Page-level components
├── services/              # API services
├── store/                 # State management
└── assets/                # Static assets
```

### Folder Purpose

- **`app/`** - Core application files (entry point, main App component)
- **`components/`** - Reusable UI components that can be shared across features
- **`features/`** - Feature-based modules containing components, hooks, and logic specific to a feature
- **`hooks/`** - Custom React hooks for shared logic
- **`lib/`** - Third-party library configurations and utilities
- **`types/`** - TypeScript type definitions and interfaces
- **`utils/`** - Utility functions and helper methods
- **`providers/`** - React context providers for state management
- **`layouts/`** - Layout components and page templates
- **`pages/`** - Page-level components
- **`services/`** - API services and external integrations
- **`store/`** - State management (Redux, Zustand, etc.)
- **`assets/`** - Static assets (images, icons, etc.)

## Development Workflow

### Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn lint` - Run ESLint for code quality
- `yarn preview` - Preview production build locally

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/helixum-web-ci.yml`) that:

- Runs on pull requests and pushes to main/master branches
- Only triggers when files in `helixum-web/` directory change
- Uses Node.js version from `.nvmrc` file
- Installs dependencies with Yarn
- Runs linting (`yarn lint`)
- Validates build (`yarn build`)

## File Organization

### Core Application Files

The main application files are located in `src/app/`:

- `main.tsx` - Application entry point, renders the root component
- `App.tsx` - Main application component
- `App.css` - Application-specific styles
- `index.css` - Global styles and CSS variables

### Asset Management

Static assets are stored in `src/assets/` and can be imported using relative paths or configured aliases.

## Best Practices

### Code Organization

1. **Feature-based organization** - Group related components, hooks, and logic together
2. **Separation of concerns** - Keep UI components, business logic, and utilities separate
3. **Type safety** - Use TypeScript for all new code
4. **Consistent naming** - Follow React naming conventions

### Development Guidelines

1. **Component structure** - Use functional components with hooks
2. **Type definitions** - Define interfaces in the `types/` folder
3. **Utility functions** - Place reusable logic in `utils/`
4. **Custom hooks** - Extract reusable state logic into custom hooks

## Future Considerations

### Scalability

The Bulletproof React structure supports:

- Easy addition of new features
- Clear separation of concerns
- Maintainable codebase as it grows
- Team collaboration with clear boundaries

### Potential Enhancements

- State management library integration (Redux Toolkit, Zustand)
- Routing solution (React Router)
- UI component library integration
- Testing framework setup (Jest, React Testing Library)
- Storybook for component documentation

## Related Documentation

- [README.md](../README.md) - Project overview
- [helixum-web/README.md](../helixum-web/README.md) - Web application setup details
