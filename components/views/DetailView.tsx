"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Plus,
  Check,
  ListPlus,
  X,
  Heart,
} from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";
import { useUIStore } from "@/stores/uiStore";
import { useLibraryStore } from "@/stores/libraryStore";
import { moodTheme } from "@/constants/theme";
import Turntable from "@/components/player/Turntable";
import NowPlaying from "@/components/player/NowPlaying";
import WaveForm from "@/components/player/WaveForm";
import Controls from "@/components/player/Controls";

export default function DetailView() {
  const { currentTrack, currentMood } = usePlayerStore();
  const { setActiveView } = useUIStore();
  const {
    playlists,
    addToPlaylist,
    favorites,
    addToFavorites,
    removeFromFavorites,
  } = useLibraryStore();

  const isFavorite = currentTrack
    ? favorites.some((f) => f.id === currentTrack.id)
    : false;

  const toggleFavorite = () => {
    if (!currentTrack) return;
    if (isFavorite) {
      removeFromFavorites(currentTrack.id);
    } else {
      addToFavorites(currentTrack);
    }
  };
  const theme = moodTheme[currentMood];

  const [showAddModal, setShowAddModal] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState<string | null>(null);

  const handleAddToPlaylist = (playlistId: string) => {
    if (!currentTrack) return;
    addToPlaylist(playlistId, currentTrack);
    setAddedToPlaylist(playlistId);
    setTimeout(() => {
      setAddedToPlaylist(null);
      setShowAddModal(false);
    }, 1500);
  };

  // Generate YouTube search URL
  const getYouTubeSearchUrl = () => {
    if (!currentTrack) return "";
    const query = encodeURIComponent(
      `${currentTrack.title} ${currentTrack.artist}`
    );
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  const handleBack = () => {
    setActiveView("home");
  };

  if (!currentTrack) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-background">
        <p className="text-secondary">곡을 선택해주세요</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-800"
        >
          홈으로 돌아가기
        </button>
      </main>
    );
  }

  return (
    <main
      className={`flex-1 flex flex-col items-center p-4 md:p-8 transition-mood bg-gradient-to-b ${theme.gradient} overflow-y-auto`}
    >
      {/* Back Button - Hidden on mobile (use bottom nav) */}
      <div className="w-full max-w-2xl mb-4 md:mb-6 hidden md:block">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
          <span>홈으로</span>
        </button>
      </div>

      {/* 30초 미리듣기 안내 */}
      <div className="w-full max-w-md mb-4 md:mb-6 p-2 md:p-3 bg-white/80 backdrop-blur rounded-lg flex items-center gap-2">
        <Clock size={16} className="text-amber-600 flex-shrink-0" />
        <p className="text-xs md:text-sm text-amber-700">
          미리듣기는 <strong>30초</strong>만 제공됩니다.
        </p>
      </div>

      {/* Turntable */}
      <div className="mb-4 md:mb-6">
        <Turntable />
      </div>

      {/* Now Playing Info */}
      <NowPlaying />

      {/* Waveform */}
      <div className="w-full max-w-md mb-4 md:mb-6">
        <WaveForm />
      </div>

      {/* Controls */}
      {/* <Controls />/ */}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4">
        {/* Like Button */}
        <button
          onClick={toggleFavorite}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors shadow-md ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/80 backdrop-blur text-primary hover:bg-white"
          }`}
        >
          <Heart size={18} fill={isFavorite ? "white" : "none"} />
          <span className="text-sm font-medium">
            {isFavorite ? "좋아요" : "좋아요"}
          </span>
        </button>

        {/* Add to Playlist Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full text-primary hover:bg-white transition-colors shadow-md"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">내 리스트에 추가</span>
          </button>

          {/* Add to Playlist Modal */}
          {showAddModal && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-xl border border-border p-3 z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-primary">
                  플레이리스트 선택
                </p>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-secondary hover:text-primary"
                >
                  <X size={16} />
                </button>
              </div>
              {playlists.length === 0 ? (
                <p className="text-xs text-secondary text-center py-4">
                  저장된 플레이리스트가 없습니다.
                  <br />
                  보관함에서 새로 만들어보세요!
                </p>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {playlists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => handleAddToPlaylist(pl.id)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${
                        addedToPlaylist === pl.id
                          ? "bg-green-100 text-green-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {addedToPlaylist === pl.id ? (
                        <Check size={16} />
                      ) : (
                        <ListPlus size={16} className="text-secondary" />
                      )}
                      <span className="truncate flex-1">{pl.name}</span>
                      <span className="text-xs text-secondary">
                        ({pl.songs.length}곡)
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Song Details - Below Controls */}
      <div className="w-full max-w-md mt-6 md:mt-8 p-3 md:p-4 bg-white/80 backdrop-blur rounded-xl">
        <h3 className="text-sm font-semibold text-primary mb-2 md:mb-3">
          곡 정보
        </h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
          <div>
            <p className="text-secondary mb-1 text-xs md:text-sm">BPM</p>
            <p className="font-bold text-primary text-sm md:text-base">
              {currentTrack.bpm || "-"}
            </p>
          </div>
          <div>
            <p className="text-secondary mb-1 text-xs md:text-sm">분위기</p>
            <p className="font-bold text-primary capitalize text-sm md:text-base">
              {currentTrack.mood || "-"}
            </p>
          </div>
          {currentTrack.reason && (
            <div className="col-span-2">
              <p className="text-secondary mb-1 text-xs md:text-sm">
                추천 이유
              </p>
              <p className="font-medium text-primary text-xs md:text-sm">
                {currentTrack.reason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* YouTube Link */}
      <a
        href={getYouTubeSearchUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 md:mt-8 mb-4 flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg text-sm md:text-base"
      >
        <svg
          className="w-4 h-4 md:w-5 md:h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        <span className="font-medium">YouTube에서 전체 곡 듣기</span>
        <ExternalLink size={14} className="md:w-4 md:h-4" />
      </a>
    </main>
  );
}
