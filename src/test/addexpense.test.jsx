import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

vi.mock("../../config/api", () => ({
  API_URL: "http://localhost:5000",
}));

import AddExpense from "../Component/User/AddExpense";

describe("CashMate Add Expense Page", () => {
  test("renders the Add Expense page", () => {
    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    expect(document.body.textContent).toMatch(/expense/i);
  });

  test("displays the expense amount field", () => {
    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("0")).toBeInTheDocument();
  });

  test("allows the user to enter an expense amount", () => {
    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    const amountInput = screen.getByPlaceholderText("0");

    fireEvent.change(amountInput, {
      target: { value: "100" },
    });

    expect(amountInput).toHaveValue(100);
  });

  test("enables Save Expense after a valid amount is entered", () => {
    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    const saveButton = screen.getByRole("button", {
      name: /save expense/i,
    });

    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("0"), {
      target: { value: "100" },
    });

    expect(saveButton).toBeEnabled();
  });

  test("displays expense categories", () => {
    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();
  });
});