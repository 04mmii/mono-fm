'use client';

import { usePlayerStore, EQ_BANDS, EQ_PRESETS } from '@/stores/playerStore';
import { Power, RotateCcw } from 'lucide-react';

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

export default function Equalizer() {
  const { eqSettings, eqEnabled, setEQBand, setEQPreset, toggleEQ } = usePlayerStore();

  const presets = Object.keys(EQ_PRESETS);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-bold text-primary">이퀄라이저</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEQPreset('flat')}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-100 text-secondary flex items-center justify-center hover:bg-gray-200 transition-colors"
            title="초기화"
          >
            <RotateCcw size={12} className="md:w-3.5 md:h-3.5" />
          </button>
          <button
            onClick={toggleEQ}
            className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
              eqEnabled
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-secondary'
            }`}
          >
            <Power size={12} className="md:w-3.5 md:h-3.5" />
            {eqEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-4 md:mb-6">
        <p className="text-xs text-secondary mb-2">프리셋</p>
        <div className="grid grid-cols-4 gap-1.5 md:gap-2">
          {presets.map((preset) => {
            const isActive = JSON.stringify(eqSettings) === JSON.stringify(EQ_PRESETS[preset]);
            return (
              <button
                key={preset}
                onClick={() => setEQPreset(preset)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-secondary hover:bg-gray-200'
                }`}
              >
                {PRESET_LABELS[preset] || preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frequency Bands */}
      <div className={`transition-opacity ${eqEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <p className="text-xs text-secondary mb-3 md:mb-4">주파수 조절</p>

        {/* Visual EQ Display */}
        <div className="flex justify-between items-center gap-1.5 md:gap-2 mb-3 md:mb-4 h-20 md:h-24 bg-gray-50 rounded-lg p-2 md:p-3">
          {EQ_BANDS.map((band) => {
            const value = eqSettings[band];
            const heightPercent = ((value + 12) / 24) * 100;
            return (
              <div key={band} className="flex flex-col items-center flex-1 h-full">
                <div className="relative flex-1 w-full flex items-end justify-center">
                  {/* Background bar */}
                  <div className="absolute inset-0 bg-gray-200 rounded-sm" />
                  {/* Value bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-sm transition-all duration-150"
                    style={{ height: `${heightPercent}%` }}
                  />
                  {/* Center line */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Sliders */}
        <div className="space-y-2 md:space-y-3">
          {EQ_BANDS.map((band) => (
            <div key={band} className="flex items-center gap-2 md:gap-3">
              <span className="text-[10px] md:text-xs text-secondary w-8 md:w-10">{BAND_LABELS[band]}Hz</span>
              <input
                type="range"
                min={-12}
                max={12}
                step={1}
                value={eqSettings[band]}
                onChange={(e) => setEQBand(band, parseInt(e.target.value))}
                disabled={!eqEnabled}
                className="eq-slider flex-1 h-2"
              />
              <span className="text-[10px] md:text-xs font-medium text-primary w-8 md:w-10 text-right">
                {eqSettings[band] > 0 ? '+' : ''}{eqSettings[band]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <p className="text-[10px] text-secondary mt-3 md:mt-4 text-center">
        -12dB ~ +12dB 범위에서 조절
      </p>
    </div>
  );
}
