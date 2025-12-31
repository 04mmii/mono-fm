export type Mood = 'calm' | 'energetic' | 'melancholy' | 'romantic' | 'dark' | 'uplifting';

export interface Song {
  id: string;
  title: string;
  artist: string;
  reason: string;
  bpm: number;
  mood: Mood;
  albumArt?: string;
  previewUrl?: string;
  duration: number; // seconds
}

export interface Playlist {
  id: string;
  name: string;
  songCount: number;
  coverImage?: string;
}

export interface AIResponse {
  songs: Omit<Song, 'id' | 'albumArt' | 'previewUrl' | 'duration'>[];
  playlistMood: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  preview_url: string | null;
  duration_ms: number;
  album: {
    images: { url: string }[];
  };
}
