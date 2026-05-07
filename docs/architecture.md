# Deal Desk Workspace Architecture

## Product Overview

Deal Desk Workspace is a recruiter-facing frontend portfolio project designed to feel like a real internal commercial workspace. It gives revenue, finance, legal, channel, and leadership teams one place to understand active deals, pricing pressure, approval blockers, and margin governance.

## Experience Structure

1. Hero layer
   - frames deal desk as an operating system, not an admin page
   - highlights commercial confidence, approval pressure, margin risk, and deal velocity
2. Active deal queue
   - shows account, stage, value, risk, and deal summary
   - makes real commercial tension visible
3. Approval queue
   - focuses on blockers that actually slow signatures
   - clarifies ownership and timing pressure
4. Margin guardrails
   - shows how governance protects quality without killing speed
5. Proof layer
   - explains why this is a product system with operator and executive value

## Rendering Model

- React 19 renders the workspace
- Vite provides local development and production bundling
- Static TypeScript data keeps the demo smooth and recruiter-friendly
- CSS builds a distinct visual direction optimized for GitHub presentation and portfolio screenshots

## Design Direction

- dark commercial workspace palette rather than generic SaaS admin styling
- strong serif headlines for authority
- teal, sand, and copper accents to differentiate this repo from the executive dashboard and backend projects
- card structure designed around operator pressure, not just metrics

## Future Production Upgrades

- quote composer with line-item editing
- approval history and stakeholder comments
- margin waterfall and scenario analysis
- contract redline integration
- live sync with CRM and billing systems
