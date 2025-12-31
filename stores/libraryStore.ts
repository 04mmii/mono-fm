'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Song } from '@/types';

export interface SavedPlaylist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: number;
  coverImage?: string;
}

interface LibraryState {
  // State
  favorites: Song[];
  playlists: SavedPlaylist[];
  recentlyPlayed: Song[];

  // Actions
  addToFavorites: (song: Song) => void;
  removeFromFavorites: (songId: string) => void;
  isFavorite: (songId: string) => boolean;

  createPlaylist: (name: string, songs?: Song[]) => SavedPlaylist;
  deletePlaylist: (playlistId: string) => void;
  addToPlaylist: (playlistId: string, song: Song) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  renamePlaylist: (playlistId: string, name: string) => void;

  addToRecentlyPlayed: (song: Song) => void;
  clearRecentlyPlayed: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      // Initial State
      favorites: [],
      playlists: [],
      recentlyPlayed: [],

      // Favorites
      addToFavorites: (song) =>
        set((state) => {
          if (state.favorites.some((s) => s.id === song.id)) return state;
          return { favorites: [...state.favorites, song] };
        }),

      removeFromFavorites: (songId) =>
        set((state) => ({
          favorites: state.favorites.filter((s) => s.id !== songId),
        })),

      isFavorite: (songId) => get().favorites.some((s) => s.id === songId),

      // Playlists
      createPlaylist: (name, songs = []) => {
        const newPlaylist: SavedPlaylist = {
          id: Date.now().toString(),
          name,
          songs,
          createdAt: Date.now(),
          coverImage: songs[0]?.albumArt,
        };
        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }));
        return newPlaylist;
      },

      deletePlaylist: (playlistId) =>
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== playlistId),
        })),

      addToPlaylist: (playlistId, song) =>
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id !== playlistId) return p;
            if (p.songs.some((s) => s.id === song.id)) return p;
            return {
              ...p,
              songs: [...p.songs, song],
              coverImage: p.coverImage || song.albumArt,
            };
          }),
        })),

      removeFromPlaylist: (playlistId, songId) =>
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id !== playlistId) return p;
            return {
              ...p,
              songs: p.songs.filter((s) => s.id !== songId),
            };
          }),
        })),

      renamePlaylist: (playlistId, name) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, name } : p
          ),
        })),

      // Recently Played
      addToRecentlyPlayed: (song) =>
        set((state) => {
          const filtered = state.recentlyPlayed.filter((s) => s.id !== song.id);
          return {
            recentlyPlayed: [song, ...filtered].slice(0, 20), // Keep last 20
          };
        }),

      clearRecentlyPlayed: () => set({ recentlyPlayed: [] }),
    }),
    {
      name: 'mono-fm-library',
    }
  )
);
