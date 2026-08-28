import Link from "next/link";
import { PageStatus } from "@/components/ui/page-status";

/**
 * Root not-found boundary for `notFound()` calls and unknown URLs.
 */
export default function NotFound() {
  return (
    <PageStatus
      title="We can't find that page"
      message="The course or lesson you are looking for does not exist or may have moved."
    >
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D8653F] hover:bg-[#C25430] text-white font-sans font-medium text-[14px] shadow-sm transition-colors"
      >
        Browse courses
      </Link>
    </PageStatus>
  );
}
