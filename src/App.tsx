import { useCallback, useEffect, useMemo, useState } from "react";
import {
  activeDeals,
  approvalLanes,
  marginRules,
  scoreCards,
  workspacePrinciples,
} from "./data";
import { sampleDecisionCard } from "./sampleDecisionCard";
import type { AuditEvent, Deal, OperatorRole } from "./types";
import {
  MockSkyyflowVault,
  parseDecisionCard,
  selectVaultTarget,
  type ParsedVaultTarget,
} from "./vault";

const toneClassMap = {
  healthy: "score-card score-card--healthy",
  watch: "score-card score-card--watch",
  critical: "score-card score-card--critical",
} as const;

const riskClassMap = {
  low: "risk-pill risk-pill--low",
  medium: "risk-pill risk-pill--medium",
  high: "risk-pill risk-pill--high",
} as const;

const ROLE_OPTIONS: { value: OperatorRole; label: string; vaultRole: string }[] = [
  { value: "sales-rep", label: "Sales Rep", vaultRole: "sales-rep" },
  { value: "deal-desk-lead", label: "Deal Desk Lead", vaultRole: "deal-desk-lead" },
  { value: "finance-director", label: "Finance Director", vaultRole: "finance-director" },
];

type VaultedDeal = Omit<Deal, "billingContactEmail" | "billingContactPhone" | "executiveSponsorEmail"> & {
  billingContactEmailToken: string;
  billingContactPhoneToken: string;
  executiveSponsorEmailToken: string;
};

type PiiFieldKey = "billing_contact_email" | "billing_contact_phone" | "executive_sponsor_email";

const PII_FIELD_LABELS: Record<PiiFieldKey, string> = {
  billing_contact_email: "Billing contact email",
  billing_contact_phone: "Billing contact phone",
  executive_sponsor_email: "Executive sponsor email",
};

function maskedDisplay(token: string): string {
  return `${token.slice(0, 9)}…${token.slice(-4)}`;
}

function App() {
  const vault = useMemo(() => new MockSkyyflowVault("kg-dealdesk-vault-2026-q2"), []);

  const vaultTarget = useMemo<ParsedVaultTarget | null>(() => {
    const parsed = parseDecisionCard(sampleDecisionCard);
    return selectVaultTarget(parsed, "skyyflow");
  }, []);

  const [currentRole, setCurrentRole] = useState<OperatorRole>("sales-rep");
  const [vaultedDeals, setVaultedDeals] = useState<VaultedDeal[]>([]);
  const [tokenContext, setTokenContext] = useState<Map<string, { field: PiiFieldKey; dealId: string; account: string }>>(
    new Map()
  );
  const [revealedValues, setRevealedValues] = useState<Map<string, string>>(new Map());
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [vaultReady, setVaultReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function tokenizeAll() {
      const ctx = new Map<string, { field: PiiFieldKey; dealId: string; account: string }>();
      const next: VaultedDeal[] = [];
      for (const deal of activeDeals) {
        const responses = await vault.tokenize([
          { field: "billing_contact_email", value: deal.billingContactEmail },
          { field: "billing_contact_phone", value: deal.billingContactPhone },
          { field: "executive_sponsor_email", value: deal.executiveSponsorEmail },
        ]);
        const [emailRes, phoneRes, sponsorRes] = responses;
        ctx.set(emailRes.token, { field: "billing_contact_email", dealId: deal.id, account: deal.account });
        ctx.set(phoneRes.token, { field: "billing_contact_phone", dealId: deal.id, account: deal.account });
        ctx.set(sponsorRes.token, { field: "executive_sponsor_email", dealId: deal.id, account: deal.account });
        const { billingContactEmail: _e, billingContactPhone: _p, executiveSponsorEmail: _s, ...rest } = deal;
        next.push({
          ...rest,
          billingContactEmailToken: emailRes.token,
          billingContactPhoneToken: phoneRes.token,
          executiveSponsorEmailToken: sponsorRes.token,
        });
      }
      if (!cancelled) {
        setTokenContext(ctx);
        setVaultedDeals(next);
        setVaultReady(true);
      }
    }
    void tokenizeAll();
    return () => {
      cancelled = true;
    };
  }, [vault]);

  const handleReveal = useCallback(
    async (token: string) => {
      if (!vaultTarget) return;
      const ctx = tokenContext.get(token);
      if (!ctx) return;
      const [response] = await vault.detokenize(
        [{ field: ctx.field, token }],
        { callerRoles: [currentRole], revealRoles: vaultTarget.revealRoles }
      );
      const event: AuditEvent = {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        callerRole: currentRole,
        dealId: ctx.dealId,
        account: ctx.account,
        field: ctx.field,
        disposition: response.disposition,
      };
      setAuditEvents((prev) => [event, ...prev].slice(0, 50));
      if (response.disposition === "revealed" && response.value !== null) {
        setRevealedValues((prev) => {
          const next = new Map(prev);
          next.set(token, response.value as string);
          return next;
        });
      }
    },
    [currentRole, tokenContext, vault, vaultTarget]
  );

  const handleMaskAll = useCallback(() => {
    setRevealedValues(new Map());
  }, []);

  const handleRoleChange = useCallback((nextRole: OperatorRole) => {
    setCurrentRole(nextRole);
    setRevealedValues(new Map());
  }, []);

  const isRoleAuthorized = vaultTarget
    ? vaultTarget.revealRoles.includes(currentRole)
    : false;

  return (
    <main className="workspace-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Deal Desk Workspace</p>
          <h1>Commercial approvals, pricing guardrails, and high-stakes deal execution in one workspace.</h1>
          <p className="hero-text">
            A recruiter-ready frontend project that treats deal desk as a real internal operating surface. Instead of a toy CRM clone, this
            workspace makes pricing pressure, approval bottlenecks, and margin risk visible to the people who actually have to move revenue
            forward. Billing-contact PII flows through a Skyyflow vault — masked tokens by default, reveal only when an AI Procurement
            Decision Card authorizes the caller's role.
          </p>
          <div className="hero-actions">
            <a href="#deal-queue" className="action-chip">
              Review active deals
            </a>
            <a href="#approval-queue" className="action-chip action-chip--alt">
              Open approval queue
            </a>
            <a href="#audit-trail" className="action-chip">
              View reveal audit
            </a>
          </div>
          <div className="role-switcher" role="group" aria-label="Operator role">
            <span className="role-switcher__label">Acting as</span>
            <div className="role-switcher__options">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`role-chip ${currentRole === opt.value ? "role-chip--active" : ""}`}
                  onClick={() => handleRoleChange(opt.value)}
                  aria-pressed={currentRole === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className={`role-switcher__status ${isRoleAuthorized ? "is-authorized" : "is-restricted"}`}>
              {isRoleAuthorized
                ? "Reveal authorized by Decision Card "
                : "Reveal restricted by Decision Card "}
              <code>{vaultTarget ? vaultTarget.vendor : "—"}</code>
            </p>
          </div>
        </div>
        <div className="score-grid" aria-label="Deal desk scorecards">
          {scoreCards.map((card) => (
            <article key={card.id} className={toneClassMap[card.tone]}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.context}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="main-grid">
        <section className="panel panel--wide" id="deal-queue">
          <div className="section-heading">
            <p className="eyebrow">Active deal queue</p>
            <h2>Revenue opportunities with real pricing, legal, and approval pressure.</h2>
          </div>
          <div className="deal-list">
            {!vaultReady && <p className="vault-loading">Tokenizing billing PII via Skyyflow vault…</p>}
            {vaultedDeals.map((deal) => (
              <article key={deal.id} className="deal-card">
                <div className="deal-card__top">
                  <div>
                    <h3>{deal.account}</h3>
                    <p>
                      {deal.segment} · {deal.owner}
                    </p>
                  </div>
                  <span className={riskClassMap[deal.risk]}>{deal.risk} risk</span>
                </div>
                <div className="deal-card__meta">
                  <strong>{deal.value}</strong>
                  <span>{deal.stage}</span>
                </div>
                <p className="deal-card__summary">{deal.summary}</p>
                <dl className="pii-table" aria-label={`Vaulted PII for ${deal.account}`}>
                  <PiiRow
                    label="Billing contact email"
                    token={deal.billingContactEmailToken}
                    revealedValue={revealedValues.get(deal.billingContactEmailToken)}
                    canReveal={isRoleAuthorized}
                    onReveal={() => handleReveal(deal.billingContactEmailToken)}
                  />
                  <PiiRow
                    label="Billing contact phone"
                    token={deal.billingContactPhoneToken}
                    revealedValue={revealedValues.get(deal.billingContactPhoneToken)}
                    canReveal={isRoleAuthorized}
                    onReveal={() => handleReveal(deal.billingContactPhoneToken)}
                  />
                  <PiiRow
                    label="Executive sponsor email"
                    token={deal.executiveSponsorEmailToken}
                    revealedValue={revealedValues.get(deal.executiveSponsorEmailToken)}
                    canReveal={isRoleAuthorized}
                    onReveal={() => handleReveal(deal.executiveSponsorEmailToken)}
                  />
                </dl>
              </article>
            ))}
          </div>
        </section>

        <aside className="panel" id="approval-queue">
          <div className="section-heading section-heading--compact">
            <p className="eyebrow">Approval queue</p>
            <h2>The blockers that determine whether deals actually close.</h2>
          </div>
          <div className="approval-list">
            {approvalLanes.map((lane) => (
              <article key={lane.title} className="approval-card">
                <div className="approval-card__meta">
                  <span>{lane.owner}</span>
                  <span>{lane.clock}</span>
                </div>
                <h3>{lane.title}</h3>
                <p>{lane.blocker}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="secondary-grid">
        <section className="panel">
          <div className="section-heading section-heading--compact">
            <p className="eyebrow">Margin guardrails</p>
            <h2>Governance that protects commercial quality without choking velocity.</h2>
          </div>
          <div className="rule-list">
            {marginRules.map((rule) => (
              <article key={rule.title} className="rule-card">
                <div className="rule-card__top">
                  <h3>{rule.title}</h3>
                  <span>{rule.posture}</span>
                </div>
                <p>{rule.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading section-heading--compact">
            <p className="eyebrow">What this proves</p>
            <h2>Frontend execution with real business weight.</h2>
          </div>
          <div className="principle-list">
            {workspacePrinciples.map((principle) => (
              <article key={principle.title} className="principle-card">
                <p>{principle.artifact}</p>
                <h3>{principle.title}</h3>
                <span>{principle.summary}</span>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="panel audit-panel" id="audit-trail">
        <div className="section-heading section-heading--compact">
          <p className="eyebrow">Reveal audit trail</p>
          <h2>Every Skyyflow reveal attempt, on the record.</h2>
        </div>
        <div className="audit-actions">
          <button type="button" className="audit-actions__button" onClick={handleMaskAll}>
            Mask all revealed values
          </button>
          <span className="audit-actions__count">
            {auditEvents.length} {auditEvents.length === 1 ? "event" : "events"} this session
          </span>
        </div>
        {auditEvents.length === 0 ? (
          <p className="audit-empty">No reveal attempts yet. Click any token under a deal to record one.</p>
        ) : (
          <ol className="audit-list">
            {auditEvents.map((event) => (
              <li key={event.id} className={`audit-row audit-row--${event.disposition}`}>
                <span className="audit-row__time">{event.timestamp}</span>
                <span className="audit-row__role">{event.callerRole}</span>
                <span className="audit-row__account">{event.account}</span>
                <span className="audit-row__field">{PII_FIELD_LABELS[event.field as PiiFieldKey] ?? event.field}</span>
                <span className="audit-row__disposition">{event.disposition.replace(/-/g, " ")}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

interface PiiRowProps {
  label: string;
  token: string;
  revealedValue: string | undefined;
  canReveal: boolean;
  onReveal: () => void;
}

function PiiRow({ label, token, revealedValue, canReveal, onReveal }: PiiRowProps) {
  const isRevealed = revealedValue !== undefined;
  return (
    <div className="pii-row">
      <dt>{label}</dt>
      <dd>
        {isRevealed ? (
          <span className="pii-value pii-value--revealed">{revealedValue}</span>
        ) : (
          <span className="pii-value pii-value--masked" title="Skyyflow vault token">
            {maskedDisplay(token)}
          </span>
        )}
        <button
          type="button"
          className="pii-reveal"
          onClick={onReveal}
          disabled={isRevealed}
          aria-label={isRevealed ? `${label} revealed` : `Reveal ${label}`}
        >
          {isRevealed ? "Revealed" : canReveal ? "Reveal" : "Request reveal"}
        </button>
      </dd>
    </div>
  );
}

export default App;
