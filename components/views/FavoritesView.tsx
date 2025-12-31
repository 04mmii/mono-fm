'use client';

import { Play, Heart, Music } from 'lucide-react';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlayerStore } from '@/stores/playerStore';

export default function FavoritesView() {
  const { favorites } = useLibraryStore();
  const { setPlaylist, setTrack, currentTrack } = usePlayerStore();

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      setPlaylist(favorites);
      setTrack(favorites[0]);
    }
  };

  const handlePlayTrack = (song: typeof favorites[0]) => {
    setPlaylist(favorites);
    setTrack(song);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
            <Heart size={24} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">좋아요</h1>
            <p className="text-sm text-secondary">{favorites.length}곡</p>
          </div>
        </div>
        {favorites.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <Play size={18} fill="white" />
            <span className="text-sm font-medium">전체 재생</span>
          </button>
        )}
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Heart size={32} className="text-gray-400" />
          </div>
          <p className="text-lg font-medium text-primary mb-2">아직 좋아요한 곡이 없어요</p>
          <p className="text-sm text-secondary">마음에 드는 곡에 하트를 눌러보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {favorites.map((song, index) => {
            const isCurrentTrack = currentTrack?.id === song.id;
            return (
              <div
                key={song.id}
                onClick={() => handlePlayTrack(song)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  isCurrentTrack
                    ? 'bg-primary/10 border border-primary/30'
                    : 'bg-card hover:bg-gray-50'
                }`}
              >
                <span className={`text-sm w-6 text-center ${isCurrentTrack ? 'text-primary font-bold' : 'text-secondary'}`}>
                  {isCurrentTrack ? '▶' : index + 1}
                </span>
                <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${isCurrentTrack ? 'ring-2 ring-primary' : 'bg-gray-200'}`}>
                  {song.albumArt ? (
                    <img src={song.albumArt} alt={song.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <Music size={20} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isCurrentTrack ? 'text-primary' : 'text-primary'}`}>
                    {song.title}
                  </p>
                  <p className={`text-sm truncate ${isCurrentTrack ? 'text-primary/70' : 'text-secondary'}`}>
                    {song.artist}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
