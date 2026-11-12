import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./error";

describe("ErrorBoundary component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders error message and accessible alert role", () => {
    const error = new Error("Test explosion");
    const reset = vi.fn();

    render(<ErrorBoundary error={error} reset={reset} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /something went wrong/i })).toBeInTheDocument();
    expect(screen.getByText(/an unexpected error interrupted this page/i)).toBeInTheDocument();
  });

  it("renders error digest when available", () => {
    const error = Object.assign(new Error("Digest error"), { digest: "ERR_12345" });
    const reset = vi.fn();

    render(<ErrorBoundary error={error} reset={reset} />);

    expect(screen.getByText(/Error ID: ERR_12345/i)).toBeInTheDocument();
  });

  it("calls reset function when 'Try again' button is clicked", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    render(<ErrorBoundary error={error} reset={reset} />);

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(tryAgainButton);

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("renders link back to overview", () => {
    const error = new Error("Test error");
    const reset = vi.fn();

    render(<ErrorBoundary error={error} reset={reset} />);

    const homeLink = screen.getByRole("link", { name: /back to overview/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
