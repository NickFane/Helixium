# Journey Engine – Glossary of Terms

*Status: Draft – v0.1*

This glossary standardises the language used throughout Helixium’s **Journey Engine** so that developers, product owners, and analysts share a common vocabulary.  Each engine term may correspond to multiple synonyms in business or UX copy; mapping them here avoids confusion.

| Engine Term | Definition / Purpose | Alternate / Business Terms | Notes |
|-------------|---------------------|----------------------------|-------|
| **Genome** | Complete configuration object describing an end-to-end journey, including meta-data, ordered Strands, and Genes. | Journey, Flow, Form, Wizard | JSON validated against `genome.schema.json`. |
| **Strand** | Logical slice of the Genome rendered as a single screen/step. Contains one or more Genes plus UI meta (title, description). | Page, Step, Section | Min 1 Gene, no max. Display order defined by Genome. |
| **Gene** | Discrete UI component that captures a single piece of user input. | Question, Field, Question Block | Supports types: text, number, date, singleChoice, multiChoice, etc. |
| **Allele** | The value/answer supplied by the user for a Gene. Stored in state atoms. | Answer, Response, Value | May be empty/null until user interacts. |
| **Polymerase** | Runtime engine (React provider + hooks) that interprets a Genome, manages navigation, and exposes state. | Journey Engine, Renderer, Engine | Consumers mount `<PolymeraseProvider>` in the app. |
| **Variant** | A specific version of a Genome used for A/B or multivariate testing. | Experiment, Arm, Schema Variant | Selected via feature flag or query param. |
| **Genome Schema** | JSON-Schema document describing valid Genome structure. | Config Schema | Maintained under `src/genomes/schema/`. |
| **Gene Registry** | Mapping of `gene.type` → React component used by Polymerase to render UI. | Control Map, Renderer Registry | Default registry lives in `journey-engine-ui`. |
| **Payload Builder** | Utility that converts Alleles into the format required by downstream APIs (e.g., quote service). | Mapper, Converter | Pluggable per product. |
| **Conditional Logic** | Rules in Genome that determine visibility or branching based on Alleles. | Skip Logic, Branching, Dependencies | Introduced in v0.2+. |
| **Hot Reload** | Dev-time mechanism that reloads Genome JSON without full page refresh. | Live Reload | Powered by Vite HMR. |

---

### Naming Guidelines

1. Use **engine terms** in code to maintain consistency (`gene.id`, `strand.title`).  
2. Use **business synonyms** in user-facing copy only (`“step”`, `“question”`).  
3. When introducing new features, add the term here with clear mapping.

---

##### Last updated: <!-- date placeholder -->