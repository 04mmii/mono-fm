import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchTrack } from '@/lib/spotify';
import { Song, Mood } from '@/types';
import { getDeezerPreviewUrl } from '@/lib/deezer';
import { getRandomSampleAudio } from '@/lib/sampleAudio';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const VALID_MOODS: Mood[] = [
  'calm',
  'energetic',
  'melancholy',
  'romantic',
  'dark',
  'uplifting',
];

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

// Proxy external URLs to avoid CORS issues
function proxyUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('/api/')) return url;
  return `/api/audio-proxy?url=${encodeURIComponent(url)}`;
}

const SYSTEM_PROMPT = `당신은 MONO.fm의 음악 큐레이터입니다. MONO.fm은 레트로 턴테이블 감성의 서비스로,
아날로그하고 오래된 질감의 음악만을 다룹니다.

추천 가능한 음악 (이 범위 안에서만 고르세요):
- 시티팝 (일본 80년대 시티팝, 라이트 멜로우)
- 올드스쿨 소울 / 펑크(Funk) / 모타운 / 디스코
- 70~90년대 팝, 록, 발라드
- 재즈 스탠다드, 보사노바, 크루너 보컬
- 빈티지 신스 사운드 (신스팝, 신스웨이브, 아날로그 신디사이저 중심의 곡)

금지 사항:
- 최신 유행곡, 차트 히트곡, 2010년대 이후에 발표된 곡은 추천하지 마세요
- 현대적인 프로덕션(트랩 비트, EDM 드롭, 오토튠 중심, 과도한 사이드체인 압축)의 곡은 제외하세요
- 실존하지 않는 곡이나 아티스트를 지어내지 마세요

응답 형식:
반드시 아래 JSON 형식으로만 응답하세요. 코드블록이나 설명 문장 등 다른 텍스트는 절대 포함하지 마세요.

{
  "songs": [
    {
      "title": "곡 제목",
      "artist": "아티스트명",
      "reason": "추천 이유 (한국어, 한 문장)",
      "bpm": 120,
      "mood": "calm"
    }
  ],
  "playlistMood": "플레이리스트 분위기 설명 (한국어)"
}

규칙:
- 정확히 5곡을 추천하세요
- bpm은 곡의 실제 템포에 가깝게 정수로 설정하세요
- mood는 반드시 calm, energetic, melancholy, romantic, dark, uplifting 중 하나여야 합니다
- 사용자의 요청이 최신 음악을 원하더라도, 위의 레트로/빈티지 범위 안에서 가장 가까운 곡으로 대신 추천하세요`;

async function getAIRecommendations(prompt: string): Promise<AIResponse> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `다음 분위기/상황에 어울리는 레트로 감성의 음악을 추천해주세요: "${prompt}"`,
      },
    ],
  });

  const textContent = message.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from AI');
  }

  try {
    return JSON.parse(textContent.text) as AIResponse;
  } catch {
    console.error('Failed to parse AI response:', textContent.text);
    throw new Error('Failed to parse AI response');
  }
}

// 레트로 감성 폴백 트랙 (API 키가 없거나 호출이 실패했을 때 사용)
const fallbackRecommendations: AIResponse = {
  songs: [
    {
      title: 'Plastic Love',
      artist: 'Mariya Takeuchi',
      reason: '시티팝의 대명사 같은 밤의 질감',
      bpm: 103,
      mood: 'melancholy',
    },
    {
      title: 'Stay With Me',
      artist: 'Miki Matsubara',
      reason: '80년대 일본 시티팝 특유의 아련한 신스',
      bpm: 110,
      mood: 'romantic',
    },
    {
      title: 'September',
      artist: 'Earth, Wind & Fire',
      reason: '70년대 펑크/디스코의 활기',
      bpm: 126,
      mood: 'uplifting',
    },
    {
      title: 'Fly Me to the Moon',
      artist: 'Frank Sinatra',
      reason: '재즈 스탠다드 크루너의 정석',
      bpm: 119,
      mood: 'calm',
    },
    {
      title: 'Dreams',
      artist: 'Fleetwood Mac',
      reason: '70년대 아날로그 록의 몽환적인 그루브',
      bpm: 120,
      mood: 'calm',
    },
  ],
  playlistMood: '턴테이블 위에서 도는 레트로 감성',
};

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let recommendations: AIResponse;

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        recommendations = await getAIRecommendations(prompt);
      } catch (error) {
        console.error('AI recommendation failed, using fallback:', error);
        recommendations = fallbackRecommendations;
      }
    } else {
      console.log('No ANTHROPIC_API_KEY, using retro fallback');
      recommendations = fallbackRecommendations;
    }

    // Spotify 검색으로 앨범 아트/재생시간을 붙이고, 미리듣기 URL을 단계적으로 확보
    const enrichedSongs: Song[] = await Promise.all(
      recommendations.songs.map(async (song, i) => {
        const spotifyTrack = await searchTrack(song.title, song.artist);

        // Spotify preview -> Deezer preview -> 샘플 오디오 순서로 fallback
        let previewUrl = proxyUrl(spotifyTrack?.preview_url);
        if (!previewUrl) {
          previewUrl = proxyUrl(
            await getDeezerPreviewUrl(song.title, song.artist)
          );
        }
        if (!previewUrl) {
          previewUrl = getRandomSampleAudio(i);
        }

        const mood: Mood = VALID_MOODS.includes(song.mood as Mood)
          ? (song.mood as Mood)
          : 'calm';

        return {
          id: spotifyTrack?.id || Math.random().toString(36).substring(2, 11),
          title: song.title,
          artist: song.artist,
          reason: song.reason,
          bpm: song.bpm,
          mood,
          albumArt:
            spotifyTrack?.album?.images?.[0]?.url ||
            `https://picsum.photos/seed/${encodeURIComponent(song.title)}/300/300`,
          previewUrl,
          duration: spotifyTrack?.duration_ms
            ? Math.floor(spotifyTrack.duration_ms / 1000)
            : 180,
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
