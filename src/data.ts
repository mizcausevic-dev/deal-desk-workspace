import type { ApprovalLane, Deal, MarginRule, ScoreCard, WorkspacePrinciple } from "./types";

export const scoreCards: ScoreCard[] = [
  {
    id: "card-1",
    label: "Commercial confidence",
    value: "91",
    context: "Discount guardrails holding across active approvals",
    tone: "healthy"
  },
  {
    id: "card-2",
    label: "Open executive approvals",
    value: "4",
    context: "Two need action before quarter-close",
    tone: "watch"
  },
  {
    id: "card-3",
    label: "At-risk margin",
    value: "8.7%",
    context: "Lowest blended floor in current queue",
    tone: "critical"
  },
  {
    id: "card-4",
    label: "Deal velocity",
    value: "+14%",
    context: "Workspace reduced handoff drag this month",
    tone: "healthy"
  }
];

export const activeDeals: Deal[] = [
  {
    id: "deal-1",
    account: "Northstar Cloud",
    segment: "Enterprise",
    value: "$418k ARR",
    owner: "RevOps + Sales",
    stage: "Legal + finance review",
    risk: "high",
    summary: "Strong platform fit, but discount exception plus custom payment terms need coordinated approval."
  },
  {
    id: "deal-2",
    account: "Summit BioSystems",
    segment: "Mid-market",
    value: "$192k ARR",
    owner: "Channel + Finance",
    stage: "Partner structure review",
    risk: "medium",
    summary: "Partner-led deal needs attribution clarity and a cleaner margin split before signature."
  },
  {
    id: "deal-3",
    account: "Redpoint Analytics",
    segment: "Enterprise expansion",
    value: "$610k ARR",
    owner: "CS + Sales Leadership",
    stage: "Executive escalation",
    risk: "low",
    summary: "Expansion is healthy, but board-visible pricing requires tightly framed rationale and comms discipline."
  }
];

export const approvalLanes: ApprovalLane[] = [
  {
    title: "Discount exception beyond enterprise floor",
    owner: "Finance Director",
    clock: "1h 45m remaining",
    blocker: "Needs margin rationale tied to multiyear retention value."
  },
  {
    title: "Custom indemnity language",
    owner: "Legal",
    clock: "Today",
    blocker: "Procurement redlines still unresolved."
  },
  {
    title: "Partner split validation",
    owner: "Channel Ops",
    clock: "6h remaining",
    blocker: "Attribution record and territory ownership need alignment."
  }
];

export const marginRules: MarginRule[] = [
  {
    title: "Enterprise floor protection",
    posture: "Active",
    detail: "Discounts below threshold require finance approval and retention-backed justification."
  },
  {
    title: "Non-standard payment terms",
    posture: "Watch",
    detail: "Quarterly payment requests trigger legal and controller review before signature."
  },
  {
    title: "Board-visible deals",
    posture: "Escalate",
    detail: "Large strategic opportunities must include an executive summary before final approval."
  }
];

export const workspacePrinciples: WorkspacePrinciple[] = [
  {
    title: "Deal desk as workflow design",
    summary: "The point is not just approvals. The point is turning pricing, legal, channel, and finance friction into a coordinated operating surface.",
    artifact: "Operator-first product thinking"
  },
  {
    title: "Margin and speed together",
    summary: "High-value commercial teams do not choose between fast deals and disciplined governance. They engineer for both.",
    artifact: "Executive-grade revenue systems"
  },
  {
    title: "Frontend with business weight",
    summary: "This interface is designed to feel like a real internal workspace used during active deal cycles, not a UI exercise made for screenshots only.",
    artifact: "Portfolio flagship for pricing ops"
  }
];
