'use client';

import { Search, Mail, Bell, User, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';

interface HeaderProps {
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

export default function Header({ onSearch, isLoading }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { setActiveView } = useUIStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
  };

  const handleLogoClick = () => {
    setActiveView('home');
    window.scrollTo(0, 0);
  };

  return (
    <header className="h-14 md:h-16 bg-card border-b border-border flex items-center justify-between px-3 md:px-6">
      {/* Logo */}
      <button
        onClick={handleLogoClick}
        className="text-lg md:text-xl font-bold tracking-wider text-primary hover:opacity-70 transition-opacity flex-shrink-0"
      >
        MONO.fm
      </button>

      {/* Search */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-2 md:mx-8">
        <div className="relative">
          {isLoading ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary animate-spin" size={18} />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="분위기 검색..."
            className="w-full h-9 md:h-10 pl-10 pr-4 bg-background border border-border rounded-full text-sm focus:outline-none focus:border-primary transition-colors"
            disabled={isLoading}
          />
        </div>
      </form>

      {/* Actions - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-2">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-gray-100 transition-colors">
          <Mail size={20} />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-gray-100 transition-colors">
          <Bell size={20} />
        </button>
        <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-secondary hover:bg-gray-300 transition-colors">
          <User size={20} />
        </button>
      </div>
    </header>
  );
}
