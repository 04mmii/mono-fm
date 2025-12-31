import { Mood } from '@/types';

export const moodTheme: Record<Mood, { bg: string; accent: string; gradient: string }> = {
  calm: {
    bg: 'bg-slate-100',
    accent: 'text-slate-600',
    gradient: 'from-slate-200 to-slate-100',
  },
  energetic: {
    bg: 'bg-amber-50',
    accent: 'text-amber-600',
    gradient: 'from-amber-100 to-amber-50',
  },
  melancholy: {
    bg: 'bg-blue-50',
    accent: 'text-blue-600',
    gradient: 'from-blue-100 to-blue-50',
  },
  romantic: {
    bg: 'bg-rose-50',
    accent: 'text-rose-600',
    gradient: 'from-rose-100 to-rose-50',
  },
  dark: {
    bg: 'bg-zinc-200',
    accent: 'text-zinc-700',
    gradient: 'from-zinc-300 to-zinc-200',
  },
  uplifting: {
    bg: 'bg-yellow-50',
    accent: 'text-yellow-600',
    gradient: 'from-yellow-100 to-yellow-50',
  },
};

export const categories = [
  { id: 'classic', label: 'Classic' },
  { id: '90s', label: '90s' },
  { id: 'new', label: 'New' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'indie', label: 'Indie' },
];
