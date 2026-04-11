'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProgress } from './ProgressProvider';
import { useTutorialMode } from './ModeProvider';
import XPBar from './XPBar';
import { CHAPTERS } from '@/lib/chapters';
import { GENERIC_CHAPTERS } from '@/lib/genericChapters';
import ApiKeyModal from './ApiKeyModal';
import ModeToggle from './ModeToggle';
import { hasConfiguredProvider, getActiveProvider } from '@/lib/providerStore';

export default function Navbar() {
  const { progress } = useProgress();
  const { mode } = useTutorialMode();
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'groq' | 'anthropic'>('groq');

  useEffect(() => {
    setHasKey(hasConfiguredProvider());
    setActiveProvider(getActiveProvider());
  }, [showApiKey]);

  const chapters = mode === 'generic' ? GENERIC_CHAPTERS : CHAPTERS;
  const totalExercises = chapters.reduce((sum, ch) => sum + ch.exercises.length, 0);
  const completedExercises = progress
    ? Object.values(progress.completedExercises).filter((e) => e.passed).length
    : 0;

  return (
    <>
      {showApiKey && <ApiKeyModal onClose={() => setShowApiKey(false)} />}

      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-teak-600 rounded flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="currentColor" opacity="0.7"/>
                <rect x="6" y="6" width="4" height="4" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-stone-900 font-semibold text-base tracking-tight">PromptCraft</span>
              <span className="text-teak-600 font-semibold text-base tracking-tight">Academy</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/tutorial"
              className="text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium"
            >
              Chapters
            </Link>
            <Link
              href="/leaderboard"
              className="text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium"
            >
              Leaderboard
            </Link>

            <ModeToggle />

            <button
              onClick={() => setShowApiKey(true)}
              title={hasKey ? `Using ${activeProvider === 'anthropic' ? 'Anthropic (Claude)' : 'Groq (Llama)'}` : 'Add API key to run exercises'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                hasKey
                  ? 'border-teak-300 bg-teak-50 text-teak-700 hover:bg-teak-100'
                  : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-teak-500' : 'bg-amber-500'}`} />
              {hasKey
                ? activeProvider === 'anthropic' ? 'Claude (Premium)' : 'Groq (Free)'
                : 'Add Key'}
            </button>

            {progress && (
              <div className="flex items-center gap-3">
                <div className="text-stone-400 text-xs hidden sm:block">
                  {completedExercises}/{totalExercises}
                </div>
                <XPBar xp={progress.totalXP} compact />
                <div className="text-stone-700 text-sm font-medium hidden sm:block">
                  {progress.username}
                </div>
              </div>
            )}

            {!progress && (
              <Link
                href="/"
                className="bg-teak-600 hover:bg-teak-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                Start
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
