'use client';

import { create } from 'zustand';

type ActiveView = 'home' | 'detail' | 'favorites' | 'library' | 'equalizer' | 'premium';

interface UIState {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'home',
  setActiveView: (view) => set({ activeView: view }),
}));
