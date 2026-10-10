
import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import LoginRequests from "../Component/Admin/src/components/LoginRequests";

afterEach(() => {
  cleanup();
});

const sampleRequests = [
  {
    id: "USER001",
    method: "Google",
    date: "2026-10-08",
    status: "Pending",
  },
  {
    id: "USER002",
    method: "Email",
    date: "2026-10-09",
    status: "Pending",
  },
];

describe("CashMate Admin Login Requests", () => {
  test("shows empty state when there are no requests", () => {
    render(<LoginRequests />);

    expect(
      screen.getByText("No pending login requests found.")
    ).toBeInTheDocument();

    expect(screen.getByText("0 pending approval")).toBeInTheDocument();
  });

  test("displays login requests and pending count", () => {
    render(<LoginRequests requestsData={sampleRequests} />);

    expect(screen.getByText("USER001")).toBeInTheDocument();
    expect(screen.getByText("USER002")).toBeInTheDocument();
    expect(screen.getByText("2 pending approval")).toBeInTheDocument();
  });

  test("filters Google login requests", () => {
    render(<LoginRequests requestsData={sampleRequests} />);

    fireEvent.click(screen.getByRole("button", { name: "Google" }));

    expect(screen.getByText("USER001")).toBeInTheDocument();
    expect(screen.queryByText("USER002")).not.toBeInTheDocument();
  });

  test("filters Email login requests", () => {
    render(<LoginRequests requestsData={sampleRequests} />);

    fireEvent.click(screen.getByRole("button", { name: "Email" }));

    expect(screen.getByText("USER002")).toBeInTheDocument();
    expect(screen.queryByText("USER001")).not.toBeInTheDocument();
  });

  test("approves a request and calls onApprove", () => {
    const onApprove = vi.fn();

    render(
      <LoginRequests
        requestsData={sampleRequests}
        onApprove={onApprove}
      />
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Approve" })[0]);

    expect(onApprove).toHaveBeenCalledWith("USER001");
    expect(screen.queryByText("USER001")).not.toBeInTheDocument();
    expect(screen.getByText("1 pending approval")).toBeInTheDocument();
  });

  test("denies a request and calls onDeny", () => {
    const onDeny = vi.fn();

    render(
      <LoginRequests
        requestsData={sampleRequests}
        onDeny={onDeny}
      />
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Deny" })[0]);

    expect(onDeny).toHaveBeenCalledWith("USER001");
    expect(screen.queryByText("USER001")).not.toBeInTheDocument();
    expect(screen.getByText("1 pending approval")).toBeInTheDocument();
  });
});
