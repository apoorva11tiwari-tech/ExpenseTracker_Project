
/* @vitest-environment jsdom */

import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import AdminLogin from "../Component/Admin/src/components/AdminLogin";


afterEach(() => {
  cleanup();
});

describe("CashMate Admin Login", () => {
  test("renders the Admin Login page", () => {
    render(<AdminLogin onLogin={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: /admin login/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /login to admin panel/i })
    ).toBeInTheDocument();
  });

  test("shows an error when email and password are empty", () => {
    render(<AdminLogin onLogin={vi.fn()} />);

    fireEvent.click(
      screen.getByRole("button", { name: /login to admin panel/i })
    );

    expect(
      screen.getByText("Please enter email and password")
    ).toBeInTheDocument();
  });

  test("rejects invalid credentials", () => {
    render(<AdminLogin onLogin={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("Enter admin email"), {
      target: { value: "wrong@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /login to admin panel/i })
    );

    expect(
      screen.getByText("Invalid email or password")
    ).toBeInTheDocument();
  });

  test("calls onLogin when the correct credentials are entered", () => {
    const onLogin = vi.fn();

    render(<AdminLogin onLogin={onLogin} />);

    fireEvent.change(screen.getByPlaceholderText("Enter admin email"), {
      target: { value: "admin@gmail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "admin123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /login to admin panel/i })
    );

    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  test("toggles password visibility", () => {
    render(<AdminLogin onLogin={vi.fn()} />);

    const passwordInput = screen.getByPlaceholderText("Enter password");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Show" }));

    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByRole("button", { name: "Hide" }));

    expect(passwordInput).toHaveAttribute("type", "password");
  });
});