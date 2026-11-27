import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const useReducedMotionMock = vi.fn(() => false);

vi.mock("motion/react", async () => {
  const actual = await vi.importActual<typeof import("motion/react")>("motion/react");
  return {
    ...actual,
    useReducedMotion: () => useReducedMotionMock(),
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
  it("disables continuous pulse beams and marks reduced-motion when requested", () => {
    useReducedMotionMock.mockReturnValue(true);

    const { container: ribbonContainer } = render(<HeroRibbon />);
    expect(
      ribbonContainer.querySelector('[data-reduced-motion="true"]'),
    ).toBeInTheDocument();
    expect(
      ribbonContainer.querySelector('path[stroke-dasharray="220 1580"]'),
    ).toBeNull();

    const { container: visualContainer } = render(<HeroVisual />);
    expect(
      visualContainer.querySelector('[data-reduced-motion="true"]'),
    ).toBeInTheDocument();
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
    expect(screen.getByText("Card body")).toBeInTheDocument();
  });

  it("enables continuous pulse beams when reduced motion is not requested", () => {
    useReducedMotionMock.mockReturnValue(false);

    const { container: ribbonContainer } = render(<HeroRibbon />);
    expect(
      ribbonContainer.querySelector('[data-reduced-motion="false"]'),
    ).toBeInTheDocument();
    expect(
      ribbonContainer.querySelector('path[stroke-dasharray="220 1580"]'),
    ).not.toBeNull();

    const { container: visualContainer } = render(<HeroVisual />);
    expect(
      visualContainer.querySelectorAll('path[stroke-dasharray="14 90"]').length,
    ).toBe(6);
  });

  it("includes CSS prefers-reduced-motion fallback for aurora and marquee animations", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".animate-aurora-3d-one");
    expect(css).toContain(".animate-aurora-3d-two");
    expect(css).toContain(".marquee");
    expect(css).toContain(".marquee-dance-pill");
  });
});
