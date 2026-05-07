import { activeDeals, approvalLanes, marginRules, scoreCards, workspacePrinciples } from "./data";

const toneClassMap = {
  healthy: "score-card score-card--healthy",
  watch: "score-card score-card--watch",
  critical: "score-card score-card--critical"
} as const;

const riskClassMap = {
  low: "risk-pill risk-pill--low",
  medium: "risk-pill risk-pill--medium",
  high: "risk-pill risk-pill--high"
} as const;

function App() {
  return (
    <main className="workspace-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Deal Desk Workspace</p>
          <h1>Commercial approvals, pricing guardrails, and high-stakes deal execution in one workspace.</h1>
          <p className="hero-text">
            A recruiter-ready frontend project that treats deal desk as a real internal operating surface. Instead of a toy CRM clone, this
            workspace makes pricing pressure, approval bottlenecks, and margin risk visible to the people who actually have to move revenue
            forward.
          </p>
          <div className="hero-actions">
            <a href="#deal-queue" className="action-chip">
              Review active deals
            </a>
            <a href="#approval-queue" className="action-chip action-chip--alt">
              Open approval queue
            </a>
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
            {activeDeals.map((deal) => (
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
    </main>
  );
}

export default App;
