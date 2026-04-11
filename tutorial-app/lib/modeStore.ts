export type TutorialMode = 'anthropic' | 'generic';

const MODE_STORAGE_KEY = 'prompt_eng_mode';

export function getMode(): TutorialMode {
  if (typeof window === 'undefined') return 'anthropic';
  try {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === 'anthropic' || stored === 'generic') return stored;
  } catch {
    // storage unavailable
  }
  return 'anthropic';
}

export function setMode(mode: TutorialMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // storage unavailable
  }
}
