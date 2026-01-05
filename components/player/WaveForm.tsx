'use client';

import { useEffect, useState } from 'react';
import { usePlayerStore } from '@/stores/playerStore';

// Generate fake waveform data
const generateWaveform = (length: number): number[] => {
  return Array.from({ length }, () => Math.random() * 0.6 + 0.4);
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 무드별 색상
const moodColors: Record<string, { played: string; unplayed: string; glow: string }> = {
  calm: { played: '#6366f1', unplayed: '#c7d2fe', glow: 'rgba(99, 102, 241, 0.5)' },
  energetic: { played: '#f59e0b', unplayed: '#fde68a', glow: 'rgba(245, 158, 11, 0.5)' },
  melancholy: { played: '#3b82f6', unplayed: '#bfdbfe', glow: 'rgba(59, 130, 246, 0.5)' },
  romantic: { played: '#ec4899', unplayed: '#fbcfe8', glow: 'rgba(236, 72, 153, 0.5)' },
  dark: { played: '#6b7280', unplayed: '#d1d5db', glow: 'rgba(107, 114, 128, 0.5)' },
  uplifting: { played: '#10b981', unplayed: '#a7f3d0', glow: 'rgba(16, 185, 129, 0.5)' },
};

export default function WaveForm() {
  const { currentTime, duration, isPlaying, setCurrentTime, currentMood } = usePlayerStore();
  const [waveform] = useState(() => generateWaveform(60));
  const [animatedBars, setAnimatedBars] = useState<number[]>([]);

  const progress = duration > 0 ? currentTime / duration : 0;
  const colors = moodColors[currentMood] || moodColors.calm;

  // 재생 중일 때 막대 애니메이션
  useEffect(() => {
    if (!isPlaying) {
      setAnimatedBars([]);
      return;
    }

    const interval = setInterval(() => {
      // 현재 위치 근처 막대들 애니메이션
      const currentBar = Math.floor(progress * waveform.length);
      const animated = [];
      for (let i = currentBar - 2; i <= currentBar + 2; i++) {
        if (i >= 0 && i < waveform.length) {
          animated.push(i);
        }
      }
      setAnimatedBars(animated);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, progress, waveform.length]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(percentage * duration);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Waveform</span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-secondary capitalize">
          {currentMood}
        </span>
      </div>

      {/* Waveform */}
      <div
        className="h-20 md:h-24 flex items-center gap-[3px] cursor-pointer rounded-xl p-3 bg-gray-50/80"
        onClick={handleClick}
        style={{
          boxShadow: isPlaying ? `0 0 20px ${colors.glow}` : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {waveform.map((height, index) => {
          const barProgress = index / waveform.length;
          const isPlayed = barProgress <= progress;
          const isAnimated = animatedBars.includes(index);

          return (
            <div
              key={index}
              className="flex-1 rounded-full transition-all duration-150"
              style={{
                height: `${height * 100}%`,
                minWidth: '4px',
                backgroundColor: isPlayed ? colors.played : colors.unplayed,
                transform: isAnimated ? `scaleY(${1 + Math.random() * 0.3})` : 'scaleY(1)',
                boxShadow: isPlayed && isAnimated ? `0 0 8px ${colors.glow}` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${colors.played}, ${colors.unplayed})`,
          }}
        />
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm font-medium mt-2">
        <span className="text-primary">{formatTime(currentTime)}</span>
        <span className="text-secondary">{formatTime(duration)}</span>
      </div>
    </div>
  );
}
