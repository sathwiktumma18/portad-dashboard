import path from "node:path";
import { expect, test } from "@playwright/test";

const MINIMAL_PORTAD_FIXTURE = path.resolve(__dirname, "../fixtures/minimal.portad");

test.describe("Sprint 3 End-to-End Pilot & Reconciliation", () => {
  test.describe("Migration Wizard Flow", () => {
    test("executes reproducible pilot happy path with real .portad fixture to Step 4 CLI guidance", async ({
      page,
    }) => {
      await page.goto("/migrate");

      // Step 1: Select Fixtures demo source
      await page.getByRole("button", { name: /Fixtures demo/ }).click();
      await page.getByRole("button", { name: "Next", exact: true }).click();

      // Step 2: Select Huly target
      await expect(page.getByRole("heading", { name: "Choose a target" })).toBeVisible();
      await page.getByRole("button", { name: /^Huly/ }).click();
      await page.getByRole("button", { name: "Next", exact: true }).click();

      // Step 3: Attach real minimal .portad package fixture and verify preview container
      await expect(page.getByRole("heading", { name: "Attach a package" })).toBeVisible();
      await page.locator('input[type="file"]').setInputFiles(MINIMAL_PORTAD_FIXTURE);

      const preview = page.locator('[data-testid="package-preview"]');
      await expect(preview).toBeVisible();
      await expect(preview).toContainText("preview · minimal.portad");
      await page.getByRole("button", { name: "Continue" }).click();

      // Step 4: Verify honest disabled hosted execution & CLI flow
      await expect(page.getByRole("heading", { name: "Run the migration" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Run hosted migration" })).toBeDisabled();
      await expect(page.getByText(/Hosted execution not enabled yet/)).toBeVisible();

      const cliCommands = page.locator('[data-testid="cli-command"]');
      await expect(cliCommands).toHaveCount(3);
      await expect(cliCommands.nth(0)).toContainText("portad export notion");
      await expect(cliCommands.nth(1)).toContainText("portad transform --target huly");
      await expect(cliCommands.nth(2)).toContainText("portad import huly --resume");
    });

    test("blocks invalid package upload and recovers cleanly when real .portad package is selected", async ({
      page,
    }) => {
      await page.goto("/migrate");

      await page.getByRole("button", { name: /Notion/ }).click();
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page.getByRole("button", { name: /^Huly/ }).click();
      await page.getByRole("button", { name: "Next", exact: true }).click();

      // Failure path: unsupported file extension
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: "payload.exe",
        mimeType: "application/x-msdownload",
        buffer: Buffer.from("not-a-package"),
      });

      await expect(page.locator("#file-error-msg")).toContainText(/Invalid file type/i);
      await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();

      // Recovery path: replace with real minimal .portad file fixture
      await fileInput.setInputFiles(MINIMAL_PORTAD_FIXTURE);

      await expect(page.locator("#file-error-msg")).toHaveCount(0);
      const preview = page.locator('[data-testid="package-preview"]');
      await expect(preview).toBeVisible();
      await expect(preview).toContainText("preview · minimal.portad");
      await expect(page.getByRole("button", { name: "Continue" })).toBeEnabled();
    });
  });

  test.describe("Compatibility Matrix & Search", () => {
    test("filters compatibility matrix and renders accessible empty state", async ({
      page,
    }) => {
      await page.goto("/compatibility");

      await expect(page.getByRole("heading", { name: "Sources", exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Targets", exact: true })).toBeVisible();
      await expect(page.getByText("Huly")).toBeVisible();

      // Filter by Planned
      await page.getByRole("button", { name: "Planned" }).click();
      await expect(page.getByText("Trello")).toBeVisible();
      await expect(page.getByText("Asana")).toBeVisible();
      await expect(page.getByText("Huly")).toHaveCount(0);

      // Search non-existent platform -> empty state
      await page.getByRole("searchbox", { name: /search platforms/i }).fill("nonexistent-xyz");
      await expect(page.getByRole("main").getByRole("status")).toContainText(
        "No platforms found. Try a different search or select another status filter.",
      );
    });
  });

  test.describe("Jobs Honest State", () => {
    test("displays honest empty state on Jobs page with migration link", async ({
      page,
    }) => {
      await page.goto("/jobs");

      await expect(page.getByRole("heading", { name: "No jobs yet" })).toBeVisible();
      await expect(page.getByText("portad jobs list")).toBeVisible();

      await page.getByRole("main").getByRole("link", { name: "Start a migration" }).click();
      await expect(page).toHaveURL(/\/migrate$/);
    });
  });

  test.describe("Account & Session Lifecycle", () => {
    test("validates empty account submission and supports preview session lifecycle", async ({
      page,
    }) => {
      await page.goto("/account");

      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page.getByText("Enter an email and password.")).toBeVisible();

      await page.getByRole("button", { name: /Skip — use a preview session/i }).click();
      await expect(page.getByText("preview session")).toBeVisible();
      await expect(
        page.getByText(/This session is not a real account/i),
      ).toBeVisible();

      await page.getByRole("main").getByRole("button", { name: "Sign out" }).click();
      await expect(page.getByRole("heading", { name: "Sign in to PortaD" })).toBeVisible();
    });
  });
});
