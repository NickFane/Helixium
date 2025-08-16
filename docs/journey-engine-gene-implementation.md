# Journey Engine Gene Implementation Guide

_Status: Active Development - v0.1_  
_Last Updated: August 16, 2025_

---

## Overview

This document describes the initial implementation of the Journey Engine's Gene system in Helixium. This represents the first step toward the config-driven journey architecture outlined in our business requirements, focusing on reusable, configurable UI components with external state access.

## What We Built

### 🧬 Gene Component System

**FullNameGene Component** - A sample text input gene demonstrating the core Journey Engine patterns:

- **Configurable Props**: `questionText` prop allows different question contexts
- **Unique Identity**: Each gene instance has a unique `geneId`
- **State Management**: Uses Jotai atoms for scalable state management
- **External Access**: Registry system allows ID-based value retrieval
- **Auto-registration**: Components register themselves for external access

```tsx
<FullNameGene geneId="primary-contact" questionText="What is your full name?" />
```

### 🗂️ Gene Registry System

**External Access Pattern** - Components can access gene values without direct references:

```tsx
// External component can access any gene value by ID
const specificValue = store.get(GeneRegistry.getValueById("primary-contact"));
const allValues = store.get(GeneRegistry.getAllValues());
```

### 🧭 Sub-Navigation System

**Contextual Navigation** - Sub-navbar appears automatically on routes with sub-routes:

- **Fixed Positioning**: Sits below main navbar at top of page
- **Route Detection**: Automatically detects route structure and displays relevant tabs
- **Consistent Styling**: Matches main navbar appearance and behavior

### 📁 Organized Structure

**Scalable Architecture** - Clean separation of concerns:

```
helixium-web/src/features/form-builder/
├── index.tsx                    # Directory page with demo/utility cards
├── genes/                       # Common gene utilities
│   ├── atoms.ts                # Shared Jotai atoms and registry
│   ├── index.ts                # Common exports and GeneRegistry
│   └── fullname/               # Specific gene implementation
│       ├── FullNameGene.tsx    # Component implementation
│       └── index.ts            # Component exports
```

---

## Technical Implementation

### Jotai Atom Architecture

**Atom Family Pattern** for scalable state management:

```typescript
// Each gene gets its own atom based on geneId
export const geneAlleleAtomFamily = atomFamily((_geneId: string) =>
  atom<string>("")
);

// Registry tracks all active genes
export const geneRegistryAtom = atom<Set<string>>(new Set<string>());

// Helper for external access
export const getAllGenesValuesAtom = atom((get) => {
  const registry = get(geneRegistryAtom);
  const values: Record<string, string> = {};

  registry.forEach((geneId) => {
    const alleleAtom = geneAlleleAtomFamily(geneId);
    values[geneId] = get(alleleAtom);
  });

  return values;
});
```

### Component Registration Pattern

**Auto-registration** ensures external accessibility:

```typescript
const FullNameGene = ({ geneId, questionText }: FullNameGeneProps) => {
  // Get the allele atom for this specific gene
  const alleleAtom = geneAlleleAtomFamily(geneId);
  const [alleleValue, setAlleleValue] = useAtom(alleleAtom);

  // Register this gene for external access
  const [, registerGene] = useAtom(registerGeneAtom);

  useEffect(() => {
    registerGene(geneId);
  }, [geneId, registerGene]);

  // ... component implementation
};
```

### Sub-Navbar Configuration

**Route-based Navigation** with automatic detection:

```typescript
const subNavConfig: SubNavConfig = {
  "/form-builder": [
    {
      label: "Overview",
      path: "/form-builder",
      isActive: currentPath === "/form-builder",
    },
    {
      label: "Demos",
      path: "/form-builder/demos/gene-reusability",
      isActive: currentPath.startsWith("/form-builder/demos"),
    },
    // ... more nav items
  ],
};
```

---

## Demo Implementation

### Gene Reusability Demo

**Location**: `/form-builder/demos/gene-reusability`

**Demonstrates**:

- Same component with different question text
- Independent state management per gene instance
- External value access patterns
- Consistent UI for value display

**Example Usage**:

```tsx
// Primary contact
<FullNameGene
  geneId="primary-fullname-gene"
  questionText="What is your full name?"
/>

// Emergency contact
<FullNameGene
  geneId="emergency-contact-fullname-gene"
  questionText="What is your emergency contact's full name?"
/>
```

### External Access Demo

**Three Access Patterns**:

1. **Get All Values** - Retrieves all registered gene values
2. **Get Primary Contact** - Retrieves specific gene by ID
3. **Get Emergency Contact** - Retrieves different specific gene by ID

**Consistent Display**: All results show in same formatted JSON display box with action tracking.

---

## Journey Engine Compliance

### Terminology Alignment

| Implementation | Journey Engine Term | Purpose                                    |
| -------------- | ------------------- | ------------------------------------------ |
| `FullNameGene` | **Gene**            | Discrete UI component capturing user input |
| `alleleValue`  | **Allele**          | User's answer/value for a gene             |
| `GeneRegistry` | **Gene Registry**   | Mapping system for external access         |
| `geneId`       | **Gene ID**         | Unique identifier for gene instances       |

### Business Requirements Mapping

| Requirement                          | Implementation Status | Details                                    |
| ------------------------------------ | --------------------- | ------------------------------------------ |
| **FR-01**: Render journeys from JSON | 🟡 **Partial**        | Components configurable via props (step 1) |
| **FR-02**: JSON Schema validation    | ❌ **Future**         | Not yet implemented                        |
| **FR-03**: One Gene per Strand       | ✅ **Complete**       | Demo shows individual gene instances       |
| **FR-04**: Collect Alleles           | ✅ **Complete**       | External access via GeneRegistry           |
| **FR-05**: GA4 events                | ❌ **Future**         | Not yet implemented                        |
| **FR-06**: Variant selection         | ❌ **Future**         | Not yet implemented                        |

---

## Architecture Benefits

### 🔄 Reusability

- Same component, different configurations
- Props-based customization
- Independent state per instance

### 🎯 External Access

- ID-based value retrieval
- No direct component references needed
- Registry pattern for discoverability

### 📈 Scalability

- Atom family pattern handles unlimited gene instances
- Clean folder structure for new gene types
- Extensible sub-navigation system

### 🛡️ Type Safety

- Full TypeScript implementation
- Proper interfaces for all components
- Type-safe atom definitions

---

## Next Steps

### Phase 2: Enhanced Configuration

- Add validation props (required, regex, min/max)
- Implement placeholder text configuration
- Add help text and labels

### Phase 3: JSON Configuration

- Move from props to JSON-driven configuration
- Implement Genome/Strand/Gene JSON schema
- Add runtime JSON validation

### Phase 4: Advanced Features

- Conditional logic and branching
- Multi-step journeys with navigation
- Analytics events integration

### Phase 5: Package Extraction

- Extract to `@helixium/journey-engine` npm package
- Headless core with pluggable UI components
- Documentation and examples

---

## Usage Guidelines

### Adding New Gene Types

1. **Create gene folder**: `src/features/form-builder/genes/{gene-type}/`
2. **Implement component**: Follow FullNameGene pattern
3. **Export from genes/index.ts**: Add to main exports
4. **Create demo**: Add demonstration to demos section

### External Integration

```typescript
// In any external component
import { GeneRegistry } from "@/features/form-builder/genes";

const MyComponent = () => {
  const store = useStore();

  // Get specific value
  const userName = store.get(
    GeneRegistry.getValueById("primary-fullname-gene")
  );

  // Get all values
  const allAnswers = store.get(GeneRegistry.getAllValues());

  return <div>Hello, {userName}!</div>;
};
```

### Best Practices

1. **Unique Gene IDs**: Always use descriptive, unique gene IDs
2. **Prop Configuration**: Use props for configuration until JSON schema ready
3. **State Isolation**: Each gene instance should have independent state
4. **External Access**: Design components for external value access
5. **Type Safety**: Maintain full TypeScript coverage

---

## Testing

### Manual Testing

- Navigate to `/form-builder/demos/gene-reusability`
- Test different question text displays correctly
- Verify independent state management
- Test external value access buttons

### Automated Testing

- Component unit tests (planned)
- E2E tests for demo functionality (planned)
- Registry pattern tests (planned)

---

## Related Documentation

- [Business Requirements](../Helixium/docs/business-requirements-journey-engine.md)
- [Journey Engine Glossary](../Helixium/docs/journey-engine-glossary.md)
- [Config-Driven Implementation](../Helixium/docs/config-driven-journeys-implementation.md)
- [Jotai State Management](./jotai-state-management.md)

---

_This implementation represents the foundation of the Journey Engine's Gene system. It demonstrates core patterns while remaining simple and focused for incremental development toward the full config-driven architecture._
