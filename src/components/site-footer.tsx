import Link from "next/link";

import ApiStatus from "@/components/api-status";
import { LogoTile, Wordmark } from "@/components/logo";
import { API_URL, GITHUB_URL } from "@/lib/config";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "New migration", href: "/migrate" },
      { label: "Jobs", href: "/jobs" },
      { label: "Compatibility", href: "/compatibility" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub", href: GITHUB_URL },
      { label: "API health", href: `${API_URL}/healthz` },
      { label: "Account", href: "/account" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-white/8 bg-space-950">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"
      />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoTile size={40} />
            <Wordmark className="text-lg" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-frost-500">
            The open way to move your data — local-first, resumable, and verifiable
            SaaS workspace migrations.
          </p>
          <div className="mt-5">
            <ApiStatus compact />
          </div>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-frost-600">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {column.links.map((link) =>
                link.href.startsWith("http") ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-frost-400 transition-colors hover:text-frost-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-frost-400 transition-colors hover:text-frost-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-frost-600 sm:flex-row sm:items-center sm:px-6">
          <p>© 2026 VishMuKa TechWorks Private Limited · MIT licensed</p>
          <p className="flex items-center gap-3">
            <Link href="/migrate" className="transition-colors hover:text-frost-300">
              Start a migration
            </Link>
            <span aria-hidden className="text-frost-600/50">
              ·
            </span>
            <span>built for portability, not lock-in</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
