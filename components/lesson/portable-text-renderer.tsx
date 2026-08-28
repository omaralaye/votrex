import React from "react";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="font-serif font-bold text-[28px] sm:text-[32px] text-[#0F172A] mt-8 mb-4 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif font-bold text-[22px] sm:text-[26px] text-[#0F172A] mt-6 mb-3 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif font-bold text-[18px] sm:text-[20px] text-[#0F172A] mt-5 mb-2.5 leading-snug">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-sans font-semibold text-[16px] text-[#0F172A] mt-4 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="font-sans text-[15px] sm:text-[16px] leading-[1.7] text-[#334155] mb-4 font-normal">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#F97316] pl-4 sm:pl-5 py-2 my-5 bg-[#FFF8F5] rounded-r-xl font-sans text-[15px] italic text-[#475569]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 sm:pl-7 my-4 space-y-2 font-sans text-[15px] sm:text-[16px] text-[#334155] marker:text-[#F97316]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 sm:pl-7 my-4 space-y-2 font-sans text-[15px] sm:text-[16px] text-[#334155] marker:text-[#F97316] marker:font-semibold">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-[1.65]">{children}</li>,
    number: ({ children }) => <li className="leading-[1.65]">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#0F172A]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-[13.5px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#E05D38] border border-[#E2E8F0] font-medium">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-[#F97316] hover:text-[#EA580C] underline underline-offset-2 font-medium transition-colors cursor-pointer"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      try {
        const imageUrl = urlFor(value).width(1200).url();
        return (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden my-6 border border-[#E2E8F0]">
            <Image
              src={imageUrl}
              alt={value.alt || "Lesson diagram"}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        );
      } catch {
        return null;
      }
    },
  },
};

interface PortableTextRendererProps {
  content?: PortableTextBlock[];
}

export function PortableTextRenderer({ content }: PortableTextRendererProps) {
  if (!content || content.length === 0) {
    return (
      <div className="py-8 text-center text-[#64748B] font-sans text-[14px]">
        No detailed notes provided for this lesson yet.
      </div>
    );
  }

  return (
    <div className="prose max-w-none">
      <PortableText value={content} components={components} />
    </div>
  );
}
