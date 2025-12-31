import { NextRequest, NextResponse } from 'next/server';
import { searchByCategory } from '@/lib/spotify';
import { Song, Mood } from '@/types';
import { getDeezerPreviewUrl } from '@/lib/deezer';
import { getRandomSampleAudio } from '@/lib/sampleAudio';

const moodMap: Record<string, Mood> = {
  classic: 'calm',
  '90s': 'uplifting',
  new: 'energetic',
  jazz: 'calm',
  indie: 'melancholy',
  kpop: 'energetic',
  hiphop: 'energetic',
  rock: 'energetic',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'new';
  const limit = parseInt(searchParams.get('limit') || '6');

  try {
    const tracks = await searchByCategory(category, limit);

    // Fetch Deezer previews in parallel
    const songs: Song[] = await Promise.all(
      tracks.map(async (track, index) => {
        const title = track.name;
        const artist = track.artists?.map((a) => a.name).join(', ') || 'Unknown';

        // Try Spotify preview first, then Deezer, then fallback
        let previewUrl = track.preview_url;
        if (!previewUrl) {
          previewUrl = await getDeezerPreviewUrl(title, artist);
        }
        if (!previewUrl) {
          previewUrl = getRandomSampleAudio(index);
        }

        return {
          id: track.id,
          title,
          artist,
          reason: `${category} 추천곡`,
          bpm: 100 + Math.floor(Math.random() * 60),
          mood: moodMap[category] || 'calm',
          albumArt: track.album?.images?.[0]?.url,
          previewUrl,
          duration: track.duration_ms ? Math.floor(track.duration_ms / 1000) : 180,
        };
      })
    );

    return NextResponse.json({ songs, category });
  } catch (error) {
    console.error('Category search error:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}
