'use client';

import { Play, Plus, Trash2, Music, Library, X } from 'lucide-react';
import { useState } from 'react';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlayerStore } from '@/stores/playerStore';

export default function LibraryView() {
  const { playlists, createPlaylist, deletePlaylist, removeFromPlaylist } = useLibraryStore();
  const { setPlaylist, setTrack, currentTrack, playlist: currentPlayerPlaylist } = usePlayerStore();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(null);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), currentPlayerPlaylist);
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handlePlayPlaylist = (playlistSongs: typeof playlists[0]['songs']) => {
    if (playlistSongs.length > 0) {
      setPlaylist(playlistSongs);
      setTrack(playlistSongs[0]);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <Library size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">내 플레이리스트</h1>
            <p className="text-sm text-secondary">{playlists.length}개의 플레이리스트</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-medium hidden md:inline">새 플레이리스트</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-card rounded-xl border border-border">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="플레이리스트 이름..."
            className="w-full px-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary mb-3"
            onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreatePlaylist}
              className="flex-1 py-2 bg-primary text-white text-sm rounded-lg hover:bg-gray-800"
            >
              생성
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 py-2 bg-gray-200 text-secondary text-sm rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Library size={32} className="text-gray-400" />
          </div>
          <p className="text-lg font-medium text-primary mb-2">플레이리스트가 없어요</p>
          <p className="text-sm text-secondary">새 플레이리스트를 만들어보세요</p>
        </div>
      ) : (
        <div className="space-y-4">
          {playlists.map((pl) => (
            <div key={pl.id} className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Playlist Header */}
              <div
                onClick={() => setExpandedPlaylistId(expandedPlaylistId === pl.id ? null : pl.id)}
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {pl.coverImage ? (
                    <img src={pl.coverImage} alt={pl.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <Music size={24} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary truncate">{pl.name}</p>
                  <p className="text-sm text-secondary">{pl.songs.length}곡</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPlaylist(pl.songs);
                  }}
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Play size={18} fill="white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist(pl.id);
                  }}
                  className="w-10 h-10 rounded-full text-secondary flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Expanded Songs */}
              {expandedPlaylistId === pl.id && (
                <div className="border-t border-border bg-gray-50/50">
                  {pl.songs.length === 0 ? (
                    <p className="text-sm text-secondary text-center py-4">곡이 없습니다</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {pl.songs.map((song) => {
                        const isCurrentTrack = currentTrack?.id === song.id;
                        return (
                          <div
                            key={song.id}
                            className={`flex items-center gap-3 p-3 ${isCurrentTrack ? 'bg-primary/5' : ''}`}
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              {song.albumArt ? (
                                <img src={song.albumArt} alt={song.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                              )}
                            </div>
                            <div
                              onClick={() => {
                                setPlaylist(pl.songs);
                                setTrack(song);
                              }}
                              className="flex-1 min-w-0 cursor-pointer"
                            >
                              <p className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-primary' : 'text-primary'}`}>
                                {song.title}
                              </p>
                              <p className="text-xs text-secondary truncate">{song.artist}</p>
                            </div>
                            <button
                              onClick={() => removeFromPlaylist(pl.id, song.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
