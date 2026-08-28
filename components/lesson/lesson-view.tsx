"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import {
  StatsIcon,
  ClockIcon,
  UsersGroupIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  PlayTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
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
  DocumentIcon,
  ExternalLinkIcon,
} from "@/components/icons";
import { Navbar } from "@/components/navigation/navbar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { VideoPlayer } from "@/components/lesson/video-player";
import { PortableTextRenderer } from "@/components/lesson/portable-text-renderer";
import { getLessonThumbnailUrl } from "@/sanity/lib/image";
import type { LessonDetail } from "@/sanity/lib/data";

export interface LessonViewProps {
  lesson: LessonDetail;
  startSeconds?: number;
}

function LightbulbIcon({ size = 24, className = "" }: { size?: number | string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function GithubIcon({ size = 24, className = "" }: { size?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function getCourseSmallIcon(iconIdentifier?: string) {
  switch (iconIdentifier) {
    case "nextjs":
      return (
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shrink-0 shadow-sm">
          <span className="font-serif font-bold text-[18px]">N</span>
        </div>
      );
    case "docker":
      return <DockerIcon size={40} className="shrink-0" />;
    case "typescript":
      return <TypeScriptIcon size={40} className="shrink-0" />;
    case "react":
      return <ReactIcon size={40} className="shrink-0" />;
    case "node":
      return <NodejsIcon size={40} className="shrink-0" />;
    case "cloud":
      return <CloudIcon size={40} className="shrink-0" />;
    case "database":
      return <DatabaseIcon size={40} className="shrink-0" />;
    case "ai":
      return <AIIcon size={40} className="shrink-0" />;
    case "python":
      return <PythonIcon size={40} className="shrink-0" />;
    case "rust":
      return <RustIcon size={40} className="shrink-0" />;
    case "security":
      return <SecurityIcon size={40} className="shrink-0" />;
    default:
      return (
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shrink-0 shadow-sm">
          <span className="font-serif font-bold text-[18px]">N</span>
        </div>
      );
  }
}

export function LessonView({ lesson, startSeconds = 0 }: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const course = lesson.course;
  const courseSlug = course?.slug?.current || "nextjs-for-production";
  const courseTitle = course?.title || "Next.js for Production";
  const modules = course?.modules || [];

  // Find module index and lesson index
  let currentModuleIndex = 0;
  let currentLessonIndexInModule = 0;
  let found = false;

  const flattenedLessons: {
    lesson: {
      _id: string;
      title: string;
      slug: { current: string };
      duration: string;
    };
    moduleIndex: number;
    moduleTitle: string;
    moduleDuration?: string;
  }[] = [];

  modules.forEach((mod, mIdx) => {
    const modLessons = mod.lessons || [];
    modLessons.forEach((les, lIdx) => {
      flattenedLessons.push({
        lesson: les,
        moduleIndex: mIdx + 1,
        moduleTitle: mod.title,
        moduleDuration: mod.duration,
      });

      if (!found && (les._id === lesson._id || les.slug?.current === lesson.slug?.current)) {
        currentModuleIndex = mIdx + 1;
        currentLessonIndexInModule = lIdx + 1;
        found = true;
      }
    });
  });

  // Fallbacks if not found directly in module structure
  if (currentModuleIndex === 0) currentModuleIndex = 5;
  if (currentLessonIndexInModule === 0) currentLessonIndexInModule = 1;


  // Track PostHog page view
  useEffect(() => {
    posthog.capture("lesson_viewed", {
      course_slug: courseSlug,
      course_title: courseTitle,
      lesson_slug: lesson.slug?.current,
      lesson_title: lesson.title,
      module_number: currentModuleIndex,
      lesson_number: `${currentModuleIndex}.${currentLessonIndexInModule}`,
      duration: lesson.duration,
    });
  }, [courseSlug, courseTitle, lesson, currentModuleIndex, currentLessonIndexInModule]);

  // Find current position in flattened lessons for Previous / Next Navigation
  const currentFlatIndex = flattenedLessons.findIndex(
    (item) => item.lesson._id === lesson._id || item.lesson.slug?.current === lesson.slug?.current
  );

  const prevItem = currentFlatIndex > 0 ? flattenedLessons[currentFlatIndex - 1] : null;
  const nextItem =
    currentFlatIndex >= 0 && currentFlatIndex < flattenedLessons.length - 1
      ? flattenedLessons[currentFlatIndex + 1]
      : null;

  const toggleModuleAccordion = (moduleKey: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  const currentModule = modules[currentModuleIndex - 1];
  const currentModuleTitle = currentModule?.title || "Data Fetching & Caching";

  const breadcrumbItems = [
    { label: "All Courses", href: "/courses" },
    { label: courseTitle, href: `/courses/${courseSlug}` },
    { label: currentModuleTitle },
    { label: lesson.title, isCurrent: true },
  ];

  const studentCountDisplay = lesson.studentCount
    ? lesson.studentCount >= 1000
      ? `${(lesson.studentCount / 1000).toFixed(1)}k students`
      : `${lesson.studentCount} students`
    : "3,426 students";

  const defaultKeyPoints = [
    "Understand the different data fetching methods in Next.js",
    "Learn how caching works in Server Components",
    "Implement revalidation and cache control",
    "Optimize performance with advanced caching strategies",
  ];

  const keyPoints = lesson.keyPoints && lesson.keyPoints.length > 0 ? lesson.keyPoints : defaultKeyPoints;

  const defaultProTip =
    "Use caching and revalidation wisely to ensure your app stays fast and data remains fresh without unnecessary requests.";
  const proTip = lesson.proTip || defaultProTip;

  const defaultResources = [
    {
      _key: "r1",
      title: "Next.js Data Fetching Documentation",
      description: "Official Next.js docs on data fetching methods.",
      type: "Doc",
      url: "https://nextjs.org/docs/app/building-your-application/data-fetching",
    },
    {
      _key: "r2",
      title: "Caching and Revalidation Guide",
      description: "Deep dive into Next.js caching strategies.",
      type: "Guide",
      url: "https://nextjs.org/docs/app/building-your-application/caching",
    },
    {
      _key: "r3",
      title: "Example Repository",
      description: "Explore the source code for this lesson.",
      type: "Repository",
      url: "https://github.com/vercel/next.js",
    },
  ];

  const resources = lesson.resources && lesson.resources.length > 0 ? lesson.resources : defaultResources;

  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F6] text-[#0F172A] flex flex-col justify-between selection:bg-[#FED7AA] selection:text-[#9A3412]">
      {/* Subtle diagonal background texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[repeating-linear-gradient(45deg,#0F172A_0,#0F172A_1px,transparent_0,transparent_9px)]"
      />

      {/* Top Navbar */}
      <div className="relative z-20 w-full border-b border-[#EBE8E3]/80 bg-[#FAF9F6]/90 backdrop-blur-md">
        <Navbar activeRoute="courses" />
      </div>

      {/* Main 2-Column Workspace */}
      <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row max-w-[1536px] mx-auto">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden p-4 border-b border-[#EBE8E3] bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[13px] font-sans font-medium text-[#334155]"
          >
            <span>{sidebarOpen ? "Hide Curriculum" : "View Curriculum"}</span>
            <ChevronDownIcon
              size={16}
              className={`transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
          <span className="text-[12px] font-sans text-[#64748B]">
            Module {currentModuleIndex} of {modules.length || 12}
          </span>
        </div>

        {/* ========================================================= */}
        {/* LEFT SIDEBAR: Curriculum Navigation                       */}
        {/* ========================================================= */}
        <aside
          className={`w-full lg:w-[320px] xl:w-[340px] shrink-0 border-r border-[#EBE8E3] bg-[#FAF9F6] lg:bg-transparent ${
            sidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="p-6 sm:p-7 flex flex-col gap-6">
            {/* Back to Course Link */}
            <Link
              href={`/courses/${courseSlug}`}
              className="inline-flex items-center gap-2 text-[14px] font-sans font-medium text-[#D8653F] hover:text-[#C25430] transition-colors cursor-pointer group"
            >
              <ChevronLeftIcon size={16} className="transition-transform group-hover:-translate-x-0.5" />
              <span>Back to course</span>
            </Link>

            {/* Course Card Snippet */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#EBE8E3] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              {getCourseSmallIcon(course?.iconIdentifier)}
              <div className="flex-1 min-w-0">
                <h2 className="font-sans font-semibold text-[14px] text-[#0F172A] truncate leading-snug">
                  {courseTitle}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-16 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#F97316] rounded-full" style={{ width: "35%" }} />
                  </div>
                  <span className="font-sans text-[11.5px] text-[#64748B]">35% complete</span>
                </div>
              </div>
            </div>

            {/* Modules Accordion List */}
            <div className="flex flex-col">
              {/* Module Header Bar */}
              <div className="flex items-center justify-between text-[13.5px] font-sans font-semibold text-[#0F172A] py-2 mb-1">
                <span>
                  Module {currentModuleIndex} of {modules.length || 12}
                </span>
                <ChevronDownIcon size={16} className="text-[#94A3B8]" />
              </div>

              {/* Module Items */}
              <div className="divide-y divide-[#EBE8E3]/60 border-t border-b border-[#EBE8E3]/80">
                {modules.map((mod, mIndex) => {
                  const modNum = mIndex + 1;
                  const isCurrentModule = modNum === currentModuleIndex;
                  const isCompleted = modNum < currentModuleIndex;
                  const modKey = `m_${mIndex}`;
                  const isExpanded = expandedModules[modKey] ?? isCurrentModule;
                  const modLessons = mod.lessons || [];

                  return (
                    <div key={mod._key || modKey} className="py-2.5">
                      {/* Module Row Header */}
                      <button
                        type="button"
                        onClick={() => toggleModuleAccordion(modKey)}
                        className="w-full flex items-center justify-between text-left py-1 group cursor-pointer gap-2"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Module Number Circle */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-sans text-[12px] font-semibold shrink-0 transition-colors ${
                              isCurrentModule
                                ? "bg-[#D8653F] text-white shadow-sm"
                                : isCompleted
                                ? "bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]"
                                : "bg-[#FAF9F6] text-[#64748B] border border-[#E2E8F0]"
                            }`}
                          >
                            {modNum}
                          </div>

                          {/* Module Title & Duration */}
                          <div className="min-w-0 flex-1">
                            <span
                              className={`font-sans text-[13.5px] block truncate ${
                                isCurrentModule ? "font-bold text-[#0F172A]" : "font-medium text-[#334155]"
                              }`}
                            >
                              {mod.title}
                            </span>
                            <span className="font-sans text-[12px] text-[#64748B] block">
                              {mod.duration || "45m"}
                            </span>
                          </div>
                        </div>

                        {/* Right Icon State: Checkmark, Chevron Up, or Chevron Down */}
                        <div className="shrink-0">
                          {isCompleted ? (
                            <div className="text-[#D8653F]">
                              <CheckCircleIcon size={18} className="text-[#D8653F]" />
                            </div>
                          ) : isCurrentModule ? (
                            <div className="text-[#D8653F]">
                              <ChevronUpIcon size={16} className="text-[#D8653F]" />
                            </div>
                          ) : (
                            <div className="text-[#94A3B8]">
                              <ChevronDownIcon size={16} />
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Nested Lessons (Expanded) */}
                      {isExpanded && modLessons.length > 0 && (
                        <div className="mt-2.5 mb-1 pl-4 sm:pl-5 border-l-2 border-[#EBE8E3] ml-3.5 space-y-3">
                          {modLessons.map((les, lIndex) => {
                            const isCurrentLesson =
                              isCurrentModule &&
                              (les._id === lesson._id || les.slug?.current === lesson.slug?.current);

                            return (
                              <div key={les._id || `les_${lIndex}`} className="text-[13px] font-sans">
                                {isCurrentLesson ? (
                                  <div className="flex items-center justify-between gap-2 py-1">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className="w-2 h-2 rounded-full bg-[#D8653F] shrink-0" />
                                      <div className="min-w-0">
                                        <span className="font-semibold text-[#0F172A] block truncate">
                                          {les.title}
                                        </span>
                                        <span className="text-[11.5px] font-medium text-[#D8653F] block">
                                          Now playing
                                        </span>
                                      </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-[#D8653F] text-white flex items-center justify-center shrink-0 shadow-sm">
                                      <PlayTriangleIcon size={12} className="translate-x-0.2" />
                                    </div>
                                  </div>
                                ) : (
                                  <Link
                                    href={`/courses/${courseSlug}/${les.slug?.current || ""}`}
                                    className="flex items-center justify-between gap-2 py-1 text-[#64748B] hover:text-[#0F172A] transition-colors group cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className="w-1.5 h-1.5 rounded-full border border-[#94A3B8] group-hover:border-[#0F172A] shrink-0" />
                                      <span className="truncate group-hover:font-medium">
                                        {les.title}
                                      </span>
                                    </div>
                                    <span className="text-[11.5px] text-[#94A3B8] shrink-0">
                                      {les.duration || "15m"}
                                    </span>
                                  </Link>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT MAIN AREA: Video Player, Content, Notes, Nav       */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0 px-6 sm:px-10 lg:px-12 py-8 lg:py-10 flex flex-col">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Lesson Header Row */}
          <div className="mb-6">
            {/* Pill Badge */}
            <div className="mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#FFF1EB] text-[#E05D38] font-sans font-semibold text-[11px] uppercase tracking-wider">
                LESSON {currentModuleIndex}.{currentLessonIndexInModule}
              </span>
            </div>

            {/* Title & Bookmark Button */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="font-serif text-[32px] sm:text-[40px] lg:text-[44px] font-bold text-[#0F172A] leading-[1.15] tracking-tight">
                {lesson.title}
              </h1>

              <button
                type="button"
                aria-label="Bookmark lesson"
                onClick={() => {
                  setIsBookmarked((prev) => {
                    const next = !prev;
                    posthog.capture("lesson_bookmarked", {
                      course_slug: courseSlug,
                      lesson_slug: lesson.slug?.current,
                      bookmarked: next,
                    });
                    return next;
                  });
                }}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 shadow-sm ${
                  isBookmarked
                    ? "bg-[#FFF7ED] border-[#FDBA74] text-[#EA580C]"
                    : "bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <BookmarkIcon size={20} filled={isBookmarked} />
              </button>
            </div>

            {/* Subtitle / Summary */}
            <p className="font-sans text-[15px] sm:text-[16px] text-[#475569] leading-relaxed max-w-[800px] mb-5">
              {lesson.summary ||
                "Learn how Next.js handles data fetching and caching in both Server and Client Components."}
            </p>

            {/* Meta Info Row */}
            <div className="flex items-center flex-wrap gap-x-6 sm:gap-x-8 gap-y-2 text-[13.5px] sm:text-[14px] text-[#475569] font-sans">
              <div className="flex items-center gap-2">
                <ClockIcon size={18} className="text-[#94A3B8]" />
                <span className="font-medium text-[#334155]">{lesson.duration || "1h 28m"}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatsIcon size={18} className="text-[#94A3B8]" />
                <span className="font-medium text-[#334155]">{course?.level || "Intermediate"}</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersGroupIcon size={19} className="text-[#94A3B8]" />
                <span className="font-medium text-[#334155]">{studentCountDisplay}</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* VIDEO PLAYER SECTION                                      */}
          {/* ========================================================= */}
          <section className="w-full mb-8">
            <VideoPlayer
              videoUrl={lesson.videoUrl || "https://www.youtube.com/watch?v=gSSsZReIFRk"}
              posterUrl={getLessonThumbnailUrl(lesson)}
              title={lesson.title}
              startSeconds={startSeconds}
            />
          </section>

          {/* ========================================================= */}
          {/* TABS SWITCHER: Lesson Content / Notes                     */}
          {/* ========================================================= */}
          <div className="w-full border-b border-[#E2E8F0] mb-8">
            <div className="flex items-center gap-8">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("content");
                  posthog.capture("lesson_tab_switched", {
                    course_slug: courseSlug,
                    lesson_slug: lesson.slug?.current,
                    tab: "content",
                  });
                }}
                className={`pb-3 font-sans text-[15px] font-semibold transition-all relative cursor-pointer ${
                  activeTab === "content"
                    ? "text-[#D8653F]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <span>Lesson Content</span>
                {activeTab === "content" && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#D8653F] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("notes");
                  posthog.capture("lesson_tab_switched", {
                    course_slug: courseSlug,
                    lesson_slug: lesson.slug?.current,
                    tab: "notes",
                  });
                }}
                className={`pb-3 font-sans text-[15px] font-medium transition-all relative cursor-pointer ${
                  activeTab === "notes"
                    ? "text-[#D8653F] font-semibold"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <span>Notes</span>
                {activeTab === "notes" && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#D8653F] rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB CONTENT: Lesson Content Overview, Points, Pro Tip...  */}
          {/* ========================================================= */}
          {activeTab === "content" ? (
            <div className="flex flex-col gap-10">
              {/* Overview Section */}
              <section>
                <h2 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0F172A] mb-3">
                  Overview
                </h2>
                <p className="font-sans text-[15px] sm:text-[16px] leading-[1.65] text-[#475569]">
                  {lesson.summary ||
                    "In this lesson, you'll learn how Next.js handles data fetching and caching in both Server and Client Components. We'll explore different caching strategies and revalidation techniques to build fast and scalable applications."}
                </p>
              </section>

              {/* In This Lesson You Will Section */}
              <section>
                <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-[#0F172A] mb-4">
                  In this lesson you will:
                </h3>
                <div className="space-y-3">
                  {keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3 text-[14.5px] sm:text-[15px] font-sans text-[#334155]">
                      <div className="mt-0.5 text-[#D8653F] shrink-0">
                        <CheckCircleIcon size={19} className="text-[#D8653F]" />
                      </div>
                      <span className="leading-snug">{point}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pro Tip Box */}
              {proTip && (
                <section className="rounded-[18px] bg-[#FFF8F5] border border-[#FED7AA]/60 p-5 sm:p-6 flex items-start gap-4 shadow-sm">
                  <div className="text-[#D8653F] mt-0.5 shrink-0">
                    <LightbulbIcon size={24} className="text-[#D8653F]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-[15px] text-[#0F172A] mb-1">
                      Pro Tip
                    </h4>
                    <p className="font-sans text-[14px] sm:text-[14.5px] leading-[1.6] text-[#475569]">
                      {proTip}
                    </p>
                  </div>
                </section>
              )}

              {/* Resources Section */}
              <section>
                <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0F172A] mb-5">
                  Resources
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((res, rIdx) => {
                    const isRepo =
                      res.type?.toLowerCase().includes("repo") ||
                      res.type?.toLowerCase().includes("git") ||
                      res.title?.toLowerCase().includes("repo");

                    return (
                      <div
                        key={res._key || rIdx}
                        className="bg-white border border-[#E2E8F0] rounded-[18px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                      >
                        <div>
                          {/* Icon */}
                          <div className="text-[#0F172A] mb-3">
                            {isRepo ? <GithubIcon size={22} /> : <DocumentIcon size={22} />}
                          </div>

                          {/* Title */}
                          <h4 className="font-sans font-bold text-[15.5px] text-[#0F172A] mb-1.5 leading-snug">
                            {res.title}
                          </h4>

                          {/* Description */}
                          <p className="font-sans text-[13px] leading-[1.5] text-[#64748B] mb-4">
                            {res.description}
                          </p>
                        </div>

                        {/* Footer Link */}
                        <div className="pt-2 flex justify-end">
                          <a
                            href={res.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              posthog.capture("lesson_resource_clicked", {
                                course_slug: courseSlug,
                                lesson_slug: lesson.slug?.current,
                                resource_title: res.title,
                                url: res.url,
                              });
                            }}
                            className="text-[#94A3B8] hover:text-[#D8653F] transition-colors p-1"
                            aria-label={`Open ${res.title}`}
                          >
                            <ExternalLinkIcon size={16} />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          ) : (
            /* ======================================================= */
            /* TAB CONTENT: Rich Notes (Portable Text)                 */
            /* ======================================================= */
            <div className="bg-white border border-[#EBE8E3] rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <PortableTextRenderer content={lesson.content} />
            </div>
          )}

          {/* ========================================================= */}
          {/* BOTTOM NAVIGATION BAR: Previous / Next Lesson             */}
          {/* ========================================================= */}
          <div className="mt-14 pt-8 border-t border-[#EBE8E3] flex items-center justify-between gap-4 flex-wrap">
            {/* Previous Lesson Action */}
            {prevItem ? (
              <div className="flex items-center gap-4">
                <Link
                  href={`/courses/${courseSlug}/${prevItem.lesson.slug?.current || ""}`}
                  onClick={() => {
                    posthog.capture("lesson_navigated", {
                      course_slug: courseSlug,
                      from_lesson: lesson.slug?.current,
                      to_lesson: prevItem.lesson.slug?.current,
                      direction: "previous",
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-sans font-medium text-[14px] shadow-sm transition-all cursor-pointer"
                >
                  <ChevronLeftIcon size={16} />
                  <span>Previous Lesson</span>
                </Link>
                <div className="hidden sm:block">
                  <div className="font-sans font-medium text-[13.5px] text-[#0F172A]">
                    {prevItem.moduleTitle || prevItem.lesson.title}
                  </div>
                  <div className="font-sans text-[12px] text-[#64748B]">
                    {prevItem.moduleDuration || prevItem.lesson.duration}
                  </div>
                </div>
              </div>
            ) : (
              <div />
            )}

            {/* Next Lesson Action */}
            {nextItem ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="font-sans font-medium text-[13.5px] text-[#0F172A]">
                    {nextItem.moduleTitle || nextItem.lesson.title}
                  </div>
                  <div className="font-sans text-[12px] text-[#64748B]">
                    {nextItem.moduleDuration || nextItem.lesson.duration}
                  </div>
                </div>
                <Link
                  href={`/courses/${courseSlug}/${nextItem.lesson.slug?.current || ""}`}
                  onClick={() => {
                    posthog.capture("lesson_navigated", {
                      course_slug: courseSlug,
                      from_lesson: lesson.slug?.current,
                      to_lesson: nextItem.lesson.slug?.current,
                      direction: "next",
                    });
                  }}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#D8653F] hover:bg-[#C25430] text-white font-sans font-medium text-[14px] sm:text-[15px] shadow-[0_4px_14px_rgba(216,101,63,0.3)] transition-all cursor-pointer"
                >
                  <span>Next Lesson</span>
                  <ArrowRightIcon size={16} className="text-white" />
                </Link>
              </div>
            ) : (
              <Link
                href={`/courses/${courseSlug}`}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-medium text-[14px] shadow-sm transition-all cursor-pointer"
              >
                <span>Complete Course</span>
                <CheckCircleIcon size={16} className="text-white" />
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
