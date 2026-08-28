"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  StatsIcon,
  ClockIcon,
  DocumentIcon,
  UsersGroupIcon,
  BookmarkIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  LayersOutlineIcon,
  DatabaseOutlineIcon,
  GaugeOutlineIcon,
  CloudOutlineIcon,
  NextjsHeroCover,
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
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BottomBarsGraphic } from "@/components/ui/bottom-bars";
import type { CourseDetail } from "@/sanity/lib/data";

interface CourseViewProps {
  course: CourseDetail;
}

function formatStudentCount(count?: number): string {
  if (!count) return "2.1k";
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1);
    return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}k`;
  }
  return `${count}`;
}

function getOutcomeIcon(iconName?: string) {
  const normalized = (iconName || "").toLowerCase();
  switch (normalized) {
    case "layers":
    case "stack":
    case "router":
    case "foundations":
      return <LayersOutlineIcon size={44} className="text-[#D8653F] shrink-0" />;
    case "database":
    case "server":
    case "caching":
      return <DatabaseOutlineIcon size={44} className="text-[#D8653F] shrink-0" />;
    case "speedometer":
    case "gauge":
    case "performance":
    case "zap":
    case "timer":
      return <GaugeOutlineIcon size={44} className="text-[#D8653F] shrink-0" />;
    case "cloud":
    case "deploy":
    case "scaling":
      return <CloudOutlineIcon size={44} className="text-[#D8653F] shrink-0" />;
    default:
      return <LayersOutlineIcon size={44} className="text-[#D8653F] shrink-0" />;
  }
}

function getCourseHeroGraphic(course: CourseDetail) {
  if (course.iconIdentifier === "nextjs" || course.slug?.current?.includes("nextjs")) {
    return <NextjsHeroCover />;
  }

  if (course.coverImageUrl) {
    return (
      <div className="relative w-full aspect-square rounded-[28px] sm:rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
        <Image
          src={course.coverImageUrl}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 380px"
          priority
        />
      </div>
    );
  }

  // Framework icon fallback
  let IconComponent = CustomCourseIcon;
  switch (course.iconIdentifier) {
    case "docker":
      IconComponent = DockerIcon;
      break;
    case "typescript":
      IconComponent = TypeScriptIcon;
      break;
    case "react":
      IconComponent = ReactIcon;
      break;
    case "node":
      IconComponent = NodejsIcon;
      break;
    case "cloud":
      IconComponent = CloudIcon;
      break;
    case "database":
      IconComponent = DatabaseIcon;
      break;
    case "ai":
      IconComponent = AIIcon;
      break;
    case "python":
      IconComponent = PythonIcon;
      break;
    case "rust":
      IconComponent = RustIcon;
      break;
    case "security":
      IconComponent = SecurityIcon;
      break;
    default:
      IconComponent = CustomCourseIcon;
  }

  return (
    <div className="relative w-full aspect-square rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.22)] flex items-center justify-center">
      <div className="scale-150">
        <IconComponent size={96} />
      </div>
    </div>
  );
}

export function CourseView({ course }: CourseViewProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [showAllModules, setShowAllModules] = useState(false);

  const modules = course.modules || [];
  const totalModulesCount = course.totalModules || modules.length || 12;
  const initialVisibleCount = 6;
  const visibleModules = showAllModules ? modules : modules.slice(0, initialVisibleCount);
  const hasMoreModules = modules.length > initialVisibleCount;

  const toggleModule = (moduleKey: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  const breadcrumbItems = [
    { label: "All Courses", href: "/" },
    { label: course.title, isCurrent: true },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F6] text-[#0F172A] flex flex-col justify-between overflow-x-hidden selection:bg-[#FED7AA] selection:text-[#9A3412]">
      {/* Diagonal pinstripe texture pattern across background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[repeating-linear-gradient(45deg,#0F172A_0,#0F172A_1px,transparent_0,transparent_9px)]"
      />

      {/* Main Content */}
      <div className="relative z-10 w-full flex-1 flex flex-col">
        {/* Navigation Header */}
        <Navbar activeRoute="courses" />

        <main className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 pt-6 sm:pt-8 pb-32 sm:pb-36">
          {/* Breadcrumbs */}
          <div className="mb-8 sm:mb-10">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Hero Section */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center mb-14 sm:mb-16">
            {/* Left Cover Image */}
            <div className="md:col-span-5 lg:col-span-4 max-w-[340px] w-full mx-auto md:mx-0">
              {getCourseHeroGraphic(course)}
            </div>

            {/* Right Course Metadata & CTAs */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center">
              {/* Popular Badge */}
              {course.isPopular && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FFF1EB] border border-[#FED7AA]/60 text-[#E05D38] font-sans font-semibold text-[11px] uppercase tracking-[0.14em] shadow-[0_1px_2px_rgba(224,93,56,0.05)]">
                    POPULAR
                  </span>
                </div>
              )}

              {/* Course Title */}
              <h1 className="font-serif text-[36px] sm:text-[46px] lg:text-[52px] font-bold tracking-tight text-[#0F172A] leading-[1.12] mb-4">
                {course.title}
              </h1>

              {/* Course Marketing Summary / Description */}
              <p className="font-sans text-[15.5px] sm:text-[17px] leading-[1.62] text-[#475569] max-w-[620px] mb-7 font-normal">
                {course.description}
              </p>

              {/* Specs Meta Row */}
              <div className="flex items-center flex-wrap gap-x-6 sm:gap-x-8 gap-y-3 text-[13.5px] sm:text-[14px] text-[#475569] font-sans mb-8">
                {/* Skill Level */}
                <div className="flex items-center gap-2">
                  <StatsIcon size={18} className="text-[#94A3B8]" />
                  <span className="font-medium text-[#334155]">{course.level || "Intermediate"}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2">
                  <ClockIcon size={18} className="text-[#94A3B8]" />
                  <span className="font-medium text-[#334155]">{course.duration || "18h 24m"}</span>
                </div>

                {/* Modules Count */}
                <div className="flex items-center gap-2">
                  <DocumentIcon size={18} className="text-[#94A3B8]" />
                  <span className="font-medium text-[#334155]">{totalModulesCount} modules</span>
                </div>

                {/* Students Count */}
                <div className="flex items-center gap-2">
                  <UsersGroupIcon size={19} className="text-[#94A3B8]" />
                  <span className="font-medium text-[#334155]">{formatStudentCount(course.studentCount)} students</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-wrap gap-3 sm:gap-4">
                {/* Primary CTA */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("curriculum");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#D8653F] hover:bg-[#C25430] active:scale-[0.99] text-white font-sans font-medium text-[15px] shadow-[0_4px_16px_rgba(216,101,63,0.32)] hover:shadow-[0_6px_20px_rgba(216,101,63,0.42)] transition-all duration-200 cursor-pointer"
                >
                  <span>Continue Learning</span>
                  <ArrowRightIcon size={18} className="text-white" />
                </button>

                {/* Secondary Bookmark CTA */}
                <button
                  type="button"
                  onClick={() => setIsBookmarked((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-5 py-3 sm:py-3.5 rounded-xl border font-sans font-medium text-[15px] transition-all duration-200 cursor-pointer shadow-sm ${
                    isBookmarked
                      ? "bg-[#FFF7ED] border-[#FDBA74] text-[#EA580C]"
                      : "bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] hover:border-[#CBD5E1]"
                  }`}
                >
                  <BookmarkIcon size={18} filled={isBookmarked} className={isBookmarked ? "text-[#EA580C]" : "text-[#475569]"} />
                  <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* What You'll Learn Card */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <section className="w-full bg-white/70 backdrop-blur-sm border border-[#EBE8E3] rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-[0_2px_8px_rgba(15,23,42,0.02)] mb-14 sm:mb-16">
              <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#0F172A] mb-7">
                What you’ll learn
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div
                    key={outcome._key || idx}
                    className="flex items-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-[18px] bg-white border border-[#F1F5F9] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#E2E8F0] transition-colors"
                  >
                    <div className="mt-0.5">
                      {getOutcomeIcon(outcome.icon || (idx === 0 ? "layers" : idx === 1 ? "database" : idx === 2 ? "speedometer" : "cloud"))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-[16.5px] sm:text-[17.5px] text-[#0F172A] mb-1.5 leading-snug">
                        {outcome.title}
                      </h3>
                      {outcome.description && (
                        <p className="font-sans text-[13.5px] sm:text-[14px] leading-[1.55] text-[#64748B]">
                          {outcome.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Course Content / Curriculum Section */}
          <section id="curriculum" className="w-full mb-12">
            {/* Curriculum Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#0F172A]">
                Course Content
              </h2>
              <div className="text-[13.5px] sm:text-[14px] text-[#64748B] font-sans font-normal">
                <span>{totalModulesCount} modules</span>
                <span className="mx-2">•</span>
                <span>{course.duration || "18h 24m"}</span>
              </div>
            </div>

            {/* Modules List Container */}
            <div className="border border-[#EBE8E3] rounded-[20px] bg-white divide-y divide-[#F1F5F9] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              {visibleModules.map((module, index) => {
                const moduleNum = index + 1;
                const isExpanded = !!expandedModules[module._key || `m_${index}`];
                const lessons = module.lessons || [];

                return (
                  <div key={module._key || `mod_${index}`} className="group transition-colors">
                    {/* Module Header Row */}
                    <button
                      type="button"
                      onClick={() => toggleModule(module._key || `m_${index}`)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-[#FAF9F6]/80 transition-colors cursor-pointer gap-4"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                        {/* Module Number Circle */}
                        <div className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-[#FAF9F6] text-[#0F172A] font-sans font-medium text-[13px] flex items-center justify-center shrink-0">
                          {moduleNum}
                        </div>

                        {/* Title & Summary */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-sans font-semibold text-[14.5px] sm:text-[15.5px] text-[#0F172A] mb-0.5 truncate sm:whitespace-normal">
                            {module.title}
                          </h3>
                          {module.summary && (
                            <p className="font-sans text-[12.5px] sm:text-[13.5px] text-[#64748B] line-clamp-1 sm:line-clamp-none">
                              {module.summary}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Meta & Chevron */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-sans text-[12.5px] sm:text-[13.5px] text-[#64748B] font-medium">
                          {module.duration || "45m"}
                        </span>
                        <div
                          className={`text-[#94A3B8] transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          <ChevronDownIcon size={18} />
                        </div>
                      </div>
                    </button>

                    {/* Expandable Lessons Sub-list */}
                    {isExpanded && (
                      <div className="bg-[#FAF9F6]/60 border-t border-[#F1F5F9] px-5 sm:px-8 py-3 divide-y divide-[#F1F5F9]/80">
                        {lessons.length > 0 ? (
                          lessons.map((lesson, lIdx) => (
                            <div
                              key={lesson._id || `les_${lIdx}`}
                              className="py-3 flex items-center justify-between text-[13.5px] font-sans gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="text-[#D8653F] shrink-0">
                                  <PlayIcon size={16} filled />
                                </div>
                                <span className="font-medium text-[#1E293B] truncate">
                                  {lesson.title}
                                </span>
                                {lesson.isFreePreview && (
                                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#EFF6FF] text-[#2563EB] shrink-0">
                                    Free Preview
                                  </span>
                                )}
                              </div>
                              <span className="text-[#64748B] text-[12px] shrink-0">
                                {lesson.duration || "12:00"}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-3 text-[13px] text-[#64748B] italic">
                            Lessons in this module are loading...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Show All Modules Button */}
            {hasMoreModules && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllModules((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-[#0F172A] font-sans font-medium text-[13.5px] sm:text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all cursor-pointer"
                >
                  <span>
                    {showAllModules
                      ? "Show fewer modules"
                      : `Show all ${totalModulesCount} modules`}
                  </span>
                  {showAllModules ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Floating Bottom Progress Bar */}
      <div className="fixed bottom-5 inset-x-0 z-40 max-w-[1120px] mx-auto px-4 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#EAECEF] rounded-[20px] p-4 sm:p-4.5 sm:px-6 shadow-[0_12px_36px_rgba(15,23,42,0.12)] flex items-center justify-between gap-4 sm:gap-8">
          {/* Progress Cluster */}
          <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
            <div className="shrink-0">
              <div className="font-sans text-[10.5px] uppercase tracking-wider text-[#64748B] font-medium leading-none mb-1">
                Your Progress
              </div>
              <div className="font-sans font-bold text-[14px] sm:text-[15px] text-[#0F172A] leading-none">
                35% <span className="font-normal text-[#64748B] text-[13px]">complete</span>
              </div>
            </div>

            {/* Progress Bar Line */}
            <div className="flex-1 max-w-[360px] h-2 bg-[#E2E8F0] rounded-full overflow-hidden shrink min-w-[60px]">
              <div
                className="h-full bg-[#D8653F] rounded-full transition-all duration-500 ease-out"
                style={{ width: "35%" }}
              />
            </div>
          </div>

          {/* Bottom Action Button */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("curriculum");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#D8653F] hover:bg-[#C25430] active:scale-[0.99] text-white font-sans font-medium text-[14px] sm:text-[15px] shadow-[0_4px_14px_rgba(216,101,63,0.3)] transition-all duration-200 cursor-pointer shrink-0"
          >
            <span>Continue Learning</span>
            <ArrowRightIcon size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Ambient Orange Graphic at Bottom */}
      <BottomBarsGraphic />
    </div>
  );
}
