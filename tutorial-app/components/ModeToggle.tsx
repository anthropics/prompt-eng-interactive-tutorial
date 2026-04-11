'use client';

import { useRouter } from 'next/navigation';
import { useTutorialMode } from './ModeProvider';
import { useProgress } from './ProgressProvider';

export default function ModeToggle() {
  const { mode, setMode } = useTutorialMode();
  const { progress } = useProgress();
  const router = useRouter();

  if (!progress) return null;

  const handleSwitch = (next: 'anthropic' | 'generic') => {
    if (next === mode) return;
    setMode(next);
    router.push('/tutorial');
  };

  return (
    <div className="flex items-center rounded-md border border-stone-200 overflow-hidden text-xs font-medium">
      <button
        onClick={() => handleSwitch('anthropic')}
        className={`px-2.5 py-1 transition-colors ${
          mode === 'anthropic'
            ? 'bg-teak-600 text-white'
            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
        }`}
      >
        Anthropic
      </button>
      <button
        onClick={() => handleSwitch('generic')}
        className={`px-2.5 py-1 transition-colors border-l border-stone-200 ${
          mode === 'generic'
            ? 'bg-teak-600 text-white'
            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
        }`}
      >
        Generic
      </button>
    </div>
  );
}
