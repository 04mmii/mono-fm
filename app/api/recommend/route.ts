import { NextRequest, NextResponse } from 'next/server';
import { searchTracks } from '@/lib/spotify';
import { Song, Mood } from '@/types';
import { getDeezerPreviewUrl } from '@/lib/deezer';
import { getRandomSampleAudio } from '@/lib/sampleAudio';

// Proxy external URLs to avoid CORS issues
function proxyUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/api/')) return url;
  return `/api/audio-proxy?url=${encodeURIComponent(url)}`;
}

// 키워드에 따른 무드 추정
function guessMood(query: string): Mood {
  const q = query.toLowerCase();
  if (q.includes('신나') || q.includes('운동') || q.includes('파티') || q.includes('energy') || q.includes('dance')) {
    return 'energetic';
  }
  if (q.includes('슬프') || q.includes('우울') || q.includes('이별') || q.includes('sad')) {
    return 'melancholy';
  }
  if (q.includes('사랑') || q.includes('로맨') || q.includes('love') || q.includes('romantic')) {
    return 'romantic';
  }
  if (q.includes('어두') || q.includes('dark') || q.includes('밤')) {
    return 'dark';
  }
  if (q.includes('희망') || q.includes('기분') || q.includes('happy') || q.includes('uplifting')) {
    return 'uplifting';
  }
  return 'calm';
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Spotify에서 직접 검색
    const tracks = await searchTracks(prompt, 8);

    if (tracks.length === 0) {
      return NextResponse.json(
        { error: 'No tracks found' },
        { status: 404 }
      );
    }

    const mood = guessMood(prompt);

    // Enrich with preview URLs
    const songs: Song[] = await Promise.all(
      tracks.map(async (track, i) => {
        const title = track.name;
        const artist = track.artists?.map((a) => a.name).join(', ') || 'Unknown';

        // Try Spotify preview first, then Deezer, then fallback
        let previewUrl = proxyUrl(track.preview_url);
        if (!previewUrl) {
          previewUrl = proxyUrl(await getDeezerPreviewUrl(title, artist));
        }
        if (!previewUrl) {
          previewUrl = getRandomSampleAudio(i);
        }

        return {
          id: track.id,
          title,
          artist,
          reason: `"${prompt}" 검색 결과`,
          bpm: 80 + Math.floor(Math.random() * 80),
          mood,
          albumArt: track.album?.images?.[0]?.url,
          previewUrl,
          duration: track.duration_ms ? Math.floor(track.duration_ms / 1000) : 180,
        };
      })
    );

    return NextResponse.json({
      songs,
      playlistMood: `"${prompt}" 관련 음악`,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search tracks' },
      { status: 500 }
    );
  }
}
