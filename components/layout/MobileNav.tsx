'use client';

import { Home, Heart, Library, Sliders, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { usePlayerStore } from '@/stores/playerStore';

export default function MobileNav() {
  const { activeView, setActiveView } = useUIStore();
  const { currentTrack, isPlaying, play, pause, next, prev } = usePlayerStore();

  const navItems = [
    { id: 'home', icon: Home, label: '홈' },
    { id: 'favorites', icon: Heart, label: '좋아요' },
    { id: 'library', icon: Library, label: '보관함' },
    { id: 'equalizer', icon: Sliders, label: 'EQ' },
  ] as const;

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50">
        {/* Mini Player */}
        {currentTrack && (
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
            <div
              className="w-10 h-10 rounded-md overflow-hidden bg-gray-200 flex-shrink-0"
              onClick={() => setActiveView('detail')}
            >
              {currentTrack.albumArt ? (
                <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0" onClick={() => setActiveView('detail')}>
              <p className="text-sm font-medium text-primary truncate">{currentTrack.title}</p>
              <p className="text-xs text-secondary truncate">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={prev}
                className="w-8 h-8 flex items-center justify-center text-secondary"
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={() => isPlaying ? pause() : play()}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
              <button
                onClick={next}
                className="w-8 h-8 flex items-center justify-center text-secondary"
              >
                <SkipForward size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || (activeView === 'detail' && item.id === 'home');
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center gap-0.5 py-1 px-4 ${
                  isActive ? 'text-primary' : 'text-secondary'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
