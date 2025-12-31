'use client';

import { usePlayerStore, EQ_BANDS, EQ_PRESETS } from '@/stores/playerStore';
import { Power, RotateCcw, Sliders } from 'lucide-react';

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

export default function EqualizerView() {
  const { eqSettings, eqEnabled, setEQBand, setEQPreset, toggleEQ } = usePlayerStore();

  const presets = Object.keys(EQ_PRESETS);

  return (
    <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <Sliders size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">이퀄라이저</h1>
            <p className="text-sm text-secondary">음향을 커스터마이즈하세요</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEQPreset('flat')}
            className="w-10 h-10 rounded-full bg-gray-100 text-secondary flex items-center justify-center hover:bg-gray-200 transition-colors"
            title="초기화"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={toggleEQ}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              eqEnabled
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-secondary'
            }`}
          >
            <Power size={16} />
            {eqEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Presets */}
        <div className="bg-card rounded-xl border border-border p-4 md:p-6 mb-6">
          <p className="text-sm font-medium text-primary mb-4">프리셋</p>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {presets.map((preset) => {
              const isActive = JSON.stringify(eqSettings) === JSON.stringify(EQ_PRESETS[preset]);
              return (
                <button
                  key={preset}
                  onClick={() => setEQPreset(preset)}
                  className={`px-3 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg'
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
        <div className={`bg-card rounded-xl border border-border p-4 md:p-6 transition-opacity ${eqEnabled ? 'opacity-100' : 'opacity-50'}`}>
          <p className="text-sm font-medium text-primary mb-6">주파수 조절</p>

          {/* Visual EQ Display */}
          <div className="flex justify-between items-end gap-3 mb-8 h-32 bg-gray-50 rounded-xl p-4">
            {EQ_BANDS.map((band) => {
              const value = eqSettings[band];
              const heightPercent = ((value + 12) / 24) * 100;
              return (
                <div key={band} className="flex flex-col items-center flex-1 h-full">
                  <div className="relative flex-1 w-full flex items-end justify-center">
                    {/* Background bar */}
                    <div className="absolute inset-0 bg-gray-200 rounded" />
                    {/* Value bar */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded transition-all duration-150 ${
                        eqEnabled ? 'bg-primary' : 'bg-gray-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Center line */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400" />
                  </div>
                  <span className="text-[10px] md:text-xs text-secondary mt-2">{BAND_LABELS[band]}</span>
                </div>
              );
            })}
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {EQ_BANDS.map((band) => (
              <div key={band} className="flex items-center gap-4">
                <span className="text-xs md:text-sm text-secondary w-12 md:w-14">{BAND_LABELS[band]}Hz</span>
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
                <span className="text-xs md:text-sm font-medium text-primary w-10 text-right">
                  {eqSettings[band] > 0 ? '+' : ''}{eqSettings[band]}dB
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-secondary mt-4 text-center">
          -12dB ~ +12dB 범위에서 조절 가능합니다
        </p>
      </div>
    </main>
  );
}
