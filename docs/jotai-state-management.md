# Jotai State Management

This document describes the Jotai state management implementation in the Helixium project, specifically the click counter example that demonstrates atom sharing across multiple stores.

## Overview

The implementation demonstrates how Jotai atoms can be shared across multiple stores while maintaining independent state. This pattern is useful for creating isolated instances of the same functionality, such as multiple counters, forms, or widgets.

## Architecture

### Atom Structure

The state management is built around two main atoms:

1. **`clickCountReducerAtom`** - A reducer atom that manages the click count state
2. **`clickCountDisplayAtom`** - A derived atom that formats the display text

```typescript
// store/atoms/clickCountAtom.ts
export const clickCountReducerAtom = atomWithReducer(0, clickCountReducer);

export const clickCountDisplayAtom = atom((get) => {
  const clickCount = get(clickCountReducerAtom);
  return `Click count: ${clickCount}`;
});
```

### Reducer Pattern

The implementation uses Jotai's `atomWithReducer` for predictable state updates:

```typescript
export const clickCountReducer = (prev: number, action: { type: string }) => {
  if (action.type === "increment") {
    return prev + 1;
  }
  if (action.type === "decrement") {
    return prev - 1;
  }
  return prev;
};
```

## Multiple Store Isolation

### Store Creation

The application creates two separate Jotai stores to demonstrate atom isolation:

```typescript
// routes/index.tsx
const store1 = createStore();
const store2 = createStore();
```

### Provider Pattern

Each store is wrapped in its own `Provider` component:

```typescript
<Provider store={store1}>
  <ClickDashboard id="1" />
</Provider>
<Provider store={store2}>
  <ClickDashboard id="2" />
</Provider>
```

### Component Implementation

The `ClickDashboard` component demonstrates how to use atoms within a specific store:

```typescript
const ClickDashboard = ({ id }: { id: string }) => {
  const store = useStore();
  const [, dispatch] = useAtom(clickCountReducerAtom);
  const clickCountText = store.get(clickCountDisplayAtom);

  return (
    <Flex flexDir={"column"} gap={2}>
      <Text>{id}</Text>
      <Text>{clickCountText}</Text>
      <Button onClick={() => dispatch({ type: "increment" })}>Click me</Button>
    </Flex>
  );
};
```

## Key Concepts Demonstrated

### 1. Atom Sharing

The same atom definitions (`clickCountReducerAtom` and `clickCountDisplayAtom`) are used across multiple stores, but each store maintains its own independent state.

### 2. Store Isolation

Each `Provider` creates an isolated context where atoms maintain separate state values. This allows for:

- Independent state management
- No cross-contamination between instances
- Scalable component architecture

### 3. Derived Atoms

The `clickCountDisplayAtom` demonstrates how to create computed values that automatically update when their dependencies change:

```typescript
export const clickCountDisplayAtom = atom((get) => {
  const clickCount = get(clickCountReducerAtom);
  return `Click count: ${clickCount}`;
});
```

### 4. Direct Store Access

The component uses `store.get()` to directly access atom values, bypassing the usual React re-render cycle for performance optimization.

## Usage Patterns

### Creating Multiple Instances

To create multiple instances of the same functionality:

1. **Create separate stores**:

   ```typescript
   const store1 = createStore();
   const store2 = createStore();
   ```

2. **Wrap components in providers**:

   ```typescript
   <Provider store={store1}>
     <MyComponent />
   </Provider>
   <Provider store={store2}>
     <MyComponent />
   </Provider>
   ```

3. **Use atoms within components**:
   ```typescript
   const store = useStore();
   const [state, dispatch] = useAtom(myReducerAtom);
   ```

### Benefits of This Pattern

- **Reusability**: Same atom definitions work across multiple instances
- **Isolation**: Each instance maintains independent state
- **Performance**: Direct store access for optimized reads
- **Type Safety**: Full TypeScript support with atom types
- **Predictable Updates**: Reducer pattern ensures consistent state changes

## File Structure

```
src/
├── store/
│   └── atoms/
│       └── clickCountAtom.ts    # Atom definitions
├── features/
│   └── clickDashboard/
│       └── index.tsx            # Component using atoms
└── routes/
    └── index.tsx                # Multiple store setup
```

## Dependencies

The implementation requires the following Jotai dependencies:

```json
{
  "jotai": "^2.13.0"
}
```

## Best Practices

1. **Atom Organization**: Keep related atoms in the same file
2. **Naming Conventions**: Use descriptive names for atoms and reducers
3. **Type Safety**: Always define proper TypeScript types for actions
4. **Performance**: Use `store.get()` for read-only access when appropriate
5. **Testing**: Test atoms in isolation and with different store instances

## Future Enhancements

Potential improvements to consider:

- **Persistence**: Add atom persistence for state restoration
- **DevTools**: Integrate Jotai DevTools for debugging
- **Async Atoms**: Implement async atoms for API calls
- **Atom Families**: Use atom families for dynamic atom creation
- **Validation**: Add runtime validation for atom values

## Related Documentation

- [Jotai Official Documentation](https://jotai.org/)
- [React State Management Patterns](../development-workflow.md)
- [Project Architecture](../README.md)
