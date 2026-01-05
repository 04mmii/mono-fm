'use client';

import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Share2 } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { motion } from 'framer-motion';

// 무드별 색상
const moodColors: Record<string, { main: string; glow: string }> = {
  calm: { main: '#6366f1', glow: 'rgba(99, 102, 241, 0.5)' },
  energetic: { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' },
  melancholy: { main: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)' },
  romantic: { main: '#ec4899', glow: 'rgba(236, 72, 153, 0.5)' },
  dark: { main: '#6b7280', glow: 'rgba(107, 114, 128, 0.5)' },
  uplifting: { main: '#10b981', glow: 'rgba(16, 185, 129, 0.5)' },
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function Controls() {
  const {
    isPlaying,
    togglePlay,
    next,
    prev,
    isShuffle,
    isRepeat,
    toggleShuffle,
    toggleRepeat,
    currentTime,
    duration,
    currentMood,
    setCurrentTime,
  } = usePlayerStore();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const colors = moodColors[currentMood] || moodColors.calm;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(percentage * duration);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-4 px-2">
        {/* Time Display */}
        <div className="flex justify-between text-xs font-medium mb-2">
          <span className="text-primary">{formatTime(currentTime)}</span>
          <span className="text-secondary">{formatTime(duration)}</span>
        </div>

        {/* Seek Bar */}
        <div
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer group"
          onClick={handleSeek}
        >
          {/* Progress */}
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${colors.main}, ${colors.main}cc)`,
              boxShadow: `0 0 10px ${colors.glow}`,
            }}
            transition={{ duration: 0.1 }}
          />

          {/* Thumb */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              left: `calc(${progress}% - 8px)`,
              background: colors.main,
              boxShadow: `0 0 10px ${colors.glow}, 0 2px 5px rgba(0,0,0,0.3)`,
            }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-2 md:gap-4">
      {/* Share - Hidden on mobile */}
      <button
        className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-secondary hover:bg-gray-100 transition-colors"
        title="Share"
      >
        <Share2 size={18} />
      </button>

      {/* Previous */}
      <button
        onClick={prev}
        className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-primary hover:bg-gray-100 transition-all hover:scale-105"
        title="Previous"
      >
        <SkipBack size={18} className="md:w-5 md:h-5" fill="currentColor" />
      </button>

      {/* Play/Pause */}
      <motion.button
        onClick={togglePlay}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause size={20} className="md:w-6 md:h-6" fill="white" />
        ) : (
          <Play size={20} className="md:w-6 md:h-6 ml-0.5" fill="white" />
        )}
      </motion.button>

      {/* Next */}
      <button
        onClick={next}
        className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-primary hover:bg-gray-100 transition-all hover:scale-105"
        title="Next"
      >
        <SkipForward size={18} className="md:w-5 md:h-5" fill="currentColor" />
      </button>

      {/* Shuffle */}
      <button
        onClick={toggleShuffle}
        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
          isShuffle
            ? 'text-primary bg-gray-100'
            : 'text-secondary hover:bg-gray-100'
        }`}
        title="Shuffle"
      >
        <Shuffle size={16} className="md:w-[18px] md:h-[18px]" />
      </button>

      {/* Repeat */}
      <button
        onClick={toggleRepeat}
        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
          isRepeat
            ? 'text-primary bg-gray-100'
            : 'text-secondary hover:bg-gray-100'
        }`}
        title="Repeat"
      >
        <Repeat size={16} className="md:w-[18px] md:h-[18px]" />
      </button>
      </div>
    </div>
  );
}
