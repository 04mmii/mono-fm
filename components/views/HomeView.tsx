'use client';

import { useEffect, useState } from 'react';
import { Play, Music, Loader2, Clock } from 'lucide-react';
import { usePlayerStore } from '@/stores/playerStore';
import { useUIStore } from '@/stores/uiStore';
import { categories } from '@/constants/theme';
import { Song } from '@/types';

export default function HomeView() {
  const { setPlaylist, setTrack } = usePlayerStore();
  const { setActiveView } = useUIStore();
  const [featuredTracks, setFeaturedTracks] = useState<Song[]>([]);
  const [categoryTracks, setCategoryTracks] = useState<Record<string, Song[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('new');

  // Fetch featured tracks
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/spotify/featured?limit=8');
        if (res.ok) {
          const data = await res.json();
          setFeaturedTracks(data.songs || []);
        }
      } catch (error) {
        console.error('Failed to fetch featured:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Fetch category tracks
  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryTracks[activeCategory]) return;

      try {
        const res = await fetch(`/api/spotify/category?category=${activeCategory}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setCategoryTracks((prev) => ({
            ...prev,
            [activeCategory]: data.songs || [],
          }));
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
      }
    };
    fetchCategory();
  }, [activeCategory, categoryTracks]);

  const handlePlayTrack = (song: Song, playlist: Song[]) => {
    setPlaylist(playlist);
    setTrack(song);
    setActiveView('detail');
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={48} />
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
      {/* 30초 미리듣기 안내 */}
      <div className="mb-4 md:mb-6 p-2 md:p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
        <Clock size={16} className="text-amber-600 flex-shrink-0" />
        <p className="text-xs md:text-sm text-amber-700">
          미리듣기는 <strong>30초</strong>만 제공됩니다.
          <span className="hidden md:inline"> 전체 곡을 들으려면 상세 페이지에서 YouTube 링크를 이용해주세요.</span>
        </p>
      </div>

      {/* Featured Section */}
      <section className="mb-6 md:mb-10">
        <h2 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">오늘의 추천</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {featuredTracks.slice(0, 8).map((song) => (
            <div
              key={song.id}
              onClick={() => handlePlayTrack(song, featuredTracks)}
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 relative mb-2">
                {song.albumArt ? (
                  <img
                    src={song.albumArt}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Music size={32} className="text-gray-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <Play size={24} className="text-primary ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <p className="font-medium text-primary text-sm truncate">{song.title}</p>
              <p className="text-xs text-secondary truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">카테고리</h2>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-secondary hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Category Tracks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {(categoryTracks[activeCategory] || []).slice(0, 8).map((song) => (
            <div
              key={song.id}
              onClick={() => handlePlayTrack(song, categoryTracks[activeCategory] || [])}
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 relative mb-2">
                {song.albumArt ? (
                  <img
                    src={song.albumArt}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <Music size={32} className="text-gray-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <Play size={24} className="text-primary ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <p className="font-medium text-primary text-sm truncate">{song.title}</p>
              <p className="text-xs text-secondary truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
