'use client';

import { Plus, Music, Save, Check, ListPlus, X } from 'lucide-react';
import { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlayerStore } from '@/stores/playerStore';
import MiniTurntable from '@/components/player/MiniTurntable';
import { Song } from '@/types';

export default function RightPanel() {
  const { activeView } = useUIStore();
  const { playlists, createPlaylist, addToPlaylist } = useLibraryStore();
  const { setTrack, playlist: currentPlaylist, currentTrack } = usePlayerStore();
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [savePlaylistName, setSavePlaylistName] = useState('');
  const [saved, setSaved] = useState(false);
  const [addToPlaylistSong, setAddToPlaylistSong] = useState<Song | null>(null);
  const [addedToPlaylist, setAddedToPlaylist] = useState<string | null>(null);

  const handleSaveCurrentPlaylist = () => {
    if (savePlaylistName.trim() && currentPlaylist.length > 0) {
      createPlaylist(savePlaylistName.trim(), currentPlaylist);
      setSavePlaylistName('');
      setShowSaveForm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleAddSongToPlaylist = (playlistId: string, song: Song) => {
    addToPlaylist(playlistId, song);
    setAddedToPlaylist(playlistId);
    setTimeout(() => {
      setAddedToPlaylist(null);
      setAddToPlaylistSong(null);
    }, 1500);
  };

  // Detail View - Show Playlist with save option
  if (activeView === 'detail') {
    return (
      <aside className="w-full md:w-80 bg-card md:border-l border-border p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-primary">추천곡 리스트</h2>
          {currentPlaylist.length > 0 && (
            <button
              onClick={() => setShowSaveForm(!showSaveForm)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                saved
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-secondary hover:bg-gray-200'
              }`}
            >
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saved ? '저장됨!' : '저장'}
            </button>
          )}
        </div>

        {showSaveForm && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <input
              type="text"
              value={savePlaylistName}
              onChange={(e) => setSavePlaylistName(e.target.value)}
              placeholder="플레이리스트 이름..."
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:border-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveCurrentPlaylist()}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveCurrentPlaylist}
                className="flex-1 py-1.5 bg-primary text-white text-xs rounded-md hover:bg-gray-800"
              >
                저장하기
              </button>
              <button
                onClick={() => setShowSaveForm(false)}
                className="flex-1 py-1.5 bg-gray-200 text-secondary text-xs rounded-md hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* Add to Playlist Modal */}
        {addToPlaylistSong && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-primary truncate flex-1">
                &ldquo;{addToPlaylistSong.title}&rdquo; 추가
              </p>
              <button
                onClick={() => setAddToPlaylistSong(null)}
                className="text-secondary hover:text-primary"
              >
                <X size={14} />
              </button>
            </div>
            {playlists.length === 0 ? (
              <p className="text-xs text-secondary py-2">저장된 플레이리스트가 없습니다</p>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAddSongToPlaylist(pl.id, addToPlaylistSong)}
                    className={`w-full flex items-center gap-2 p-2 rounded-md text-left text-xs transition-colors ${
                      addedToPlaylist === pl.id
                        ? 'bg-green-100 text-green-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {addedToPlaylist === pl.id ? (
                      <Check size={14} />
                    ) : (
                      <ListPlus size={14} className="text-secondary" />
                    )}
                    <span className="truncate">{pl.name}</span>
                    <span className="text-secondary ml-auto">({pl.songs.length}곡)</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {currentPlaylist.length === 0 ? (
          <p className="text-sm text-secondary text-center py-4">
            재생 중인 곡이 없습니다
          </p>
        ) : (
          <div className="space-y-2">
            {currentPlaylist.map((song, index) => {
              const isCurrentTrack = currentTrack?.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${
                    isCurrentTrack
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-xs w-5 ${isCurrentTrack ? 'text-primary font-bold' : 'text-secondary'}`}>
                    {isCurrentTrack ? '▶' : index + 1}
                  </span>
                  <div
                    onClick={() => setTrack(song)}
                    className={`w-12 h-12 rounded-md overflow-hidden flex-shrink-0 cursor-pointer ${isCurrentTrack ? 'ring-2 ring-primary' : 'bg-gray-200'}`}
                  >
                    {song.albumArt ? (
                      <img src={song.albumArt} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                  </div>
                  <div
                    onClick={() => setTrack(song)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <p className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-primary' : 'text-primary'}`}>
                      {song.title}
                    </p>
                    <p className={`text-xs truncate ${isCurrentTrack ? 'text-primary/70' : 'text-secondary'}`}>
                      {song.artist}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddToPlaylistSong(song);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-secondary opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all"
                    title="플레이리스트에 추가"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </aside>
    );
  }

  // Default View (Home, Favorites, Library, Equalizer) - Always show Mini Turntable + Queue
  return (
    <aside className="w-full md:w-80 bg-card md:border-l border-border p-4 md:p-6 overflow-y-auto">
      {/* Mini Turntable */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-primary mb-4 text-center">Now Playing</h2>
        <MiniTurntable />
      </section>

      {/* Current Playlist / Queue */}
      <section>
        <h2 className="text-sm font-semibold text-primary mb-4">재생 대기열</h2>

        {currentPlaylist.length === 0 ? (
          <p className="text-sm text-secondary text-center py-4">
            음악을 선택해주세요
          </p>
        ) : (
          <div className="space-y-2">
            {currentPlaylist.slice(0, 5).map((song) => {
              const isCurrentTrack = currentTrack?.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => setTrack(song)}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                    isCurrentTrack ? 'bg-primary/10' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-md overflow-hidden flex-shrink-0 ${isCurrentTrack ? 'ring-2 ring-primary' : 'bg-gray-200'}`}>
                    {song.albumArt ? (
                      <img src={song.albumArt} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <Music size={12} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${isCurrentTrack ? 'text-primary' : 'text-primary'}`}>
                      {song.title}
                    </p>
                    <p className="text-[10px] text-secondary truncate">{song.artist}</p>
                  </div>
                  {isCurrentTrack && (
                    <span className="text-primary text-xs">▶</span>
                  )}
                </div>
              );
            })}
            {currentPlaylist.length > 5 && (
              <p className="text-xs text-secondary text-center pt-2">
                +{currentPlaylist.length - 5}곡 더 보기
              </p>
            )}
          </div>
        )}
      </section>
    </aside>
  );
}
