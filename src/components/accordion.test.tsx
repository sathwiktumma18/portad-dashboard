
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import Accordion, { type FaqItem } from "./accordion";

afterEach(() => {
  cleanup();
});
const items: FaqItem[] = [
  { q: "What is PortaD?", a: "PortaD helps migrate data." },
  { q: "Is it free?", a: "Yes, it is open source." },
  { q: "How can I contribute?", a: "You can contribute on GitHub." },
];

describe("Accordion", () => {
  it("shows the first answer by default", () => {
    render(<Accordion items={items} />);

    expect(screen.getByText("PortaD helps migrate data.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /what is portad/i }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("opens an answer when its question is clicked", () => {
    render(<Accordion items={items} />);

    fireEvent.click(
      screen.getByRole("button", { name: /is it free/i }),
    );

    expect(screen.getByText("Yes, it is open source.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /is it free/i }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("closes an answer when its open question is clicked", () => {
    render(<Accordion items={items} />);

    fireEvent.click(
      screen.getByRole("button", { name: /what is portad/i }),
    );

    expect(
      screen.getByRole("button", { name: /what is portad/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the previous answer when another question is opened", () => {
    render(<Accordion items={items} />);

    fireEvent.click(
      screen.getByRole("button", { name: /is it free/i }),
    );

    expect(
      screen.getByRole("button", { name: /what is portad/i }),
    ).toHaveAttribute("aria-expanded", "false");

    expect(
      screen.getByRole("button", { name: /is it free/i }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});