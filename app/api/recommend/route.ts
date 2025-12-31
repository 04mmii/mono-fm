import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchTrack } from '@/lib/spotify';
import { Song, Mood } from '@/types';
import { getDeezerPreviewUrl } from '@/lib/deezer';
import { getRandomSampleAudio } from '@/lib/sampleAudio';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AIRecommendation {
  title: string;
  artist: string;
  reason: string;
  bpm: number;
  mood: string;
}

interface AIResponse {
  songs: AIRecommendation[];
  playlistMood: string;
}

async function getAIRecommendations(prompt: string): Promise<AIResponse> {
  const systemPrompt = `당신은 음악 큐레이터입니다. 사용자의 기분이나 상황에 맞는 음악을 추천해주세요.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:

{
  "songs": [
    {
      "title": "곡 제목",
      "artist": "아티스트명",
      "reason": "추천 이유 (한국어, 짧게)",
      "bpm": 120,
      "mood": "calm|energetic|melancholy|romantic|dark|uplifting 중 하나"
    }
  ],
  "playlistMood": "플레이리스트 분위기 설명 (한국어)"
}

규칙:
- 실제로 존재하는 곡만 추천하세요
- 5곡을 추천하세요
- 다양한 장르와 시대의 곡을 섞어주세요
- BPM은 곡의 실제 템포에 맞게 설정하세요
- mood는 반드시 calm, energetic, melancholy, romantic, dark, uplifting 중 하나여야 합니다`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `다음 분위기/상황에 맞는 음악을 추천해주세요: "${prompt}"`,
      },
    ],
    system: systemPrompt,
  });

  // Extract text content
  const textContent = message.content.find(block => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI');
  }

  // Parse JSON response
  try {
    const response = JSON.parse(textContent.text) as AIResponse;
    return response;
  } catch {
    console.error('Failed to parse AI response:', textContent.text);
    throw new Error('Failed to parse AI response');
  }
}

// Fallback mock data
const fallbackRecommendations: AIResponse = {
  songs: [
    { title: 'Clair de Lune', artist: 'Claude Debussy', reason: '잔잔한 피아노 선율', bpm: 72, mood: 'calm' },
    { title: 'Gymnopedie No.1', artist: 'Erik Satie', reason: '몽환적인 분위기', bpm: 66, mood: 'calm' },
    { title: 'River Flows in You', artist: 'Yiruma', reason: '감성적인 멜로디', bpm: 70, mood: 'romantic' },
    { title: 'Experience', artist: 'Ludovico Einaudi', reason: '감동적인 피아노', bpm: 80, mood: 'melancholy' },
    { title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', reason: '평화로운 느낌', bpm: 75, mood: 'calm' },
  ],
  playlistMood: '평화로운 피아노 음악',
};

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get AI recommendations or fallback
    let recommendations: AIResponse;

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        recommendations = await getAIRecommendations(prompt);
      } catch (error) {
        console.error('AI recommendation failed, using fallback:', error);
        recommendations = fallbackRecommendations;
      }
    } else {
      console.log('No ANTHROPIC_API_KEY, using fallback');
      recommendations = fallbackRecommendations;
    }

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

        // Validate mood
        const validMoods: Mood[] = ['calm', 'energetic', 'melancholy', 'romantic', 'dark', 'uplifting'];
        const mood = validMoods.includes(song.mood as Mood) ? song.mood as Mood : 'calm';

        return {
          id: spotifyTrack?.id || Math.random().toString(36).substr(2, 9),
          title: song.title,
          artist: song.artist,
          reason: song.reason,
          bpm: song.bpm,
          mood,
          albumArt: spotifyTrack?.album?.images?.[0]?.url || `https://picsum.photos/seed/${encodeURIComponent(song.title)}/300/300`,
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
