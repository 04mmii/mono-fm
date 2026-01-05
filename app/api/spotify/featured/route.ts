import { NextRequest, NextResponse } from 'next/server';
import { searchTracks } from '@/lib/spotify';
import { Song, Mood } from '@/types';
import { getDeezerPreviewUrl } from '@/lib/deezer';
import { getRandomSampleAudio } from '@/lib/sampleAudio';

// Proxy external URLs to avoid CORS issues
function proxyUrl(url: string | null): string | null {
  if (!url) return null;
  // Already proxied or relative URL
  if (url.startsWith('/api/')) return url;
  return `/api/audio-proxy?url=${encodeURIComponent(url)}`;
}

// 다양한 검색 쿼리 풀
const allQueries = [
  // 최신 인기곡
  { query: 'top hits 2024', mood: 'energetic' as Mood, reason: '2024 인기곡' },
  { query: 'viral hits 2024', mood: 'energetic' as Mood, reason: '바이럴 히트' },
  { query: 'new music friday', mood: 'uplifting' as Mood, reason: '최신 발매곡' },

  // K-Pop
  { query: 'kpop hits', mood: 'energetic' as Mood, reason: 'K-Pop 인기곡' },
  { query: 'kpop 2024', mood: 'energetic' as Mood, reason: 'K-Pop 최신곡' },
  { query: 'korean r&b', mood: 'calm' as Mood, reason: '한국 R&B' },

  // 장르별
  { query: 'indie pop', mood: 'uplifting' as Mood, reason: '인디 팝' },
  { query: 'hip hop hits', mood: 'energetic' as Mood, reason: '힙합' },
  { query: 'r&b soul', mood: 'romantic' as Mood, reason: 'R&B 소울' },
  { query: 'jazz lounge', mood: 'calm' as Mood, reason: '재즈' },
  { query: 'acoustic covers', mood: 'calm' as Mood, reason: '어쿠스틱' },
  { query: 'electronic dance', mood: 'energetic' as Mood, reason: 'EDM' },
  { query: 'lo-fi beats', mood: 'calm' as Mood, reason: '로파이' },
  { query: 'rock classics', mood: 'energetic' as Mood, reason: '록 클래식' },

  // 분위기별
  { query: 'chill vibes', mood: 'calm' as Mood, reason: '칠한 분위기' },
  { query: 'feel good music', mood: 'uplifting' as Mood, reason: '기분 좋은 음악' },
  { query: 'sad songs', mood: 'melancholy' as Mood, reason: '감성적인 노래' },
  { query: 'romantic ballad', mood: 'romantic' as Mood, reason: '로맨틱 발라드' },
  { query: 'workout music', mood: 'energetic' as Mood, reason: '운동할 때' },
  { query: 'study music', mood: 'calm' as Mood, reason: '공부할 때' },
  { query: 'sleep music', mood: 'calm' as Mood, reason: '잠들기 전' },
  { query: 'party songs', mood: 'energetic' as Mood, reason: '파티 음악' },

  // 해외 인기
  { query: 'billboard hot 100', mood: 'energetic' as Mood, reason: '빌보드 인기곡' },
  { query: 'pop hits', mood: 'uplifting' as Mood, reason: '팝 히트' },
  { query: 'latin hits', mood: 'energetic' as Mood, reason: '라틴 음악' },
  { query: 'japanese city pop', mood: 'uplifting' as Mood, reason: '시티팝' },
];

// 랜덤하게 3개 선택
function getRandomQueries() {
  const shuffled = [...allQueries].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '8');

  try {
    // Get a mix of different moods (랜덤 쿼리 선택)
    const allTracks: Song[] = [];
    const selectedQueries = getRandomQueries();

    for (const { query, mood, reason } of selectedQueries) {
      const tracks = await searchTracks(query, Math.ceil(limit / 3));

      // Fetch Deezer previews in parallel
      const songsWithPreviews = await Promise.all(
        tracks.map(async (track, index) => {
          const title = track.name;
          const artist = track.artists?.map((a) => a.name).join(', ') || 'Unknown';

          // Try Spotify preview first, then Deezer, then fallback
          let previewUrl = proxyUrl(track.preview_url);
          if (!previewUrl) {
            previewUrl = proxyUrl(await getDeezerPreviewUrl(title, artist));
          }
          if (!previewUrl) {
            previewUrl = getRandomSampleAudio(allTracks.length + index);
          }

          return {
            id: track.id,
            title,
            artist,
            reason,
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
