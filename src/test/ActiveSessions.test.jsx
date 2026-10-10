
import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ActiveSessions from "../Component/Admin/src/components/ActiveSessions";

afterEach(() => {
  cleanup();
});

const sampleSessions = [
  {
    id: "USER001",
    method: "Google",
    loginTime: "2026-10-08 10:30 AM",
  },
  {
    id: "USER002",
    method: "Email",
    loginTime: "2026-10-09 09:15 AM",
  },
];

describe("CashMate Admin Active Sessions", () => {
  test("shows empty state when there are no sessions", () => {
    render(<ActiveSessions />);

    expect(
      screen.getByText("No active user sessions right now.")
    ).toBeInTheDocument();

    expect(screen.getByText("0 active right now")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Logout All Sessions" })
    ).toBeDisabled();
  });

  test("displays active sessions and their count", () => {
    render(<ActiveSessions sessionsData={sampleSessions} />);

    expect(screen.getByText("USER001")).toBeInTheDocument();
    expect(screen.getByText("USER002")).toBeInTheDocument();
    expect(screen.getByText("2 active right now")).toBeInTheDocument();
    expect(screen.getAllByText("Active")).toHaveLength(2);
  });

  test("displays authentication methods and login times", () => {
    render(<ActiveSessions sessionsData={sampleSessions} />);

    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("2026-10-08 10:30 AM")).toBeInTheDocument();
    expect(screen.getByText("2026-10-09 09:15 AM")).toBeInTheDocument();
  });

  test("logs out a single user and calls onLogoutUser", () => {
    const onLogoutUser = vi.fn();

    render(
      <ActiveSessions
        sessionsData={sampleSessions}
        onLogoutUser={onLogoutUser}
      />
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Logout" })[0]);

    expect(onLogoutUser).toHaveBeenCalledWith("USER001");
    expect(screen.queryByText("USER001")).not.toBeInTheDocument();
    expect(screen.getByText("USER002")).toBeInTheDocument();
    expect(screen.getByText("1 active right now")).toBeInTheDocument();
  });

  test("logs out all users and calls onLogoutAll", () => {
    const onLogoutAll = vi.fn();

    render(
      <ActiveSessions
        sessionsData={sampleSessions}
        onLogoutAll={onLogoutAll}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Logout All Sessions" })
    );

    expect(onLogoutAll).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("USER001")).not.toBeInTheDocument();
    expect(screen.queryByText("USER002")).not.toBeInTheDocument();
    expect(screen.getByText("0 active right now")).toBeInTheDocument();
  });

  test("disables Logout All Sessions when all sessions are removed", () => {
    render(<ActiveSessions sessionsData={sampleSessions} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Logout All Sessions" })
    );

    expect(
      screen.getByRole("button", { name: "Logout All Sessions" })
    ).toBeDisabled();

    expect(
      screen.getByText("No active user sessions right now.")
    ).toBeInTheDocument();
  });
});
