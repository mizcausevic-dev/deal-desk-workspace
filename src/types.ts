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
