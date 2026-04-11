'use client';

import { UserProgress, ExerciseResult, Badge, getLevelFromXP } from './types';

const STORAGE_KEY = 'prompt_eng_progress';

export function getProgress(): UserProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function initProgress(username: string): UserProgress {
  const progress: UserProgress = {
    username,
    totalXP: 0,
    level: 0,
    completedExercises: {},
    completedChapters: [],
    badges: [],
    startedAt: Date.now(),
  };
  saveProgress(progress);
  return progress;
}

export function saveProgress(progress: UserProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // storage full or unavailable
  }
}

export function recordExerciseResult(
  exerciseId: string,
  result: Omit<ExerciseResult, 'exerciseId'>
): UserProgress | null {
  const progress = getProgress();
  if (!progress) return null;

  const existing = progress.completedExercises[exerciseId];

  if (!existing || result.xpEarned > existing.xpEarned) {
    progress.completedExercises[exerciseId] = {
      exerciseId,
      ...result,
    };

    const totalXP = Object.values(progress.completedExercises).reduce(
      (sum, r) => sum + r.xpEarned,
      0
    );
    progress.totalXP = totalXP;
    const levelData = getLevelFromXP(totalXP);
    progress.level = levelData ? 1 : 0;

    saveProgress(progress);
  }

  return progress;
}

export function markChapterComplete(chapterId: string, bonusXP: number): UserProgress | null {
  const progress = getProgress();
  if (!progress) return null;

  if (!progress.completedChapters.includes(chapterId)) {
    progress.completedChapters.push(chapterId);
    progress.totalXP += bonusXP;

    const badge: Badge = {
      id: `badge_${chapterId}`,
      name: `Chapter Complete`,
      description: `Completed chapter ${chapterId}`,
      icon: '🏅',
      earnedAt: Date.now(),
    };
    progress.badges.push(badge);

    saveProgress(progress);
  }

  return progress;
}

export function calculateXPForExercise(
  attempts: number,
  usedHint: boolean,
  baseXP: number
): number {
  let xp = baseXP;
  if (usedHint) xp = Math.round(xp * 0.7);
  if (attempts === 1) xp = Math.round(xp * 1.0);
  else if (attempts === 2) xp = Math.round(xp * 0.85);
  else xp = Math.round(xp * 0.7);
  return xp;
}

export function clearProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// ── Generic Mode ─────────────────────────────────────────────────────────────

const GENERIC_STORAGE_KEY = 'prompt_eng_progress_generic';

export function getGenericProgress(): UserProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(GENERIC_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function initGenericProgress(username: string): UserProgress {
  const progress: UserProgress = {
    username,
    totalXP: 0,
    level: 0,
    completedExercises: {},
    completedChapters: [],
    badges: [],
    startedAt: Date.now(),
  };
  saveGenericProgress(progress);
  return progress;
}

export function saveGenericProgress(progress: UserProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GENERIC_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // storage full or unavailable
  }
}

export function recordGenericExerciseResult(
  exerciseId: string,
  result: Omit<ExerciseResult, 'exerciseId'>
): UserProgress | null {
  const progress = getGenericProgress();
  if (!progress) return null;

  const existing = progress.completedExercises[exerciseId];

  if (!existing || result.xpEarned > existing.xpEarned) {
    progress.completedExercises[exerciseId] = {
      exerciseId,
      ...result,
    };

    const totalXP = Object.values(progress.completedExercises).reduce(
      (sum, r) => sum + r.xpEarned,
      0
    );
    progress.totalXP = totalXP;
    const levelData = getLevelFromXP(totalXP);
    progress.level = levelData ? 1 : 0;

    saveGenericProgress(progress);
  }

  return progress;
}

export function markGenericChapterComplete(chapterId: string, bonusXP: number): UserProgress | null {
  const progress = getGenericProgress();
  if (!progress) return null;

  if (!progress.completedChapters.includes(chapterId)) {
    progress.completedChapters.push(chapterId);
    progress.totalXP += bonusXP;

    const badge: Badge = {
      id: `badge_${chapterId}`,
      name: `Chapter Complete`,
      description: `Completed chapter ${chapterId}`,
      icon: '🏅',
      earnedAt: Date.now(),
    };
    progress.badges.push(badge);

    saveGenericProgress(progress);
  }

  return progress;
}

export function clearGenericProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GENERIC_STORAGE_KEY);
}
