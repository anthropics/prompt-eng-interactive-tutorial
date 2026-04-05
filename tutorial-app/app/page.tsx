'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProgress } from '@/components/ProgressProvider';
import { initProgress } from '@/lib/store';
import { CHAPTERS } from '@/lib/chapters';
import { LEVELS } from '@/lib/types';

const FEATURES = [
  { icon: '⬡', title: 'Gamified Learning', desc: 'Earn XP, level up, and unlock badges as you master each technique' },
  { icon: '⬡', title: 'Real Claude API', desc: 'Test your prompts against real Claude responses instantly' },
  { icon: '⬡', title: 'Leaderboard', desc: 'Compete with other learners and claim the top spot' },
  { icon: '⬡', title: 'Certificate', desc: 'Earn a personalized certificate of completion with your score' },
];

export default function HomePage() {
  const router = useRouter();
  const { progress, setProgress } = useProgress();
  const [username, setUsername] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleStart = () => {
    if (!username.trim()) return;
    const p = initProgress(username.trim());
    setProgress(p);
    router.push('/tutorial');
  };

  const totalXP = CHAPTERS.reduce(
    (sum, ch) => sum + ch.exercises.reduce((s, ex) => s + ex.xpReward, 0) + ch.xpBonus,
    0
  );

  const completedExercises = progress
    ? Object.values(progress.completedExercises).filter((e) => e.passed).length
    : 0;
  const totalExercises = CHAPTERS.reduce((sum, ch) => sum + ch.exercises.length, 0);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <div className="inline-flex items-center gap-2 border border-teak-200 rounded-full px-3 py-1 text-xs text-stone-500 mb-10">
            <span className="w-1.5 h-1.5 bg-teak-500 rounded-full" />
            Powered by Claude &middot; 9 Chapters &middot; {totalExercises} Exercises
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-stone-900">
            Master Prompt Engineering
            <br />
            <span className="text-teak-600">the right way.</span>
          </h1>

          <p className="text-lg text-stone-500 mb-10 max-w-xl leading-relaxed">
            Learn hands-on with real Claude exercises. Earn XP, climb the leaderboard,
            and earn a certificate as you build production-ready prompting skills.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {progress ? (
              <>
                <Link
                  href="/tutorial"
                  className="inline-flex items-center justify-center px-6 py-3 bg-teak-600 hover:bg-teak-500 text-white rounded-md font-medium text-sm transition-colors"
                >
                  Continue Learning &rarr;
                </Link>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-stone-300 hover:border-stone-400 text-stone-700 rounded-md font-medium text-sm transition-colors"
                >
                  New Player
                </button>
              </>
            ) : !showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center px-6 py-3 bg-teak-600 hover:bg-teak-500 text-white rounded-md font-medium text-sm transition-colors"
              >
                Start Learning &rarr;
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  placeholder="Enter your username..."
                  className="px-4 py-3 rounded-md bg-white border border-stone-300 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-1 focus:ring-teak-400 focus:border-teak-400 w-56"
                  autoFocus
                />
                <button
                  onClick={handleStart}
                  disabled={!username.trim()}
                  className="px-5 py-3 bg-teak-600 hover:bg-teak-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md font-medium text-sm transition-colors"
                >
                  Go
                </button>
              </div>
            )}
          </div>

          {progress && (
            <p className="mt-4 text-sm text-stone-500">
              Welcome back, <span className="text-stone-700">{progress.username}</span> &mdash; {progress.totalXP} XP &middot; {completedExercises}/{totalExercises} exercises
            </p>
          )}

          {/* Stats */}
          <div className="flex gap-10 mt-16 text-sm">
            {[
              { value: `${totalXP}+`, label: 'XP available' },
              { value: '9', label: 'Chapters' },
              { value: String(totalExercises), label: 'Exercises' },
              { value: '6', label: 'Rank levels' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-semibold text-stone-900">{s.value}</div>
                <div className="text-stone-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold text-stone-900 mb-2 tracking-tight">Why PromptCraft Academy?</h2>
        <p className="text-stone-500 mb-10 text-sm">Learn by doing, not just reading</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white border border-stone-200 rounded-lg p-5 hover:border-teak-300 transition-colors">
              <div className="w-8 h-8 bg-teak-50 border border-teak-200 rounded-md flex items-center justify-center mb-4">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-teak-600">
                  <circle cx="7" cy="7" r="3" fill="currentColor"/>
                </svg>
              </div>
              <div className="font-semibold text-stone-900 text-sm mb-1.5">{f.title}</div>
              <div className="text-xs text-stone-500 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rank Levels */}
      <div className="bg-teak-50 border-y border-teak-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-stone-900 mb-2 tracking-tight">Your Rank Journey</h2>
          <p className="text-stone-500 text-sm mb-10">Progress from Novice to Grandmaster</p>
          <div className="flex flex-wrap gap-3">
            {LEVELS.map((level) => (
              <div
                key={level.name}
                className="flex items-center gap-3 bg-white border border-teak-200 rounded-lg px-4 py-3 hover:border-teak-400 transition-colors"
              >
                <span className="text-2xl">{level.emoji}</span>
                <div>
                  <div className="text-stone-900 text-sm font-medium">{level.name}</div>
                  <div className="text-stone-500 text-xs">{level.minXP}+ XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter Overview */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold text-stone-900 mb-2 tracking-tight">9 Chapters of Expert Knowledge</h2>
        <p className="text-stone-500 text-sm mb-10">From basic structure to complex, production-ready prompts</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.id}
              className="border border-stone-200 rounded-lg p-4 hover:border-teak-300 hover:bg-teak-50/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{ch.icon}</span>
                  <span className="text-xs text-stone-400 font-mono">Ch.{ch.number}</span>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teak-50 text-teak-700 border border-teak-200">
                  {ch.difficulty}
                </span>
              </div>
              <div className="font-medium text-stone-900 text-sm mb-1">{ch.title}</div>
              <div className="text-xs text-stone-500 mb-3">{ch.subtitle}</div>
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>{ch.exercises.length} exercises</span>
                <span className="text-teak-600 font-medium">
                  {ch.exercises.reduce((s, ex) => s + ex.xpReward, 0) + ch.xpBonus} XP
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          {progress ? (
            <Link
              href="/tutorial"
              className="inline-flex items-center justify-center px-8 py-3 bg-teak-600 hover:bg-teak-500 text-white rounded-md font-medium text-sm transition-colors"
            >
              Continue Learning &rarr;
            </Link>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-teak-600 hover:bg-teak-500 text-white rounded-md font-medium text-sm transition-colors"
            >
              Start Now &mdash; It&apos;s Free
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
