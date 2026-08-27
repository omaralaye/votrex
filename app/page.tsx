"use client";

import React, { useState } from "react";
import {
  VertexLogo,
  BellIcon,
  SearchIcon,
  PlayIcon,
  DocumentIcon,
  BookmarkIcon,
  StatsIcon,
  ClockIcon,
  UserIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Pagination } from "@/components/ui/pagination";
import { CourseCard } from "@/components/cards/course-card";
import { LessonVideoCard } from "@/components/cards/lesson-video-card";
import { LessonTopicCard } from "@/components/cards/lesson-topic-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { PrinciplesGrid } from "@/components/design-system/principles";

export default function DesignSystemPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeNav, setActiveNav] = useState<"courses" | "my-learning">("courses");

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] pb-24 selection:bg-[#FDBA74]/40 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 space-y-16">
        
        {/* ========================================================================= */}
        {/* HEADER & INTRO + 01 COLORS */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-12 border-b border-[#E2E8F0]">
          {/* Left Column: Brand Hero */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <VertexLogo size={36} />
              <span className="font-sans font-bold text-[26px] tracking-tight text-[#0F172A]">
                Vertex
              </span>
            </div>

            <h1 className="font-serif font-bold text-[48px] md:text-[56px] leading-[1.1] tracking-tight text-[#0F172A]">
              Design System
            </h1>

            <p className="font-sans text-[16px] leading-[26px] text-[#64748B] max-w-md">
              A unified design language for Vertex learning platform. Clean, modern and
              focused on clarity, consistency and intuitive learning experiences.
            </p>

            <div className="pt-4 text-[12px] font-mono tracking-wider uppercase text-[#94A3B8]">
              VERSION 1.0 • MAY 2025
            </div>
          </div>

          {/* Right Column: 01 COLORS */}
          <div className="lg:col-span-7 space-y-8 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#F97316]">01</span>
              <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                COLORS
              </h2>
            </div>

            {/* Primary Colors */}
            <div className="space-y-3">
              <h3 className="font-sans font-semibold text-[14px] text-[#0F172A]">Primary</h3>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { name: "Primary 500", hex: "#F97316", bg: "bg-[#F97316]" },
                  { name: "Primary 400", hex: "#FB923C", bg: "bg-[#FB923C]" },
                  { name: "Primary 300", hex: "#FDBA74", bg: "bg-[#FDBA74]" },
                  { name: "Primary 200", hex: "#FED7AA", bg: "bg-[#FED7AA]" },
                  { name: "Primary 100", hex: "#FFEEE5", bg: "bg-[#FFEEE5]" },
                ].map((color) => (
                  <div key={color.hex} className="space-y-2">
                    <div className={`h-16 rounded-[12px] ${color.bg} shadow-sm border border-black/5`} />
                    <div className="font-sans">
                      <div className="text-[11px] font-medium text-[#0F172A]">{color.name}</div>
                      <div className="text-[10px] font-mono text-[#64748B]">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neutral Colors */}
            <div className="space-y-3">
              <h3 className="font-sans font-semibold text-[14px] text-[#0F172A]">Neutral</h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {[
                  { name: "Neutral 900", hex: "#0F172A", bg: "bg-[#0F172A]", border: "" },
                  { name: "Neutral 700", hex: "#334155", bg: "bg-[#334155]", border: "" },
                  { name: "Neutral 500", hex: "#64748B", bg: "bg-[#64748B]", border: "" },
                  { name: "Neutral 300", hex: "#CBD5E1", bg: "bg-[#CBD5E1]", border: "" },
                  { name: "Neutral 200", hex: "#E2E8F0", bg: "bg-[#E2E8F0]", border: "" },
                  { name: "Neutral 100", hex: "#F1F5F9", bg: "bg-[#F1F5F9]", border: "" },
                  { name: "Neutral 50", hex: "#FAFAFC", bg: "bg-[#FAFAFC]", border: "border border-[#E2E8F0]" },
                  { name: "White", hex: "#FFFFFF", bg: "bg-[#FFFFFF]", border: "border border-[#E2E8F0]" },
                ].map((color) => (
                  <div key={color.hex} className="space-y-2">
                    <div className={`h-16 rounded-[12px] ${color.bg} ${color.border} shadow-sm`} />
                    <div className="font-sans">
                      <div className="text-[11px] font-medium text-[#0F172A] truncate">{color.name}</div>
                      <div className="text-[10px] font-mono text-[#64748B]">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 02 TYPOGRAPHY & 03 TYPE SCALE */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#E2E8F0]">
          {/* 02 Typography */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#F97316]">02</span>
              <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                TYPOGRAPHY
              </h2>
            </div>

            {/* Playfair Display */}
            <div className="flex items-baseline gap-6">
              <span className="font-serif text-[48px] font-bold text-[#0F172A] leading-none select-none">
                Ag
              </span>
              <div>
                <h3 className="font-serif font-bold text-[20px] text-[#0F172A]">
                  Playfair Display
                </h3>
                <p className="font-sans text-[13px] text-[#64748B] mt-1">
                  Elegant <span className="text-[#F97316]">•</span> Readable <span className="text-[#F97316]">•</span> Timeless
                </p>
              </div>
            </div>

            {/* Inter */}
            <div className="flex items-baseline gap-6 pt-4 border-t border-[#F1F5F9]">
              <span className="font-sans text-[48px] font-bold text-[#0F172A] leading-none select-none">
                Ag
              </span>
              <div>
                <h3 className="font-sans font-bold text-[20px] text-[#0F172A]">
                  Inter
                </h3>
                <p className="font-sans text-[13px] text-[#64748B] mt-1">
                  Clean <span className="text-[#F97316]">•</span> Modern <span className="text-[#F97316]">•</span> Highly legible
                </p>
              </div>
            </div>
          </div>

          {/* 03 Type Scale */}
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#F97316]">03</span>
              <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                TYPE SCALE
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-[13px]">
                <thead>
                  <tr className="text-[#64748B] border-b border-[#F1F5F9]">
                    <th className="pb-3 font-semibold">Style</th>
                    <th className="pb-3 font-semibold">Font</th>
                    <th className="pb-3 font-semibold">Size / Line Height</th>
                    <th className="pb-3 font-semibold">Weight</th>
                    <th className="pb-3 font-semibold">Use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {[
                    { style: "Display 1", font: "Playfair Display", size: "48 / 56", weight: "Bold", use: "Page titles", isSerif: true },
                    { style: "Display 2", font: "Playfair Display", size: "36 / 44", weight: "Bold", use: "Section titles", isSerif: true },
                    { style: "Heading 1", font: "Inter", size: "28 / 36", weight: "Semi Bold", use: "Card titles", isSerif: false },
                    { style: "Heading 2", font: "Inter", size: "22 / 30", weight: "Semi Bold", use: "Sub section", isSerif: false },
                    { style: "Heading 3", font: "Inter", size: "18 / 26", weight: "Medium", use: "Small titles", isSerif: false },
                    { style: "Body Large", font: "Inter", size: "16 / 24", weight: "Regular", use: "Body copy", isSerif: false },
                    { style: "Body", font: "Inter", size: "14 / 20", weight: "Regular", use: "Supporting text", isSerif: false },
                    { style: "Small", font: "Inter", size: "12 / 16", weight: "Regular", use: "Captions, meta", isSerif: false },
                  ].map((row) => (
                    <tr key={row.style} className="hover:bg-[#FAFAFC] transition-colors">
                      <td className={`py-2.5 font-medium text-[#0F172A] ${row.isSerif ? "font-serif" : "font-sans"}`}>
                        {row.style}
                      </td>
                      <td className="py-2.5 text-[#64748B]">{row.font}</td>
                      <td className="py-2.5 font-mono text-[#64748B]">{row.size}</td>
                      <td className="py-2.5 text-[#0F172A] font-medium">{row.weight}</td>
                      <td className="py-2.5 text-[#64748B]">{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 04 SPACING SYSTEM & 05 RADIUS & SHADOWS */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#E2E8F0]">
          {/* 04 Spacing System */}
          <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] font-bold text-[#F97316]">04</span>
                <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                  SPACING SYSTEM
                </h2>
              </div>
              <span className="text-[12px] font-mono text-[#64748B]">Base unit: 4px</span>
            </div>

            <div className="flex items-end justify-between gap-2 pt-6 overflow-x-auto">
              {[
                { px: 4, rem: "0.25rem", h: "h-2" },
                { px: 8, rem: "0.5rem", h: "h-4" },
                { px: 12, rem: "0.75rem", h: "h-6" },
                { px: 16, rem: "1rem", h: "h-8" },
                { px: 24, rem: "1.5rem", h: "h-12" },
                { px: 32, rem: "2rem", h: "h-16" },
                { px: 40, rem: "2.5rem", h: "h-20" },
                { px: 48, rem: "3rem", h: "h-24" },
                { px: 64, rem: "4rem", h: "h-28" },
              ].map((item) => (
                <div key={item.px} className="flex flex-col items-center gap-2 shrink-0">
                  <div className={`w-9 ${item.h} bg-[#FED7AA] rounded-[4px] border border-[#FDBA74]/40`} />
                  <div className="text-center font-sans">
                    <div className="text-[12px] font-semibold text-[#0F172A]">{item.px}</div>
                    <div className="text-[10px] text-[#64748B] font-mono whitespace-nowrap">({item.rem})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 05 Radius & Shadows */}
          <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#F97316]">05</span>
              <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                RADIUS & SHADOWS
              </h2>
            </div>

            {/* Radius */}
            <div className="space-y-2">
              <h3 className="font-sans font-semibold text-[13px] text-[#0F172A]">Radius</h3>
              <div className="grid grid-cols-6 gap-3">
                {[
                  { name: "4px", label: "(xs)", radius: "rounded-[4px]" },
                  { name: "8px", label: "(sm)", radius: "rounded-[8px]" },
                  { name: "12px", label: "(md)", radius: "rounded-[12px]" },
                  { name: "16px", label: "(lg)", radius: "rounded-[16px]" },
                  { name: "24px", label: "(xl)", radius: "rounded-[24px]" },
                  { name: "Full", label: "(circle)", radius: "rounded-full" },
                ].map((r) => (
                  <div key={r.name} className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 border-2 border-[#CBD5E1] bg-[#F8FAFC] ${r.radius}`} />
                    <div className="text-center font-sans">
                      <div className="text-[11px] font-medium text-[#0F172A]">{r.name}</div>
                      <div className="text-[10px] text-[#64748B]">{r.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shadows */}
            <div className="space-y-2 pt-4 border-t border-[#F1F5F9]">
              <h3 className="font-sans font-semibold text-[13px] text-[#0F172A]">Shadows</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: "Sm", spec: "0 1px 2px 0", alpha: "rgba(15, 23, 42, 0.05)", shadowClass: "shadow-sm" },
                  { name: "Md", spec: "0 4px 12px -2px", alpha: "rgba(15, 23, 42, 0.08)", shadowClass: "shadow-md" },
                  { name: "Lg", spec: "0 12px 24px -4px", alpha: "rgba(15, 23, 42, 0.10)", shadowClass: "shadow-lg" },
                  { name: "Xl", spec: "0 20px 40px -8px", alpha: "rgba(15, 23, 42, 0.12)", shadowClass: "shadow-xl" },
                ].map((s) => (
                  <div key={s.name} className={`bg-white border border-[#E2E8F0] rounded-[12px] p-3 ${s.shadowClass} space-y-1`}>
                    <div className="font-sans font-semibold text-[13px] text-[#0F172A]">{s.name}</div>
                    <div className="font-mono text-[10px] text-[#64748B]">{s.spec}</div>
                    <div className="font-mono text-[9px] text-[#94A3B8] truncate">{s.alpha}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 06 ICONS, 07 BUTTONS, 08 INPUTS */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#E2E8F0]">
          {/* 06 Icons */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#F97316]">06</span>
              <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                ICONS
              </h2>
            </div>

            {/* Outline Style */}
            <div className="space-y-2">
              <h3 className="font-sans text-[12px] font-medium text-[#64748B]">Outline Style</h3>
              <div className="flex items-center justify-between text-[#0F172A] p-2 bg-[#FAFAFC] rounded-[12px] border border-[#E2E8F0]">
                <BellIcon size={20} />
                <SearchIcon size={20} />
                <PlayIcon size={20} />
                <DocumentIcon size={20} />
                <BookmarkIcon size={20} />
                <StatsIcon size={20} />
                <ClockIcon size={20} />
                <UserIcon size={20} />
                <ChevronRightIcon size={20} />
              </div>
            </div>

            {/* Filled Style */}
            <div className="space-y-2">
              <h3 className="font-sans text-[12px] font-medium text-[#64748B]">Filled Style</h3>
              <div className="flex items-center justify-between text-[#0F172A] p-2 bg-[#FAFAFC] rounded-[12px] border border-[#E2E8F0]">
                <BellIcon size={20} filled />
                <SearchIcon size={20} filled />
                <PlayIcon size={20} filled />
                <DocumentIcon size={20} filled />
                <BookmarkIcon size={20} filled />
                <StatsIcon size={20} filled />
                <ClockIcon size={20} filled />
                <UserIcon size={20} filled />
                <ChevronRightIcon size={20} />
              </div>
            </div>

            {/* Icon Specs */}
            <div className="pt-4 border-t border-[#F1F5F9] space-y-1.5 font-sans">
              <h3 className="text-[12px] font-semibold text-[#0F172A]">Icon Specs</h3>
              <ul className="text-[11px] text-[#64748B] space-y-1 list-disc list-inside">
                <li>24x24px grid</li>
                <li>2px stroke width (outline)</li>
                <li>Rounded line caps</li>
                <li>Consistent optical balance</li>
              </ul>
            </div>
          </div>

          {/* 07 Buttons */}
          <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#F97316]">07</span>
              <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                BUTTONS
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead>
                  <tr className="text-[11px] font-semibold text-[#64748B] border-b border-[#F1F5F9]">
                    <th className="pb-2"></th>
                    <th className="pb-2">Primary</th>
                    <th className="pb-2">Secondary</th>
                    <th className="pb-2">Tertiary</th>
                    <th className="pb-2">Text</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-[13px]">
                  {/* Default */}
                  <tr>
                    <td className="py-3 text-[11px] text-[#64748B] font-medium pr-2">Default</td>
                    <td className="py-3 pr-2">
                      <Button variant="primary" size="sm">Get Started</Button>
                    </td>
                    <td className="py-3 pr-2">
                      <Button variant="secondary" size="sm">Explore Courses</Button>
                    </td>
                    <td className="py-3 pr-2">
                      <Button variant="tertiary" size="sm" rightIcon={<ExternalLinkIcon size={14} />}>View Lesson</Button>
                    </td>
                    <td className="py-3">
                      <Button variant="text" size="sm" rightIcon={<PlayIcon size={14} />}>Watch Video</Button>
                    </td>
                  </tr>

                  {/* Hover State display */}
                  <tr>
                    <td className="py-3 text-[11px] text-[#64748B] font-medium pr-2">Hover</td>
                    <td className="py-3 pr-2">
                      <button className="h-[36px] px-3 text-[13px] inline-flex items-center justify-center font-medium font-sans rounded-[12px] bg-[#EA580C] text-white shadow">
                        Get Started
                      </button>
                    </td>
                    <td className="py-3 pr-2">
                      <button className="h-[36px] px-3 text-[13px] inline-flex items-center justify-center font-medium font-sans rounded-[12px] bg-[#FFF7ED] border border-[#FB923C] text-[#F97316]">
                        Explore Courses
                      </button>
                    </td>
                    <td className="py-3 pr-2">
                      <button className="h-[36px] px-3 text-[13px] inline-flex items-center justify-center font-medium font-sans rounded-[12px] bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] gap-1.5">
                        <span>View Lesson</span>
                        <ExternalLinkIcon size={14} />
                      </button>
                    </td>
                    <td className="py-3">
                      <button className="text-[13px] inline-flex items-center justify-center font-medium font-sans text-[#EA580C] gap-1.5">
                        <span>Watch Video</span>
                        <PlayIcon size={14} />
                      </button>
                    </td>
                  </tr>

                  {/* Disabled */}
                  <tr>
                    <td className="py-3 text-[11px] text-[#64748B] font-medium pr-2">Disabled</td>
                    <td className="py-3 pr-2">
                      <Button variant="primary" size="sm" disabled>Get Started</Button>
                    </td>
                    <td className="py-3 pr-2">
                      <Button variant="secondary" size="sm" disabled>Explore Courses</Button>
                    </td>
                    <td className="py-3 pr-2">
                      <Button variant="tertiary" size="sm" disabled rightIcon={<ExternalLinkIcon size={14} />}>View Lesson</Button>
                    </td>
                    <td className="py-3">
                      <Button variant="text" size="sm" disabled rightIcon={<PlayIcon size={14} />}>Watch Video</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Button Specs */}
            <div className="pt-4 border-t border-[#F1F5F9] space-y-1.5 font-sans">
              <h3 className="text-[12px] font-semibold text-[#0F172A]">Button Specs</h3>
              <ul className="text-[11px] text-[#64748B] space-y-1 list-disc list-inside">
                <li>Height: 44px (default)</li>
                <li>Padding: 0 16px (lg), 0 12px (md)</li>
                <li>Radius: 12px</li>
                <li>Font: Inter Medium (14–16px)</li>
              </ul>
            </div>
          </div>

          {/* 08 Inputs */}
          <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#F97316]">08</span>
              <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                INPUTS
              </h2>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[#64748B] font-sans">Search / Text Input</label>
              <Input showSearchShortcut placeholder="Search anything..." />
            </div>

            {/* Select Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[#64748B] font-sans">Select</label>
              <Select
                defaultValue="most-relevant"
                options={[
                  { value: "most-relevant", label: "Most Relevant" },
                  { value: "newest", label: "Newest" },
                  { value: "popular", label: "Most Popular" },
                ]}
              />
            </div>

            {/* Field Specs */}
            <div className="pt-4 border-t border-[#F1F5F9] space-y-1.5 font-sans">
              <h3 className="text-[12px] font-semibold text-[#0F172A]">Field Specs</h3>
              <ul className="text-[11px] text-[#64748B] space-y-1 list-disc list-inside">
                <li>Height: 44px</li>
                <li>Radius: 12px</li>
                <li>Border: 1px solid #E2E8F0</li>
                <li>Padding: 0 16px</li>
                <li>Focus: Border color #FB923C</li>
              </ul>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 09 BADGES, 10 STATUS, 11 PROGRESS BAR */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#E2E8F0]">
          {/* 09 Badges / Tags */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#F97316]">09</span>
              <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                BADGES / TAGS
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-[11px] font-medium text-[#64748B]">Video</div>
                <Badge variant="video">VIDEO</Badge>
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-medium text-[#64748B]">Lesson</div>
                <Badge variant="lesson">LESSON</Badge>
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-medium text-[#64748B]">Popular</div>
                <Badge variant="popular">POPULAR</Badge>
              </div>
            </div>
          </div>

          {/* 10 Status / Indicators */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#F97316]">10</span>
              <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                STATUS / INDICATORS
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatusIndicator status="in-progress" />
              <StatusIndicator status="completed" />
              <StatusIndicator status="now-playing" />
              <StatusIndicator status="locked" />
            </div>
          </div>

          {/* 11 Progress Bar */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#F97316]">11</span>
              <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
                PROGRESS BAR
              </h2>
            </div>

            <div className="pt-2">
              <ProgressBar progress={35} />
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 12 CARDS */}
        {/* ========================================================================= */}
        <section className="space-y-6 pb-12 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-bold text-[#F97316]">12</span>
            <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
              CARDS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Course Card */}
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-[#64748B]">Course Card</div>
              <CourseCard
                title="Next.js for Production"
                description="Build scalable, high-performance web applications with Next.js."
                level="Intermediate"
                duration="18h 24m"
                modulesCount="12 modules"
              />
            </div>

            {/* Lesson Card (Video) */}
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-[#64748B]">Lesson Card (Video)</div>
              <LessonVideoCard
                title="Data Fetching in Server Components"
                description="Learn how to fetch data on the server using async/await and Next.js best practices."
                lessonLabel="Lesson 5.1"
                duration="12:45"
                timestamp="12:45"
              />
            </div>

            {/* Lesson Card (Lesson) */}
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-[#64748B]">Lesson Card (Lesson)</div>
              <LessonTopicCard
                title="Data Fetching & Caching"
                description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
                moduleLabel="Module 5"
              />
            </div>

            {/* Resource Card */}
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-[#64748B]">Resource Card</div>
              <ResourceCard
                title="Caching and Revalidation Guide"
                description="Deep dive into Next.js caching strategies."
                fileFormat="PDF"
                fileSize="1.2 MB"
              />
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 13 NAVIGATION */}
        {/* ========================================================================= */}
        <section className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-8 pb-12 border-b">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-bold text-[#F97316]">13</span>
            <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
              NAVIGATION
            </h2>
          </div>

          {/* Top Bar Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 px-6 bg-[#FAFAFC] border border-[#E2E8F0] rounded-[16px]">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <VertexLogo size={24} />
                  <span className="font-bold text-[17px] text-[#0F172A]">Vertex</span>
                </div>

                <nav className="flex items-center gap-6 text-[14px] font-medium">
                  <button
                    onClick={() => setActiveNav("courses")}
                    className={`transition-colors cursor-pointer ${
                      activeNav === "courses"
                        ? "text-[#F97316] font-semibold"
                        : "text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    Courses
                  </button>
                  <button
                    onClick={() => setActiveNav("my-learning")}
                    className={`transition-colors cursor-pointer ${
                      activeNav === "my-learning"
                        ? "text-[#F97316] font-semibold"
                        : "text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  >
                    My Learning
                  </button>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
                  <BellIcon size={16} />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FFEEE5] text-[#F97316] flex items-center justify-center">
                  <UserIcon size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumbs & Pagination Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
            <div className="space-y-2">
              <div className="text-[12px] font-medium text-[#64748B]">Breadcrumbs</div>
              <Breadcrumbs
                items={[
                  { label: "All Courses", href: "#courses" },
                  { label: "Next.js for Production", href: "#course" },
                  { label: "Data Fetching & Caching", isCurrent: true },
                ]}
              />
            </div>

            <div className="space-y-2 md:text-right">
              <div className="text-[12px] font-medium text-[#64748B]">Pagination</div>
              <Pagination
                currentPage={currentPage}
                totalPages={8}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 14 PRINCIPLES */}
        {/* ========================================================================= */}
        <section className="bg-white border border-[#E2E8F0] rounded-[20px] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-bold text-[#F97316]">14</span>
            <h2 className="font-mono text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">
              PRINCIPLES
            </h2>
          </div>

          <PrinciplesGrid />
        </section>

      </div>
    </div>
  );
}
