import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import CompatibilityMatrix from "./matrix";

afterEach(() => {
  cleanup();
});

describe("CompatibilityMatrix animations", () => {
  it("completes card exit animations before showing the empty state", async () => {
    const { container } = render(<CompatibilityMatrix />);

    const search = screen.getByRole("searchbox", { name: "Search platforms" });
    fireEvent.change(search, { target: { value: "Notion" } });
    const cards = screen
      .getAllByText("Notion")
      .map((element) => element.closest("li"))
      .filter((card): card is HTMLLIElement => card !== null);
    expect(cards).toHaveLength(2);

    const observerRef: { current: MutationObserver | null } = { current: null };
    const emptyStateAfterExits = new Promise<void>((resolve, reject) => {
      observerRef.current = new MutationObserver((mutations) => {
        const statusAdded = mutations.some((mutation) =>
          Array.from(mutation.addedNodes).some(
            (node) =>
              node instanceof HTMLElement &&
              (node.matches('[role="status"]') ||
                node.querySelector('[role="status"]') !== null),
          ),
        );
        if (!statusAdded) return;

        observerRef.current?.disconnect();
        if (cards.some((card) => card.isConnected)) {
          reject(new Error("Empty state appeared before exiting cards were removed"));
        } else {
          resolve();
        }
      });
      observerRef.current.observe(container, { childList: true, subtree: true });
    });

    try {
      fireEvent.change(search, { target: { value: "no matching platform" } });

      expect(cards.every((card) => card.isConnected)).toBe(true);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();

      await emptyStateAfterExits;

      expect(cards.every((card) => !card.isConnected)).toBe(true);
      expect(screen.getByRole("status")).toBeInTheDocument();
    } finally {
      observerRef.current?.disconnect();
    }
  });
});
