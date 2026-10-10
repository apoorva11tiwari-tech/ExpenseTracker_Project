
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

vi.mock("../firebase", () => ({
  auth: {},
  googleProvider: {},
}));

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  signInWithPopup: vi.fn(),
}));

import SignUp from "../SignUp";

describe("CashMate Sign Up Page", () => {
  test("displays the account creation heading", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /create your account/i,
      })
    ).toBeInTheDocument();
  });

  test("displays the Create Account button", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name: /create account/i,
      })
    ).toBeInTheDocument();
  });

  test("displays the Google sign-up button", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name: /sign up with google/i,
      })
    ).toBeInTheDocument();
  });
});
