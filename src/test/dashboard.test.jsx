
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

vi.mock("../../config/api", () => ({
  default: "http://localhost:5000",
}));

import Dashboard from "../Component/User/Dashboard";

describe("CashMate Dashboard", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("renders the CashMate welcome message", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Welcome to CashMate!")
    ).toBeInTheDocument();
  });

  test("displays financial summary cards", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText("Total Balance")).toBeInTheDocument();
    expect(screen.getByText("Monthly Income")).toBeInTheDocument();
    expect(screen.getByText("Total Expenses")).toBeInTheDocument();
    expect(screen.getByText("Budget Remaining")).toBeInTheDocument();
  });

  test("shows empty chart messages", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("No financial data yet")
    ).toBeInTheDocument();

    expect(screen.getByText("No categories yet")).toBeInTheDocument();
  });

  test("shows the empty transactions message", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("No transactions yet")
    ).toBeInTheDocument();
  });

  test("shows Create Budget and Create Goal buttons", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: /create budget/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /create goal/i })
    ).toBeInTheDocument();
  });
});
