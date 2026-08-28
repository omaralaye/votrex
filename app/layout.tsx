import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import { PostHogIdentifier } from "@/components/posthog-identifier";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vertex - Intelligent Learning Platform",
  description: "Search your learning in plain English with Vertex.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAFAFC] text-[#0F172A]">
        <ClerkProvider>
          <PostHogIdentifier />
          {children}
          <SanityLive />
        </ClerkProvider>
      </body>
    </html>
  );
}