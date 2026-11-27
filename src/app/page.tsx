import Link from "next/link";

import Accordion from "@/components/accordion";
import ApiStatus from "@/components/api-status";
import Carousel from "@/components/carousel";
import HeroRibbon from "@/components/hero-ribbon";
import HeroVisual from "@/components/hero-visual";
import {
  IconArrowRight,
  IconBadgeCheck,
  IconBook,
  IconBlocks,
  IconCheckSquare,
  IconComment,
  IconDoc,
  IconFileStack,
  IconFingerprint,
  IconLock,
  IconShield,
  IconTable,
  IconTerminal,
  IconTicket,
  IconUpload,
  IconUsers,
} from "@/components/icons";
import { Section, SectionHeading } from "@/components/section";
import Marquee from "@/components/marquee";
import Process from "@/components/process";
import Reveal from "@/components/reveal";
import Terminal from "@/components/terminal";
import TiltCard from "@/components/tilt-card";

const FEATURES = [
  {
    title: "Local-first",
    body: "Your data leaves the machine only when you say so. The .portad package is fully usable without any PortaD service.",
    icon: IconLock,
  },
  {
    title: "Resumable",
    body: "Interrupted migrations continue from checkpoints — verified downloads and written files are reused, never redone.",
    icon: IconShield,
  },
  {
    title: "Verifiable",
    body: "Five validation layers, checksums, and a round-trip diff prove what migrated, what changed, and what cannot be carried.",
    icon: IconBadgeCheck,
  },
  {
    title: "Extensible",
    body: "A small adapter SDK with entry-point discovery, stable errors, and a fixtures framework for contributors.",
    icon: IconBlocks,
  },
];

const CATEGORIES = [
  { title: "Documents", body: "Pages, blocks, nested content and attachments", icon: IconDoc, fidelity: "PRESERVED" },
  { title: "Databases", body: "Rows, relations, views and schema metadata", icon: IconTable, fidelity: "PRESERVED" },
  { title: "Tasks", body: "Issues, statuses, assignees, due dates", icon: IconCheckSquare, fidelity: "TRANSFORMED" },
  { title: "Files", body: "Uploads with checksums and original names", icon: IconFileStack, fidelity: "PRESERVED" },
  { title: "People", body: "Members, roles and workspace permissions", icon: IconUsers, fidelity: "TRANSFORMED" },
  { title: "Comments", body: "Threads, replies, mentions and reactions", icon: IconComment, fidelity: "PRESERVED" },
  { title: "Wikis", body: "Knowledge bases with full link structure", icon: IconBook, fidelity: "PRESERVED" },
  { title: "Issues", body: "Boards, sprints and custom fields", icon: IconTicket, fidelity: "TRANSFORMED" },
];

const COMPARISON: {
  row: string;
  portad: boolean;
  manual: boolean;
  vendor: boolean | "partial";
}[] = [
  { row: "Field-level fidelity report", portad: true, manual: false, vendor: "partial" },
  { row: "Round-trip diff that proves the result", portad: true, manual: false, vendor: false },
  { row: "Resumes after interruption", portad: true, manual: false, vendor: false },
  { row: "Works offline on your machine", portad: true, manual: true, vendor: false },
  { row: "No vendor lock-in — open package format", portad: true, manual: true, vendor: false },
];

const FAQ = [
  {
    q: "Where does my data go?",
    a: "By default, nowhere. Export, validate, transform and import all run on your machine against a local .portad package. The hosted plane only ever sees a package you explicitly upload — and that feature isn't enabled yet.",
  },
  {
    q: "What is inside a .portad package?",
    a: "A neutral JSON payload for every record type, the original attachments, a manifest with per-file checksums, and a report of every mapping decision. It is a plain archive you can inspect with any unzip tool.",
  },
  {
    q: "What happens if a migration is interrupted?",
    a: "Nothing is lost. Completed downloads and written files are checksummed and reused, so the run continues from its last checkpoint instead of starting over.",
  },
  {
    q: "Which platforms are supported today?",
    a: "Notion export and Huly import are supported now, plus a fixtures demo workspace that needs no account. Trello, ClickUp and Asana are next on the roadmap — see the compatibility matrix for details.",
  },
  {
    q: "How do I know nothing was invented or lost?",
    a: "Every migration ends with a round-trip diff: source vs. target, field by field, with PRESERVED / TRANSFORMED / UNSUPPORTED / FAILED per field. If something can't move, the report says so before you delete anything.",
  },
];


function Cell({ value }: { value: boolean | "partial" }) {
  if (value === true) {
    return (
      <span
        role="img"
        aria-label="Yes"
        className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          aria-hidden="true"
          className="h-3.5 w-3.5"
        >
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (value === "partial") {
    return (
      <span
        role="img"
        aria-label="Partial support"
        className="grid h-6 w-6 place-items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300 text-xs font-bold"
      >
        ~
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label="No"
      className="grid h-6 w-6 place-items-center rounded-full bg-white/6 text-frost-300"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        aria-hidden="true"
        className="h-3 w-3"
      >
        <path d="M6 12h12" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      {/* ── Global Slow-Motion 3D Aurora / Ribbon Canvas across entire page ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#f6f3ff] via-[#f4f7fc] to-[#ecfeff] dark:from-[#060607] dark:via-[#070709] dark:to-[#060607]"
      >
        <div
          className="animate-aurora-3d-one absolute -left-1/4 -top-1/4 h-[85vh] w-[140vw] rounded-[100%] opacity-50 blur-[80px] dark:opacity-80"
          style={{
            background:
              "conic-gradient(from 210deg at 45% 55%, rgba(6,6,7,0) 0deg, rgba(168,85,247,0.45) 55deg, rgba(236,72,153,0.5) 115deg, rgba(8,207,254,0.45) 170deg, rgba(6,6,7,0) 240deg)",
          }}
        />
        <div
          className="animate-aurora-3d-two absolute -bottom-1/3 -right-1/4 h-[80vh] w-[120vw] rounded-[100%] opacity-35 blur-[90px] dark:opacity-55"
          style={{
            background:
              "radial-gradient(ellipse at 60% 50%, rgba(8,207,254,0.38), rgba(168,85,247,0.28) 45%, transparent 72%)",
          }}
        />
        <div className="grid-bg absolute inset-0 opacity-60" />
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative border-b border-slate-200/70 text-slate-900 dark:border-white/10 dark:text-white">
        <HeroRibbon />

        <Section className="relative py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Reveal delay={0.05} y={18}>
                <h1 className="text-4xl font-bold leading-[1.06] tracking-tight text-slate-950 sm:text-6xl lg:text-[68px] dark:text-white">
                  Move your
                  <br />
                  workspace.
                  <br />
                  <span className="text-sky-600 dark:text-[#08CFFE]">Keep the truth.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.18} y={16}>
                <p className="mt-6 max-w-xl text-base leading-7 text-slate-700 sm:text-lg dark:text-[#D6D7E6]">
                  Export any SaaS workspace into a checksummed .portad package,
                  verify every field against your rules, and import into the target
                  system with round-trip proof.
                </p>
              </Reveal>

              <Reveal delay={0.28} y={14}>
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/migrate"
                    className="btn-primary group inline-flex items-center gap-2.5 rounded-full py-2.5 pl-5 pr-2.5 text-sm font-semibold"
                  >
                    <span>Start a migration</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#08CFFE] text-slate-950 transition-transform duration-300 group-hover:rotate-45 dark:bg-[#060607] dark:text-white">
                      <IconArrowRight className="h-3.5 w-3.5 -rotate-45" />
                    </span>
                  </Link>
                  <Link
                    href="/compatibility"
                    className="btn-glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                  >
                    See what moves
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.36} y={12}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-600 dark:text-[rgba(232,226,250,0.74)]">
                    <span className="h-2 w-2 rounded-full border border-sky-600 dark:border-[#08CFFE]" />
                    Local-first · SHA-256 verified · v0.1
                  </span>
                  <ApiStatus />
                </div>
              </Reveal>
            </div>

            <div className="flex justify-center lg:justify-end">
              <HeroVisual />
            </div>
          </div>
        </Section>
      </div>

      {/* ── Marquee ─────────────────────────────────────────── */}
      <div className="border-b border-slate-200/70 bg-white/40 py-10 backdrop-blur-md dark:border-white/8 dark:bg-white/[0.02]">
        <p className="mb-6 text-center text-xs font-medium text-frost-400">
          Adapters built for the tools you already use
        </p>
        <Marquee />
      </div>

      {/* ── Process ─────────────────────────────────────────── */}
      <Section id="process">
        <SectionHeading
          eyebrow="How it works"
          title="Six stages, every one auditable"
          sub="The same pipeline whether you run it from the terminal today or from the hosted plane tomorrow."
        />
        <div className="mt-14">
          <Process />
        </div>
      </Section>

      {/* ── Features ────────────────────────────────────────── */}
      <div className="border-y border-slate-200/70 bg-white/35 backdrop-blur-md dark:border-white/8 dark:bg-white/[0.02]">
        <Section id="features">
          <SectionHeading
            eyebrow="Principles"
            title="Built so you can trust the result"
            sub="Portability is only useful if the output is provable. These are the guarantees baked into every run."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              const iconTones = [
                "border-orange-500/30 bg-orange-500/12 text-orange-600 dark:text-orange-400",
                "border-emerald-500/30 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
                "border-indigo-500/30 bg-indigo-500/12 text-indigo-600 dark:text-indigo-400",
                "border-teal-500/30 bg-teal-500/12 text-teal-600 dark:text-teal-400",
              ];
              return (
                <Reveal key={feature.title} delay={i * 0.06}>
                  <TiltCard className="glass group relative h-full rounded-2xl p-6 transition-colors hover:border-orange-500/40">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl border ${iconTones[i % iconTones.length]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-medium text-slate-900 dark:text-frost-50">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-frost-400">{feature.body}</p>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </Section>
      </div>

      {/* ── Category carousel ───────────────────────────────── */}
      <Section id="categories">
        <SectionHeading
          eyebrow="Coverage"
          title="Everything a workspace is made of"
          sub="Drag through the record types the pipeline understands — each one carries a field-level fidelity status through the whole trip."
        />
        <div className="mt-12">
          <Carousel label="Record categories PortaD moves">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <TiltCard
                  key={category.title}
                  className="glass w-[260px] shrink-0 snap-start rounded-2xl p-5 sm:p-6 transition-colors hover:border-orange-500/40 sm:w-[320px]"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-semibold text-slate-900 dark:text-frost-50">{category.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-frost-400">{category.body}</p>
                  <span
                    className={`mt-4 inline-flex rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium ${
                      category.fidelity === "PRESERVED"
                        ? "border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                        : "border-indigo-500/35 bg-indigo-500/12 text-indigo-700 dark:text-indigo-300"
                    }`}
                  >
                    {category.fidelity === "PRESERVED" ? "Preserved" : "Transformed"}
                  </span>
                </TiltCard>
              );
            })}
          </Carousel>
        </div>
      </Section>

      {/* ── CLI + terminal ──────────────────────────────────── */}
      <div className="border-y border-slate-200/70 bg-white/35 backdrop-blur-md dark:border-white/8 dark:bg-white/[0.02]">
        <Section id="cli">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="font-mono text-xs font-medium text-brand-600 dark:text-brand-400">
                From your terminal
              </p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-frost-100 sm:text-4xl">
                The hosted UI mirrors
                <br />
                the CLI, exactly
              </h2>
              <p className="mt-4 max-w-lg leading-7 text-slate-600 dark:text-frost-400">
                Every button in this dashboard maps to a command you can run yourself.
                No black boxes: script it, audit it, pin it in CI. Hosted execution —
                upload a package, we run the pipeline — arrives with the hosted plane.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-slate-700 dark:text-frost-300">
                {[
                  "One binary, zero daemons on your machine",
                  "Exit codes and JSON reports for automation",
                  "The same checksums, wherever it runs",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} className="h-3 w-3">
                        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 font-mono text-xs text-slate-700 shadow-xs dark:border-white/10 dark:bg-white/[0.04] dark:text-frost-400 dark:shadow-none">
                <IconTerminal className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                curl -fsSL portad.dev | sh
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <Terminal />
            </Reveal>
          </div>
        </Section>
      </div>

      {/* ── Comparison ──────────────────────────────────────── */}
      <Section id="compare">
        <SectionHeading
          eyebrow="Comparison"
          title="Why not just export and retype?"
          sub="Vendor exports lose relationships. Copy-paste loses weekends. PortaD is the third option."
        />
        <Reveal delay={0.1}>
          <div className="mt-12 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left">
                  <th className="rounded-l-2xl border-b border-slate-200 px-5 py-4 font-medium text-slate-500 dark:border-white/10 dark:text-frost-500">
                    Capability
                  </th>
                  <th className="border-b border-slate-200 bg-brand-500/10 px-5 py-4 text-center font-semibold text-brand-700 dark:border-white/10 dark:text-brand-300">
                    PortaD
                  </th>
                  <th className="border-b border-slate-200 px-5 py-4 text-center font-medium text-slate-500 dark:border-white/10 dark:text-frost-500">
                    Manual copy
                  </th>
                  <th className="rounded-r-2xl border-b border-slate-200 px-5 py-4 text-center font-medium text-slate-500 dark:border-white/10 dark:text-frost-500">
                    Vendor export
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.row} className="group">
                    <td className="border-b border-slate-200/80 px-5 py-4 text-slate-700 transition group-hover:text-slate-900 dark:border-white/6 dark:text-frost-300 dark:group-hover:text-frost-50">
                      {row.row}
                    </td>
                    <td className="border-b border-slate-200/80 bg-brand-500/[0.05] px-5 py-4 text-center transition group-hover:bg-brand-500/10 dark:border-white/6 dark:bg-brand-500/[0.07] dark:group-hover:bg-brand-500/15">
                      <span className="inline-flex justify-center">
                        <Cell value={row.portad} />
                      </span>
                    </td>
                    <td className="border-b border-slate-200/80 px-5 py-4 text-center dark:border-white/6">
                      <span className="inline-flex justify-center">
                        <Cell value={row.manual} />
                      </span>
                    </td>
                    <td className="border-b border-slate-200/80 px-5 py-4 text-center dark:border-white/6">
                      <span className="inline-flex justify-center">
                        <Cell value={row.vendor} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      {/* ── Security band ───────────────────────────────────── */}
      <Section id="security" className="pb-4!">
        <Reveal>
          <div className="glass-strong hairline relative overflow-hidden rounded-2xl p-8 sm:p-12">
            <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-brand-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-brand-400">
                  <IconFingerprint className="h-5 w-5" />
                </span>
                <h2 className="mt-6 text-3xl font-medium tracking-tight text-frost-100 sm:text-4xl">
                  Your data never moves
                  <br />
                  without you saying so
                </h2>
                <p className="mt-4 max-w-lg leading-7 text-frost-400">
                  The package format, the checksums and the diff report are designed so
                  you can hand them to a security team and they can hand them back with
                  questions — not shrugs.
                </p>
              </div>
              <ul className="space-y-3 self-center">
                {[
                  { icon: IconLock, text: "Local-first: nothing uploads unless you choose the hosted plane" },
                  { icon: IconShield, text: "SHA-256 checksums on every file, verified on both ends" },
                  { icon: IconUpload, text: "Explicit, per-run package upload — no background sync, ever" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.text}
                      className="flex items-start gap-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-white/8 dark:bg-white/[0.03]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-brand-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-brand-400">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm leading-6 text-frost-200">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <Section id="faq">
        <SectionHeading
          eyebrow="FAQ"
          title="Straight answers"
        />
        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 max-w-3xl">
            <Accordion items={FAQ} />
          </div>
        </Reveal>
      </Section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <Section id="cta" className="pt-4!">
        <Reveal>
          <div className="glass-strong hairline relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-12">
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-medium tracking-tight text-frost-100 sm:text-4xl">
                The open way to move your data
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-frost-400">
                Start with the fixtures demo — no accounts, no credentials, the whole
                pipeline in under a minute.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/migrate"
                  className="btn-primary group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                >
                  Start a migration
                  <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/jobs"
                  className="btn-glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                >
                  View jobs
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
