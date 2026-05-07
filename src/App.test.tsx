import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Deal Desk Workspace", () => {
  it("renders the hero headline", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", {
        name: /commercial approvals, pricing guardrails, and high-stakes deal execution in one workspace/i
      })
    ).toBeInTheDocument();
  });

  it("shows deal and approval content", () => {
    render(<App />);
    expect(screen.getAllByText(/Northstar Cloud/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Discount exception beyond enterprise floor/i).length).toBeGreaterThan(0);
  });
});
