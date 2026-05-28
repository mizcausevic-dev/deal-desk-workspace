// In-browser deterministic Skyyflow vault for portfolio demos. Tokens are
// produced by sha256(vaultId|field|value) (via Web Crypto, available in modern
// browsers and jsdom) and stored in a Map; reverse direction reads the Map.
// Round-trips cleanly within a single page session. Not persisted. Not
// network-visible. A real surface would call a hosted vault instead.

import type {
  DetokenizeRequest,
  DetokenizeResponse,
  SkyyflowVault,
  TokenizeRequest,
  TokenizeResponse,
} from './types';

const HEX_CHARS = '0123456789abcdef';

function bufferToHex(buffer: ArrayBuffer): string {
  const view = new Uint8Array(buffer);
  let out = '';
  for (let i = 0; i < view.length; i += 1) {
    const byte = view[i];
    out += HEX_CHARS[(byte >> 4) & 0xf];
    out += HEX_CHARS[byte & 0xf];
  }
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(digest);
}

export class MockSkyyflowVault implements SkyyflowVault {
  readonly vendor = 'skyyflow' as const;
  readonly vaultId: string;
  private readonly store = new Map<string, { field: string; value: string }>();

  constructor(vaultId = 'mock-vault-deal-desk') {
    this.vaultId = vaultId;
  }

  async tokenize(requests: TokenizeRequest[]): Promise<TokenizeResponse[]> {
    const responses: TokenizeResponse[] = [];
    for (const { field, value } of requests) {
      const hash = await sha256Hex(`${this.vaultId}|${field}|${value}`);
      const token = `skyy_${hash.slice(0, 16)}`;
      this.store.set(token, { field, value });
      responses.push({ field, token });
    }
    return responses;
  }

  async detokenize(
    requests: DetokenizeRequest[],
    options: { callerRoles: readonly string[]; revealRoles: readonly string[] }
  ): Promise<DetokenizeResponse[]> {
    const authorized = options.revealRoles.some((r) => options.callerRoles.includes(r));
    return requests.map(({ field, token }) => {
      const entry = this.store.get(token);
      if (!entry) {
        return { field, token, value: null, disposition: 'denied-no-such-token' as const };
      }
      if (!authorized) {
        return { field, token, value: null, disposition: 'denied-not-authorized' as const };
      }
      return { field, token, value: entry.value, disposition: 'revealed' as const };
    });
  }

  /** Test-only — number of tokens stored. */
  size(): number {
    return this.store.size;
  }
}
