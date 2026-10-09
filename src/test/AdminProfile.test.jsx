import { describe, test, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import AdminProfile from "../Component/Admin/src/components/AdminProfile";

afterEach(() => {
  cleanup();
});

describe("CashMate Admin Profile", () => {
  test("renders the Admin Profile Settings heading", () => {
    render(<AdminProfile />);

    expect(screen.getByText("Admin Profile Settings")).toBeInTheDocument();
  });

  test("shows the profile privacy description", () => {
    render(<AdminProfile />);

    expect(
      screen.getByText(
        "Manage self admin credentials. You do not have access to regular user profiles."
      )
    ).toBeInTheDocument();
  });

  test("displays the account name and password fields", () => {
    render(<AdminProfile />);

    expect(
      screen.getByDisplayValue("System Administrator")
    ).toBeInTheDocument();

    const passwordFields = document.querySelectorAll(
      'input[type="password"]'
    );

    expect(passwordFields).toHaveLength(2);
    expect(passwordFields[0]).toHaveValue("••••••••••••");
    expect(passwordFields[1]).toHaveValue("");

    expect(
      screen.getByPlaceholderText("Enter new password")
    ).toBeInTheDocument();
  });

  test("shows the Update Security Credentials button", () => {
    render(<AdminProfile />);

    expect(
      screen.getByRole("button", {
        name: "Update Security Credentials",
      })
    ).toBeInTheDocument();
  });

  test("prevents the default form submission", () => {
    render(<AdminProfile />);

    const form = screen
      .getByRole("button", {
        name: "Update Security Credentials",
      })
      .closest("form");

    const event = new Event("submit", {
      bubbles: true,
      cancelable: true,
    });

    fireEvent(form, event);

    expect(event.defaultPrevented).toBe(true);
  });
});