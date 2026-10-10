
import { describe, test, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import AuthenticationLogs from "../Component/Admin/src/components/AuthenticationLogs";

afterEach(() => {
  cleanup();
});

const sampleLogs = [
  {
    id: "USER001",
    method: "Google",
    status: "Success",
    date: "2026-10-08",
  },
  {
    userId: "USER002",
    authMethod: "Email",
    result: "Failed",
    time: "2026-10-09",
  },
  {
    id: "USER003",
    method: "Password",
    status: "Success",
    timestamp: "2026-10-09 10:00 AM",
  },
];

describe("CashMate Authentication Logs", () => {
  test("shows empty state when there are no logs", () => {
    render(<AuthenticationLogs />);

    expect(
      screen.getByText("No authentication logs found.")
    ).toBeInTheDocument();
  });

  test("displays authentication log entries", () => {
    render(<AuthenticationLogs logs={sampleLogs} />);

    expect(screen.getByText("Authentication Logs")).toBeInTheDocument();
    expect(screen.getByText("USER001")).toBeInTheDocument();
    expect(screen.getByText("USER002")).toBeInTheDocument();
    expect(screen.getByText("USER003")).toBeInTheDocument();
  });

  test("searches logs by User ID", () => {
    render(<AuthenticationLogs logs={sampleLogs} />);

    fireEvent.change(screen.getByPlaceholderText("Search by User ID..."), {
      target: { value: "USER002" },
    });

    expect(screen.getByText("USER002")).toBeInTheDocument();
    expect(screen.queryByText("USER001")).not.toBeInTheDocument();
    expect(screen.queryByText("USER003")).not.toBeInTheDocument();
  });

  test("filters logs by authentication method", () => {
    render(<AuthenticationLogs logs={sampleLogs} />);

    fireEvent.change(screen.getByDisplayValue("All Methods"), {
      target: { value: "Google" },
    });

    expect(screen.getByText("USER001")).toBeInTheDocument();
    expect(screen.queryByText("USER002")).not.toBeInTheDocument();
    expect(screen.queryByText("USER003")).not.toBeInTheDocument();
  });

  test("filters logs by status", () => {
    render(<AuthenticationLogs logs={sampleLogs} />);

    fireEvent.change(screen.getByDisplayValue("All Status"), {
      target: { value: "Failed" },
    });

    expect(screen.getByText("USER002")).toBeInTheDocument();
    expect(screen.queryByText("USER001")).not.toBeInTheDocument();
    expect(screen.queryByText("USER003")).not.toBeInTheDocument();
  });

  test("combines search, method and status filters", () => {
    render(<AuthenticationLogs logs={sampleLogs} />);

    fireEvent.change(screen.getByPlaceholderText("Search by User ID..."), {
      target: { value: "USER001" },
    });

    fireEvent.change(screen.getByDisplayValue("All Methods"), {
      target: { value: "Google" },
    });

    fireEvent.change(screen.getByDisplayValue("All Status"), {
      target: { value: "Success" },
    });

    expect(screen.getByText("USER001")).toBeInTheDocument();
    expect(screen.queryByText("USER002")).not.toBeInTheDocument();
    expect(screen.queryByText("USER003")).not.toBeInTheDocument();
  });

  test("handles invalid log data safely", () => {
    render(<AuthenticationLogs logs={[null, undefined]} />);

    expect(
      screen.getByText("No authentication logs found.")
    ).toBeInTheDocument();
  });
});
