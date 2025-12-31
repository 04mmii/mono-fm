'use client';

import { useEffect, useState } from 'react';
import { usePlayerStore } from '@/stores/playerStore';

// Generate fake waveform data
const generateWaveform = (length: number): number[] => {
  return Array.from({ length }, () => Math.random() * 0.7 + 0.3);
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function WaveForm() {
  const { currentTime, duration, isPlaying, setCurrentTime } = usePlayerStore();
  const [waveform] = useState(() => generateWaveform(50));

  const progress = duration > 0 ? currentTime / duration : 0;

  // Simulate time progression
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(currentTime + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, setCurrentTime]);

  // Reset when song ends
  useEffect(() => {
    if (currentTime >= duration && duration > 0) {
      setCurrentTime(0);
    }
  }, [currentTime, duration, setCurrentTime]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(percentage * duration);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Time Display */}
      <div className="flex justify-between text-xs text-secondary mb-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Waveform */}
      <div
        className="h-12 flex items-center gap-[2px] cursor-pointer"
        onClick={handleClick}
      >
        {waveform.map((height, index) => {
          const barProgress = index / waveform.length;
          const isPlayed = barProgress <= progress;

          return (
            <div
              key={index}
              className={`flex-1 rounded-full transition-colors duration-100 ${
                isPlayed ? 'bg-primary' : 'bg-gray-300'
              }`}
              style={{
                height: `${height * 100}%`,
                minWidth: '3px',
              }}
            />
          );
        })}
      </div>

      {/* Progress Bar (backup simple version) */}
      <div className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
