import { Suspense } from "react";
import type { Metadata } from "next";
import { searchContent } from "@/lib/search-service";
import { SearchResultsView } from "@/components/search/search-results-view";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    query?: string;
    sort?: "relevance" | "newest" | "duration";
  }>;
}

export async function generateMetadata(props: SearchPageProps): Promise<Metadata> {
  const params = await props.searchParams;
  const q = params.q || params.query || "";
  return {
    title: q ? `Search: "${q}" | Vertex` : "Search Learning | Vertex",
    description: "Search courses, lessons, and video moments in plain English on Vertex.",
  };
}

async function SearchPageContent({ searchParams }: { searchParams: SearchPageProps["searchParams"] }) {
  const params = await searchParams;
  const query = params.q || params.query || "";
  const sort = params.sort || "relevance";

  const initialData = query ? await searchContent(query, sort) : undefined;

  return (
    <SearchResultsView
      key={`${query}-${sort}`}
      initialQuery={query}
      initialSort={sort}
      initialData={initialData}
    />
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#EA580C] border-t-transparent animate-spin" />
        </div>
      }
    >
      <SearchPageContent searchParams={searchParams} />
    </Suspense>
  );
}
