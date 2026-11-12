import { expect, test } from "@playwright/test";

test.describe("Sprint 3 End-to-End Pilot & Reconciliation", () => {
  test("executes reproducible pilot happy path from source to Step 4 CLI guidance", async ({
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

    // Step 3: Attach synthetic .portad package and inspect tree preview
    await expect(page.getByRole("heading", { name: "Attach a package" })).toBeVisible();
    await page.locator('input[type="file"]').setInputFiles({
      name: "pilot.portad",
      mimeType: "application/zip",
      buffer: Buffer.from("synthetic-pilot-package"),
    });

    await expect(page.getByText("preview · pilot.portad")).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 4: Verify honest disabled hosted execution & CLI flow
    await expect(page.getByRole("heading", { name: "Run the migration" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Run hosted migration" })).toBeDisabled();
    await expect(page.getByText(/Hosted execution not enabled yet/)).toBeVisible();
    await expect(page.getByText("portad export notion")).toBeVisible();
    await expect(page.getByText("portad transform --target huly")).toBeVisible();
    await expect(page.getByText("portad import huly --resume")).toBeVisible();
  });

  test("blocks invalid package upload and recovers cleanly when valid package is selected", async ({
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

    await expect(page.getByRole("alert")).toContainText(/Invalid file type/i);
    await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();

    // Recovery path: replace with valid .portad file
    await fileInput.setInputFiles({
      name: "recovered.portad",
      mimeType: "application/zip",
      buffer: Buffer.from("valid-package"),
    });

    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByText("preview · recovered.portad")).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue" })).toBeEnabled();
  });

  test("filters compatibility matrix and renders accessible empty state", async ({
    page,
  }) => {
    await page.goto("/compatibility");

    await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Targets" })).toBeVisible();
    await expect(page.getByText("Huly")).toBeVisible();

    // Filter by Planned
    await page.getByRole("button", { name: "Planned" }).click();
    await expect(page.getByText("Trello")).toBeVisible();
    await expect(page.getByText("Asana")).toBeVisible();
    await expect(page.getByText("Huly")).toHaveCount(0);

    // Search non-existent platform -> empty state
    await page.getByRole("searchbox", { name: /search platforms/i }).fill("nonexistent-xyz");
    await expect(page.getByRole("status")).toContainText(
      "No platforms found. Try a different search or select another status filter.",
    );
  });

  test("displays honest empty state on Jobs page with migration link", async ({
    page,
  }) => {
    await page.goto("/jobs");

    await expect(page.getByRole("heading", { name: "No jobs yet" })).toBeVisible();
    await expect(page.getByText("portad jobs list")).toBeVisible();

    await page.getByRole("link", { name: "Start a migration" }).click();
    await expect(page).toHaveURL(/\/migrate$/);
  });

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

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page.getByRole("heading", { name: "Sign in to PortaD" })).toBeVisible();
  });
});
