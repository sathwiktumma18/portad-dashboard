import Link from "next/link";
import type { Metadata } from "next";

import { IconArrowRight, IconRefresh, IconShield, IconUpload } from "@/components/icons";
import { Section, SectionHeading } from "@/components/section";
import Reveal from "@/components/reveal";

export const metadata: Metadata = { title: "Jobs" };

const APPEARS = [
  { icon: IconUpload, title: "Live progress", body: "Per-stage output streamed as the pipeline runs" },
  { icon: IconRefresh, title: "Resumable state", body: "Reopen a job and it continues from its checkpoint" },
  { icon: IconShield, title: "Downloadable report", body: "The full fidelity diff as JSON and a readable summary" },
];

export default function Jobs() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Jobs"
        title="Migration runs will appear here"
        sub="Hosted jobs arrive with the hosted plane — until then, runs live in your terminal and this page stays honest about it."
      />

      <Reveal delay={0.1}>
        <div className="relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-10 text-center shadow-sm dark:border-white/10 dark:bg-space-850 dark:shadow-none">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(22,104,255,0.1),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(22,104,255,0.18),transparent_70%)]"
          />

          <div className="relative">
            {/* Illustration */}
            <svg
              aria-hidden
              viewBox="0 0 220 120"
              className="mx-auto h-28 w-52 max-w-full text-brand-500/80 dark:text-brand-400/70"
              fill="none"
            >
              <rect x="10" y="18" width="200" height="84" rx="14" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
              <path d="M10 40h200" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
              <circle cx="26" cy="29" r="3.5" fill="#ff5f57" fillOpacity="0.85" />
              <circle cx="38" cy="29" r="3.5" fill="#febc2e" fillOpacity="0.85" />
              <circle cx="50" cy="29" r="3.5" fill="#28c840" fillOpacity="0.85" />
              <rect x="26" y="54" width="90" height="7" rx="3.5" fill="currentColor" fillOpacity="0.28" />
              <rect x="26" y="70" width="130" height="7" rx="3.5" fill="currentColor" fillOpacity="0.18" />
              <rect x="26" y="86" width="60" height="7" rx="3.5" fill="currentColor" fillOpacity="0.12" />
              <rect x="168" y="54" width="26" height="7" rx="3.5" fill="#00c6ff" fillOpacity="0.6" />
              <rect x="168" y="70" width="26" height="7" rx="3.5" fill="#00c6ff" fillOpacity="0.35" />
              <circle cx="196" cy="90" r="10" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
              <path d="M196 84v6l4 2.5" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <h2 className="mt-6 text-xl font-semibold text-slate-900 dark:text-frost-50">No jobs yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-frost-400">
              Start a migration to create your first run — or run the pipeline locally
              with the CLI and it will show up here once the hosted worker lands.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/migrate"
                className="btn-primary group inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
              >
                Start a migration
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <span className="font-mono text-xs text-slate-500 dark:text-frost-600">portad jobs list</span>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
        {APPEARS.map((item, i) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={0.15 + i * 0.08}>
              <div className="glass h-full rounded-2xl p-5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-400/25">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3.5 text-sm font-semibold text-slate-900 dark:text-frost-100">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-frost-500">{item.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs text-slate-500 dark:text-frost-600">
        Job records will live in Firestore with Postgres as the orchestration store on
        Railway; both light up with the hosted worker.
      </p>
    </Section>
  );
}
