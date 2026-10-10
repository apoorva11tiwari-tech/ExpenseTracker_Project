import { describe, test, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import WebsiteTheme from "../Component/Admin/src/components/WebsiteTheme";

afterEach(() => {
  cleanup();
});

describe("CashMate Website Theme Settings", () => {
  test("renders the Website Theme Settings heading", () => {
    render(<WebsiteTheme />);
    expect(screen.getByText("Website Theme Settings")).toBeInTheDocument();
  });

  test("shows all three available themes", () => {
    render(<WebsiteTheme />);
    expect(screen.getByText("Dark Mode (Default)")).toBeInTheDocument();
    expect(screen.getByText("Midnight Blue")).toBeInTheDocument();
    expect(screen.getByText("Slate Gray")).toBeInTheDocument();
  });

  test("shows the theme customization description", () => {
    render(<WebsiteTheme />);
    expect(
      screen.getByText(
        "Customize the visual appearance and color palette of your admin console."
      )
    ).toBeInTheDocument();
  });

  test("selects Dark Mode by default", () => {
    render(<WebsiteTheme />);

    const themeCard = screen
      .getByText("Dark Mode (Default)")
      .closest(".cursor-pointer");

    expect(themeCard).not.toBeNull();
    expect(
      themeCard.querySelector(".bi-check-circle-fill")
    ).toBeInTheDocument();
    expect(themeCard).toHaveStyle({
      border: "2px solid #3b82f6",
    });
  });

  test("selects Midnight Blue when clicked", () => {
    render(<WebsiteTheme />);

    fireEvent.click(screen.getByText("Midnight Blue"));

    const themeCard = screen
      .getByText("Midnight Blue")
      .closest(".cursor-pointer");

    expect(
      themeCard.querySelector(".bi-check-circle-fill")
    ).toBeInTheDocument();
  });

  test("selects Slate Gray when clicked", () => {
    render(<WebsiteTheme />);

    fireEvent.click(screen.getByText("Slate Gray"));

    const themeCard = screen
      .getByText("Slate Gray")
      .closest(".cursor-pointer");

    expect(
      themeCard.querySelector(".bi-check-circle-fill")
    ).toBeInTheDocument();
  });

  test("updates selection when switching between themes", () => {
    render(<WebsiteTheme />);

    fireEvent.click(screen.getByText("Midnight Blue"));

    expect(
      screen
        .getByText("Midnight Blue")
        .closest(".cursor-pointer")
        .querySelector(".bi-check-circle-fill")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Slate Gray"));

    expect(
      screen
        .getByText("Slate Gray")
        .closest(".cursor-pointer")
        .querySelector(".bi-check-circle-fill")
    ).toBeInTheDocument();

    expect(
      screen
        .getByText("Midnight Blue")
        .closest(".cursor-pointer")
        .querySelector(".bi-check-circle-fill")
    ).not.toBeInTheDocument();
  });
});