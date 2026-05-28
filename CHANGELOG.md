# Changelog

All notable changes to this project are documented here.

## [1.1.0] - 2026-05-28

### Added
- Skyyflow vault integration for billing-contact PII (`billing_contact_email`, `billing_contact_phone`, `executive_sponsor_email`) on every active deal.
- AI Procurement Decision Card v0.2 reader — workspace consumes the `data_vault_targets[]` entry to learn which roles may reveal which fields.
- `MockSkyyflowVault` browser implementation (SHA-256 via Web Crypto) with deterministic opaque tokens (`skyy_<hex16>`).
- RBAC-aware reveal flow — three operator roles (Sales Rep · Deal Desk Lead · Finance Director). Sales Rep sees only masked tokens; Deal Desk Lead and Finance Director may click-to-reveal per the Decision Card's `reveal_roles`.
- Audit trail panel — every reveal attempt records caller role, account, field, and disposition (`revealed`, `denied-not-authorized`, `denied-no-such-token`).
- Unit tests for the vault, the Decision Card parser, and the full mask → switch role → reveal → audit flow.

### Why this mattered
- Pricing approvals routinely surface billing-contact PII to roles that have no business reading it. The old surface treated those fields as plain strings.
- The Decision Card spec already declares which roles may see which fields; this release made the workspace honour that contract instead of restating it in code.
- Same vault contract is used in the [rag-sentinel](https://github.com/mizcausevic-dev/rag-sentinel) tokenize-before-index pipeline — one Decision Card drives both server-side scanning and client-side reveal.

## [1.0.0] - 2026-05-12

### Released
- Released **deal-desk-workspace** publicly as a reviewable operating system for identity governance.
- Packaged the current implementation, documentation, validation flow, and proof surfaces into a repo that can be reviewed by technical and operating stakeholders.
- Clarified the core problem the project is addressing: identity sprawl, tenant-boundary mistakes, and access-review workflows that are technically complete but poorly explained.

### Why this mattered
- Existing approaches in IGA suites, ticket approvals, and access review campaigns were useful for parts of the workflow.
- They still left out a fast, legible control layer for access reasoning at the moment decisions are made.
- This release made the repo read like an operational capability rather than a narrow technical demo.

## [0.1.0] - 2026-02-13

### Shipped
- Cut the first coherent internal version of **deal-desk-workspace** with stable domain objects, review surfaces, and decision outputs.
- Established the first reviewable version of the architecture described as: React + TypeScript workspace for pricing approvals, margin guardrails, and operator-facing commercial deal execution.
- Focused the repo around actionability instead of passive reporting.

## [Prototype] - 2025-08-12

### Built
- Built the first runnable prototype for the repo's main workflow and decision model.
- Validated the concept against pressure points such as identity sprawl, least-privilege drift, tenant-boundary mistakes, and approval latency.
- Used the prototype phase to test whether the project could drive action, not just present information.

## [Design Phase] - 2024-12-12

### Designed
- Defined the system around operator-first and decision-legible outputs.
- Chose interfaces and examples that made sense for IAM, platform security, compliance, and internal platform teams.
- Avoided reducing the project to a generic dashboard, CRUD app, or fashionable wrapper around the stack.

## [Idea Origin] - 2024-02-12

### Observed
- The original idea surfaced while looking at how teams were handling identity sprawl, tenant-boundary mistakes, and access-review workflows that are technically complete but poorly explained.
- The recurring pattern was that teams had data and tools, but still lacked a usable operating layer for the hardest decisions.

## [Background Signals] - 2022-08-09

### Context
- Earlier platform, governance, and operator-tooling work made one pattern hard to ignore: the systems that create the most drag are often the ones with partial controls and weak operational coherence, not the ones with no controls at all.
- That pattern shaped the thinking behind this repo well before the public version existed.