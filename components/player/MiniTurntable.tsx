'use client';

import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useUIStore } from '@/stores/uiStore';

export default function MiniTurntable() {
  const { currentTrack, isPlaying, play, pause, next, prev } = usePlayerStore();
  const { setActiveView } = useUIStore();

  const handleClick = () => {
    if (currentTrack) {
      setActiveView('detail');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Mini LP */}
      <div
        onClick={handleClick}
        className="relative w-40 h-40 cursor-pointer group"
      >
        {/* LP Disc */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl"
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{
            duration: 3,
            repeat: isPlaying ? Infinity : 0,
            ease: 'linear',
          }}
        >
          {/* Grooves */}
          <div className="absolute inset-2 rounded-full border border-gray-700" />
          <div className="absolute inset-4 rounded-full border border-gray-700" />
          <div className="absolute inset-6 rounded-full border border-gray-700" />
          <div className="absolute inset-8 rounded-full border border-gray-700" />

          {/* Label */}
          <div className="absolute inset-0 m-auto w-16 h-16 rounded-full overflow-hidden bg-gray-200 shadow-inner">
            {currentTrack?.albumArt ? (
              <img
                src={currentTrack.albumArt}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <Music size={20} className="text-gray-500" />
              </div>
            )}
          </div>

          {/* Center hole */}
          <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-gray-900" />
        </motion.div>

        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium">상세보기</span>
        </div>
      </div>

      {/* Track Info */}
      {currentTrack && (
        <div className="mt-4 text-center w-full">
          <p className="font-medium text-primary text-sm truncate">{currentTrack.title}</p>
          <p className="text-xs text-secondary truncate">{currentTrack.artist}</p>
        </div>
      )}

      {/* Mini Controls */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-gray-100 transition-colors"
        >
          <SkipBack size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isPlaying) {
              pause();
            } else {
              play();
            }
          }}
          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-gray-100 transition-colors"
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
}
