"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

/**
 * Identifies the authenticated Clerk user with PostHog so that client-side
 * and server-side events share a stable distinct ID.
 * Render this inside ClerkProvider (e.g. in the root layout).
 */
export function PostHogIdentifier() {
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      // Identify the user so anonymous events are merged with their profile.
      // PII (email, name) goes on the person, NOT in capture() properties.
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
        username: user.username ?? undefined,
      });
    }
  }, [isSignedIn, user, isLoaded]);

  return null;
}
