// Sample AI Procurement Decision Card v0.2 used by the deal-desk-workspace
// demo. It declares a Skyyflow vault target authorizing reveal of three
// billing-contact PII fields to two operator roles. In a real deployment, the
// procurement office publishes this document; the deal-desk surface reads it
// and configures its vault flow accordingly.

export const sampleDecisionCard = {
  decision_card_version: '0.2',
  decision_id: 'kg-dealdesk-2026-Q2-001',
  decision_summary:
    'Authorize Skyyflow as the field-level vault for billing-contact PII inside the deal-desk operating surface. Reveal limited to Deal Desk Lead and Finance Director during active pricing review.',
  data_vault_targets: [
    {
      vendor: 'skyyflow',
      vault_id: 'kg-dealdesk-vault-2026-q2',
      vault_url: 'https://kg-dealdesk.vault.skyyflowapis.example',
      fields_authorized: ['billing_contact_email', 'billing_contact_phone', 'executive_sponsor_email'],
      reveal_roles: ['deal-desk-lead', 'finance-director'],
      reveal_audit_uri: 'https://kineticgain.com/.well-known/dealdesk-reveal-audit',
      notes:
        'Sales reps see masked tokens by default. Deal Desk Lead may reveal during legal/finance review. Finance Director may reveal during executive escalation. All reveals are recorded in the audit panel.',
    },
  ],
} as const;
