import { NextRequest, NextResponse } from 'next/server';
import { searchTracks, searchTrack } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const title = searchParams.get('title');
  const artist = searchParams.get('artist');

  try {
    // Search by title + artist (exact match)
    if (title && artist) {
      const track = await searchTrack(title, artist);
      if (!track) {
        return NextResponse.json({ error: 'Track not found' }, { status: 404 });
      }
      return NextResponse.json({ track });
    }

    // General search
    if (query) {
      const tracks = await searchTracks(query);
      return NextResponse.json({ tracks });
    }

    return NextResponse.json(
      { error: 'Missing query parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json(
      { error: 'Failed to search tracks' },
      { status: 500 }
    );
  }
}
