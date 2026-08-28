"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";
import { SearchIcon, ArrowRightIcon } from "@/components/icons";
import { LessonVideoCard } from "@/components/cards/lesson-video-card";
import { LessonTopicCard } from "@/components/cards/lesson-topic-card";
import { SearchResponse } from "@/lib/search-service";
import posthog from "posthog-js";

interface SearchResultsViewProps {
  initialQuery?: string;
  initialSort?: "relevance" | "newest" | "duration";
  initialData?: SearchResponse;
}

export function SearchResultsView({
  initialQuery = "",
  initialSort = "relevance",
  initialData,
}: SearchResultsViewProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<"relevance" | "newest" | "duration">(initialSort);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [data, setData] = useState<SearchResponse>(
    initialData || {
      query: initialQuery,
      totalResults: 0,
      coursesCount: 0,
      results: [],
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const performSearch = async (searchTerm: string, sortOrder: "relevance" | "newest" | "duration") => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setData({
        query: "",
        totalResults: 0,
        coursesCount: 0,
        results: [],
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&sort=${sortOrder}`);
      if (res.ok) {
        const result: SearchResponse = await res.json();
        setData(result);
        posthog.capture("search_performed", {
          query: trimmed,
          results_count: result.totalResults,
          courses_count: result.coursesCount,
          sort: sortOrder,
        });
      }
    } catch (err) {
      console.error("Search fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}&sort=${sort}`);
      performSearch(trimmed, sort);
    }
  };

  const handleSortChange = (newSort: "relevance" | "newest" | "duration") => {
    setSort(newSort);
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}&sort=${newSort}`);
      performSearch(trimmed, newSort);
      posthog.capture("search_sort_changed", {
        query: trimmed,
        sort: newSort,
      });
    }
  };

  const results = data?.results || [];
  const totalCount = data?.totalResults || 0;
  const coursesCount = data?.coursesCount || 0;

  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F6] text-[#0F172A] flex flex-col justify-between overflow-x-hidden selection:bg-[#FED7AA] selection:text-[#9A3412]">
      {/* Subtle diagonal pinstripe texture pattern across background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[repeating-linear-gradient(45deg,#0F172A_0,#0F172A_1px,transparent_0,transparent_9px)]"
      />

      <div className="relative z-10 w-full flex-1 flex flex-col">
        {/* Navigation Bar */}
        <Navbar activeRoute="courses" />

        {/* Main Content */}
        <main className="w-full max-w-[960px] mx-auto px-5 sm:px-8 lg:px-10 pt-8 sm:pt-12 pb-16">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA]/70 shadow-[0_1px_2px_rgba(249,115,22,0.06)] mb-5 sm:mb-6">
              <span className="font-sans font-semibold text-[11px] sm:text-[12px] tracking-[0.14em] text-[#EA580C] uppercase">
                SEARCH RESULTS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-[36px] sm:text-[46px] md:text-[52px] leading-[1.15] tracking-[-0.015em] text-[#0F172A] font-normal max-w-2xl">
              {query.trim() ? (
                <>
                  Results for <span className="text-[#EA580C] font-serif font-normal">“{query.trim()}”</span>
                </>
              ) : (
                "Search your learning"
              )}
            </h1>

            {/* Sub-headline */}
            <p className="font-sans text-[14px] sm:text-[16px] text-[#64748B] mt-3 sm:mt-4 mb-8 font-normal">
              {query.trim()
                ? `Found ${totalCount} ${totalCount === 1 ? "result" : "results"} across ${coursesCount} ${coursesCount === 1 ? "course" : "courses"}`
                : "Type keywords or topics to find exact lessons and video moments across all courses."}
            </p>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-[680px] mb-10 sm:mb-12">
              <div
                className={`relative flex items-center justify-between w-full bg-white rounded-2xl border px-4 sm:px-5 py-3 sm:py-3.5 transition-all duration-200 shadow-[0_2px_12px_rgba(15,23,42,0.04)] ${
                  isSearchFocused
                    ? "border-[#F97316] ring-4 ring-[#FED7AA]/40 shadow-[0_4px_20px_rgba(249,115,22,0.12)]"
                    : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 mr-3">
                  <SearchIcon
                    size={20}
                    className={`transition-colors shrink-0 ${
                      isSearchFocused ? "text-[#F97316]" : "text-[#94A3B8]"
                    }`}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search by topic, keyword, or concept (e.g. 'data fetching', 'Docker')..."
                    className="w-full bg-transparent border-none outline-none font-sans text-[15px] sm:text-[16px] text-[#0F172A] placeholder:text-[#94A3B8] tracking-[-0.01em]"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {query ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setData({
                          query: "",
                          totalResults: 0,
                          coursesCount: 0,
                          results: [],
                        });
                        router.push("/search");
                        searchInputRef.current?.focus();
                      }}
                      className="px-2 py-1 text-[12px] font-sans text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                    >
                      Clear
                    </button>
                  ) : (
                    <kbd className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] font-sans text-[#64748B] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                      ⌘ K
                    </kbd>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Results Header: Count & Sort Controls */}
          {query.trim() && (
            <div className="flex items-center justify-between mb-6 pb-2">
              <div className="font-sans font-medium text-[15px] sm:text-[16px] text-[#0F172A]">
                {totalCount} {totalCount === 1 ? "result" : "results"}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value as "relevance" | "newest" | "duration")}
                    className="appearance-none bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl px-4 py-2 pr-9 font-sans text-[13px] sm:text-[13.5px] font-medium text-[#334155] shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="newest">Newest</option>
                    <option value="duration">Duration</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#64748B]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="w-full flex items-center justify-center py-12">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-sm text-[#64748B]">
                <div className="w-4 h-4 rounded-full border-2 border-[#EA580C] border-t-transparent animate-spin" />
                <span>Searching courses & video transcripts...</span>
              </div>
            </div>
          )}

          {/* Results List */}
          {!isLoading && results.length > 0 && (
            <div className="space-y-4 sm:space-y-5">
              {results.map((item) => {
                const lessonUrl = `/courses/${item.courseSlug}/${item.lessonSlug}${
                  item.type === "video" && item.startSeconds !== undefined ? `?t=${item.startSeconds}` : ""
                }`;

                const handleResultClick = () => {
                  posthog.capture("search_result_clicked", {
                    query: query.trim(),
                    result_id: item.id,
                    result_type: item.type,
                    result_title: item.title,
                    course_slug: item.courseSlug,
                    lesson_slug: item.lessonSlug,
                    start_seconds: item.startSeconds,
                  });
                };

                if (item.type === "video") {
                  return (
                    <LessonVideoCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      courseTitle={item.courseTitle}
                      courseIconIdentifier={item.courseIconIdentifier}
                      moduleLabel={item.moduleLabel}
                      moduleTitle={item.moduleTitle}
                      lessonLabel={item.lessonLabel}
                      duration={item.duration}
                      timestamp={item.timestampFormatted || "00:00"}
                      startSeconds={item.startSeconds}
                      thumbnailUrl={item.thumbnailUrl}
                      href={lessonUrl}
                      onWatch={handleResultClick}
                    />
                  );
                }

                return (
                  <LessonTopicCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    courseTitle={item.courseTitle}
                    courseIconIdentifier={item.courseIconIdentifier}
                    moduleLabel={item.moduleLabel}
                    moduleTitle={item.moduleTitle}
                    lessonLabel={item.lessonLabel}
                    keyPoints={item.keyPoints}
                    href={lessonUrl}
                    onViewLesson={handleResultClick}
                  />
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && query.trim() && results.length === 0 && (
            <div className="text-center py-16 px-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] text-[#EA580C] mx-auto flex items-center justify-center mb-4">
                <SearchIcon size={26} />
              </div>
              <h3 className="font-serif font-semibold text-[20px] text-[#0F172A] mb-2">
                No matching results found
              </h3>
              <p className="font-sans text-[14.5px] text-[#64748B] max-w-md mx-auto mb-6">
                We couldn&apos;t find any lessons or video moments matching &quot;{query}&quot;. Try checking for typos or searching with broader keywords.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-medium text-[14px] transition-colors"
              >
                <span>Browse all courses</span>
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          )}

          {/* Bottom Discovery Banner */}
          <div className="bg-[#FFF7ED]/70 border border-[#FED7AA]/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 sm:mt-16">
            <div className="flex items-center gap-4 text-left">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 shadow-xs">
                <SearchIcon size={22} className="text-[#EA580C]" />
              </div>
              <div>
                <h4 className="font-serif font-semibold text-[16px] sm:text-[17px] text-[#0F172A]">
                  Can&apos;t find what you&apos;re looking for?
                </h4>
                <p className="font-sans text-[13px] sm:text-[13.5px] text-[#64748B] mt-0.5">
                  Try different keywords or browse our full course catalog.
                </p>
              </div>
            </div>

            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A] hover:text-[#EA580C] font-sans font-medium text-[13.5px] shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <span>Browse all courses</span>
              <ArrowRightIcon size={15} />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
