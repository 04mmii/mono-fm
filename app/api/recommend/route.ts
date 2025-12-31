import { NextRequest, NextResponse } from 'next/server';
import { searchTrack } from '@/lib/spotify';
import { Song, Mood } from '@/types';
import { getDeezerPreviewUrl } from '@/lib/deezer';
import { getRandomSampleAudio } from '@/lib/sampleAudio';

// Mock AI recommendations (나중에 Claude API로 교체)
const mockRecommendations: Record<string, { songs: Omit<Song, 'id' | 'albumArt' | 'previewUrl' | 'duration'>[]; playlistMood: string }> = {
  default: {
    songs: [
      { title: 'Clair de Lune', artist: 'Claude Debussy', reason: '잔잔한 피아노 선율', bpm: 72, mood: 'calm' },
      { title: 'Gymnopedie No.1', artist: 'Erik Satie', reason: '몽환적인 분위기', bpm: 66, mood: 'calm' },
      { title: 'River Flows in You', artist: 'Yiruma', reason: '감성적인 멜로디', bpm: 70, mood: 'romantic' },
    ],
    playlistMood: '평화로운 피아노 음악',
  },
  energetic: {
    songs: [
      { title: 'Blinding Lights', artist: 'The Weeknd', reason: '신나는 신스팝', bpm: 171, mood: 'energetic' },
      { title: 'Uptown Funk', artist: 'Bruno Mars', reason: '펑키한 그루브', bpm: 115, mood: 'uplifting' },
      { title: 'Levitating', artist: 'Dua Lipa', reason: '중독성 있는 비트', bpm: 103, mood: 'energetic' },
    ],
    playlistMood: '에너지 넘치는 댄스 음악',
  },
  sad: {
    songs: [
      { title: 'Someone Like You', artist: 'Adele', reason: '감동적인 발라드', bpm: 68, mood: 'melancholy' },
      { title: 'Fix You', artist: 'Coldplay', reason: '위로가 되는 곡', bpm: 138, mood: 'melancholy' },
      { title: 'Skinny Love', artist: 'Bon Iver', reason: '잔잔한 포크', bpm: 76, mood: 'melancholy' },
    ],
    playlistMood: '감성적인 발라드 모음',
  },
  jazz: {
    songs: [
      { title: 'Take Five', artist: 'Dave Brubeck', reason: '클래식 재즈', bpm: 174, mood: 'calm' },
      { title: 'So What', artist: 'Miles Davis', reason: '모던 재즈의 정수', bpm: 136, mood: 'calm' },
      { title: 'Fly Me to the Moon', artist: 'Frank Sinatra', reason: '스윙 재즈', bpm: 120, mood: 'romantic' },
    ],
    playlistMood: '클래식 재즈 컬렉션',
  },
};

function getRecommendationType(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('신나') || lowerPrompt.includes('운동') || lowerPrompt.includes('에너지')) {
    return 'energetic';
  }
  if (lowerPrompt.includes('슬프') || lowerPrompt.includes('우울') || lowerPrompt.includes('감성')) {
    return 'sad';
  }
  if (lowerPrompt.includes('재즈') || lowerPrompt.includes('jazz')) {
    return 'jazz';
  }
  return 'default';
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

    // Get mock recommendations based on prompt
    const type = getRecommendationType(prompt);
    const recommendations = mockRecommendations[type] || mockRecommendations.default;

    // Enrich with Spotify data and Deezer previews
    const enrichedSongs: Song[] = await Promise.all(
      recommendations.songs.map(async (song, i) => {
        const spotifyTrack = await searchTrack(song.title, song.artist);

        // Try Spotify preview first, then Deezer, then fallback
        let previewUrl = spotifyTrack?.preview_url;
        if (!previewUrl) {
          previewUrl = await getDeezerPreviewUrl(song.title, song.artist);
        }
        if (!previewUrl) {
          previewUrl = getRandomSampleAudio(i);
        }

        return {
          id: spotifyTrack?.id || Math.random().toString(36).substr(2, 9),
          title: song.title,
          artist: song.artist,
          reason: song.reason,
          bpm: song.bpm,
          mood: song.mood as Mood,
          albumArt: spotifyTrack?.album?.images?.[0]?.url || `https://picsum.photos/seed/${song.title}/300/300`,
          previewUrl,
          duration: spotifyTrack?.duration_ms ? Math.floor(spotifyTrack.duration_ms / 1000) : 180,
        };
      })
    );

    return NextResponse.json({
      songs: enrichedSongs,
      playlistMood: recommendations.playlistMood,
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
