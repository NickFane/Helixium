# Helixium

A "Configurable UI Journeys" project built with React, TypeScript, and Vite.

## 🚀 Live Application

**Production URL**: https://helixium.nicholasfane.com

## 📚 Documentation

Comprehensive documentation is available in the [docs/](docs/) folder:

- [Project Documentation](docs/README.md) - Complete project overview
- [Page Transitions & Debug System](docs/page-transitions-debug.md) - UI features and development tools
- [Development Workflow](docs/development-workflow.md) - Development practices and CI/CD
- [Jotai State Management](docs/jotai-state-management.md) - State management patterns
- [Docker Implementation](docs/docker-implementation.md) - Containerization guide
- [CI/CD Pipeline](docs/ci-cd-pipeline.md) - Deployment and automation
- [Domain Setup Guide](docs/domain-setup-guide.md) - Custom domain configuration

## 🎯 Development Guidelines

### Cursor Rules

This project includes `.cursorrules` that enforce:

- **Documentation-first approach** - Always check docs before implementing
- **Established patterns** - Follow documented architecture and conventions
- **Type safety** - Use enum-like constants and proper TypeScript patterns
- **Code organization** - Follow Bulletproof React folder structure

### Quick Start

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd Helixium/helixium-web
   yarn install
   ```

2. **Start development**

   ```bash
   yarn dev
   ```

3. **Access debug tools**
   - Click the toggle button on the left edge of the screen
   - Adjust animation speeds and other debug controls

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **State Management**: Jotai with atom patterns
- **Styling**: Chakra UI with dark theme
- **Routing**: TanStack Router
- **Animations**: Framer Motion
- **Deployment**: AWS ECS + ALB + HTTPS
- **CI/CD**: GitHub Actions + Terraform

## 🔧 Key Features

- ✅ **Production Ready** - Custom domain with SSL
- ✅ **Smooth Transitions** - Page transitions with Framer Motion
- ✅ **Debug Tools** - Integrated development debug panel
- ✅ **Type Safety** - Full TypeScript with enum-like constants
- ✅ **State Management** - Jotai with proper store isolation
- ✅ **CI/CD Pipeline** - Automated testing and deployment
- ✅ **Monitoring** - Slack notifications and health checks

## 📁 Project Structure

```
Helixium/
├── docs/                    # Comprehensive documentation
├── helixium-web/           # React application
│   ├── src/
│   │   ├── features/       # Feature-based modules
│   │   │   ├── debug/      # Debug system with drawer
│   │   │   ├── navbar/     # Navigation component
│   │   │   └── ...         # Other features
│   │   ├── components/     # Generic reusable components
│   │   ├── store/          # Jotai state management
│   │   └── ...             # Other directories
│   └── ...                 # Configuration files
├── terraform/              # Infrastructure as Code
├── .github/workflows/      # CI/CD pipelines
├── .cursorrules           # Development rules for Cursor
└── ...                    # Other project files
```

## 🤝 Contributing

1. **Read the documentation** - Start with [docs/README.md](docs/README.md)
2. **Follow established patterns** - Check existing features for conventions
3. **Use debug tools** - Test with the integrated debug panel
4. **Update documentation** - Keep docs current with code changes

## 🔗 Links

- [Live Application](https://helixium.nicholasfane.com)
- [Documentation](docs/README.md)
- [GitHub Repository](https://github.com/your-org/helixium)

---

_Built with ❤️ using React, TypeScript, and modern web technologies._
