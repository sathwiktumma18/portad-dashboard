import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CompatibilityMatrix from "./matrix";
import * as apiClient from "@/lib/api-client";

describe("CompatibilityMatrix", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders catalog and fallback offline indicator by default", async () => {
    vi.spyOn(apiClient, "fetchCapabilities").mockResolvedValue({
      data: apiClient.FALLBACK_ENTRIES,
      error: { kind: "network", message: "Failed to fetch" },
      isFallback: true,
    });

    render(<CompatibilityMatrix />);

    expect(screen.getByPlaceholderText("Search platforms…")).toBeDefined();
    expect(screen.getByRole("group", { name: "Filter by status" })).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("○ Offline Catalog")).toBeDefined();
    });

    // Check presence of Notion and Huly
    expect(screen.getAllByText("Notion").length).toBeGreaterThan(0);
    expect(screen.getByText("Huly")).toBeDefined();
  });

  it("updates indicator to Live Core API when dynamic fetch succeeds", async () => {
    vi.spyOn(apiClient, "fetchCapabilities").mockResolvedValue({
      data: [
        {
          id: "custom-live",
          name: "LivePlatform",
          kind: "source",
          status: "Supported",
          detail: "Live integration test",
        },
      ],
      error: null,
      isFallback: false,
    });

    render(<CompatibilityMatrix />);

    await waitFor(() => {
      expect(screen.getByText("● Live Core API")).toBeDefined();
      expect(screen.getByText("LivePlatform")).toBeDefined();
    });
  });

  it("filters items by search query", async () => {
    vi.spyOn(apiClient, "fetchCapabilities").mockResolvedValue({
      data: apiClient.FALLBACK_ENTRIES,
      error: null,
      isFallback: false,
    });

    render(<CompatibilityMatrix />);

    const searchInput = screen.getByPlaceholderText("Search platforms…");
    fireEvent.change(searchInput, { target: { value: "Huly" } });

    expect(screen.getByText("Huly")).toBeDefined();
    await waitFor(() => {
      expect(screen.queryByText("ClickUp")).toBeNull();
    });
  });

  it("shows empty state when search matches no platforms", async () => {
    vi.spyOn(apiClient, "fetchCapabilities").mockResolvedValue({
      data: apiClient.FALLBACK_ENTRIES,
      error: null,
      isFallback: false,
    });

    render(<CompatibilityMatrix />);

    const searchInput = screen.getByPlaceholderText("Search platforms…");
    fireEvent.change(searchInput, { target: { value: "nonexistent-platform" } });

    await waitFor(() => {
      expect(
        screen.getByText(
          "No platforms found. Try a different search or select another status filter.",
        ),
      ).toBeDefined();
    });
  });

  it("filters platforms by status buttons", async () => {
    vi.spyOn(apiClient, "fetchCapabilities").mockResolvedValue({
      data: apiClient.FALLBACK_ENTRIES,
      error: null,
      isFallback: false,
    });

    render(<CompatibilityMatrix />);

    const plannedButton = screen.getByRole("button", { name: "Planned" });
    fireEvent.click(plannedButton);

    expect(plannedButton.getAttribute("aria-pressed")).toBe("true");
    // Huly is Supported, so it unmounts when Planned is selected
    await waitFor(() => {
      expect(screen.queryByText("Huly")).toBeNull();
    });
    // Trello is Planned, so it should be visible
    expect(screen.getByText("Trello")).toBeDefined();
  });
});
