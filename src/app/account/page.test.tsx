import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";

import Account from "./page";
import * as authModule from "@/lib/auth";

vi.mock("@/components/reveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/lib/firebase", () => ({
  firebaseEnabled: false,
  getFirebaseApi: () => null,
}));

describe("Account page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("validates empty, malformed, and oversized credentials before calling auth", () => {
    vi.spyOn(authModule, "useAuth").mockReturnValue({ ready: true, session: null });
    const signInSpy = vi.spyOn(authModule, "signInEmail").mockResolvedValue();

    render(<Account />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: "Sign in" });

    // Empty submit
    fireEvent.click(submitBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Enter an email and password.");
    expect(signInSpy).not.toHaveBeenCalled();

    // Malformed email
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.click(submitBtn);
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address.");
    expect(signInSpy).not.toHaveBeenCalled();

    // Oversized password (>128 chars)
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "a".repeat(129) } });
    fireEvent.click(submitBtn);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Password must be 128 characters or fewer.",
    );
    expect(signInSpy).not.toHaveBeenCalled();
  });

  it("enforces minimum password length on account creation", () => {
    vi.spyOn(authModule, "useAuth").mockReturnValue({ ready: true, session: null });
    const signUpSpy = vi.spyOn(authModule, "signUpEmail").mockResolvedValue();

    render(<Account />);

    fireEvent.click(screen.getByRole("button", { name: /new here\? create an account/i }));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Password must be at least 6 characters.",
    );
    expect(signUpSpy).not.toHaveBeenCalled();
  });

  it("recovers UI state after failed sign-in and clears error on input edit", async () => {
    vi.spyOn(authModule, "useAuth").mockReturnValue({ ready: true, session: null });
    vi.spyOn(authModule, "signInEmail").mockRejectedValue({
      code: "auth/invalid-credential",
    });

    render(<Account />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: "Sign in" });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Wrong email or password.");
    });
    expect(submitBtn).not.toBeDisabled();

    // Error clears when user modifies input
    fireEvent.change(passwordInput, { target: { value: "newpass123" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders signed-in session card, handles clipboard fallback, and disables repeat sign out", async () => {
    let resolveSignOut!: () => void;
    const signOutPromise = new Promise<void>((resolve) => {
      resolveSignOut = resolve;
    });
    const signOutSpy = vi.spyOn(authModule, "signOut").mockReturnValue(signOutPromise);

    vi.spyOn(authModule, "useAuth").mockReturnValue({
      ready: true,
      session: {
        email: "dev@portad.io",
        uid: "uid-123",
        provider: "password",
        mode: "firebase",
        since: "2026-11-10T10:00:00.000Z",
        expiresAt: "2026-11-10T11:00:00.000Z",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      },
    });

    // Simulate clipboard error
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
      configurable: true,
    });

    render(<Account />);

    fireEvent.click(screen.getByRole("button", { name: "Copy ID token" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Clipboard unavailable" })).toBeInTheDocument();
    });

    const signOutBtn = screen.getByRole("button", { name: "Sign out" });
    fireEvent.click(signOutBtn);
    fireEvent.click(signOutBtn);

    expect(signOutSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Signing out…" })).toBeDisabled();

    resolveSignOut();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Sign out" })).not.toBeDisabled();
    });
  });
});
