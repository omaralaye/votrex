"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

/**
 * Identifies the authenticated Clerk user with PostHog so that client-side
 * and server-side events share a stable distinct ID.
 * Also resets the PostHog session when the user signs out.
 * Render this inside ClerkProvider (e.g. in the root layout).
 */
export function PostHogIdentifier() {
  const { isSignedIn, user, isLoaded } = useUser();
  const wasSignedInRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      wasSignedInRef.current = true;
      // Identify the user so anonymous events are merged with their profile.
      // PII (email, name) goes on the person, NOT in capture() properties.
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
        username: user.username ?? undefined,
      });
    } else if (wasSignedInRef.current && !isSignedIn) {
      // Call posthog.reset() on logout to cleanly terminate the identified session
      posthog.reset();
      wasSignedInRef.current = false;
    }
  }, [isSignedIn, user, isLoaded]);

  return null;
}
