'use client';

import { Home, Heart, Music, SlidersHorizontal, Gem } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useLibraryStore } from '@/stores/libraryStore';

const navItems = [
  { icon: Home, label: 'Home', view: 'home' as const },
  { icon: Heart, label: 'Favorites', view: 'favorites' as const },
  { icon: Music, label: 'Library', view: 'library' as const },
  { icon: SlidersHorizontal, label: 'Equalizer', view: 'equalizer' as const },
  { icon: Gem, label: 'Premium', view: 'premium' as const },
];

export default function Sidebar() {
  const { activeView, setActiveView } = useUIStore();
  const { favorites } = useLibraryStore();

  return (
    <aside className="w-16 bg-card border-r border-border flex flex-col items-center py-6 gap-2">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => setActiveView(item.view)}
          className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
            activeView === item.view
              ? 'bg-primary text-white'
              : 'text-secondary hover:bg-gray-100'
          }`}
          title={item.label}
        >
          <item.icon size={20} />
          {/* Favorites badge */}
          {item.view === 'favorites' && favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {favorites.length > 9 ? '9+' : favorites.length}
            </span>
          )}
        </button>
      ))}
    </aside>
  );
}
