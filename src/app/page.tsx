import Link from "next/link";

import Accordion from "@/components/accordion";
import ApiStatus from "@/components/api-status";
import Carousel from "@/components/carousel";
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
        className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/15 text-emerald-300"
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
        className="grid h-6 w-6 place-items-center rounded-full bg-amber-400/15 text-amber-300 text-xs font-bold"
      >
        ~
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label="No"
      className="grid h-6 w-6 place-items-center rounded-full bg-white/6 text-frost-600"
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
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/8">
        <div aria-hidden className="grid-bg absolute inset-0" />
        <div
          aria-hidden
          className="animate-drift absolute -top-32 left-1/4 h-[480px] w-[560px] rounded-full bg-brand-600/25 blur-[130px]"
        />
        <div
          aria-hidden
          className="animate-drift absolute -right-20 top-40 h-[380px] w-[420px] rounded-full bg-ice-400/15 blur-[120px]"
        />

        <Section className="relative py-24 sm:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Reveal>
                <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-frost-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-400 to-ice-400" />
                  Local-first data portability · v0.1
                </span>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-gradient-soft sm:text-6xl lg:text-7xl">
                  Move your workspace.
                  <br />
                  <span className="text-gradient-brand">Keep the truth.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-lg leading-8 text-frost-400">
                  PortaD exports a SaaS workspace into a neutral, checksummed package,
                  reports exactly what will survive the trip, and imports it into the
                  target system — with a diff at the end that proves nothing was invented.
                </p>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/migrate"
                    className="btn-gradient group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all"
                  >
                    Start a migration
                    <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/compatibility"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-frost-200 transition hover:border-white/35 hover:text-white"
                  >
                    See what moves
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.32}>
                <div className="mt-8">
                  <ApiStatus />
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2} className="flex justify-center lg:justify-end">
              <div className="animate-floaty">
                <HeroVisual />
              </div>
            </Reveal>
          </div>
        </Section>
      </div>

      {/* ── Marquee ─────────────────────────────────────────── */}
      <div className="border-b border-white/8 bg-space-950/60 py-10">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.24em] text-frost-600">
          Adapters being built for the tools you already use
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
      <div className="border-y border-white/8 bg-space-950/60">
        <Section id="features">
          <SectionHeading
            eyebrow="Principles"
            title="Built so you can trust the result"
            sub="Portability is only useful if the output is provable. These are the guarantees baked into every run."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={i * 0.08}>
                  <div className="glass group relative h-full overflow-hidden rounded-2xl p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-400/40">
                    <div
                      aria-hidden
                      className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/0 blur-2xl transition group-hover:bg-brand-500/20"
                    />
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/25 to-ice-400/10 text-brand-300 ring-1 ring-brand-400/30">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-frost-50">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-frost-400">{feature.body}</p>
                  </div>
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
                <div
                  key={category.title}
                  className="glass w-[280px] shrink-0 snap-start rounded-2xl p-6 transition duration-300 hover:border-brand-400/40 sm:w-[320px]"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-brand-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-semibold text-frost-50">{category.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-frost-400">{category.body}</p>
                  <span className="mt-4 inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 font-mono text-[11px] tracking-wider text-emerald-300">
                    {category.fidelity}
                  </span>
                </div>
              );
            })}
          </Carousel>
        </div>
      </Section>

      {/* ── CLI + terminal ──────────────────────────────────── */}
      <div className="border-y border-white/8 bg-space-950/60">
        <Section id="cli">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
                From your terminal
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gradient-soft sm:text-4xl">
                The hosted UI mirrors
                <br />
                the CLI, exactly.
              </h2>
              <p className="mt-4 max-w-lg leading-7 text-frost-400">
                Every button in this dashboard maps to a command you can run yourself.
                No black boxes: script it, audit it, pin it in CI. Hosted execution —
                upload a package, we run the pipeline — arrives with the hosted plane.
              </p>
              <ul className="mt-7 space-y-3 text-sm text-frost-300">
                {[
                  "One binary, zero daemons on your machine",
                  "Exit codes and JSON reports for automation",
                  "The same checksums, wherever it runs",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-300">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} className="h-3 w-3">
                        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs text-frost-400">
                <IconTerminal className="h-4 w-4 text-brand-400" />
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
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left">
                  <th className="rounded-l-2xl border-b border-white/10 px-5 py-4 font-medium text-frost-500">
                    Capability
                  </th>
                  <th className="border-b border-white/10 bg-brand-500/10 px-5 py-4 text-center font-semibold text-brand-300">
                    PortaD
                  </th>
                  <th className="border-b border-white/10 px-5 py-4 text-center font-medium text-frost-500">
                    Manual copy
                  </th>
                  <th className="rounded-r-2xl border-b border-white/10 px-5 py-4 text-center font-medium text-frost-500">
                    Vendor export
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.row} className="group">
                    <td className="border-b border-white/6 px-5 py-4 text-frost-300 transition group-hover:text-frost-50">
                      {row.row}
                    </td>
                    <td className="border-b border-white/6 bg-brand-500/[0.07] px-5 py-4 text-center transition group-hover:bg-brand-500/15">
                      <span className="inline-flex justify-center">
                        <Cell value={row.portad} />
                      </span>
                    </td>
                    <td className="border-b border-white/6 px-5 py-4 text-center">
                      <span className="inline-flex justify-center">
                        <Cell value={row.manual} />
                      </span>
                    </td>
                    <td className="border-b border-white/6 px-5 py-4 text-center">
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
          <div className="relative overflow-hidden rounded-3xl border border-brand-400/25 bg-gradient-to-br from-brand-600/20 via-space-850 to-ice-500/10 p-8 sm:p-12">
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl"
            />
            <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-brand-200 ring-1 ring-white/15">
                  <IconFingerprint className="h-6 w-6" />
                </span>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Your data never moves
                  <br />
                  without you saying so.
                </h2>
                <p className="mt-4 max-w-lg leading-7 text-frost-300">
                  The package format, the checksums and the diff report are designed so
                  you can hand them to a security team and they can hand them back with
                  questions — not shrugs.
                </p>
              </div>
              <ul className="space-y-4 self-center">
                {[
                  { icon: IconLock, text: "Local-first: nothing uploads unless you choose the hosted plane" },
                  { icon: IconShield, text: "SHA-256 checksums on every file, verified on both ends" },
                  { icon: IconUpload, text: "Explicit, per-run package upload — no background sync, ever" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.text}
                      className="glass flex items-start gap-3.5 rounded-2xl p-4"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-200">
                        <Icon className="h-4.5 w-4.5" />
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
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-space-850 px-8 py-16 text-center sm:px-12">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_-20%,rgba(22,104,255,0.35),transparent_70%)]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-gradient-soft sm:text-4xl">
                The open way to move your data
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-frost-400">
                Start with the fixtures demo — no accounts, no credentials, the whole
                pipeline in under a minute.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/migrate"
                  className="btn-gradient group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all"
                >
                  Start a migration
                  <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-frost-200 transition hover:border-white/35 hover:text-white"
                >
                  View jobs
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
