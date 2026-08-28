import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLessonBySlug } from "@/sanity/lib/data";
import { LessonView } from "@/components/lesson/lesson-view";

interface LessonPageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
  searchParams: Promise<{
    start?: string;
    t?: string;
    seconds?: string;
  }>;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { lessonSlug } = await params;
  const lesson = await getLessonBySlug(lessonSlug);

  if (!lesson) {
    return {
      title: "Lesson Not Found | Vertex",
    };
  }

  return {
    title: `${lesson.title} | Vertex`,
    description: lesson.summary || `Watch ${lesson.title} on Vertex`,
  };
}

export default async function CourseLessonAliasPage({ params, searchParams }: LessonPageProps) {
  const { lessonSlug } = await params;
  const search = await searchParams;
  const startSeconds = parseFloat(search.start || search.t || search.seconds || "0") || 0;

  const lesson = await getLessonBySlug(lessonSlug);

  if (!lesson) {
    notFound();
  }

  return <LessonView lesson={lesson} startSeconds={startSeconds} />;
}
