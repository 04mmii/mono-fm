'use client';

import { useEffect, useState } from 'react';
import { useRecommend } from '@/hooks/useRecommend';
import { useUIStore } from '@/stores/uiStore';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import RightPanel from '@/components/layout/RightPanel';
import MobileNav from '@/components/layout/MobileNav';
import AudioPlayer from '@/components/player/AudioPlayer';
import HomeView from '@/components/views/HomeView';
import DetailView from '@/components/views/DetailView';
import FavoritesView from '@/components/views/FavoritesView';
import LibraryView from '@/components/views/LibraryView';
import EqualizerView from '@/components/views/EqualizerView';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { recommend, isLoading } = useRecommend();
  const { activeView, setActiveView } = useUIStore();
  const [hydrated, setHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleSearch = async (query: string) => {
    try {
      await recommend(query);
      setActiveView('detail');
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Show nothing until hydrated
  if (!hydrated) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-secondary" size={48} />
      </div>
    );
  }

  // Render center content based on activeView
  const renderCenterView = () => {
    switch (activeView) {
      case 'detail':
        return <DetailView />;
      case 'favorites':
        return <FavoritesView />;
      case 'library':
        return <LibraryView />;
      case 'equalizer':
        return <EqualizerView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Audio Player (hidden) */}
      <AudioPlayer />

      {/* Header */}
      <Header onSearch={handleSearch} isLoading={isLoading} />

      {/* Main Content - Desktop */}
      <div className="flex-1 hidden md:flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Center - View based on activeView */}
        {renderCenterView()}

        {/* Right Panel - Always shows Now Playing */}
        <RightPanel />
      </div>

      {/* Main Content - Mobile */}
      <div className="flex-1 flex md:hidden overflow-hidden pb-[120px]">
        {renderCenterView()}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
