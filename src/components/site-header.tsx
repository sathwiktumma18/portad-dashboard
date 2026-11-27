"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconClose, IconMenu } from "@/components/icons";
import { LogoTile, Wordmark } from "@/components/logo";
import ThemeToggle from "@/components/theme-toggle";
import { signOut, useAuth } from "@/lib/auth";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/migrate", label: "Migrate" },
  { href: "/jobs", label: "Jobs" },
  { href: "/compatibility", label: "Compatibility" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { ready, session } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Reset mobile menu if pathname changed
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Close on Escape key press for keyboard accessibility
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-colors duration-200 dark:border-white/8 dark:bg-space-900/95">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70"
          onClick={() => setMobileOpen(false)}
        >
          <LogoTile size={34} />
          <Wordmark />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border border-slate-200/90 bg-slate-100/70 p-1 text-sm transition-colors md:flex dark:border-white/8 dark:bg-white/[0.03]"
        >
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  "rounded-full px-3.5 py-1.5 transition-colors " +
                  (active
                    ? "bg-white font-semibold text-brand-600 shadow-xs dark:bg-white/10 dark:text-white dark:shadow-sm"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-frost-400 dark:hover:bg-transparent dark:hover:text-frost-100")
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {!ready ? (
            <span
              aria-hidden
              className="h-7 w-16 animate-pulse rounded-full border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/[0.04]"
            />
          ) : session ? (
            <>
              <Link
                href="/account"
                title={session.email}
                className="hidden max-w-[13rem] truncate rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 text-xs text-slate-700 transition hover:border-slate-300 hover:text-slate-900 sm:block dark:border-white/10 dark:bg-transparent dark:text-frost-400 dark:hover:border-white/25 dark:hover:text-frost-100"
              >
                {session.email}
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/12 dark:bg-transparent dark:text-frost-200 dark:shadow-none dark:hover:border-white/30 dark:hover:bg-transparent dark:hover:text-frost-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/account"
              className="btn-primary rounded-lg px-4 py-1.5 text-xs font-medium"
            >
              Sign in
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 dark:border-white/12 dark:bg-white/[0.04] dark:text-frost-300 dark:shadow-none dark:hover:border-white/30 dark:hover:bg-white/[0.08] dark:hover:text-white"
          >
            {mobileOpen ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white/95 px-4 pb-6 pt-3 shadow-lg backdrop-blur-2xl md:hidden dark:border-white/8 dark:bg-space-950/95 dark:shadow-none"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1.5">
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition " +
                    (active
                      ? "bg-brand-50 font-semibold text-brand-700 shadow-xs dark:bg-white/10 dark:text-white dark:shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-frost-300 dark:hover:bg-white/[0.05] dark:hover:text-white")
                  }
                >
                  <span>{link.label}</span>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  )}
                </Link>
              );
            })}

            {session && (
              <div className="mt-2 border-t border-slate-200 pt-3 dark:border-white/8">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-frost-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
                >
                  <span>Signed in as</span>
                  <span className="max-w-[14rem] truncate font-mono text-slate-800 dark:text-frost-200">
                    {session.email}
                  </span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}