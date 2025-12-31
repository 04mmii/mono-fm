'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Song, Mood } from '@/types';

// Equalizer frequency bands (Hz)
export const EQ_BANDS = [60, 170, 350, 1000, 3500, 10000] as const;
export type EQBand = (typeof EQ_BANDS)[number];

export interface EQSettings {
  60: number;
  170: number;
  350: number;
  1000: number;
  3500: number;
  10000: number;
}

export const EQ_PRESETS: Record<string, EQSettings> = {
  flat: { 60: 0, 170: 0, 350: 0, 1000: 0, 3500: 0, 10000: 0 },
  bass: { 60: 6, 170: 4, 350: 1, 1000: 0, 3500: -1, 10000: -2 },
  treble: { 60: -2, 170: -1, 350: 0, 1000: 1, 3500: 4, 10000: 6 },
  vocal: { 60: -2, 170: 0, 350: 2, 1000: 4, 3500: 2, 10000: 0 },
  rock: { 60: 4, 170: 2, 350: -1, 1000: 1, 3500: 3, 10000: 4 },
  jazz: { 60: 3, 170: 1, 350: 0, 1000: 1, 3500: 2, 10000: 3 },
  electronic: { 60: 5, 170: 3, 350: 0, 1000: -1, 3500: 2, 10000: 4 },
  acoustic: { 60: 2, 170: 1, 350: 1, 1000: 2, 3500: 2, 10000: 1 },
};

interface PlayerState {
  // State
  currentTrack: Song | null;
  playlist: Song[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentMood: Mood;
  isShuffle: boolean;
  isRepeat: boolean;
  isLoading: boolean;
  eqSettings: EQSettings;
  eqEnabled: boolean;

  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setTrack: (track: Song) => void;
  next: () => void;
  prev: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaylist: (songs: Song[]) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setLoading: (loading: boolean) => void;
  setEQBand: (band: EQBand, value: number) => void;
  setEQPreset: (preset: string) => void;
  toggleEQ: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Initial State - empty until Spotify loads
      currentTrack: null,
      playlist: [],
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      currentMood: 'calm',
      isShuffle: false,
      isRepeat: false,
      isLoading: false,
      eqSettings: EQ_PRESETS.flat,
      eqEnabled: true,

      // Actions
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setTrack: (track) =>
        set({
          currentTrack: track,
          currentMood: track.mood,
          duration: track.duration,
          currentTime: 0,
          isPlaying: true,
        }),

      next: () => {
        const { playlist, currentTrack, isShuffle } = get();
        if (!currentTrack || playlist.length === 0) return;

        let nextIndex: number;
        if (isShuffle) {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } else {
          const currentIndex = playlist.findIndex((s) => s.id === currentTrack.id);
          nextIndex = (currentIndex + 1) % playlist.length;
        }

        const nextTrack = playlist[nextIndex];
        set({
          currentTrack: nextTrack,
          currentMood: nextTrack.mood,
          duration: nextTrack.duration,
          currentTime: 0,
        });
      },

      prev: () => {
        const { playlist, currentTrack, currentTime } = get();
        if (!currentTrack || playlist.length === 0) return;

        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }

        const currentIndex = playlist.findIndex((s) => s.id === currentTrack.id);
        const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
        const prevTrack = playlist[prevIndex];

        set({
          currentTrack: prevTrack,
          currentMood: prevTrack.mood,
          duration: prevTrack.duration,
          currentTime: 0,
        });
      },

      setCurrentTime: (time) => set({ currentTime: time }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setPlaylist: (songs) => set({ playlist: songs }),
      toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
      toggleRepeat: () => set((state) => ({ isRepeat: !state.isRepeat })),
      setLoading: (loading) => set({ isLoading: loading }),

      // Equalizer
      setEQBand: (band, value) =>
        set((state) => ({
          eqSettings: { ...state.eqSettings, [band]: Math.max(-12, Math.min(12, value)) },
        })),
      setEQPreset: (preset) =>
        set({ eqSettings: EQ_PRESETS[preset] || EQ_PRESETS.flat }),
      toggleEQ: () => set((state) => ({ eqEnabled: !state.eqEnabled })),
    }),
    {
      name: 'mono-fm-player',
      partialize: (state) => ({
        volume: state.volume,
        isShuffle: state.isShuffle,
        isRepeat: state.isRepeat,
        eqSettings: state.eqSettings,
        eqEnabled: state.eqEnabled,
      }),
    }
  )
);
