# Config-Driven Journey System

*Status: Draft – v0.1*

---

## 1. Purpose

Helixium needs a highly configurable way to present a series of questions (“journeys”) that collect data and ultimately feed an external API (e.g. an insurance-quote service).  By storing the journey definition in a JSON-schema-validated config file we gain:

1. **Rapid Experimentation** – reorder questions, change copy, or group questions without a redeploy of UI code.
2. **A/B & Multivariate Testing** – maintain parallel configs and use feature-flags or traffic splitting upstream.
3. **Future-Proofing** – add conditional logic, branching, internationalisation, and new input types without core rewrites.

The first concrete implementation targets *car-insurance comparison* but the design is intentionally product-agnostic.

---

## 2. Helixium-Themed Terminology

To keep naming consistent with the Helixium brand (DNA / helix imagery):

| Concept | Helixium Term | Analogy | Notes |
|---------|---------------|---------|-------|
| Entire flow | **Genome** | Complete genetic blueprint | Publicly called *Journey* in UX copy to avoid jargon. |
| Logical page / wizard step | **Strand** | Section of DNA helix | Minimum 1 question. |
| Single question UI component | **Gene** | Encodes a single trait | Former “Question Block”. |
| Typed answer value | **Allele** | Variant of a gene | Stored in Jotai atom. |
| Runtime engine | **Polymerase** | Enzyme that reads DNA | Consumes Genome config and renders UI. |

Developers may still use neutral aliases (`Journey`, `Page`, `Question`) in code where clarity trumps theme, but docs adopt the above.

---

## 3. Milestones & Roadmap

1. **MVP (v0.1)**
   - Genome served as static JSON file in repo.
   - Linear flow: one Gene per Strand.
   - Supported Gene types: text, number, date, single-choice, multi-choice.
   - Synchronous, per-Gene validation (required, regex, min/max, etc.).
   - Answers stored in Jotai atoms; submission builds request payload via mapping layer.

2. **Enhanced (v0.2 – v0.3)**
   - Multiple Genes per Strand (configurable counts).
   - Conditional visibility (show/hide Strand/Gene based on other Alleles).
   - Variant configs for A/B testing behind LaunchDarkly flag.
   - Remote config fetching with hot-reload (resets progress).

3. **Future (v1.0+)**
   - Branching logic: non-linear Genome paths.
   - Internationalisation support inside Genome strings.
   - Fine-grained analytics hooks emitted per Gene.
   - Accessibility metadata baked into Gene definition.
   - Secure handling for PII answers (masking/encryption at rest).

---

## 4. Genome JSON Schema (MVP excerpt)

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://helixium.dev/schemas/genome.schema.json",
  "title": "Helixium Genome Config",
  "type": "object",
  "required": ["version", "id", "title", "strands"],
  "properties": {
    "version": { "type": "string", "pattern": "^v\\d+\\.\\d+$" },
    "id": { "type": "string", "description": "Unique key for analytics & versioning" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "strands": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/definitions/strand" }
    }
  },
  "definitions": {
    "strand": {
      "type": "object",
      "required": ["id", "title", "genes"],
      "properties": {
        "id": { "type": "string" },
        "title": { "type": "string" },
        "description": { "type": "string" },
        "genes": {
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#/definitions/gene" }
        }
      }
    },
    "gene": {
      "type": "object",
      "required": ["id", "type", "label"],
      "properties": {
        "id": { "type": "string" },
        "type": {
          "type": "string",
          "enum": ["text", "number", "date", "singleChoice", "multiChoice"]
        },
        "label": { "type": "string" },
        "placeholder": { "type": "string" },
        "validation": {
          "type": "object",
          "properties": {
            "required": { "type": "boolean" },
            "regex": { "type": "string" },
            "min": { "type": "number" },
            "max": { "type": "number" }
          }
        },
        "options": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["value", "label"],
            "properties": {
              "value": { "type": "string" },
              "label": { "type": "string" }
            }
          }
        }
      }
    }
  }
}
```

> 🔍 **Note**: Conditional logic properties (`visibility`, `dependsOn`) will be added in v0.2 without breaking existing genomes.

---

## 5. Runtime Engine Responsibilities (Polymerase)

1. Load Genome config (local file → later remote URL).
2. Validate against JSON Schema at runtime; fail fast and log descriptive errors.
3. Render UI: iterate Strands, display Genes according to current index.
4. Store Alleles in Jotai atoms scoped to journey instance.
5. Provide navigation helpers (`next()`, `prev()`, `gotoStrand(id)`).
6. Expose events for analytics layer (GA4): `strand_view`, `gene_view`, `gene_answer`, `journey_complete`.
7. Build final payload via mapping layer and POST to quote API endpoint.

---

## 6. Developer Workflow

```mermaid
graph TD
  A[Edit Genome JSON] --> B[CI JSON Schema validation]
  B --> C[Local dev | hot-reload]
  C --> D[Commit & PR]
  D --> E[Feature flag rollout or A/B selection]
```

1. **Create / modify** a genome file under `helixium-web/src/genomes/` (tbd).
2. CI step validates JSON against canonical schema.
3. Developers run `yarn dev` – webpack Vite plugin reloads journey on file save.
4. Once merged, feature flags select which genome variant to serve.

---

## 7. Versioning & Rollback Strategy

* Each genome carries a semantic `version` and unique `id`.
* Git history + feature flags allow instant rollback by referencing a previous `id`.
* Schema itself follows SemVer – breaking changes bump major.

---

## 8. Open Questions / Next Steps

1. **Nomenclature feedback** – accept/revise Helixium terms?
2. **File placement** – `src/genomes/` vs remote CMS.
3. **Analytics spec** – confirm GA4 event params.
4. **Security** – plan for encrypted localStorage for PII answers.

Please review and provide comments; we can iterate quickly before implementation begins.