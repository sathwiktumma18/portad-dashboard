"use client";

import { motion, useReducedMotion } from "motion/react";

const NODES = [
  {
    label: "Source",
    name: "Notion",
    meta: "1,284 records · 12 attachments",
    glyph: "N",
    tone: "from-brand-500/15 to-brand-500/5 text-brand-700 border-brand-200 dark:from-brand-500/25 dark:to-brand-500/5 dark:text-brand-300 dark:border-brand-400/30",
  },
  {
    label: "Package",
    name: "notion.portad",
    meta: "sha256:9f2c…e41a · 84.2 MB",
    glyph: "◆",
    tone: "from-slate-100 to-slate-50 text-slate-700 border-slate-200 dark:from-white/10 dark:to-white/[0.02] dark:text-frost-300 dark:border-white/15",
    mono: true,
  },
  {
    label: "Target",
    name: "Huly",
    meta: "Unified Import Format",
    glyph: "H",
    tone: "from-cyan-500/15 to-cyan-500/5 text-cyan-800 border-cyan-200 dark:from-ice-400/25 dark:to-ice-400/5 dark:text-ice-400 dark:border-ice-400/30",
  },
];

export default function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="glass-strong relative w-full max-w-[420px] overflow-hidden rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(15,32,73,0.08)] dark:shadow-[0_50px_90px_-40px_rgba(0,0,0,0.85)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-ice-400/15 blur-3xl"
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs text-frost-500">job · notion → huly</span>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot dark:bg-emerald-400" />
          live preview
        </span>
      </div>

      <div className="relative mt-5 space-y-3">
        {NODES.map((node, i) => (
          <div key={node.label}>
            <div className="glass flex items-center gap-3.5 rounded-2xl p-3.5 transition hover:border-brand-400/40">
              <span
                className={
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-gradient-to-br text-sm font-semibold " +
                  node.tone
                }
              >
                {node.glyph}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] uppercase tracking-widest text-frost-600">
                  {node.label}
                </span>
                <span
                  className={
                    "block truncate text-sm font-medium text-frost-100 " +
                    (node.mono ? "font-mono" : "")
                  }
                >
                  {node.name}
                </span>
              </span>
              <span className="hidden truncate text-right text-[11px] leading-4 text-frost-500 sm:block">
                {node.meta}
              </span>
            </div>
            {i < NODES.length - 1 && (
              <div className="relative mx-auto h-6 w-px bg-gradient-to-b from-brand-400/50 to-ice-400/50">
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-ice-400 shadow-[0_0_10px_2px_rgba(0,198,255,0.7)]"
                    initial={{ y: -3, opacity: 0 }}
                    animate={{ y: [-3, 21], opacity: [0, 1, 1, 0] }}
                    transition={{
                      duration: 1.9,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.45,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative mt-5 space-y-2.5 border-t border-slate-200/80 pt-4 dark:border-white/10">
        {[
          { label: "Export", done: true },
          { label: "Validate · 5 layers", done: true },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between text-xs">
            <span className="text-frost-400">{row.label}</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">✓ done</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-xs">
          <span className="text-frost-400">Import · checkpoint 4/6</span>
          <span className="font-medium text-brand-600 dark:text-brand-300">resumable</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/8">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-ice-400"
            initial={{ width: "34%" }}
            animate={reduce ? { width: "72%" } : { width: ["34%", "72%", "34%"] }}
            transition={
              reduce
                ? undefined
                : { duration: 5.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
            }
          />
        </div>
      </div>
    </div>
  );
}
