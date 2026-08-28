import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourseBySlug } from "@/sanity/lib/data";
import { CourseView } from "@/components/course/course-view";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found | Vertex",
    };
  }

  return {
    title: `${course.title} | Vertex`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CourseView course={course} />;
}
