'use client';

import { motion } from 'framer-motion';
import { usePlayerStore } from '@/stores/playerStore';

// 무드별 네온 색상
const moodGlow: Record<string, string> = {
  calm: 'rgba(99, 102, 241, 0.6)',
  energetic: 'rgba(245, 158, 11, 0.6)',
  melancholy: 'rgba(59, 130, 246, 0.6)',
  romantic: 'rgba(236, 72, 153, 0.6)',
  dark: 'rgba(107, 114, 128, 0.6)',
  uplifting: 'rgba(16, 185, 129, 0.6)',
};

const moodAccent: Record<string, string> = {
  calm: '#6366f1',
  energetic: '#f59e0b',
  melancholy: '#3b82f6',
  romantic: '#ec4899',
  dark: '#6b7280',
  uplifting: '#10b981',
};

export default function Turntable() {
  const { currentTrack, isPlaying, currentMood } = usePlayerStore();

  const bpm = currentTrack?.bpm || 120;
  const rotationDuration = (60 / bpm) * 33.33;
  const glowColor = moodGlow[currentMood] || moodGlow.calm;
  const accentColor = moodAccent[currentMood] || moodAccent.calm;

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Outer Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        animate={{
          boxShadow: isPlaying
            ? `0 0 60px ${glowColor}, 0 0 100px ${glowColor}`
            : '0 0 0 transparent',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Turntable Base */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
          boxShadow: '20px 20px 60px #0d0d0d, -20px -20px 60px #333333, inset 0 0 30px rgba(0,0,0,0.5)',
        }}
      />

      {/* Wood Grain Texture */}
      <div
        className="absolute inset-2 rounded-2xl opacity-20"
        style={{
          background: 'repeating-linear-gradient(90deg, #4a3728 0px, #3d2e21 2px, #4a3728 4px)',
        }}
      />

      {/* Platter Ring */}
      <div
        className="absolute top-4 left-4 right-4 bottom-4 md:top-5 md:left-5 md:right-5 md:bottom-5 rounded-full"
        style={{
          background: 'linear-gradient(145deg, #333, #222)',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8), 0 2px 5px rgba(255,255,255,0.1)',
        }}
      />

      {/* LP Disc */}
      <motion.div
        className="absolute top-6 left-6 right-6 bottom-6 md:top-7 md:left-7 md:right-7 md:bottom-7 rounded-full"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #111 0%, #1a1a1a 30%, #111 60%, #0a0a0a 100%)
          `,
          boxShadow: `
            inset 0 0 50px rgba(0,0,0,0.8),
            0 5px 20px rgba(0,0,0,0.5),
            ${isPlaying ? `0 0 30px ${glowColor}` : '0 0 0 transparent'}
          `,
        }}
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isPlaying
            ? { duration: rotationDuration, repeat: Infinity, ease: 'linear' }
            : { duration: 0.5, ease: 'easeOut' }
        }
      >
        {/* LP Grooves - More Detailed */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              inset: `${8 + i * 3}%`,
              borderColor: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.3)',
            }}
          />
        ))}

        {/* Vinyl Shine Effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
          }}
        />

        {/* Center Label */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden"
          style={{
            boxShadow: `inset 0 2px 10px rgba(0,0,0,0.5), 0 0 20px ${isPlaying ? glowColor : 'transparent'}`,
            border: `3px solid ${accentColor}`,
          }}
        >
          {currentTrack?.albumArt ? (
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${accentColor}, #1a1a1a)` }}
            >
              <div className="text-center text-white">
                <div className="text-sm md:text-base font-bold tracking-widest">MONO</div>
                <div className="text-xs opacity-70">.fm</div>
              </div>
            </div>
          )}
        </div>

        {/* Center Spindle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #666, #333)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)',
          }}
        />
      </motion.div>

      {/* Tonearm Assembly */}
      <motion.div
        className="absolute -right-2 md:-right-3 top-2 md:top-3 origin-top-right z-10"
        animate={isPlaying ? { rotate: 28 } : { rotate: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {/* Arm Base/Pivot */}
        <div
          className="w-5 h-5 md:w-6 md:h-6 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #888, #444)',
            boxShadow: '0 3px 10px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.3)',
          }}
        />

        {/* Arm Tube */}
        <div
          className="absolute top-2 md:top-2.5 left-1/2 -translate-x-1/2 w-1.5 md:w-2 h-24 md:h-32 rounded-full origin-top"
          style={{
            background: 'linear-gradient(90deg, #666, #999, #666)',
            boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
          }}
        />

        {/* Counterweight */}
        <div
          className="absolute top-1 md:top-1.5 -right-3 md:-right-4 w-4 h-4 md:w-5 md:h-5 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #555, #333)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
          }}
        />

        {/* Headshell */}
        <div
          className="absolute top-[6rem] md:top-[8rem] left-1/2 -translate-x-1/2"
          style={{
            width: '12px',
            height: '20px',
            background: 'linear-gradient(180deg, #777, #444)',
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
          }}
        />

        {/* Cartridge */}
        <div
          className="absolute top-[7rem] md:top-[9.2rem] left-1/2 -translate-x-1/2 w-2 h-2.5 md:w-2.5 md:h-3 rounded-sm"
          style={{
            background: accentColor,
            boxShadow: `0 0 10px ${glowColor}`,
          }}
        />

        {/* Stylus (Needle) */}
        <motion.div
          className="absolute top-[7.5rem] md:top-[10rem] left-1/2 -translate-x-1/2 w-0.5 h-1.5"
          style={{ background: 'linear-gradient(180deg, #ccc, #888)' }}
          animate={isPlaying ? { y: [0, 1, 0] } : {}}
          transition={{ duration: 0.1, repeat: Infinity }}
        />
      </motion.div>

      {/* Control Panel */}
      <div className="absolute bottom-3 md:bottom-4 left-4 md:left-5 right-4 md:right-5 flex justify-between items-center">
        {/* Speed Selector */}
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
            style={{
              background: accentColor,
              boxShadow: `0 0 8px ${glowColor}`,
            }}
          />
          <span className="text-[9px] md:text-[11px] text-gray-400 font-medium">
            33⅓
          </span>
        </div>

        {/* Status Light */}
        <motion.div
          className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
          style={{ background: isPlaying ? '#22c55e' : '#666' }}
          animate={isPlaying ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* BPM Display */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] md:text-[11px] text-gray-400 font-medium">
            {bpm}
          </span>
          <span className="text-[8px] md:text-[10px] text-gray-500">BPM</span>
        </div>
      </div>

      {/* Brand Logo */}
      <div className="absolute top-3 md:top-4 left-4 md:left-5">
        <span
          className="text-[10px] md:text-xs font-bold tracking-widest"
          style={{ color: accentColor }}
        >
          MONO.fm
        </span>
      </div>
    </div>
  );
}
