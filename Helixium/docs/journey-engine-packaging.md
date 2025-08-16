# Packaging Strategy – Journey Engine as a Stand-Alone NPM Module

*Status: Draft – v0.1*

This document outlines how to evolve the Journey Engine (Genome / Strand / Gene system) from code living inside `helixium-web` to an independent, reusable npm package.  It highlights key design constraints, folder structure, build tooling, dependency boundaries, and an extraction roadmap that minimises churn.

---

## 1. Guiding Principles

1. **Isolation of Core Logic** – business-agnostic parsing, validation, navigation, and state management must not import Helixium-specific code.
2. **Clear Public API** – consumers should need only a handful of surface exports: `<PolymeraseProvider>`, `useJourney`, and maybe `GeneRenderer` registry helpers.
3. **Peer Dependencies Over Bundled** – avoid forcing React, Jotai, or Chakra versions; declare them as peers.
4. **Headless First, Skinnable Later** – core engine provides no visual styling; a wrapper layer (`journey-engine-chakra`) can compose Chakra-flavoured gene components.
5. **Schema-Driven Extensibility** – new Gene types register via an extension API so downstream projects can add custom UIs without forking core.
6. **Zero Side-Effects** – package must be tree-shakeable; only run code when provider is mounted.

---

## 2. Monorepo Layout (Yarn Workspaces)

```
Helixium/
├─ package.json            # root workspaces config
├─ packages/
│  ├─ journey-engine/      # <———— core, framework-agnostic React hooks + context
│  │   ├─ src/
│  │   ├─ tsconfig.json
│  │   └─ build.config.ts  # tsup / swc / rollup
│  ├─ journey-engine-ui/   # Chakra-based reference implementation (optional)
│  └─ genomes/             # versioned JSON configs (could be separate package)
└─ apps/
   └─ helixium-web/        # CRA replacement; imports @helixium/journey-engine
```

> 🛠 *Why Yarn Workspaces?* – Helixium already uses Yarn; workspaces give seamless local linking and CI caching without introducing pnpm or Nx.

---

## 3. Package Boundaries

| Package | Purpose | Deps | Versioning |
|---------|---------|------|------------|
| `@helixium/journey-engine` | Core hooks, context, schema validation utilities | peer: `react`, `jotai`, `ajv` | Own SemVer track |
| `@helixium/journey-engine-ui` | Default Gene components implemented with Chakra | depends on `@helixium/journey-engine`, peer `@chakra-ui/react` | Matches major version of core |
| `@helixium/genomes` (future) | Pre-built JSON configs for common products | none | Independent |

---

## 4. Build & Publish

* Use **tsup** for ESM + CJS bundle and type declarations.
* Generate `.d.ts` via `tsc -p packages/journey-engine/tsconfig.json --emitDeclarationOnly`.
* Add `exports` map for modern bundlers.

```jsonc
{
  "name": "@helixium/journey-engine",
  "version": "0.1.0",
  "main": "dist/index.cjs",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "peerDependencies": {
    "react": ">=18",
    "jotai": ">=2",
    "ajv": ">=8"
  }
}
```

CI workflow:
1. `yarn workspaces run test && yarn validate:genomes` at root.
2. Build packages via `yarn workspace @helixium/journey-engine build`.
3. On semver tag, publish using **Changesets** or GH Action + npm token.

---

## 5. Abstraction Layers

| Layer | Source | Depends on | Description |
|-------|--------|------------|-------------|
| **Domain-Independent Core** | `packages/journey-engine/src/` | React, Jotai, Ajv | Parsing genome, navigation, atoms, context. No UI. |
| **UI Bindings** | `packages/journey-engine-ui/` | Chakra, core | Default `Gene` components. Consumers can swap. |
| **App Integration** | `apps/helixium-web` | Next.js/Vite + Chakra + core/ui | Imports provider + UI; passes genome JSON path or object. |

Decoupling UI means downstream users (e.g., a Vue rewrite) can reuse core engine and supply their own component mapping.

---

## 6. Steps to Extract (Roadmap)

1. **Phase 0 – In-Repo Development**
   * Keep current code under `helixium-web/src/features/journey-engine`.
   * Ensure *no relative imports* from other app folders; rely on peer deps only.
2. **Phase 1 – Create Package Skeleton**
   * `mkdir -p packages/journey-engine/src` and copy core logic.
   * Export named hooks (`useGenome`, `useNavigation`, etc.).
   * Add local alias in `tsconfig.paths` so web app can import `@helixium/journey-engine` even before publishing.
3. **Phase 2 – UI Layer**
   * Move Chakra Gene components to `packages/journey-engine-ui`.
   * Web app updates imports.
4. **Phase 3 – Internal Publish & Consumer Refactor**
   * `yarn workspaces run build` – consume built package inside app via workspace protocol.
   * Remove leftover code from app feature folder.
5. **Phase 4 – External Publish**
   * Add Changeset and version bump; publish to npm.
   * Consumers outside monorepo can now install via `npm i @helixium/journey-engine`.

Each phase is incremental and keeps the web app functional.

---

## 7. Design Constraints for Easy Extraction

1. **Avoid Absolute `src/` Imports** – use package-relative paths so copy/paste doesn’t break.
2. **No Chakra in Core** – UI imports live only in UI layer.
3. **Config Agnosticism** – engine accepts genome object; loading/fetching lives in adapter so Node/React Native could reuse.
4. **Event Bus Hooks** – inject analytics handler via context to decouple from GA4.
5. **Pluggable Validation** – default Ajv validator can be overridden.

---

## 8. Example Usage After Extraction

```tsx
import {PolymeraseProvider} from '@helixium/journey-engine'
import {ChakraGeneRenderer} from '@helixium/journey-engine-ui'
import genome from '@helixium/genomes/car-insurance-v0.1.json'

export default function QuoteWizard() {
  return (
    <PolymeraseProvider genome={genome} renderer={ChakraGeneRenderer}>
      {/* wizard layout / router outlet here */}
    </PolymeraseProvider>
  )
}
```

---

## 9. Open Questions

1. **Export naming** – keep Helix-themed terms (`PolymeraseProvider`) vs generic (`JourneyProvider`)?  Could alias both.
2. **State Manager** – stick with Jotai or expose pluggable adapter (Zustand, Redux)?
3. **Analytics API** – define typed interface or remain callback-based.
4. **Monorepo Tooling** – Yarn Workspaces is fine for now; consider Turborepo if build times grow.

---

### Next Actions

* Approve guiding principles & folder layout.  
* Kick off Phase 0 with strict **eslint-import-no-relative-parent-imports** rule inside `journey-engine` folder to enforce isolation.  
* Add Changesets config for eventual publish.

Feedback welcome!  Once agreed, we’ll restructure code accordingly without blocking ongoing MVP delivery.