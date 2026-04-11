'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProgress } from '@/lib/types';
import { getProgress, saveProgress, getGenericProgress, saveGenericProgress } from '@/lib/store';
import { getMode } from '@/lib/modeStore';

interface ProgressContextType {
  progress: UserProgress | null;
  setProgress: (p: UserProgress) => void;
  refreshProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType>({
  progress: null,
  setProgress: () => {},
  refreshProgress: () => {},
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgressState] = useState<UserProgress | null>(null);

  const refreshProgress = () => {
    const mode = getMode();
    const p = mode === 'generic' ? getGenericProgress() : getProgress();
    setProgressState(p);
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  // Re-read progress whenever the mode changes (detected via storage events or polling)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'prompt_eng_mode') {
        refreshProgress();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setProgress = (p: UserProgress) => {
    const mode = getMode();
    if (mode === 'generic') {
      saveGenericProgress(p);
    } else {
      saveProgress(p);
    }
    setProgressState(p);
  };

  return (
    <ProgressContext.Provider value={{ progress, setProgress, refreshProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
