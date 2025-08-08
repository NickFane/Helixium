# Helixium Web Application

A React + TypeScript + Vite application demonstrating modern state management patterns with Jotai.

## Features

- **Jotai State Management**: Advanced atom-based state management with multiple store isolation
- **Click Counter Example**: Demonstrates atom sharing across independent stores
- **Modern React**: Built with React 19 and TypeScript
- **Fast Development**: Vite with HMR for rapid development

## State Management

The application includes a comprehensive Jotai implementation that demonstrates:

- **Atom Architecture**: Reducer atoms and derived atoms for state management
- **Store Isolation**: Multiple independent stores sharing the same atom definitions
- **Performance Optimization**: Direct store access for read-only operations
- **Type Safety**: Full TypeScript integration with atom types

### Example Implementation

The click counter example shows how to create multiple instances of the same functionality with independent state:

```typescript
// Two separate stores
const store1 = createStore();
const store2 = createStore();

// Same atoms, independent state
<Provider store={store1}>
  <ClickDashboard id="1" />
</Provider>
<Provider store={store2}>
  <ClickDashboard id="2" />
</Provider>
```

For detailed documentation on the state management implementation, see [docs/jotai-state-management.md](../docs/jotai-state-management.md).

## Development Setup

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
