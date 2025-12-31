'use client';

import { Heart } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { moodTheme } from '@/constants/theme';

export default function NowPlaying() {
  const { currentTrack, currentMood } = usePlayerStore();
  const { favorites, addToFavorites, removeFromFavorites } = useLibraryStore();

  if (!currentTrack) return null;

  const isFavorite = favorites.some((s) => s.id === currentTrack.id);
  const theme = moodTheme[currentMood];

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(currentTrack.id);
    } else {
      addToFavorites(currentTrack);
    }
  };

  return (
    <div className="text-center mb-6">
      {/* Title & Like */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <h2 className="text-2xl font-bold text-primary">{currentTrack.title}</h2>
        <button
          onClick={toggleFavorite}
          className={`flex items-center gap-1 transition-colors ${
            isFavorite ? 'text-rose-500' : 'text-secondary hover:text-rose-500'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Artist */}
      <p className="text-secondary text-sm mb-3">{currentTrack.artist}</p>

      {/* Mood Tag */}
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${theme.bg} ${theme.accent}`}
      >
        {currentMood}
      </span>

      {/* Reason */}
      <p className="text-xs text-secondary mt-3 italic">
        &ldquo;{currentTrack.reason}&rdquo;
      </p>
    </div>
  );
}
