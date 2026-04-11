'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TutorialMode, getMode, setMode as storeSave } from '@/lib/modeStore';

interface ModeContextType {
  mode: TutorialMode;
  setMode: (m: TutorialMode) => void;
}

const ModeContext = createContext<ModeContextType>({
  mode: 'anthropic',
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<TutorialMode>('anthropic');

  useEffect(() => {
    setModeState(getMode());
  }, []);

  const setMode = (m: TutorialMode) => {
    storeSave(m);
    setModeState(m);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useTutorialMode() {
  return useContext(ModeContext);
}
