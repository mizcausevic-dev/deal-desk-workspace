// Skyyflow vault interface — vendor-neutral token vault for PII fields that
// surface in the deal-desk surface (billing contact emails, executive sponsor
// emails, etc.). Mirrors the rag-sentinel vault contract so a single buyer
// Decision Card can drive both server-side scanning and client-side reveal.
//
// MockSkyyflowVault is the default: in-memory, deterministic, browser-safe.
// A network adapter targeting a hosted Skyyflow vault could implement the same
// interface — out of scope for this portfolio surface (browser code should not
// be calling vault APIs directly anyway).

export interface TokenizeRequest {
  /** Logical field name as it appears in the Decision Card fields_authorized list. */
  field: string;
  /** Raw PII value. After this call, the surface should never read it again except via detokenize. */
  value: string;
}

export interface TokenizeResponse {
  field: string;
  /** Opaque token. Treat as a string identifier — never as a fallback display value. */
  token: string;
}

export interface DetokenizeRequest {
  field: string;
  token: string;
}

export interface DetokenizeResponse {
  field: string;
  token: string;
  /** Raw PII value, OR null if the caller's roles did not authorize reveal. */
  value: string | null;
  /** Per-token disposition for the audit panel. */
  disposition: 'revealed' | 'denied-not-authorized' | 'denied-no-such-token';
}

export interface SkyyflowVault {
  /** Provider tag — surfaces in audit-stream events; matches vendor enum from the Decision Card. */
  readonly vendor: string;
  /** Vault identifier — surfaces in audit-stream events; matches vault_id from the Decision Card. */
  readonly vaultId: string;
  tokenize(requests: TokenizeRequest[]): Promise<TokenizeResponse[]>;
  detokenize(
    requests: DetokenizeRequest[],
    options: { callerRoles: readonly string[]; revealRoles: readonly string[] }
  ): Promise<DetokenizeResponse[]>;
}
