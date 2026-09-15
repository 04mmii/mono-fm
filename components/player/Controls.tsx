'use client';

import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Share2 } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { motion } from 'framer-motion';

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
  } = usePlayerStore();

  return (
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
  );
}
