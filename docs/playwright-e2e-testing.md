# Playwright End-to-End Testing Documentation

## Overview

This document covers the comprehensive Playwright E2E testing framework integrated into the Helixium project. The setup provides automated cross-browser testing with CI/CD integration, optimized for performance and developer experience.

## Table of Contents

- [Quick Start](#quick-start)
- [Installation & Setup](#installation--setup)
- [Test Execution](#test-execution)
- [Debugging & Development](#debugging--development)
- [CI/CD Integration](#cicd-integration)
- [Test Structure](#test-structure)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)

## Quick Start

### Running Tests Locally

```bash
# Navigate to web application directory
cd helixium-web

# Run all tests (Chromium only - optimized for speed)
yarn test:e2e

# Run tests with interactive UI (recommended for development)
yarn test:e2e:ui

# Run tests with visible browser (debugging)
yarn test:e2e:headed

# Run tests in debug mode (step-by-step)
yarn test:e2e:debug
```

### Expected Output
```
Running 6 tests using 6 workers
  6 passed (3.3s)
✨  Done in 3.75s.
```

## Installation & Setup

### Dependencies
- `@playwright/test` - Core testing framework
- `@types/node` - TypeScript support for Node.js APIs
- Chromium browser (auto-installed)

### File Structure
```
helixium-web/
├── playwright.config.ts          # Main configuration
├── tests/                        # Test files
│   ├── homepage.spec.ts          # Homepage functionality
│   ├── development-tools.spec.ts # Debug panel tests
│   └── navigation.spec.ts        # Routing tests
├── test-results/                 # Auto-generated results (gitignored)
├── playwright-report/            # HTML reports (gitignored)
└── package.json                  # Test scripts
```

### Initial Setup (Already Complete)
The framework is pre-configured and ready to use. No additional setup required.

## Test Execution

### Available Scripts

| Command | Description | Use Case |
|---------|-------------|----------|
| `yarn test:e2e` | Fast execution, console output | CI/CD, quick validation |
| `yarn test:e2e:ui` | Interactive browser interface | Development, debugging |
| `yarn test:e2e:headed` | Visible browser execution | Visual debugging |
| `yarn test:e2e:debug` | Step-by-step debugging | Complex issue investigation |

### Browser Configuration

**Current Setup: Chromium Only (Optimized)**
- **Performance**: ~70% faster execution (3.3s vs 11.4s)
- **Coverage**: Chromium covers majority of users
- **CI Efficiency**: Reduced resource usage and costs

**Available Browsers (Commented Out)**
```typescript
// Firefox, WebKit, Mobile Chrome, Mobile Safari
// Easily re-enabled by uncommenting in playwright.config.ts
```

## Debugging & Development

### UI Mode Features

When you run `yarn test:e2e:ui`, you get:

- **Visual Test Picker**: Select specific tests to run
- **Live Browser Preview**: Watch tests execute in real-time
- **Timeline View**: See detailed execution flow
- **Screenshots & Videos**: Automatic capture on failures
- **Network Inspector**: Monitor API calls and responses
- **Console Logs**: Real-time debugging output
- **Trace Viewer**: Detailed execution traces

### Debugging Workflow

1. **Start with UI Mode**: `yarn test:e2e:ui`
2. **Select failing test** in the interface
3. **Watch execution** in the browser preview
4. **Inspect artifacts** (screenshots, videos, traces)
5. **Use console logs** for detailed debugging
6. **Switch to debug mode** if needed: `yarn test:e2e:debug`

### Test Artifacts

Located in `helixium-web/test-results/` (auto-generated):
- **Screenshots**: `test-failed-*.png`
- **Videos**: `video.webm`
- **Error Context**: `error-context.md`
- **Traces**: `trace.zip`

## CI/CD Integration

### GitHub Actions Workflow

Automatically runs on:
- **Pull Requests** to main/master
- **Manual workflow dispatch**
- **Changes to** frontend code, Docker files, or configs

### CI Pipeline Steps

1. **Frontend Validation**
   - Dependencies installation
   - Linting and TypeScript checks
   - Application build

2. **E2E Testing** ⭐
   - Install Chromium browser
   - Start development server (via Playwright)
   - Execute full test suite
   - Upload artifacts on failure

3. **Docker Validation**
   - Container build tests
   - Startup validation

### Performance Metrics

- **Local Execution**: ~3.3 seconds
- **CI Execution**: ~2-3 minutes total pipeline
- **Browser Downloads**: Only Chromium (~100MB vs ~500MB)
- **Parallel Workers**: 6 workers for optimal performance

## Test Structure

### Current Test Coverage

#### Homepage Tests (`homepage.spec.ts`)
- Page loading and title verification
- Basic navigation functionality
- Core application startup
- Route accessibility

#### Development Tools Tests (`development-tools.spec.ts`)
- Debug panel open/close functionality
- Animation speed controls
- Button highlighting and state management
- UI interaction validation

#### Navigation Tests (`navigation.spec.ts`)
- Route transitions between pages
- URL handling and history
- Page-to-page navigation flow
- Cross-page functionality

### Test Writing Guidelines

```typescript
// Example test structure
test.describe('Feature Name', () => {
    test('should perform specific action', async ({ page }) => {
        await page.goto('/');
        
        // Use exact selectors to avoid flaky tests
        const button = page.getByRole('button', { name: 'Exact Text', exact: true });
        await expect(button).toBeVisible();
        
        await button.click();
        await expect(page).toHaveURL('/expected-url');
    });
});
```

**Best Practices**:
- Use exact selectors (`exact: true`)
- Avoid partial text matches
- Include proper wait conditions
- Test user workflows, not implementation details

## Configuration

### Playwright Config (`playwright.config.ts`)

Key settings:
```typescript
{
    testDir: './tests',
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html'], ['json']],
    
    // Server management
    webServer: {
        command: 'yarn dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,  // Prevents port conflicts
        timeout: 120 * 1000,
    }
}
```

### TypeScript Integration

- **Node.js Types**: `@types/node` for process.env access
- **Config Inclusion**: `playwright.config.ts` in `tsconfig.node.json`
- **Strict Mode**: Proper TypeScript validation

## Troubleshooting

### Common Issues & Solutions

#### Port Conflicts
**Problem**: Server startup failures
**Solution**: Playwright manages server automatically via `webServer` config

#### Selector Issues
**Problem**: `strict mode violation` errors
**Solution**: Use exact selectors: `getByRole('button', { name: 'Text', exact: true })`

#### Timing Issues
**Problem**: Elements not found/visible
**Solution**: Add proper waits: `page.waitForLoadState('networkidle')`

#### CI Failures
**Problem**: Tests pass locally but fail in CI
**Solution**: Check uploaded artifacts in GitHub Actions

### Debug Checklist

1. **Run locally first**: `yarn test:e2e:ui`
2. **Check test artifacts**: Screenshots, videos, traces
3. **Verify selectors**: Use browser dev tools
4. **Test timing**: Add appropriate waits
5. **Check CI logs**: Review GitHub Actions output

## Performance Optimization

### Current Optimizations

- **Chromium Only**: 70% faster execution
- **Parallel Workers**: 6 concurrent test workers
- **Smart Retries**: Only in CI environment
- **Efficient Reporting**: Line reporter for CI, HTML for debugging

### Future Optimizations

- **Test Sharding**: Split tests across multiple CI jobs
- **Visual Regression**: Add screenshot comparison tests
- **Performance Monitoring**: Add page load time assertions
- **Mobile Testing**: Re-enable mobile browsers when needed

### Resource Usage

| Configuration | Tests | Time | Browsers | CI Impact |
|---------------|-------|------|----------|-----------|
| **Current (Optimized)** | 6 | ~3.3s | Chromium | Low |
| Previous (Full) | 30 | ~11.4s | 5 browsers | High |

## Cursor Rules Integration

A comprehensive Cursor rule is available at `.cursor/rules/playwright-e2e-testing.mdc` that provides:

- **Mandatory testing triggers** for code changes
- **Failure analysis protocol** (bug vs. intended change)
- **Debugging workflow** and artifact locations
- **Test maintenance guidelines**
- **Example workflows** and commit message formats

### Key Rule Guidelines

1. **Always run E2E tests** after UI/frontend changes
2. **Analyze failures carefully** - fix bugs, don't just update tests
3. **Document test changes** in commit messages
4. **Maintain test quality** - meaningful assertions only
5. **Use debugging tools** effectively for quick issue resolution

## Version History

- **v1.0** (Initial): Full cross-browser setup with 30 tests
- **v1.1** (Bug Fix): Resolved CI port conflict issues
- **v1.2** (Optimization): Chromium-only for 70% performance improvement
- **v1.3** (Documentation): Comprehensive documentation and Cursor rules

## Contributing

### Adding New Tests

1. **Create test file** in `helixium-web/tests/`
2. **Follow naming convention**: `feature-name.spec.ts`
3. **Use exact selectors** and proper waits
4. **Run locally first**: `yarn test:e2e:ui`
5. **Verify CI passes** after pushing

### Enabling Additional Browsers

To re-enable other browsers:
1. **Uncomment browser configs** in `playwright.config.ts`
2. **Update CI command**: `yarn playwright install --with-deps`
3. **Expect longer execution times** (~11s vs ~3s)
4. **Consider CI resource impact**

### Best Practices

- **Test user workflows**, not implementation details
- **Keep tests atomic** and independent
- **Use meaningful test descriptions**
- **Document complex test logic**
- **Regularly review and maintain** test suite quality

---

For questions or issues, refer to the [Playwright documentation](https://playwright.dev/docs/intro) or check the project's GitHub Issues.
