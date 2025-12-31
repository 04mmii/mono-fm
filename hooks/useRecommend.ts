'use client';

import { useState } from 'react';
import { Song } from '@/types';
import { usePlayerStore } from '@/stores/playerStore';

interface RecommendResponse {
  songs: Song[];
  playlistMood: string;
}

export function useRecommend() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlistMood, setPlaylistMood] = useState<string>('');
  const { setPlaylist, setTrack } = usePlayerStore();

  const recommend = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data: RecommendResponse = await response.json();

      if (data.songs.length > 0) {
        setPlaylist(data.songs);
        setTrack(data.songs[0]);
        setPlaylistMood(data.playlistMood);
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { recommend, isLoading, error, playlistMood };
}
