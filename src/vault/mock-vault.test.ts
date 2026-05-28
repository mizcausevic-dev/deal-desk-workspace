import { describe, expect, it } from "vitest";
import { MockSkyyflowVault } from "./mock-vault";

describe("MockSkyyflowVault", () => {
  it("issues stable opaque tokens that do not contain the raw value", async () => {
    const vault = new MockSkyyflowVault("vault-A");
    const [response] = await vault.tokenize([
      { field: "billing_contact_email", value: "ap@example.test" },
    ]);
    expect(response.field).toBe("billing_contact_email");
    expect(response.token).toMatch(/^skyy_[0-9a-f]{16}$/);
    expect(response.token).not.toContain("ap@example.test");
  });

  it("issues deterministic tokens for identical (vaultId, field, value) triples", async () => {
    const a = new MockSkyyflowVault("vault-A");
    const b = new MockSkyyflowVault("vault-A");
    const [r1] = await a.tokenize([{ field: "billing_contact_email", value: "ap@example.test" }]);
    const [r2] = await b.tokenize([{ field: "billing_contact_email", value: "ap@example.test" }]);
    expect(r1.token).toBe(r2.token);
  });

  it("issues distinct tokens when the vaultId differs", async () => {
    const a = new MockSkyyflowVault("vault-A");
    const b = new MockSkyyflowVault("vault-B");
    const [r1] = await a.tokenize([{ field: "billing_contact_email", value: "ap@example.test" }]);
    const [r2] = await b.tokenize([{ field: "billing_contact_email", value: "ap@example.test" }]);
    expect(r1.token).not.toBe(r2.token);
  });

  it("reveals the raw value when caller roles intersect reveal roles", async () => {
    const vault = new MockSkyyflowVault();
    const [{ token }] = await vault.tokenize([
      { field: "billing_contact_phone", value: "+1 415 555 0148" },
    ]);
    const [revealed] = await vault.detokenize(
      [{ field: "billing_contact_phone", token }],
      { callerRoles: ["finance-director"], revealRoles: ["finance-director", "deal-desk-lead"] }
    );
    expect(revealed.disposition).toBe("revealed");
    expect(revealed.value).toBe("+1 415 555 0148");
  });

  it("denies the reveal when caller roles do not intersect reveal roles", async () => {
    const vault = new MockSkyyflowVault();
    const [{ token }] = await vault.tokenize([
      { field: "billing_contact_phone", value: "+1 415 555 0148" },
    ]);
    const [denied] = await vault.detokenize(
      [{ field: "billing_contact_phone", token }],
      { callerRoles: ["sales-rep"], revealRoles: ["finance-director", "deal-desk-lead"] }
    );
    expect(denied.disposition).toBe("denied-not-authorized");
    expect(denied.value).toBeNull();
  });

  it("denies reveal for an unknown token", async () => {
    const vault = new MockSkyyflowVault();
    const [denied] = await vault.detokenize(
      [{ field: "billing_contact_email", token: "skyy_deadbeefdeadbeef" }],
      { callerRoles: ["finance-director"], revealRoles: ["finance-director"] }
    );
    expect(denied.disposition).toBe("denied-no-such-token");
    expect(denied.value).toBeNull();
  });
});
