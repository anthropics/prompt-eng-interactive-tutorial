'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useProgress } from '@/components/ProgressProvider';
import { CHAPTERS } from '@/lib/chapters';
import { getLevelFromXP } from '@/lib/types';

function getGrade(xp: number, totalXP: number): { letter: string; label: string; color: string } {
  const pct = totalXP > 0 ? (xp / totalXP) * 100 : 0;
  if (pct >= 90) return { letter: 'A+', label: 'Outstanding', color: '#6e4c28' };
  if (pct >= 80) return { letter: 'A', label: 'Excellent', color: '#8c6238' };
  if (pct >= 70) return { letter: 'B', label: 'Proficient', color: '#a87850' };
  if (pct >= 60) return { letter: 'C', label: 'Competent', color: '#c4956a' };
  return { letter: 'D', label: 'Beginner', color: '#d4b088' };
}

export default function CertificatePage() {
  const { progress } = useProgress();
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const totalPossibleXP = CHAPTERS.reduce(
    (sum, ch) => sum + ch.exercises.reduce((s, ex) => s + ex.xpReward, 0) + ch.xpBonus,
    0
  );

  const completedExercises = progress
    ? Object.values(progress.completedExercises).filter((e) => e.passed).length
    : 0;
  const totalExercises = CHAPTERS.reduce((sum, ch) => sum + ch.exercises.length, 0);

  const xp = progress?.totalXP || 0;
  const level = getLevelFromXP(xp);
  const grade = getGrade(xp, totalPossibleXP);
  const percentage = totalPossibleXP > 0 ? Math.round((xp / totalPossibleXP) * 100) : 0;

  const completionDate = progress?.completedAt
    ? new Date(progress.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `promptcraft-certificate-${progress?.username || 'user'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
    setDownloading(false);
  };

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">No progress found</h2>
          <p className="text-stone-500 mb-4">Complete the tutorial to earn your certificate!</p>
          <Link
            href="/tutorial"
            className="inline-block px-6 py-3 bg-teak-700 hover:bg-teak-600 text-white rounded-md font-bold transition-colors"
          >
            Start Learning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/tutorial" className="text-stone-500 hover:text-stone-900 transition-colors text-sm">
            ← Back to chapters
          </Link>
          <div className="flex gap-3">
            <Link
              href="/leaderboard"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-sm font-medium transition-colors"
            >
              🏆 Leaderboard
            </Link>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-6 py-2 bg-teak-700 hover:bg-teak-600 text-white rounded-md font-bold text-sm transition-colors disabled:opacity-50"
            >
              {downloading ? '⏳ Generating...' : '⬇ Download PNG'}
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div ref={certRef}>
          <div className="relative bg-teak-900 rounded-3xl overflow-hidden border-2 border-teak-700 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-teak-700/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teak-600/20 rounded-full blur-3xl" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teak-400/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teak-400/60 to-transparent" />
            </div>

            <div className="relative p-12 text-center">
              {/* Header */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-3xl">🧠</span>
                <span className="text-white font-black text-2xl">PromptCraft</span>
                <span className="text-teak-300 font-bold text-2xl">Academy</span>
              </div>

              <div className="text-teak-300 text-sm font-bold tracking-widest uppercase mb-8">
                Certificate of Completion
              </div>

              <div className="text-white/50 text-lg mb-3">This certifies that</div>

              <div className="text-5xl font-black text-white mb-3">
                {progress.username}
              </div>

              <div className="text-white/50 text-lg mb-8">
                has successfully completed the
              </div>

              <div className="text-3xl font-black text-white mb-2">
                Prompt Engineering Tutorial
              </div>
              <div className="text-teak-300 text-lg mb-10">
                Interactive Course — 9 Chapters
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black mb-1" style={{ color: grade.color }}>
                    {grade.letter}
                  </div>
                  <div className="text-white/50 text-xs">Grade</div>
                  <div className="text-white/70 text-xs font-medium">{grade.label}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black text-teak-300 mb-1">
                    {xp.toLocaleString()}
                  </div>
                  <div className="text-white/50 text-xs">XP Earned</div>
                  <div className="text-white/70 text-xs font-medium">{percentage}% of max</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black text-teak-200 mb-1">
                    {level.emoji}
                  </div>
                  <div className="text-white/50 text-xs">Final Rank</div>
                  <div className="text-white/70 text-xs font-medium">{level.name}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black text-teak-400 mb-1">
                    {completedExercises}/{totalExercises}
                  </div>
                  <div className="text-white/50 text-xs">Exercises</div>
                  <div className="text-white/70 text-xs font-medium">Completed</div>
                </div>
              </div>

              {/* Chapter badges */}
              <div className="mb-10">
                <div className="text-white/40 text-xs uppercase tracking-widest mb-4">
                  Chapters Mastered
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {CHAPTERS.map((ch) => {
                    const done = progress.completedChapters.includes(ch.id);
                    return (
                      <div
                        key={ch.id}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          done
                            ? 'border-teak-400/60 bg-teak-600/20 text-teak-200'
                            : 'border-white/10 bg-white/5 text-white/30'
                        }`}
                      >
                        {done ? '✓' : '○'} Ch.{ch.number}: {ch.title}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date and seal */}
              <div className="flex items-center justify-between max-w-lg mx-auto">
                <div className="text-left">
                  <div className="text-white/40 text-xs mb-1">Issued on</div>
                  <div className="text-white font-semibold">{completionDate}</div>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-teak-400/40 bg-teak-500/20 flex flex-col items-center justify-center">
                  <span className="text-2xl">🎓</span>
                  <span className="text-teak-300 text-xs font-black">CERT</span>
                </div>
                <div className="text-right">
                  <div className="text-white/40 text-xs mb-1">Powered by</div>
                  <div className="text-white font-semibold">Claude AI</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share / actions */}
        <div className="mt-8 text-center text-stone-500 text-sm">
          <p>Screenshot or download your certificate to share your achievement!</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              href="/leaderboard"
              className="px-6 py-3 bg-teak-50 hover:bg-teak-100 text-teak-700 border border-teak-200 rounded-md font-medium transition-colors"
            >
              View Leaderboard 🏆
            </Link>
            <Link
              href="/tutorial"
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-medium transition-colors"
            >
              Review Chapters 📚
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
