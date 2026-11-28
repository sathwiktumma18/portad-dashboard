import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const useReducedMotionMock = vi.fn(() => false);

function wrapMotionTag(tag: keyof React.JSX.IntrinsicElements) {
  const MotionMock = ({
    children,
    animate,
    whileHover,
    initial: _initial,
    transition: _transition,
    ...props
  }: Record<string, unknown> & { children?: React.ReactNode }) => {
    void _initial;
    void _transition;
    return React.createElement(
      tag,
      {
        ...props,
        "data-has-animate": animate !== undefined ? "true" : "false",
        "data-has-hover": whileHover !== undefined ? "true" : "false",
      },
      children,
    );
  };
  MotionMock.displayName = `MockMotion(${String(tag)})`;
  return MotionMock;
}

vi.mock("motion/react", async () => {
  const actual = await vi.importActual<typeof import("motion/react")>("motion/react");
  return {
    ...actual,
    useReducedMotion: () => useReducedMotionMock(),
    motion: {
      div: wrapMotionTag("div"),
      svg: wrapMotionTag("svg"),
      path: wrapMotionTag("path"),
      line: wrapMotionTag("line"),
    },
  };
});

import HeroRibbon from "./hero-ribbon";
import HeroVisual from "./hero-visual";
import TiltCard from "./tilt-card";

afterEach(() => {
  cleanup();
  useReducedMotionMock.mockReturnValue(false);
});

describe("Motion & prefers-reduced-motion accessibility", () => {
  it("disables all parent and child motion animations when reduced motion is requested", () => {
    useReducedMotionMock.mockReturnValue(true);

    const { container: ribbonContainer } = render(<HeroRibbon />);
    expect(
      ribbonContainer.querySelector('[data-reduced-motion="true"]'),
    ).toBeInTheDocument();
    expect(
      ribbonContainer.querySelector('[data-has-animate="true"]'),
    ).toBeNull();
    expect(
      ribbonContainer.querySelector('path[stroke-dasharray="220 1580"]'),
    ).toBeNull();

    const { container: visualContainer } = render(<HeroVisual />);
    expect(
      visualContainer.querySelector('[data-reduced-motion="true"]'),
    ).toBeInTheDocument();
    expect(
      visualContainer.querySelector('[data-has-animate="true"]'),
    ).toBeNull();
    expect(
      visualContainer.querySelector('[data-has-hover="true"]'),
    ).toBeNull();
    expect(
      visualContainer.querySelector('path[stroke-dasharray="14 90"]'),
    ).toBeNull();
    expect(screen.getByText("Notion Pages")).toBeInTheDocument();
    expect(screen.getByText("✓ Huly Docs")).toBeInTheDocument();

    const { container: cardContainer } = render(
      <TiltCard>
        <span>Card body</span>
      </TiltCard>,
    );
    expect(
      cardContainer.querySelector('[data-reduced-motion="true"]'),
    ).toBeInTheDocument();
    expect(
      cardContainer.querySelector('[data-has-hover="true"]'),
    ).toBeNull();
    expect(screen.getByText("Card body")).toBeInTheDocument();
  });

  it("enables animations and pulse beams when reduced motion is not requested", () => {
    useReducedMotionMock.mockReturnValue(false);

    const { container: ribbonContainer } = render(<HeroRibbon />);
    expect(
      ribbonContainer.querySelector('[data-reduced-motion="false"]'),
    ).toBeInTheDocument();
    expect(
      ribbonContainer.querySelectorAll('[data-has-animate="true"]').length,
    ).toBeGreaterThan(0);
    expect(
      ribbonContainer.querySelector('path[stroke-dasharray="220 1580"]'),
    ).not.toBeNull();

    const { container: visualContainer } = render(<HeroVisual />);
    expect(
      visualContainer.querySelectorAll('[data-has-animate="true"]').length,
    ).toBeGreaterThan(10);
    expect(
      visualContainer.querySelectorAll('path[stroke-dasharray="14 90"]').length,
    ).toBe(6);
  });

  it("includes CSS prefers-reduced-motion fallback and restored animate-pulse-dot utility", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    expect(css).toContain(".animate-pulse-dot");
    expect(css).toContain("@keyframes portad-pulse-dot");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".animate-aurora-3d-one");
    expect(css).toContain(".animate-aurora-3d-two");
    expect(css).toContain(".marquee");
    expect(css).toContain(".marquee-dance-pill");
  });
});
