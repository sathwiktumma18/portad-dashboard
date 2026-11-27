import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";

import CompatibilityMatrix from "./matrix";

vi.mock("motion/react", () => {
  const createMotionComponent = (tag: "div" | "section" | "li") => {
    const MockMotionComponent = ({
      children,
      ...props
    }: { children?: React.ReactNode } & Record<string, unknown>) => {
      const motionKeys = new Set([
        "initial",
        "animate",
        "exit",
        "transition",
        "variants",
        "whileHover",
        "whileTap",
        "whileFocus",
        "whileDrag",
        "whileInView",
        "viewport",
        "onAnimationStart",
        "onAnimationComplete",
        "layout",
        "layoutId",
      ]);

      const domProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !motionKeys.has(key)),
      );

      return React.createElement(tag, domProps, children);
    };

    MockMotionComponent.displayName = `MockMotion(${tag})`;

    return MockMotionComponent;
  };

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      div: createMotionComponent("div"),
      section: createMotionComponent("section"),
      li: createMotionComponent("li"),
    },
  };
});

afterEach(() => {
  cleanup();
});

describe("CompatibilityMatrix", () => {
  it("shows a single empty state when no platforms match the search and status filter", () => {
    render(<CompatibilityMatrix />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: /search platforms/i }),
      { target: { value: "does-not-exist" } },
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "No platforms found. Try a different search or select another status filter.",
    );
    expect(
      screen.queryByRole("heading", { name: "Sources" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Targets" }),
    ).not.toBeInTheDocument();
  });

  it("hides the section that does not match the current search", () => {
    render(<CompatibilityMatrix />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: /search platforms/i }),
      { target: { value: "fixtures" } },
    );

    expect(screen.getByRole("heading", { name: "Sources" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Targets" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Fixtures demo")).toBeInTheDocument();
  });
});
