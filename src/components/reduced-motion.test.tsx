import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("motion/react", async () => {
  const actual = await vi.importActual<typeof import("motion/react")>("motion/react");
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

import HeroRibbon from "./hero-ribbon";
import HeroVisual from "./hero-visual";
import Marquee from "./marquee";
import Reveal from "./reveal";
import TiltCard from "./tilt-card";

afterEach(() => {
  cleanup();
});

describe("Reduced motion support", () => {
  it("renders HeroRibbon statically without traveling pulse path when reduced motion is enabled", () => {
    const { container } = render(<HeroRibbon />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(3);
    paths.forEach((p) => {
      expect(p.getAttribute("stroke-dasharray")).toBeNull();
    });
  });

  it("renders HeroVisual without 3D transforms or repeating beam paths when reduced motion is enabled", () => {
    const { container } = render(<HeroVisual />);
    expect(screen.getByText("1. Source Export")).toBeInTheDocument();
    expect(screen.getByText("3. Target Ready")).toBeInTheDocument();
    const animatedBeams = container.querySelectorAll('path[stroke-dasharray="14 90"]');
    expect(animatedBeams.length).toBe(0);
  });

  it("renders TiltCard without 3D transformStyle or spotlight overlay when reduced motion is enabled", () => {
    const { container } = render(
      <TiltCard>
        <span>Card content</span>
      </TiltCard>,
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
    const inner = container.querySelector('[style*="preserve-3d"]');
    expect(inner).toBeNull();
  });

  it("renders Reveal immediately visible with flat transform when prefers-reduced-motion matches", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    try {
      const { container } = render(
        <Reveal>
          <p>Visible content</p>
        </Reveal>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.style.opacity).toBe("1");
      expect(wrapper.style.transform).toContain("rotateX(0deg)");
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it("renders Marquee cleanly with accessible group role", () => {
    render(<Marquee />);
    expect(
      screen.getByRole("group", { name: /platforms supported by portad/i }),
    ).toBeInTheDocument();
  });
});
