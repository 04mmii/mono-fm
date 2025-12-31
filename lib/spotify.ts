import { SpotifyTrack } from '@/types';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

export async function getSpotifyToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token');
  }

  const data = await response.json();
  accessToken = data.access_token as string;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // Refresh 1 minute early

  return accessToken as string;
}

export async function searchTrack(
  title: string,
  artist: string
): Promise<SpotifyTrack | null> {
  const token = await getSpotifyToken();
  const query = encodeURIComponent(`track:${title} artist:${artist}`);

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    console.error('Spotify search failed:', response.statusText);
    return null;
  }

  const data = await response.json();
  return data.tracks?.items?.[0] || null;
}

export async function searchTracks(query: string, limit = 10): Promise<SpotifyTrack[]> {
  const token = await getSpotifyToken();
  const encodedQuery = encodeURIComponent(query);

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    console.error('Spotify search failed:', response.statusText);
    return [];
  }

  const data = await response.json();
  return data.tracks?.items || [];
}

export async function getTrackDetails(trackId: string): Promise<SpotifyTrack | null> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function getAudioFeatures(trackId: string): Promise<{ tempo: number } | null> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${trackId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

// Get featured/new releases
export async function getNewReleases(limit = 10): Promise<SpotifyTrack[]> {
  const token = await getSpotifyToken();

  const response = await fetch(
    `https://api.spotify.com/v1/browse/new-releases?limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const albums = data.albums?.items || [];

  // Get first track from each album
  const tracks: SpotifyTrack[] = [];
  for (const album of albums.slice(0, limit)) {
    const albumResponse = await fetch(
      `https://api.spotify.com/v1/albums/${album.id}/tracks?limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (albumResponse.ok) {
      const albumData = await albumResponse.json();
      if (albumData.items?.[0]) {
        tracks.push({
          ...albumData.items[0],
          album: {
            images: album.images,
          },
        });
      }
    }
  }

  return tracks;
}

// Search by category/genre
export async function searchByCategory(category: string, limit = 6): Promise<SpotifyTrack[]> {
  const categoryQueries: Record<string, string> = {
    classic: 'genre:classical year:1900-1990',
    '90s': 'year:1990-1999',
    new: 'year:2023-2024',
    jazz: 'genre:jazz',
    indie: 'genre:indie',
    kpop: 'genre:k-pop',
    hiphop: 'genre:hip-hop',
    rock: 'genre:rock',
  };

  const query = categoryQueries[category] || category;
  return searchTracks(query, limit);
}
