// Deezer API - 무료, 인증 불필요
const DEEZER_API_BASE = 'https://api.deezer.com';

interface DeezerTrack {
  id: number;
  title: string;
  preview: string; // 30초 미리듣기 URL
  duration: number;
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover_medium: string;
    cover_big: string;
  };
}

interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
}

// 곡 검색
export async function searchDeezer(query: string, limit: number = 10): Promise<DeezerTrack[]> {
  try {
    const response = await fetch(
      `${DEEZER_API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );

    if (!response.ok) {
      console.error('Deezer search failed:', response.status);
      return [];
    }

    const data: DeezerSearchResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Deezer search error:', error);
    return [];
  }
}

// 특정 곡 검색 (제목 + 아티스트)
export async function searchDeezerTrack(title: string, artist: string): Promise<DeezerTrack | null> {
  try {
    const query = `${title} ${artist}`;
    const tracks = await searchDeezer(query, 5);

    if (tracks.length === 0) return null;

    // 가장 일치하는 결과 반환
    const exactMatch = tracks.find(
      (t) =>
        t.title.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(t.title.toLowerCase())
    );

    return exactMatch || tracks[0];
  } catch (error) {
    console.error('Deezer track search error:', error);
    return null;
  }
}

// 장르/카테고리별 검색
export async function searchDeezerByGenre(genre: string, limit: number = 10): Promise<DeezerTrack[]> {
  const genreQueries: Record<string, string> = {
    classic: 'classical music',
    '90s': '90s hits',
    new: 'new releases 2024',
    jazz: 'jazz',
    indie: 'indie',
    kpop: 'kpop',
    hiphop: 'hip hop',
    rock: 'rock',
    pop: 'pop hits',
    edm: 'electronic dance',
  };

  const query = genreQueries[genre] || genre;
  return searchDeezer(query, limit);
}

// preview URL만 가져오기 (Spotify 곡 정보 보완용)
export async function getDeezerPreviewUrl(title: string, artist: string): Promise<string | null> {
  const track = await searchDeezerTrack(title, artist);
  return track?.preview || null;
}
