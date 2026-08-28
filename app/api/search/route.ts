import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/search-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const sort = (searchParams.get('sort') as 'relevance' | 'newest' | 'duration') || 'relevance';

    const result = await searchContent(query, sort);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query || body.q || '';
    const sort = (body.sort as 'relevance' | 'newest' | 'duration') || 'relevance';

    const result = await searchContent(query, sort);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
