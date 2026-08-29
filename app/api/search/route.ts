import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/search-service';
import { getPostHogClient } from '@/lib/posthog-server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('query') || '';
  const sort = (searchParams.get('sort') as 'relevance' | 'newest' | 'duration') || 'relevance';

  try {
    const result = await searchContent(query, sort);
    const durationMs = Date.now() - startTime;

    // Server-side PostHog tracking for search action
    const posthog = getPostHogClient();
    if (posthog && query.trim()) {
      let distinctId = request.headers.get('x-posthog-distinct-id') || undefined;
      if (!distinctId) {
        try {
          const authData = await auth();
          distinctId = authData.userId || undefined;
        } catch {
          // Non-blocking fallback for unauthenticated requests
        }
      }

      posthog.capture({
        distinctId: distinctId || 'anonymous_server_search',
        event: 'search_performed',
        properties: {
          query: query.trim(),
          results_count: result.totalResults,
          courses_count: result.coursesCount,
          sort,
          source: 'api_route_get',
          duration_ms: durationMs,
        },
      });
      await posthog.flush();
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    const posthog = getPostHogClient();
    if (posthog) {
      let distinctId = request.headers.get('x-posthog-distinct-id') || undefined;
      if (!distinctId) {
        try {
          const authData = await auth();
          distinctId = authData.userId || undefined;
        } catch {
          // ignore
        }
      }
      posthog.captureException(error, distinctId, {
        query: query.trim(),
        sort,
        source: 'api_route_get',
      });
      await posthog.flush();
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let query = '';
  let sort: 'relevance' | 'newest' | 'duration' = 'relevance';

  try {
    const body = await request.json();
    query = body.query || body.q || '';
    sort = (body.sort as 'relevance' | 'newest' | 'duration') || 'relevance';

    const result = await searchContent(query, sort);
    const durationMs = Date.now() - startTime;

    // Server-side PostHog tracking for search action
    const posthog = getPostHogClient();
    if (posthog && query.trim()) {
      let distinctId = request.headers.get('x-posthog-distinct-id') || undefined;
      if (!distinctId) {
        try {
          const authData = await auth();
          distinctId = authData.userId || undefined;
        } catch {
          // Non-blocking fallback
        }
      }

      posthog.capture({
        distinctId: distinctId || 'anonymous_server_search',
        event: 'search_performed',
        properties: {
          query: query.trim(),
          results_count: result.totalResults,
          courses_count: result.coursesCount,
          sort,
          source: 'api_route_post',
          duration_ms: durationMs,
        },
      });
      await posthog.flush();
    }

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error('Search API error:', error);
    const posthog = getPostHogClient();
    if (posthog) {
      let distinctId = request.headers.get('x-posthog-distinct-id') || undefined;
      if (!distinctId) {
        try {
          const authData = await auth();
          distinctId = authData.userId || undefined;
        } catch {
          // ignore
        }
      }
      posthog.captureException(error, distinctId, {
        query: query.trim(),
        sort,
        source: 'api_route_post',
      });
      await posthog.flush();
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
