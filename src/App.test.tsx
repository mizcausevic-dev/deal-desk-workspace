import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Deal Desk Workspace", () => {
  it("renders the hero headline", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", {
        name: /commercial approvals, pricing guardrails, and high-stakes deal execution in one workspace/i,
      })
    ).toBeInTheDocument();
  });

  it("shows deal and approval content", async () => {
    render(<App />);
    expect(await screen.findByText(/Northstar Cloud/i)).toBeInTheDocument();
    expect(screen.getByText(/Discount exception beyond enterprise floor/i)).toBeInTheDocument();
  });

  it("renders billing PII as masked Skyyflow tokens by default", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/^skyy_/).length).toBeGreaterThan(0);
    });
    expect(screen.queryByText("ap@northstar-cloud.example")).not.toBeInTheDocument();
  });

  it("blocks reveal for the default Sales Rep role and records a denial in the audit trail", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/^skyy_/).length).toBeGreaterThan(0);
    });
    const revealButtons = screen.getAllByRole("button", { name: /reveal billing contact email/i });
    await user.click(revealButtons[0]);
    await waitFor(() => {
      expect(screen.getByText(/denied not authorized/i)).toBeInTheDocument();
    });
    expect(screen.queryByText("ap@northstar-cloud.example")).not.toBeInTheDocument();
  });

  it("reveals raw PII when the user switches to Finance Director", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/^skyy_/).length).toBeGreaterThan(0);
    });
    await user.click(screen.getByRole("button", { name: /finance director/i }));
    const revealButtons = screen.getAllByRole("button", { name: /reveal billing contact email/i });
    await user.click(revealButtons[0]);
    await waitFor(() => {
      expect(screen.getByText("ap@northstar-cloud.example")).toBeInTheDocument();
    });
    const auditPanel = screen.getByText(/reveal audit trail/i).closest("section") as HTMLElement;
    expect(auditPanel).toBeTruthy();
    expect(within(auditPanel).getByText(/^revealed$/i)).toBeInTheDocument();
  });
});
