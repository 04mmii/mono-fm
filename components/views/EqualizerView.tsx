'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore, EQ_BANDS, EQ_PRESETS } from '@/stores/playerStore';
import { Power, RotateCcw, Sliders, Volume2, Music } from 'lucide-react';

const BAND_LABELS: Record<number, string> = {
  60: '60',
  170: '170',
  350: '350',
  1000: '1K',
  3500: '3.5K',
  10000: '10K',
};

const PRESET_LABELS: Record<string, string> = {
  flat: '기본',
  bass: '베이스',
  treble: '고음',
  vocal: '보컬',
  rock: '락',
  jazz: '재즈',
  electronic: '일렉',
  acoustic: '어쿠스틱',
};

const PRESET_COLORS: Record<string, string> = {
  flat: '#6b7280',
  bass: '#ef4444',
  treble: '#3b82f6',
  vocal: '#ec4899',
  rock: '#f59e0b',
  jazz: '#8b5cf6',
  electronic: '#06b6d4',
  acoustic: '#10b981',
};

// 주파수별 그라디언트 색상
const FREQ_COLORS = [
  { from: '#ef4444', to: '#dc2626' }, // 60Hz - Red (Bass)
  { from: '#f97316', to: '#ea580c' }, // 170Hz - Orange
  { from: '#eab308', to: '#ca8a04' }, // 350Hz - Yellow
  { from: '#22c55e', to: '#16a34a' }, // 1kHz - Green
  { from: '#3b82f6', to: '#2563eb' }, // 3.5kHz - Blue
  { from: '#8b5cf6', to: '#7c3aed' }, // 10kHz - Purple (Treble)
];

export default function EqualizerView() {
  const { eqSettings, eqEnabled, isPlaying, setEQBand, setEQPreset, toggleEQ } = usePlayerStore();
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0, 0, 0]);

  const presets = Object.keys(EQ_PRESETS);

  // 재생 중일 때 막대 애니메이션
  useEffect(() => {
    if (!isPlaying || !eqEnabled) {
      setAnimatedValues([0, 0, 0, 0, 0, 0]);
      return;
    }

    const interval = setInterval(() => {
      setAnimatedValues(
        EQ_BANDS.map((band) => {
          const base = eqSettings[band];
          const random = (Math.random() - 0.5) * 6;
          return Math.max(-12, Math.min(12, base + random));
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, eqEnabled, eqSettings]);

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <motion.div
            className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              boxShadow: eqEnabled ? '0 0 30px rgba(6, 182, 212, 0.5)' : 'none',
            }}
            animate={{ scale: eqEnabled ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sliders size={28} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">이퀄라이저</h1>
            <p className="text-sm md:text-base text-gray-400">사운드를 커스터마이즈하세요</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setEQPreset('flat')}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center hover:bg-gray-600 transition-colors"
            title="초기화"
          >
            <RotateCcw size={18} />
          </button>
          <motion.button
            onClick={toggleEQ}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-bold transition-all ${
              eqEnabled
                ? 'text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
            style={{
              background: eqEnabled
                ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)'
                : undefined,
              boxShadow: eqEnabled ? '0 0 20px rgba(6, 182, 212, 0.5)' : 'none',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Power size={18} />
            {eqEnabled ? 'ON' : 'OFF'}
          </motion.button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Visual EQ Display - Main Feature */}
        <motion.div
          className="rounded-3xl p-6 md:p-8 mb-6 md:mb-8"
          style={{
            background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.9))',
            boxShadow: eqEnabled
              ? '0 0 60px rgba(6, 182, 212, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.5)'
              : 'inset 0 0 30px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          animate={{ opacity: eqEnabled ? 1 : 0.6 }}
        >
          {/* Frequency Labels Top */}
          <div className="flex justify-between mb-4 px-2">
            {EQ_BANDS.map((band, i) => (
              <span
                key={band}
                className="text-xs md:text-sm font-bold"
                style={{ color: FREQ_COLORS[i].from }}
              >
                {BAND_LABELS[band]}Hz
              </span>
            ))}
          </div>

          {/* EQ Bars */}
          <div className="flex justify-between items-end gap-3 md:gap-4 h-48 md:h-64 mb-4">
            {EQ_BANDS.map((band, i) => {
              const value = isPlaying && eqEnabled ? animatedValues[i] : eqSettings[band];
              const heightPercent = ((value + 12) / 24) * 100;
              const colors = FREQ_COLORS[i];

              return (
                <div key={band} className="flex flex-col items-center flex-1 h-full">
                  <div className="relative flex-1 w-full flex flex-col justify-end rounded-xl overflow-hidden">
                    {/* Background with grid lines */}
                    <div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        backgroundImage: `
                          linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '100% 10%',
                      }}
                    />

                    {/* Value bar with gradient */}
                    <motion.div
                      className="relative rounded-xl"
                      style={{
                        background: `linear-gradient(180deg, ${colors.from}, ${colors.to})`,
                        boxShadow: eqEnabled
                          ? `0 0 20px ${colors.from}80, inset 0 0 10px rgba(255,255,255,0.3)`
                          : 'none',
                      }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.1 }}
                    >
                      {/* Shine effect */}
                      <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: 'linear-gradient(90deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1))',
                        }}
                      />
                    </motion.div>

                    {/* Center line (0dB) */}
                    <div
                      className="absolute top-1/2 left-0 right-0 h-0.5"
                      style={{ background: 'rgba(255, 255, 255, 0.3)' }}
                    />
                  </div>

                  {/* Value display */}
                  <span className="text-xs md:text-sm font-bold text-white mt-3">
                    {eqSettings[band] > 0 ? '+' : ''}{eqSettings[band]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* dB Scale */}
          <div className="flex justify-between text-xs text-gray-500 px-2">
            <span>-12dB</span>
            <span>0dB</span>
            <span>+12dB</span>
          </div>
        </motion.div>

        {/* Presets */}
        <div
          className="rounded-2xl p-4 md:p-6 mb-6"
          style={{
            background: 'rgba(31, 41, 55, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Music size={18} className="text-cyan-400" />
            <p className="text-sm md:text-base font-bold text-white">프리셋</p>
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {presets.map((preset) => {
              const isActive = JSON.stringify(eqSettings) === JSON.stringify(EQ_PRESETS[preset]);
              const color = PRESET_COLORS[preset];
              return (
                <motion.button
                  key={preset}
                  onClick={() => setEQPreset(preset)}
                  className="relative px-3 py-3 md:py-4 rounded-xl text-xs md:text-sm font-bold transition-all overflow-hidden"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${color}, ${color}99)`
                      : 'rgba(55, 65, 81, 0.8)',
                    color: isActive ? 'white' : '#9ca3af',
                    boxShadow: isActive ? `0 0 20px ${color}60` : 'none',
                    border: `1px solid ${isActive ? color : 'transparent'}`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {PRESET_LABELS[preset] || preset}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Sliders */}
        <div
          className={`rounded-2xl p-4 md:p-6 transition-opacity ${eqEnabled ? 'opacity-100' : 'opacity-40'}`}
          style={{
            background: 'rgba(31, 41, 55, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Volume2 size={18} className="text-purple-400" />
            <p className="text-sm md:text-base font-bold text-white">세부 조절</p>
          </div>
          <div className="space-y-4 md:space-y-5">
            {EQ_BANDS.map((band, i) => {
              const colors = FREQ_COLORS[i];
              return (
                <div key={band} className="flex items-center gap-3 md:gap-4">
                  <span
                    className="text-xs md:text-sm font-bold w-14 md:w-16"
                    style={{ color: colors.from }}
                  >
                    {BAND_LABELS[band]}Hz
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min={-12}
                      max={12}
                      step={1}
                      value={eqSettings[band]}
                      onChange={(e) => setEQBand(band, parseInt(e.target.value))}
                      disabled={!eqEnabled}
                      className="w-full h-3 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(90deg, ${colors.from} 0%, ${colors.from} ${((eqSettings[band] + 12) / 24) * 100}%, #374151 ${((eqSettings[band] + 12) / 24) * 100}%, #374151 100%)`,
                      }}
                    />
                  </div>
                  <span
                    className="text-sm md:text-base font-bold w-12 text-right"
                    style={{ color: colors.from }}
                  >
                    {eqSettings[band] > 0 ? '+' : ''}{eqSettings[band]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: eqEnabled ? 'rgba(6, 182, 212, 0.2)' : 'rgba(107, 114, 128, 0.2)',
              border: `1px solid ${eqEnabled ? 'rgba(6, 182, 212, 0.5)' : 'rgba(107, 114, 128, 0.3)'}`,
            }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: eqEnabled ? '#06b6d4' : '#6b7280' }}
              animate={{ opacity: eqEnabled ? [1, 0.5, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className={`text-sm font-medium ${eqEnabled ? 'text-cyan-400' : 'text-gray-500'}`}>
              {eqEnabled ? '이퀄라이저 활성화됨' : '이퀄라이저 비활성화'}
            </span>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
