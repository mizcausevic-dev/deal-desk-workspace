export type ScoreCard = {
  id: string;
  label: string;
  value: string;
  context: string;
  tone: "healthy" | "watch" | "critical";
};

export type Deal = {
  id: string;
  account: string;
  segment: string;
  value: string;
  owner: string;
  stage: string;
  risk: "low" | "medium" | "high";
  summary: string;
  /** Billing contact email — held in the Skyyflow vault, tokenized at load. */
  billingContactEmail: string;
  /** Billing contact phone — held in the Skyyflow vault, tokenized at load. */
  billingContactPhone: string;
  /** Executive sponsor email — held in the Skyyflow vault, tokenized at load. */
  executiveSponsorEmail: string;
};

export type ApprovalLane = {
  title: string;
  owner: string;
  clock: string;
  blocker: string;
};

export type MarginRule = {
  title: string;
  posture: string;
  detail: string;
};

export type WorkspacePrinciple = {
  title: string;
  summary: string;
  artifact: string;
};

export type OperatorRole = "sales-rep" | "deal-desk-lead" | "finance-director";

export type AuditEvent = {
  id: string;
  timestamp: string;
  callerRole: OperatorRole;
  dealId: string;
  account: string;
  field: string;
  disposition: "revealed" | "denied-not-authorized" | "denied-no-such-token";
};
