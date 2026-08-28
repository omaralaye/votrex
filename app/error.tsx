"use client";

import { useEffect } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { PageStatus } from "@/components/ui/page-status";

/**
 * Root error boundary. It catches a render or data failure in any route so the
 * learner sees a retry action instead of a page collapsed to just the navbar.
 * It also reports the failure to PostHog so we do not need a session recording
 * to notice it.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // captureException fills the Error Tracking gap; the named event lets us
    // chart render failures next to lesson_viewed without a recording.
    posthog.captureException(error);
    posthog.capture("route_render_failed", { pathname: window.location.pathname });
  }, [error]);

  return (
    <PageStatus
      title="This page failed to load"
      message="Something broke while we loaded this page. Your progress is safe. Try again, or go back to your courses."
    >
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D8653F] hover:bg-[#C25430] text-white font-sans font-medium text-[14px] shadow-sm transition-colors cursor-pointer"
      >
        Try again
      </button>
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-sans font-medium text-[14px] shadow-sm transition-colors"
      >
        Back to courses
      </Link>
    </PageStatus>
  );
}
