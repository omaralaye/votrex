"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SearchIcon,
  StarIcon,
  ArrowRightIcon,
  NextjsIcon,
  DockerIcon,
  TypeScriptIcon,
  ReactIcon,
  NodejsIcon,
  CloudIcon,
  DatabaseIcon,
  AIIcon,
  PythonIcon,
  RustIcon,
  SecurityIcon,
  CustomCourseIcon,
} from "@/components/icons";
import { Navbar } from "@/components/navigation/navbar";
import { CourseCard } from "@/components/cards/course-card";
import { BottomBarsGraphic } from "@/components/ui/bottom-bars";
import posthog from "posthog-js";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modulesCount: string;
  icon: React.ReactNode;
  tags: string[];
}

const DEFAULT_COURSES: Course[] = [
  {
    id: "nextjs",
    slug: "nextjs-for-production",
    title: "Next.js for Production",
    description: "Build scalable, high-performance web applications with Next.js.",
    level: "Intermediate",
    duration: "18h 24m",
    modulesCount: "12 modules",
    icon: <NextjsIcon size={44} />,
    tags: ["React", "SSR", "App Router", "Server Components"],
  },
  {
    id: "docker",
    slug: "docker-container-engineering",
    title: "Docker & Container Engineering",
    description: "Containerize applications and streamline your deployment workflow.",
    level: "Beginner",
    duration: "2h 30m",
    modulesCount: "3 modules",
    icon: <DockerIcon size={44} />,
    tags: ["DevOps", "Containers", "Docker Compose", "CI/CD"],
  },
  {
    id: "typescript",
    slug: "typescript-deep-dive-metaprogramming",
    title: "TypeScript Deep Dive & Metaprogramming",
    description: "Go beyond the basics and write safer, more expressive code.",
    level: "Intermediate",
    duration: "2h 50m",
    modulesCount: "3 modules",
    icon: <TypeScriptIcon size={44} />,
    tags: ["TypeScript", "Generics", "Type Systems", "JavaScript"],
  },
];

function getCourseIcon(iconIdentifier?: string) {
  switch (iconIdentifier) {
    case "nextjs":
      return <NextjsIcon size={44} />;
    case "docker":
      return <DockerIcon size={44} />;
    case "typescript":
      return <TypeScriptIcon size={44} />;
    case "react":
      return <ReactIcon size={44} />;
    case "node":
      return <NodejsIcon size={44} />;
    case "cloud":
      return <CloudIcon size={44} />;
    case "database":
      return <DatabaseIcon size={44} />;
    case "ai":
      return <AIIcon size={44} />;
    case "python":
      return <PythonIcon size={44} />;
    case "rust":
      return <RustIcon size={44} />;
    case "security":
      return <SecurityIcon size={44} />;
    default:
      return <CustomCourseIcon size={44} />;
  }
}

export default function VertexHomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"courses" | "my-learning">("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      posthog.capture("search_performed", {
        query: trimmed,
        results_count: filteredCourses.length,
        source: "home",
      });
      posthog.capture("course_searched", {
        query: trimmed,
        results_count: filteredCourses.length,
        source: "home",
      });
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  useEffect(() => {
    async function fetchSanityCourses() {
      try {
        const { client } = await import("@/sanity/lib/client");
        const { COURSES_QUERY } = await import("@/sanity/lib/queries");
        const data = await client.fetch(COURSES_QUERY);
        if (data && data.length > 0) {
          type FetchedCourse = {
            _id: string;
            slug?: { current: string };
            title: string;
            description: string;
            level?: string;
            duration?: string;
            modulesCount?: number;
            iconIdentifier?: string;
            category?: { title?: string };
          };
          const mappedCourses: Course[] = (data as FetchedCourse[]).map((item) => ({
            id: item._id,
            slug: item.slug?.current || item._id,
            title: item.title,
            description: item.description,
            level: item.level || "Beginner",
            duration: item.duration || "10h",
            modulesCount: item.modulesCount ? `${item.modulesCount} modules` : "1 module",
            icon: getCourseIcon(item.iconIdentifier),
            tags: item.category?.title ? [item.category.title] : [],
          }));
          setCourses(mappedCourses);
        }
      } catch (err) {
        console.warn("Sanity fetch fallback:", err);
      }
    }
    fetchSanityCourses();
  }, []);

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

  const filteredCourses = courses.filter((c) =>
    searchQuery === ""
      ? true
      : c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F6] text-[#0F172A] flex flex-col justify-between overflow-x-hidden selection:bg-[#FED7AA] selection:text-[#9A3412]">
      {/* Subtle diagonal pinstripe texture pattern across background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[repeating-linear-gradient(45deg,#0F172A_0,#0F172A_1px,transparent_0,transparent_9px)]"
      />

      {/* Main Content Container */}
      <div className="relative z-10 w-full flex-1 flex flex-col">
        {/* Navigation Header */}
        <Navbar activeRoute={activeTab} onNavigate={(route) => setActiveTab(route)} />

        {/* Hero Section */}
        <main className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-10 sm:pt-14 md:pt-16 pb-8">
          <div className="flex flex-col items-center text-center">

            {/* Top Pill Badge */}
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA]/70 shadow-[0_1px_2px_rgba(249,115,22,0.06)] mb-6 sm:mb-7">
              <span className="font-sans font-semibold text-[11px] sm:text-[12px] tracking-[0.14em] text-[#EA580C] uppercase">
                INTELLIGENT LEARNING
              </span>
            </div>

            {/* Main Headline (Serif) */}
            <h1 className="font-serif text-[42px] sm:text-[54px] md:text-[62px] lg:text-[68px] leading-[1.1] tracking-[-0.015em] text-[#0F172A] font-normal max-w-3xl">
              Search your learning <br />
              in plain English.
            </h1>

            {/* Sub-headline */}
            <p className="font-sans text-[15px] sm:text-[17px] md:text-[18px] leading-[1.6] text-[#64748B] max-w-[560px] mx-auto mt-5 mb-8 font-normal">
              Vertex understands what you want to learn and finds the exact lessons across all your courses.
            </p>

            {/* Primary Action Button */}
            <div>
              <a
                href="#courses"
                onClick={() => posthog.capture("explore_courses_clicked")}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E75936] to-[#F97316] hover:from-[#D94925] hover:to-[#EA580C] text-white font-sans font-medium text-[15px] shadow-[0_4px_16px_rgba(235,90,54,0.32)] hover:shadow-[0_6px_20px_rgba(235,90,54,0.42)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Explore Courses</span>
                <ArrowRightIcon size={18} className="text-white" />
              </a>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-[680px] mt-10 sm:mt-12 mb-4">
              <div
                className={`relative flex items-center justify-between w-full bg-white rounded-2xl border px-4 sm:px-5 py-3.5 sm:py-4 transition-all duration-200 shadow-[0_2px_12px_rgba(15,23,42,0.04)] ${
                  isSearchFocused
                    ? "border-[#F97316] ring-4 ring-[#FED7AA]/40 shadow-[0_4px_20px_rgba(249,115,22,0.12)]"
                    : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 mr-3">
                  <SearchIcon
                    size={22}
                    className={`transition-colors shrink-0 ${
                      isSearchFocused ? "text-[#F97316]" : "text-[#94A3B8]"
                    }`}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      setIsSearchFocused(false);
                    }}
                    placeholder="Search by topic, keyword, or concept (e.g. 'Docker Compose', 'Generics')..."
                    className="w-full bg-transparent border-none outline-none font-sans text-[15px] sm:text-[16px] text-[#0F172A] placeholder:text-[#94A3B8] tracking-[-0.01em]"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        const prev = searchQuery.trim();
                        setSearchQuery("");
                        if (prev) {
                          posthog.capture("search_cleared", {
                            previous_query: prev,
                          });
                        }
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

          {/* Section Divider */}
          <div className="w-full h-[1px] bg-[#EAECEF] my-10 sm:my-14" />

          {/* All Courses Section */}
          <section id="courses" className="w-full">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-[24px] sm:text-[28px] font-semibold tracking-tight text-[#0F172A]">
                All Courses
              </h2>
              <Link
                href="/courses"
                className="group inline-flex items-center gap-1.5 text-[14px] font-sans font-medium text-[#EA580C] hover:text-[#C2410C] transition-colors cursor-pointer"
              >
                <span>View all courses</span>
                <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>

            {/* Courses Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  level={course.level}
                  duration={course.duration}
                  modulesCount={course.modulesCount}
                  icon={course.icon}
                  href={`/courses/${course.slug}`}
                  onClick={() => {
                    setSelectedCourse(course);
                    posthog.capture("course_card_clicked", {
                      course_slug: course.slug,
                      course_title: course.title,
                      course_level: course.level,
                      source: "home",
                    });
                  }}
                />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#E2E8F0]">
                <p className="text-[#64748B] text-base font-sans">No courses found matching &quot;{searchQuery}&quot;.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-sm font-medium text-[#F97316] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}
          </section>

          {/* Weekly Updates Divider Note */}
          <div className="flex items-center justify-center gap-4 my-14 sm:my-16 w-full max-w-[1440px] mx-auto">
            <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
            <div className="flex items-center gap-2 text-[#475569] text-[13px] sm:text-[14px] font-sans shrink-0 px-3">
              <StarIcon size={18} className="text-[#F97316]" />
              <span>New courses and lessons added every week.</span>
            </div>
            <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
          </div>
        </main>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div>{selectedCourse.icon}</div>
                <div>
                  <h3 className="font-serif text-[22px] font-semibold text-[#0F172A]">
                    {selectedCourse.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#64748B] mt-1">
                    <span>{selectedCourse.level}</span>
                    <span>•</span>
                    <span>{selectedCourse.duration}</span>
                    <span>•</span>
                    <span>{selectedCourse.modulesCount}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <p className="font-sans text-[15px] leading-relaxed text-[#475569]">
              {selectedCourse.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {selectedCourse.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#FFF7ED] text-[#EA580C] text-xs font-medium rounded-lg border border-[#FED7AA]/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#E75936] to-[#F97316] hover:from-[#D94925] hover:to-[#EA580C] text-white font-sans font-medium text-[15px] shadow-[0_4px_14px_rgba(235,90,54,0.3)] transition-all cursor-pointer text-center"
              >
                Start Course
              </button>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="py-3 px-5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] font-medium text-[15px] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Warm Architectural Gradient Columns at Bottom */}
      <BottomBarsGraphic />
    </div>
  );
}
