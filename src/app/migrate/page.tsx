"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Step = 0 | 1 | 2 | 3;

const STEP_LABELS = ["Source", "Target", "Package", "Run"] as const;

const SOURCES = [
  { id: "notion", name: "Notion", detail: "Pages, databases, attachments", ready: true },
  { id: "fixtures", name: "Fixtures demo", detail: "Synthetic workspace, no account needed", ready: true },
  { id: "trello", name: "Trello", detail: "Planned (0.3)", ready: false },
  { id: "clickup", name: "ClickUp", detail: "Planned (0.4)", ready: false },
];

const TARGETS = [
  { id: "huly", name: "Huly", detail: "Unified Import Format workspace", ready: true },
  { id: "notion", name: "Notion", detail: "Round-trip import planned", ready: false },
];

const CLI_RUN = [
  "portad export notion",
  "portad transform --target huly",
  "portad import huly --resume",
];

const TREE = [
  { depth: 0, name: "notion.portad/", kind: "dir" as const },
  { depth: 1, name: "manifest.json", kind: "file" as const, meta: "checksums · 12 KB" },
  { depth: 1, name: "report.json", kind: "file" as const, meta: "mapping decisions" },
  { depth: 1, name: "data/", kind: "dir" as const },
  { depth: 2, name: "pages.json", kind: "file" as const, meta: "842 records" },
  { depth: 2, name: "databases.json", kind: "file" as const, meta: "6 databases" },
  { depth: 2, name: "comments.json", kind: "file" as const, meta: "431 threads" },
  { depth: 1, name: "attachments/", kind: "dir" as const },
  { depth: 2, name: "12 files", kind: "file" as const, meta: "84.2 MB · sha256 ✓" },
];

const MAX_FILE_SIZE_BYTES = 250 * 1024 * 1024; // 250 MB
const ALLOWED_EXTENSIONS = [".portad", ".zip"];

export default function Migrate() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [source, setSource] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);

  const canAdvance =
    (step === 0 && source !== null) ||
    (step === 1 && target !== null) ||
    (step === 2 && fileName !== null && fileError === null);

  const handleSelectSource = (id: string) => {
    setSource(id);
  };

  const handleSelectTarget = (id: string) => {
    setTarget(id);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName(null);
      setFileError(null);
      setFileWarning(null);
      return;
    }

    const lowerName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      setFileName(file.name);
      setFileError("Invalid file type. Please upload a valid .portad or .zip package archive.");
      setFileWarning(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileName(file.name);
      setFileError(null);
      setFileWarning("Large package detected (> 250 MB). Ingestion may require running via the local CLI.");
      return;
    }

    setFileName(file.name);
    setFileError(null);
    setFileWarning(null);
  };

  const progress = (step / (STEP_LABELS.length - 1)) * 100;

  const slide = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
        New migration
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gradient-soft sm:text-4xl">
        Four steps, zero surprises
      </h1>
      <p className="mt-3 max-w-xl leading-7 text-frost-400">
        Hosted execution is not enabled yet — each step mirrors the CLI flow it will
        one day run for you.
      </p>

      {/* Stepper */}
      <div className="mt-10">
        <div className="relative">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-4 h-px bg-slate-200 dark:bg-white/10"
          />
          <motion.div
            aria-hidden
            className="absolute left-0 top-4 h-px bg-gradient-to-r from-brand-500 to-ice-400"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <ol
            className="relative flex justify-between"
            aria-label="Migration progress"
          >
            {STEP_LABELS.map((label, index) => {
              const state =
                index < step ? "done" : index === step ? "current" : "todo";
              return (
                <li
                  key={label}
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className={
                      "relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-4 ring-white dark:ring-space-900 transition-colors " +
                      (state === "current"
                        ? "bg-gradient-to-br from-brand-500 to-ice-400 text-white shadow-md"
                        : state === "done"
                          ? "bg-emerald-600 text-white"
                          : "border border-slate-200 bg-white text-slate-400 dark:border-white/15 dark:bg-space-850 dark:text-frost-500")
                    }
                  >
                  <span aria-hidden="true">{state === "done" ? "✓" : index + 1}</span>
                    <span className="sr-only">
                      {state === "done"
                        ? `Step ${index + 1} completed`
                        : state === "current"
                        ? `Step ${index + 1}, current step`
                        : `Step ${index + 1}, upcoming`}
                      </span>
                    </span>
                  <span
                    aria-current={state === "current" ? "step" : undefined}
                    className={
                      "text-xs font-medium " +
                      (state === "todo" ? "text-slate-400 dark:text-frost-600" : state === "current" ? "text-brand-600 font-semibold dark:text-frost-100" : "text-slate-700 dark:text-frost-200")
                    }
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Card */}
      <div className="glass mt-10 min-h-[380px] rounded-2xl sm:rounded-3xl p-5 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            {...slide}
            transition={{ duration: reduce ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-frost-50">Choose a source</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-frost-500">
                  Where the workspace lives today.
                </p>
                <fieldset
                  className="mt-5 border-0 p-0 m-0"
                  aria-describedby={!source ? "source-requirement-hint" : undefined}
                >
                  <legend className="sr-only">Source platform choices</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SOURCES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        disabled={!item.ready}
                        onClick={() => handleSelectSource(item.id)}
                        className={
                          "rounded-2xl border p-4 text-left transition duration-200 disabled:cursor-not-allowed disabled:opacity-45 " +
                          (source === item.id
                            ? "border-brand-500 bg-brand-50/70 shadow-sm dark:border-brand-400 dark:bg-brand-500/10"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/25 dark:hover:bg-white/[0.06]")
                        }
                      >
                        <span className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 dark:text-frost-100">{item.name}</span>
                          {!item.ready && (
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-transparent dark:text-frost-600">
                              planned
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500 dark:text-frost-500">
                          {item.detail}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                {!source ? (
                  <p
                    id="source-requirement-hint"
                    role="status"
                    className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-frost-500"
                  >
                    <span aria-hidden="true">ℹ</span> A source platform is required to proceed to the target step.
                  </p>
                ) : null}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-frost-50">Choose a target</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-frost-500">
                  Where the workspace should land.
                </p>
                <fieldset
                  className="mt-5 border-0 p-0 m-0"
                  aria-describedby={!target ? "target-requirement-hint" : undefined}
                >
                  <legend className="sr-only">Destination platform choices</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {TARGETS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        disabled={!item.ready}
                        onClick={() => handleSelectTarget(item.id)}
                        className={
                          "rounded-2xl border p-4 text-left transition duration-200 disabled:cursor-not-allowed disabled:opacity-45 " +
                          (target === item.id
                            ? "border-brand-500 bg-brand-50/70 shadow-sm dark:border-brand-400 dark:bg-brand-500/10"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/25 dark:hover:bg-white/[0.06]")
                        }
                      >
                        <span className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 dark:text-frost-100">{item.name}</span>
                          {!item.ready && (
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-transparent dark:text-frost-600">
                              planned
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500 dark:text-frost-500">
                          {item.detail}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                {!target ? (
                  <p
                    id="target-requirement-hint"
                    role="status"
                    className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-frost-500"
                  >
                    <span aria-hidden="true">ℹ</span> A destination platform is required to proceed to package upload.
                  </p>
                ) : null}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-frost-50">Attach a package</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-frost-500">
                  Have a <code className="font-mono text-brand-600 dark:text-brand-300">.portad</code>{" "}
                  package already? Attach it here — files never leave this page.
                </p>
                <label
                  htmlFor="package-upload-input"
                  className={
                    "mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition " +
                    (fileError
                      ? "border-red-400 bg-red-50/50 hover:border-red-500 hover:bg-red-50/70 dark:border-red-500/40 dark:bg-red-950/20 dark:hover:border-red-400/60"
                      : "border-slate-300 bg-slate-50/50 hover:border-brand-400 hover:bg-brand-50/40 dark:border-white/20 dark:bg-transparent dark:hover:border-brand-400/60 dark:hover:bg-brand-500/5")
                  }
                >
                  <input
                    id="package-upload-input"
                    type="file"
                    accept=".zip,.portad"
                    className="sr-only"
                    aria-describedby={
                      fileError
                        ? "file-error-msg"
                        : fileWarning
                          ? "file-warning-msg"
                          : !fileName
                            ? "file-requirement-hint"
                            : undefined
                    }
                    aria-invalid={fileError !== null}
                    onChange={handleFileChange}
                  />
                  <span className="text-sm font-medium text-slate-800 dark:text-frost-100">
                    {fileName ?? "Click to choose a .portad package"}
                  </span>
                  <span className="mt-1.5 font-mono text-xs text-slate-500 dark:text-frost-500">
                    or run portad export to create one
                  </span>
                </label>

                {fileError && (
                  <p
                    id="file-error-msg"
                    role="alert"
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                  >
                    <span aria-hidden="true">✕</span> {fileError}
                  </p>
                )}

                {fileName === null && !fileError ? (
                  <p
                    id="file-requirement-hint"
                    role="status"
                    className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-frost-500"
                  >
                    <span aria-hidden="true">ℹ</span> A .portad or .zip package archive is required to advance.
                  </p>
                ) : null}

                {fileWarning && !fileError && (
                  <p
                    id="file-warning-msg"
                    role="status"
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400"
                  >
                    <span aria-hidden="true">⚠</span> {fileWarning}
                  </p>
                )}

                <AnimatePresence>
                  {fileName && !fileError && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 overflow-x-auto no-scrollbar rounded-2xl border border-slate-200 bg-slate-900 text-frost-100 p-4 font-mono text-[13px] leading-7 dark:border-white/10 dark:bg-space-950/70">
                        <div className="mb-2 text-slate-400 dark:text-frost-600">
                          preview · {fileName}
                        </div>
                        {TREE.map((node) => (
                          <div
                            key={node.depth + node.name}
                            className="flex items-center justify-between gap-4"
                            style={{ paddingLeft: node.depth * 18 }}
                          >
                            <span
                              className={
                                node.kind === "dir"
                                  ? "text-brand-300"
                                  : "text-frost-300"
                              }
                            >
                              {node.kind === "dir" ? "▸ " : "• "}
                              {node.name}
                            </span>
                            {node.meta && (
                              <span className="text-[11px] text-frost-500">
                                {node.meta}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-frost-50">
                  Run the migration
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-frost-500">
                  Hosted runs are queued for the hosted plane. Until then, the exact
                  pipeline runs locally:
                </p>
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 dark:border-white/10 dark:bg-space-950">
                  <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-2 text-[11px] text-frost-500">terminal</span>
                  </div>
                  <div className="p-4 font-mono text-sm leading-7 text-frost-300">
                    {CLI_RUN.map((cmd) => (
                      <div key={cmd}>
                        <span className="text-brand-400">$ </span>
                        {cmd}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-5 flex items-start gap-2 text-sm font-medium text-amber-700 dark:text-amber-300/90">
                  <span aria-hidden>⚠</span>
                  Hosted execution not enabled yet — the button below is intentionally
                  disabled.
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-4 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-400 dark:border-transparent dark:bg-white/8 dark:text-frost-600"
                >
                  Run hosted migration
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(0, current - 1) as Step)}
          disabled={step === 0}
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-xs transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:bg-transparent dark:text-frost-300 dark:shadow-none dark:hover:border-white/35 dark:hover:text-white"
        >
          Back
        </button>
        <div className="font-mono text-xs text-slate-500 dark:text-frost-600">
          step {step + 1} / {STEP_LABELS.length}
        </div>
        <button
          type="button"
          onClick={() => setStep((current) => Math.min(3, current + 1) as Step)}
          disabled={step === 3 || !canAdvance}
          className="btn-gradient rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:bg-none disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-white/8 dark:disabled:text-frost-600"
        >
          {step === 2 ? "Continue" : "Next"}
        </button>
      </div>
    </div>
  );
}
