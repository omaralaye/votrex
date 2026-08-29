import { BoundaryShell } from "@/components/ui/page-status";

/**
 * Root loading boundary. It shows while a route awaits its data so a slow fetch
 * reads as loading, not as a broken page.
 */
export default function Loading() {
  return (
    <BoundaryShell>
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-4">
        <span className="h-9 w-9 rounded-full border-2 border-[#E2E8F0] border-t-[#D8653F] animate-spin" />
        <span className="font-sans text-[14px] text-[#64748B]">Loading…</span>
      </div>
    </BoundaryShell>
  );
}
