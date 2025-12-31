'use client';

import { motion } from 'framer-motion';
import { usePlayerStore } from '@/stores/playerStore';

export default function Turntable() {
  const { currentTrack, isPlaying } = usePlayerStore();

  // Calculate rotation duration based on BPM (33⅓ RPM standard)
  const bpm = currentTrack?.bpm || 120;
  const rotationDuration = (60 / bpm) * 33.33;

  return (
    <div className="relative w-56 h-56 md:w-72 md:h-72 mx-auto">
      {/* Turntable Base */}
      <div className="absolute inset-0 turntable-base rounded-2xl shadow-turntable" />

      {/* LP Disc */}
      <motion.div
        className="absolute top-3 left-3 right-3 bottom-3 md:top-4 md:left-4 md:right-4 md:bottom-4 rounded-full lp-disc shadow-lg"
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isPlaying
            ? {
                duration: rotationDuration,
                repeat: Infinity,
                ease: 'linear',
              }
            : { duration: 0.5, ease: 'easeOut' }
        }
      >
        {/* LP Grooves Effect */}
        <div className="absolute inset-0 rounded-full opacity-30">
          <div className="absolute inset-[10%] rounded-full border border-gray-600" />
          <div className="absolute inset-[20%] rounded-full border border-gray-600" />
          <div className="absolute inset-[30%] rounded-full border border-gray-600" />
        </div>

        {/* Center Label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full lp-label flex items-center justify-center shadow-inner overflow-hidden">
          {currentTrack?.albumArt ? (
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="text-center">
              <div className="text-[8px] font-bold text-primary uppercase tracking-wider">
                MONO
              </div>
              <div className="text-[6px] text-secondary">fm</div>
            </div>
          )}
        </div>

        {/* Center Spindle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gradient-to-b from-gray-400 to-gray-600 shadow-md" />
      </motion.div>

      {/* Tonearm */}
      <motion.div
        className="absolute -right-1 md:-right-2 top-1 md:top-2 origin-top-right"
        animate={isPlaying ? { rotate: 25 } : { rotate: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Arm Base */}
        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-b from-gray-300 to-gray-500 shadow-md" />

        {/* Arm */}
        <div className="absolute top-1.5 md:top-2 left-1/2 -translate-x-1/2 w-1 md:w-1.5 h-20 md:h-28 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full origin-top shadow-sm" />

        {/* Headshell */}
        <div className="absolute top-[5rem] md:top-[7rem] left-1/2 -translate-x-1/2 w-2 md:w-3 h-4 md:h-5 bg-gradient-to-b from-gray-300 to-gray-500 rounded-sm" />

        {/* Cartridge */}
        <div className="absolute top-[5.8rem] md:top-[8.2rem] left-1/2 -translate-x-1/2 w-1.5 md:w-2 h-1.5 md:h-2 bg-primary rounded-sm" />
      </motion.div>

      {/* Speed Indicator */}
      <div className="absolute bottom-1.5 md:bottom-2 left-3 md:left-4 text-[8px] md:text-[10px] text-gray-500 font-medium">
        33⅓ RPM
      </div>

      {/* BPM Display */}
      <div className="absolute bottom-1.5 md:bottom-2 right-3 md:right-4 text-[8px] md:text-[10px] text-gray-500 font-medium">
        {bpm} BPM
      </div>
    </div>
  );
}
