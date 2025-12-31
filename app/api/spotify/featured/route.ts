import { NextRequest, NextResponse } from 'next/server';
import { searchTracks } from '@/lib/spotify';
import { Song, Mood } from '@/types';
import { getDeezerPreviewUrl } from '@/lib/deezer';
import { getRandomSampleAudio } from '@/lib/sampleAudio';

const defaultQueries = [
  { query: 'top hits 2024', mood: 'energetic' as Mood },
  { query: 'chill vibes', mood: 'calm' as Mood },
  { query: 'feel good music', mood: 'uplifting' as Mood },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '8');

  try {
    // Get a mix of different moods
    const allTracks: Song[] = [];

    for (const { query, mood } of defaultQueries) {
      const tracks = await searchTracks(query, Math.ceil(limit / 3));

      // Fetch Deezer previews in parallel
      const songsWithPreviews = await Promise.all(
        tracks.map(async (track, index) => {
          const title = track.name;
          const artist = track.artists?.map((a) => a.name).join(', ') || 'Unknown';

          // Try Spotify preview first, then Deezer, then fallback
          let previewUrl = track.preview_url;
          if (!previewUrl) {
            previewUrl = await getDeezerPreviewUrl(title, artist);
          }
          if (!previewUrl) {
            previewUrl = getRandomSampleAudio(allTracks.length + index);
          }

          return {
            id: track.id,
            title,
            artist,
            reason: '오늘의 추천곡',
            bpm: 80 + Math.floor(Math.random() * 80),
            mood,
            albumArt: track.album?.images?.[0]?.url,
            previewUrl,
            duration: track.duration_ms ? Math.floor(track.duration_ms / 1000) : 180,
          } as Song;
        })
      );

      allTracks.push(...songsWithPreviews);
    }

    // Shuffle and limit
    const shuffled = allTracks.sort(() => Math.random() - 0.5).slice(0, limit);

    return NextResponse.json({ songs: shuffled });
  } catch (error) {
    console.error('Featured tracks error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured' }, { status: 500 });
  }
}
