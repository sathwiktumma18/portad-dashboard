import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import React from "react";
import Migrate from "./page";

// Mock motion/react so AnimatePresence renders synchronously in jsdom.
// The real library waits for exit animations to complete before showing the
// next child (mode="wait"), which never happens in a headless test environment.
vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) =>
      React.createElement("div", props, children),
  },
  useReducedMotion: () => false,
}));

afterEach(() => {
  cleanup();
});

/* ─── helpers ─────────────────────────────────────────────────────── */

/** Advance the wizard to a given step with default selections.          */
function advanceToStep(step: number) {
  render(<Migrate />);

  if (step >= 1) {
    fireEvent.click(screen.getByRole("button", { name: /notion/i }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
  }
  if (step >= 2) {
    fireEvent.click(screen.getByRole("button", { name: /huly/i }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
  }
  if (step >= 3) {
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["payload"], "demo.portad", {
      type: "application/zip",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  }
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Step 0 — Source selection                                         */
/* ═══════════════════════════════════════════════════════════════════ */
describe("Migrate wizard", () => {
  describe("Step 0 — Source selection", () => {
    it("starts on the Source step and shows the step counter", () => {
      render(<Migrate />);
      expect(screen.getByText("Choose a source")).toBeInTheDocument();
      expect(screen.getByText("step 1 / 4")).toBeInTheDocument();
    });

    it("disables the Back button on the first step", () => {
      render(<Migrate />);
      expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
    });

    it("disables the Next button until a source is selected", () => {
      render(<Migrate />);
      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    });

    it("keeps planned sources disabled and unselectable", () => {
      render(<Migrate />);
      expect(screen.getByRole("button", { name: /trello/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /clickup/i })).toBeDisabled();
    });

    it("enables the Next button once a source is selected", () => {
      render(<Migrate />);
      fireEvent.click(screen.getByRole("button", { name: /notion/i }));
      expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    });

    it("allows selecting Fixtures demo as a source", () => {
      render(<Migrate />);
      fireEvent.click(
        screen.getByRole("button", { name: /fixtures demo/i }),
      );
      expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    });

    it("renders detail text for each source option", () => {
      render(<Migrate />);
      expect(
        screen.getByText("Pages, databases, attachments"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Synthetic workspace, no account needed"),
      ).toBeInTheDocument();
      expect(screen.getByText("Planned (0.3)")).toBeInTheDocument();
      expect(screen.getByText("Planned (0.4)")).toBeInTheDocument();
    });

    it("displays 'planned' badges on disabled sources", () => {
      render(<Migrate />);
      const badges = screen.getAllByText("planned");
      // Trello and ClickUp are planned
      expect(badges).toHaveLength(2);
    });
  });

  /* ═══════════════════════════════════════════════════════════════════ */
  /*  Step 1 — Target selection                                        */
  /* ═══════════════════════════════════════════════════════════════════ */
  describe("Step 1 — Target selection", () => {
    it("advances to the Target step and updates the counter", () => {
      render(<Migrate />);
      fireEvent.click(screen.getByRole("button", { name: /notion/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByText("Choose a target")).toBeInTheDocument();
      expect(screen.getByText("step 2 / 4")).toBeInTheDocument();
    });

    it("can go back from the Target step to the Source step", () => {
      render(<Migrate />);
      fireEvent.click(screen.getByRole("button", { name: /notion/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.click(screen.getByRole("button", { name: "Back" }));
      expect(screen.getByText("Choose a source")).toBeInTheDocument();
      expect(screen.getByText("step 1 / 4")).toBeInTheDocument();
    });

    it("disables Next on the Target step until a target is selected", () => {
      render(<Migrate />);
      fireEvent.click(screen.getByRole("button", { name: /notion/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    });

    it("keeps planned targets disabled and unselectable", () => {
      render(<Migrate />);
      fireEvent.click(screen.getByRole("button", { name: /notion/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));

      // Notion target is planned (not ready)
      const notionTarget = screen.getByRole("button", {
        name: /round-trip import planned/i,
      });
      expect(notionTarget).toBeDisabled();
    });

    it("enables Next after selecting Huly as target", () => {
      render(<Migrate />);
      fireEvent.click(screen.getByRole("button", { name: /notion/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.click(screen.getByRole("button", { name: /huly/i }));
      expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    });

    it("shows target detail text", () => {
      render(<Migrate />);
      fireEvent.click(screen.getByRole("button", { name: /notion/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(
        screen.getByText("Unified Import Format workspace"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Round-trip import planned"),
      ).toBeInTheDocument();
    });
  });

  /* ═══════════════════════════════════════════════════════════════════ */
  /*  Step 2 — Package upload                                          */
  /* ═══════════════════════════════════════════════════════════════════ */
  describe("Step 2 — Package upload", () => {
    it("advances to the Package step after selecting a target", () => {
      render(<Migrate />);
      fireEvent.click(screen.getByRole("button", { name: /notion/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.click(screen.getByRole("button", { name: /huly/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByText("Attach a package")).toBeInTheDocument();
      expect(screen.getByText("step 3 / 4")).toBeInTheDocument();
    });

    it("shows the Continue button label on the Package step", () => {
      advanceToStep(2);
      expect(
        screen.getByRole("button", { name: "Continue" }),
      ).toBeInTheDocument();
    });

    it("disables Continue until a file is attached", () => {
      advanceToStep(2);
      expect(
        screen.getByRole("button", { name: "Continue" }),
      ).toBeDisabled();
    });

    it("shows default upload prompt text", () => {
      advanceToStep(2);
      expect(
        screen.getByText("Click to choose a .portad package"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/or run portad export to create one/i),
      ).toBeInTheDocument();
    });

    it("displays uploaded file name and enables Continue after upload", () => {
      advanceToStep(2);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["payload"], "workspace.portad", {
        type: "application/zip",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByText("workspace.portad")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Continue" }),
      ).toBeEnabled();
    });

    it("shows a package preview tree after file upload", () => {
      advanceToStep(2);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["payload"], "export.portad", {
        type: "application/zip",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByText(/preview · export\.portad/)).toBeInTheDocument();
      // Verify tree items are rendered
      expect(screen.getByText(/notion\.portad\//)).toBeInTheDocument();
      expect(screen.getByText(/manifest\.json/)).toBeInTheDocument();
      expect(screen.getByText(/report\.json/)).toBeInTheDocument();
      expect(screen.getByText(/pages\.json/)).toBeInTheDocument();
      expect(screen.getByText(/databases\.json/)).toBeInTheDocument();
      expect(screen.getByText(/comments\.json/)).toBeInTheDocument();
    });

    it("accepts .zip and .portad file types", () => {
      advanceToStep(2);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      expect(fileInput.accept).toBe(".zip,.portad");
    });

    it("can go back from the Package step to the Target step", () => {
      advanceToStep(2);
      fireEvent.click(screen.getByRole("button", { name: "Back" }));
      expect(screen.getByText("Choose a target")).toBeInTheDocument();
      expect(screen.getByText("step 2 / 4")).toBeInTheDocument();
    });
  });

  /* ═══════════════════════════════════════════════════════════════════ */
  /*  Step 3 — Run the migration                                       */
  /* ═══════════════════════════════════════════════════════════════════ */
  describe("Step 3 — Run the migration", () => {
    it("shows the Run step and keeps the hosted run button disabled", () => {
      advanceToStep(3);
      expect(screen.getByText("Run the migration")).toBeInTheDocument();
      expect(screen.getByText("step 4 / 4")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Run hosted migration" }),
      ).toBeDisabled();
    });

    it("displays CLI commands on the Run step", () => {
      advanceToStep(3);
      expect(screen.getByText("portad export notion")).toBeInTheDocument();
      expect(
        screen.getByText("portad transform --target huly"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("portad import huly --resume"),
      ).toBeInTheDocument();
    });

    it("shows the hosted execution warning message", () => {
      advanceToStep(3);
      expect(
        screen.getByText(
          /hosted execution not enabled yet/i,
        ),
      ).toBeInTheDocument();
    });

    it("shows a terminal UI chrome on the Run step", () => {
      advanceToStep(3);
      expect(screen.getByText("terminal")).toBeInTheDocument();
    });

    it("disables Next button on the last step", () => {
      advanceToStep(3);
      // On the last step, the next/continue button should not advance further.
      // The button that would be "Next" is now disabled because step === 3.
      // We find it by its text — on step 3 it shows "Next" (not "Continue")
      const nextBtn = screen.getByRole("button", { name: "Next" });
      expect(nextBtn).toBeDisabled();
    });

    it("can go back from the Run step to the Package step", () => {
      advanceToStep(3);
      fireEvent.click(screen.getByRole("button", { name: "Back" }));
      expect(screen.getByText("Attach a package")).toBeInTheDocument();
      expect(screen.getByText("step 3 / 4")).toBeInTheDocument();
    });
  });

  /* ═══════════════════════════════════════════════════════════════════ */
  /*  Stepper indicator                                                */
  /* ═══════════════════════════════════════════════════════════════════ */
  describe("Stepper indicator", () => {
    it("renders all four step labels in the stepper", () => {
      render(<Migrate />);
      const stepper = screen.getByRole("list");
      const items = within(stepper).getAllByRole("listitem");
      expect(items).toHaveLength(4);

      expect(within(stepper).getByText("Source")).toBeInTheDocument();
      expect(within(stepper).getByText("Target")).toBeInTheDocument();
      expect(within(stepper).getByText("Package")).toBeInTheDocument();
      expect(within(stepper).getByText("Run")).toBeInTheDocument();
    });

    it("shows step numbers 1–4 on initial load", () => {
      render(<Migrate />);
      const stepper = screen.getByRole("list");
      expect(within(stepper).getByText("1")).toBeInTheDocument();
      expect(within(stepper).getByText("2")).toBeInTheDocument();
      expect(within(stepper).getByText("3")).toBeInTheDocument();
      expect(within(stepper).getByText("4")).toBeInTheDocument();
    });

    it("shows a checkmark for completed steps", () => {
      // Advance to step 2 (Target) — step 0 (Source) should show ✓
      render(<Migrate />);
      fireEvent.click(screen.getByRole("button", { name: /notion/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));

      const stepper = screen.getByRole("list");
      expect(within(stepper).getByText("✓")).toBeInTheDocument();
    });
  });

  /* ═══════════════════════════════════════════════════════════════════ */
  /*  Page header                                                      */
  /* ═══════════════════════════════════════════════════════════════════ */
  describe("Page header", () => {
    it("renders the page heading and subtitle", () => {
      render(<Migrate />);
      expect(screen.getByText("New migration")).toBeInTheDocument();
      expect(
        screen.getByText("Four steps, zero surprises"),
      ).toBeInTheDocument();
    });

    it("renders the CLI info description", () => {
      render(<Migrate />);
      expect(
        screen.getByText(
          /hosted execution is not enabled yet/i,
        ),
      ).toBeInTheDocument();
    });
  });

  /* ═══════════════════════════════════════════════════════════════════ */
  /*  Full wizard flow                                                  */
  /* ═══════════════════════════════════════════════════════════════════ */
  describe("Full wizard flow", () => {
    it("completes the entire wizard flow from Source to Run", () => {
      render(<Migrate />);

      // Step 0: Source
      expect(screen.getByText("step 1 / 4")).toBeInTheDocument();
      expect(screen.getByText("Choose a source")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /notion/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));

      // Step 1: Target
      expect(screen.getByText("step 2 / 4")).toBeInTheDocument();
      expect(screen.getByText("Choose a target")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /huly/i }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));

      // Step 2: Package
      expect(screen.getByText("step 3 / 4")).toBeInTheDocument();
      expect(screen.getByText("Attach a package")).toBeInTheDocument();
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["payload"], "migration.portad", {
        type: "application/zip",
      });
      fireEvent.change(fileInput, { target: { files: [file] } });
      fireEvent.click(screen.getByRole("button", { name: "Continue" }));

      // Step 3: Run
      expect(screen.getByText("step 4 / 4")).toBeInTheDocument();
      expect(screen.getByText("Run the migration")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Run hosted migration" }),
      ).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    });

    it("navigates backward through all steps", () => {
      advanceToStep(3);

      // Step 3 → Step 2
      fireEvent.click(screen.getByRole("button", { name: "Back" }));
      expect(screen.getByText("Attach a package")).toBeInTheDocument();

      // Step 2 → Step 1
      fireEvent.click(screen.getByRole("button", { name: "Back" }));
      expect(screen.getByText("Choose a target")).toBeInTheDocument();

      // Step 1 → Step 0
      fireEvent.click(screen.getByRole("button", { name: "Back" }));
      expect(screen.getByText("Choose a source")).toBeInTheDocument();

      // Cannot go before step 0
      expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
    });
  });
});