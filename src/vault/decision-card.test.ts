import { describe, expect, it } from "vitest";
import {
  InvalidDecisionCardError,
  parseDecisionCard,
  selectVaultTarget,
} from "./decision-card";
import { sampleDecisionCard } from "../sampleDecisionCard";

describe("parseDecisionCard", () => {
  it("accepts a v0.2 document with one vault target", () => {
    const parsed = parseDecisionCard(sampleDecisionCard);
    expect(parsed.version).toBe("0.2");
    expect(parsed.decisionId).toBe("kg-dealdesk-2026-Q2-001");
    expect(parsed.vaultTargets).toHaveLength(1);
    expect(parsed.vaultTargets[0].vendor).toBe("skyyflow");
    expect(parsed.vaultTargets[0].fieldsAuthorized).toEqual([
      "billing_contact_email",
      "billing_contact_phone",
      "executive_sponsor_email",
    ]);
    expect(parsed.vaultTargets[0].revealRoles).toEqual([
      "deal-desk-lead",
      "finance-director",
    ]);
  });

  it("accepts v0.1 documents without data_vault_targets", () => {
    const parsed = parseDecisionCard({
      decision_card_version: "0.1",
      decision_id: "legacy-card",
    });
    expect(parsed.vaultTargets).toEqual([]);
  });

  it("rejects documents with unsupported version", () => {
    expect(() =>
      parseDecisionCard({
        decision_card_version: "0.9",
        decision_id: "future-card",
      })
    ).toThrow(InvalidDecisionCardError);
  });

  it("rejects vault targets missing fields_authorized", () => {
    expect(() =>
      parseDecisionCard({
        decision_card_version: "0.2",
        decision_id: "broken-card",
        data_vault_targets: [{ vendor: "skyyflow" }],
      })
    ).toThrow(InvalidDecisionCardError);
  });
});

describe("selectVaultTarget", () => {
  it("returns the target matching the requested vendor", () => {
    const parsed = parseDecisionCard(sampleDecisionCard);
    const target = selectVaultTarget(parsed, "skyyflow");
    expect(target).not.toBeNull();
    expect(target?.vendor).toBe("skyyflow");
  });

  it("returns null when no target matches", () => {
    const parsed = parseDecisionCard(sampleDecisionCard);
    expect(selectVaultTarget(parsed, "piiano")).toBeNull();
  });
});
