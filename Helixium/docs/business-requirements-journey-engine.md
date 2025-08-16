# Business Requirements Document (BRD)

**Project:** Config-Driven Journey Engine  
**Version:** 0.1 (Draft)  
**Prepared by:** Product & Architecture Team  
**Date:** <!-- YYYY-MM-DD placeholder -->

---

## 1. Executive Summary

Helixium will build a **config-driven journey engine** that allows product and marketing teams to rapidly create, modify, and experiment with multi-step user flows ("journeys") without code changes.  The first implementation targets **car-insurance quote comparison**, but the solution must be *product-agnostic* to unlock reuse across future verticals (home insurance, banking, telco, etc.).

Primary business value:

1. **Higher conversion** – iterate copy, question order, and layout to maximise quote completions and policy purchases.
2. **Faster go-to-market** – launch new variants in hours, not sprint cycles.
3. **Lower engineering overhead** – template-driven approach reduces repetitive UI work.

---

## 2. Goals & Success Metrics

| # | Goal | KPI / Metric | Target (MVP) |
|---|------|--------------|--------------|
| G1 | Increase journey completion rate | Completion % vs baseline form | +10% |
| G2 | Accelerate iteration speed | Time to launch new variant | < 4h (config + review) |
| G3 | Support controlled experiments | # of concurrently active variants | ≥ 2 (A/B) |
| G4 | Simplify maintenance | Engineer hours per new question | ≤ 1h |
| G5 | Ensure data quality | Schema validation defect rate | 0 blocking errors in prod |

---

## 3. Scope

### 3.1 In-Scope (MVP)

1. **Linear journeys** – single path, one question (*Gene*) per page (*Strand*).
2. **Config storage** – static JSON file tracked in Git.
3. **Schema validation** – JSON-Schema enforced in CI & runtime.
4. **Core input types** – text, number, date, single-choice, multi-choice.
5. **Basic validation** – required, regex, min/max rules.
6. **Analytics events** – view/answer/completion events to GA4.
7. **Feature-flag variant selection** – LaunchDarkly flag toggles between two Genome configs.

### 3.2 Out-of-Scope (MVP) / Future Phases

• Branching & skip logic  
• PII field encryption  
• Internationalisation  
• Real-time config hot-reload for in-progress sessions  
• Advanced reporting dashboards

---

## 4. Stakeholders & Responsibilities

| Role | Name (placeholder) | Responsibility |
|------|--------------------|----------------|
| Product Owner | TBD | Owns roadmap & KPIs |
| UX Lead | TBD | Designs Gene/Strand UI & copy |
| Engineering Lead | TBD | Delivers engine & integration |
| Data / Analytics | TBD | Defines GA4 event schema & monitors metrics |
| DevOps | TBD | CI/CD, feature-flag rollout, infra |
| Compliance | TBD | Reviews data handling, PII regulations |

---

## 5. Functional Requirements

ID | Requirement | Priority
---|-------------|---------
FR-01 | The system shall render a journey defined entirely by a **Genome** JSON file. | Must
FR-02 | The system shall validate Genome files against a canonical JSON-Schema during CI and at runtime. | Must
FR-03 | The system shall display **one Gene per Strand** in MVP. | Must
FR-04 | The system shall collect user answers (**Alleles**) and produce a final payload compatible with the quote API mapper. | Must
FR-05 | The system shall emit GA4 events: `strand_view`, `gene_view`, `gene_answer`, `journey_complete`. | Must
FR-06 | The system shall support **variant selection** via feature flag to enable A/B testing. | Should
FR-07 | The system shall allow non-engineers to add or edit Genes via JSON with documentation examples. | Should
FR-08 | The system shall fail gracefully with a branded error page if Genome validation fails. | Must

---

## 6. Non-Functional Requirements

Category | Requirement
---------|------------
Performance | Page transition time ≤ 300 ms; initial load time within existing budgets.
Security | All answers held only in memory until submission; comply with GDPR guidelines for PII (future encryption).
Accessibility | Gene components must meet WCAG 2.1 AA standards.
Modularity | Core engine packaged as `@helixium/journey-engine` with peer dependencies; UI layer pluggable.
Reliability | 99.9% uptime; roll back to previous Genome in < 15 min via feature flag.
Scalability | Support ≥ 5 concurrent journey variants without redeploy.
Maintainability | Codebase follows Bulletproof React conventions; high unit test coverage of engine utilities.

---

## 7. Dependencies & Risks

Dependency | Impact | Mitigation
-----------|--------|-----------
LaunchDarkly integration | Blocking for A/B rollout | Fallback to query-param variant toggle in MVP.
GA4 property setup | Required for analytics KPIs | Schedule early with Data team.
Quote API spec finalisation | Needed for payload mapper | Use mock service until spec stable.
PII Compliance Review | Could delay production launch | Begin privacy impact assessment during MVP dev.

Risk | Probability | Impact | Response
-----|-------------|--------|---------
Schema complexity grows | Med | High | Governance process + versioned schema.
Engine extraction to npm slips | Low | Med | Develop in isolation folder to ease later extraction.

---

## 8. Milestones & Timeline (Indicative)

Phase | Deliverable | ETA
------|-------------|----
0 | BRD & Technical Architecture sign-off | Week 0
1 | MVP Engine in-repo, static Genome, GA4 events | Week 4
2 | Multi-Gene per Strand, analytics enhancements | Week 6
3 | Feature-flag variant rollout, JSON-Schema governance | Week 8
4 | Package extraction to `@helixium/journey-engine` beta | Week 10

---

## 9. Acceptance Criteria (MVP)

1. Product owner can create a new Genome JSON with different question order and deploy via feature flag without code change.  
2. GA4 dashboard shows event counts aligning with manual QA runs.  
3. End-to-end Playwright test completes a car-insurance journey and receives quote payload.  
4. Schema validation prevents accidental deploy of malformed Genome.  
5. Completion rate uplift observed (baseline +10% after 2-week A/B).

---

## 10. Approval

| Name | Role | Signature | Date |
|------|------|-----------|------|
|  |  |  |  |

---

*End of Document*