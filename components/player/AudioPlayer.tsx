'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore, EQ_BANDS } from '@/stores/playerStore';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isRepeat,
    eqSettings,
    eqEnabled,
    setCurrentTime,
    pause,
    next,
  } = usePlayerStore();

  // Initialize Web Audio API
  const initAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create source from audio element
      const source = audioContext.createMediaElementSource(audioRef.current);
      sourceRef.current = source;

      // Create gain node for volume
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      gainRef.current = gainNode;

      // Create EQ filters
      const filters: BiquadFilterNode[] = EQ_BANDS.map((freq, index) => {
        const filter = audioContext.createBiquadFilter();

        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === EQ_BANDS.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1;
        }

        filter.frequency.value = freq;
        filter.gain.value = eqSettings[freq];
        return filter;
      });

      filtersRef.current = filters;

      // Connect: source -> filters -> gain -> destination
      let connection: AudioNode = source;
      filters.forEach((filter) => {
        connection.connect(filter);
        connection = filter;
      });
      connection.connect(gainNode);
      gainNode.connect(audioContext.destination);

    } catch (error) {
      console.error('Failed to initialize Web Audio API:', error);
    }
  }, [volume, eqSettings]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && currentTrack?.previewUrl) {
      // Initialize audio context on first play (required by browsers)
      if (!audioContextRef.current) {
        initAudioContext();
      }

      // Resume audio context if suspended
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }

      audioRef.current.play().catch((err) => {
        console.log('Playback failed:', err);
        pause();
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack, pause, initAudioContext]);

  // Handle volume
  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    } else if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle EQ settings changes
  useEffect(() => {
    if (!filtersRef.current.length) return;

    filtersRef.current.forEach((filter, index) => {
      const freq = EQ_BANDS[index];
      filter.gain.value = eqEnabled ? eqSettings[freq] : 0;
    });
  }, [eqSettings, eqEnabled]);

  // Handle track change
  useEffect(() => {
    if (audioRef.current && currentTrack?.previewUrl) {
      audioRef.current.src = currentTrack.previewUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.log);
      }
    }
  }, [currentTrack?.id, currentTrack?.previewUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      next();
    }
  };

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      preload="auto"
    />
  );
}
