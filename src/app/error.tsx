"use client";

import Link from "next/link";
import { useEffect } from "react";
import { IconRefresh } from "@/components/icons";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected runtime errors to telemetry/console securely
    console.error("Dashboard caught unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <div
        role="alert"
        aria-live="assertive"
        className="glass w-full rounded-3xl border border-red-200/80 p-8 shadow-sm dark:border-red-500/20 sm:p-10"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <span className="text-2xl font-bold" aria-hidden="true">
            !
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 dark:text-frost-50 sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-frost-400">
          An unexpected error interrupted this page. Your migration progress was preserved where possible.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-xs text-slate-400 dark:text-frost-600">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:bg-brand-500 dark:hover:bg-brand-400"
          >
            <IconRefresh className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:border-white/12 dark:bg-transparent dark:text-frost-300 dark:hover:bg-white/[0.04] dark:hover:text-frost-100"
          >
            Back to overview
          </Link>
        </div>
      </div>
    </div>
  );
}
