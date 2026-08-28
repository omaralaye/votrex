"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  SearchIcon,
  StarIcon,
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
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BottomBarsGraphic } from "@/components/ui/bottom-bars";

export interface CourseItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced" | string;
  duration: string;
  modulesCount: string;
  iconIdentifier?: string;
  category: string;
  tags: string[];
}

const ALL_COURSES: CourseItem[] = [
  {
    id: "nextjs",
    slug: "nextjs-for-production",
    title: "Next.js for Production",
    description: "Build scalable, high-performance web applications with Next.js, best practices, and production-ready deployment strategies.",
    level: "Intermediate",
    duration: "18h 24m",
    modulesCount: "12 modules",
    iconIdentifier: "nextjs",
    category: "Frontend",
    tags: ["React", "SSR", "App Router", "Server Components"],
  },
  {
    id: "docker",
    slug: "docker-container-engineering",
    title: "Docker & Container Engineering",
    description: "Master container internals, multi-stage builds, Docker Compose orchestration, networking drivers, and production security hardening.",
    level: "Beginner",
    duration: "2h 30m",
    modulesCount: "3 modules",
    iconIdentifier: "docker",
    category: "DevOps & Cloud",
    tags: ["DevOps", "Containers", "Docker Compose", "CI/CD"],
  },
  {
    id: "typescript",
    slug: "typescript-deep-dive-metaprogramming",
    title: "TypeScript Deep Dive & Metaprogramming",
    description: "Go beyond the basics: master generic type constraints, conditional types, mapped types, template literals, type guards, and AST transforms.",
    level: "Intermediate",
    duration: "2h 50m",
    modulesCount: "3 modules",
    iconIdentifier: "typescript",
    category: "Languages",
    tags: ["TypeScript", "Generics", "Type Systems", "JavaScript"],
  },
  {
    id: "ai-agents",
    slug: "building-production-ai-agents-rag",
    title: "Building Production AI Agents & RAG Systems",
    description: "Design, build, and deploy autonomous LLM agents, multi-agent workflows, vector retrieval pipelines, and evaluation harnesses.",
    level: "Advanced",
    duration: "3h 10m",
    modulesCount: "3 modules",
    iconIdentifier: "ai",
    category: "AI & ML",
    tags: ["AI", "RAG", "LLM", "Agents", "Vector DB"],
  },
  {
    id: "react-patterns",
    slug: "advanced-react-19-state-architecture",
    title: "Advanced React 19 & State Architecture",
    description: "Master the React Compiler, Actions (useActionState, useOptimistic), compound components, state machines with XState, and virtualization.",
    level: "Advanced",
    duration: "2h 35m",
    modulesCount: "3 modules",
    iconIdentifier: "react",
    category: "Frontend",
    tags: ["React 19", "State Management", "XState", "Hooks"],
  },
  {
    id: "kubernetes",
    slug: "kubernetes-cloud-native-architecture",
    title: "Kubernetes & Cloud-Native Architecture",
    description: "Deploy, scale, and manage fault-tolerant containerized applications with Kubernetes, Ingress controllers, Helm, ArgoCD, and Prometheus.",
    level: "Advanced",
    duration: "3h 05m",
    modulesCount: "3 modules",
    iconIdentifier: "cloud",
    category: "DevOps & Cloud",
    tags: ["Kubernetes", "DevOps", "Cloud Native", "GitOps"],
  },
  {
    id: "nodejs-microservices",
    slug: "high-throughput-nodejs-microservices",
    title: "High-Throughput Node.js Microservices",
    description: "Build resilient distributed systems with Node.js internals, event loops, streaming backpressure, gRPC, RabbitMQ, Kafka, and Redis caching.",
    level: "Intermediate",
    duration: "2h 40m",
    modulesCount: "3 modules",
    iconIdentifier: "node",
    category: "Backend",
    tags: ["Node.js", "Microservices", "gRPC", "Distributed Systems"],
  },
  {
    id: "postgresql-mastery",
    slug: "postgresql-deep-dive-database-tuning",
    title: "PostgreSQL Deep Dive & Database Tuning",
    description: "Master index types (B-Tree, GIN, BRIN), EXPLAIN ANALYZE query planning, MVCC vacuum tuning, table partitioning, and connection pooling.",
    level: "Advanced",
    duration: "2h 55m",
    modulesCount: "3 modules",
    iconIdentifier: "database",
    category: "Database",
    tags: ["PostgreSQL", "Database", "SQL", "Query Tuning"],
  },
  {
    id: "python-ai-data",
    slug: "python-data-engineering-machine-learning",
    title: "Python for Data Engineering & Machine Learning",
    description: "Process big data and deploy AI models with NumPy vectorized operations, Polars, PyTorch tensors, HuggingFace transformers, and FastAPI.",
    level: "Intermediate",
    duration: "2h 50m",
    modulesCount: "3 modules",
    iconIdentifier: "python",
    category: "AI & ML",
    tags: ["Python", "Machine Learning", "Data Engineering", "PyTorch"],
  },
  {
    id: "web-security",
    slug: "web-security-penetration-testing",
    title: "Full-Stack Web Security & Penetration Testing",
    description: "Protect applications against OWASP Top 10 vulnerabilities: OAuth 2.0 / JWT attacks, XSS, CSRF, SQL/NoSQL injection, SSRF, and CSP nonces.",
    level: "Advanced",
    duration: "3h 00m",
    modulesCount: "3 modules",
    iconIdentifier: "security",
    category: "Security",
    tags: ["Security", "AppSec", "OAuth", "Penetration Testing"],
  },
];

const CATEGORIES = [
  "All",
  "Frontend",
  "DevOps & Cloud",
  "Languages",
  "AI & ML",
  "Backend",
  "Database",
  "Security",
];

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

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

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>(ALL_COURSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  // Fetch updated courses from Sanity if available
  useEffect(() => {
    async function loadSanityCourses() {
      try {
        const { client } = await import("@/sanity/lib/client");
        const { COURSES_QUERY } = await import("@/sanity/lib/queries");
        const data = await client.fetch(COURSES_QUERY);
        if (data && Array.isArray(data) && data.length > 0) {
          type SanityCourseRaw = {
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

          const mapped: CourseItem[] = (data as SanityCourseRaw[]).map((item) => {
            const rawCategory = item.category?.title || "General";
            let normalizedCat = rawCategory;
            if (rawCategory.toLowerCase().includes("frontend")) normalizedCat = "Frontend";
            else if (rawCategory.toLowerCase().includes("devops") || rawCategory.toLowerCase().includes("cloud")) normalizedCat = "DevOps & Cloud";
            else if (rawCategory.toLowerCase().includes("language")) normalizedCat = "Languages";
            else if (rawCategory.toLowerCase().includes("ai") || rawCategory.toLowerCase().includes("machine")) normalizedCat = "AI & ML";
            else if (rawCategory.toLowerCase().includes("backend")) normalizedCat = "Backend";
            else if (rawCategory.toLowerCase().includes("database")) normalizedCat = "Database";
            else if (rawCategory.toLowerCase().includes("security")) normalizedCat = "Security";

            return {
              id: item._id,
              slug: item.slug?.current || item._id,
              title: item.title,
              description: item.description || "",
              level: item.level || "Beginner",
              duration: item.duration || "2h 30m",
              modulesCount: item.modulesCount ? `${item.modulesCount} modules` : "3 modules",
              iconIdentifier: item.iconIdentifier,
              category: normalizedCat,
              tags: item.category?.title ? [item.category.title] : [],
            };
          });
          setCourses(mapped);
        }
      } catch (err) {
        // Graceful fallback to default complete course dataset
        console.warn("Using built-in courses catalog fallback:", err);
      }
    }
    loadSanityCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search filter
      const matchesSearch =
        searchQuery.trim() === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;

      // Level filter
      const matchesLevel =
        selectedLevel === "All Levels" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "All" || selectedLevel !== "All Levels";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLevel("All Levels");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F6] text-[#0F172A] flex flex-col justify-between overflow-x-hidden selection:bg-[#FED7AA] selection:text-[#9A3412]">
      {/* Subtle diagonal pinstripe texture pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[repeating-linear-gradient(45deg,#0F172A_0,#0F172A_1px,transparent_0,transparent_9px)]"
      />

      <div className="relative z-10 w-full flex-1 flex flex-col">
        {/* Navigation Header */}
        <Navbar activeRoute="courses" />

        {/* Main Content Area */}
        <main className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pt-8 pb-16">
          
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Courses", isCurrent: true },
              ]}
            />
          </div>

          {/* Header Section */}
          <div className="mb-10 sm:mb-12">
            <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA]/70 shadow-[0_1px_2px_rgba(249,115,22,0.06)] mb-3.5">
              <span className="font-sans font-semibold text-[11px] tracking-[0.14em] text-[#EA580C] uppercase">
                COURSE DIRECTORY
              </span>
            </div>
            
            <h1 className="font-serif text-[36px] sm:text-[44px] md:text-[48px] leading-[1.15] tracking-tight font-normal text-[#0F172A] mb-3">
              All Courses
            </h1>
            
            <p className="font-sans text-[15px] sm:text-[17px] text-[#64748B] max-w-2xl font-normal leading-relaxed">
              Explore our comprehensive curriculum of in-depth engineering courses. Master modern frameworks, cloud systems, AI architectures, and database internals.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.03)] mb-10 space-y-5">
            
            {/* Top row: Search input + Level dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              
              {/* Search Bar */}
              <div className="relative flex-1 flex items-center bg-[#F8FAFC] border border-[#E2E8F0] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#FED7AA]/50 rounded-xl px-3.5 py-2.5 transition-all">
                <SearchIcon size={18} className="text-[#94A3B8] shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, framework, or keyword (e.g. Next.js, Docker, AI)..."
                  className="w-full bg-transparent border-none outline-none font-sans text-[14px] sm:text-[15px] text-[#0F172A] placeholder:text-[#94A3B8]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search query"
                    className="text-xs text-[#64748B] hover:text-[#0F172A] px-2 py-0.5 rounded cursor-pointer shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Level Filter Dropdown */}
              <div className="sm:w-48 shrink-0">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  aria-label="Filter courses by experience level"
                  className="w-full h-[42px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 text-[14px] text-[#0F172A] font-medium font-sans appearance-none cursor-pointer focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#FED7AA]/50 transition-colors"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottom row: Category Pills + Reset */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-1 border-t border-[#F1F5F9]">
              {/* Category Pills */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-[12px] font-semibold tracking-wider uppercase text-[#94A3B8] mr-1 hidden sm:inline">
                  Categories:
                </span>
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[13px] font-sans font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#0F172A] text-white shadow-sm"
                          : "bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]/70"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Active Filters Reset */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[13px] font-sans font-medium text-[#EA580C] hover:text-[#C2410C] hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>

          {/* Results Meta Info */}
          <div className="flex items-center justify-between mb-6 text-[13px] sm:text-[14px] text-[#64748B] font-sans">
            <div>
              Showing <span className="font-semibold text-[#0F172A]">{filteredCourses.length}</span>{" "}
              {filteredCourses.length === 1 ? "course" : "courses"}
              {hasActiveFilters && ` (filtered from ${courses.length} total)`}
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  level={course.level}
                  duration={course.duration}
                  modulesCount={course.modulesCount}
                  icon={getCourseIcon(course.iconIdentifier)}
                  href={`/courses/${course.slug}`}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center mx-auto mb-4">
                <SearchIcon size={24} />
              </div>
              <h3 className="font-serif text-[20px] font-semibold text-[#0F172A] mb-2">
                No courses match your filter
              </h3>
              <p className="text-[14px] text-[#64748B] font-sans mb-6">
                Try adjusting your search terms, selecting &quot;All Categories&quot;, or removing level filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-medium text-[14px] shadow-sm transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Bottom Callout Banner */}
          <div className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#EA580C] font-semibold text-[13px] tracking-wide uppercase font-sans">
                <StarIcon size={16} />
                <span>Continuous Curriculum</span>
              </div>
              <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#0F172A]">
                New masterclasses added every week
              </h3>
              <p className="font-sans text-[14px] sm:text-[15px] text-[#64748B] max-w-xl">
                Stay at the cutting edge of modern software architecture, generative AI workflows, and distributed cloud computing.
              </p>
            </div>
            <Link
              href="/"
              className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E75936] to-[#F97316] hover:from-[#D94925] hover:to-[#EA580C] text-white font-sans font-medium text-[14px] shadow-[0_4px_14px_rgba(235,90,54,0.28)] transition-all cursor-pointer"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>

      {/* Decorative Warm Architectural Graphic Columns at Bottom */}
      <BottomBarsGraphic />
    </div>
  );
}
