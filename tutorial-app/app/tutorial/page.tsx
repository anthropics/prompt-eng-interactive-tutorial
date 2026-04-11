'use client';

import Link from 'next/link';
import { useProgress } from '@/components/ProgressProvider';
import { useTutorialMode } from '@/components/ModeProvider';
import { CHAPTERS } from '@/lib/chapters';
import { GENERIC_CHAPTERS } from '@/lib/genericChapters';
import { getLevelFromXP } from '@/lib/types';
import XPBar from '@/components/XPBar';

export default function TutorialPage() {
  const { progress } = useProgress();
  const { mode } = useTutorialMode();

  const chapters = mode === 'generic' ? GENERIC_CHAPTERS : CHAPTERS;

  const getChapterProgress = (chapterId: string) => {
    if (!progress) return { completed: 0, total: 0, xpEarned: 0 };
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return { completed: 0, total: 0, xpEarned: 0 };

    const completed = chapter.exercises.filter(
      (ex) => progress.completedExercises[ex.id]?.passed
    ).length;
    const xpEarned = chapter.exercises.reduce(
      (sum, ex) => sum + (progress.completedExercises[ex.id]?.xpEarned || 0),
      0
    );
    return { completed, total: chapter.exercises.length, xpEarned };
  };

  const isChapterUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevChapter = chapters[index - 1];
    const prevProgress = getChapterProgress(prevChapter.id);
    return prevProgress.completed === prevProgress.total && prevProgress.total > 0;
  };

  const totalXP = progress?.totalXP || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-stone-200 pt-10 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-semibold text-stone-900 tracking-tight">
              Course Chapters
            </h1>
            {mode === 'generic' && (
              <span className="text-xs px-2 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-700 font-medium">
                Generic Mode
              </span>
            )}
          </div>
          <p className="text-stone-500 text-sm mb-1">
            Complete exercises to earn XP and unlock the next chapter
          </p>
          {mode === 'generic' && (
            <p className="text-stone-400 text-xs mb-5">
              Based on the dair-ai Prompt Engineering Guide — model-agnostic techniques
            </p>
          )}
          {mode !== 'generic' && <div className="mb-5" />}
          {progress ? (
            <div className="max-w-sm">
              <XPBar xp={totalXP} />
            </div>
          ) : (
            <div className="border border-amber-200 bg-amber-50 rounded-md px-4 py-3 text-amber-700 text-sm">
              <Link href="/" className="underline underline-offset-2">Create a profile</Link> to track your progress and earn XP.
            </div>
          )}
        </div>
      </div>

      {/* Chapters */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="space-y-3">
          {chapters.map((chapter, index) => {
            const chProgress = getChapterProgress(chapter.id);
            const unlocked = isChapterUnlocked(index);
            const completed = chProgress.completed === chProgress.total && chProgress.total > 0;
            const inProgress = chProgress.completed > 0 && !completed;
            const isChapterBonusEarned = progress?.completedChapters.includes(chapter.id);

            return (
              <div
                key={chapter.id}
                className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                  completed
                    ? 'border-teak-400 bg-teak-50'
                    : inProgress
                    ? 'border-teak-300 bg-teak-50/50'
                    : unlocked
                    ? 'border-stone-200 bg-white hover:border-teak-300'
                    : 'border-stone-200 bg-stone-50 opacity-50'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Chapter icon */}
                    <div className="w-12 h-12 rounded-md border border-stone-200 flex items-center justify-center text-2xl flex-shrink-0 bg-stone-50">
                      {completed ? '✓' : unlocked ? chapter.icon : '—'}
                    </div>

                    {/* Chapter info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-stone-400 text-xs font-mono">Ch.{chapter.number}</span>
                        <h3 className="text-stone-900 font-medium text-sm">{chapter.title}</h3>
                        <span className="text-xs px-1.5 py-0.5 rounded border border-stone-200 text-stone-500">
                          {chapter.difficulty}
                        </span>
                        {completed && (
                          <span className="text-xs px-1.5 py-0.5 rounded border border-teak-300 text-teak-700">
                            Done
                          </span>
                        )}
                      </div>
                      <p className="text-stone-500 text-xs mb-3">{chapter.subtitle}</p>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-stone-200 rounded-full overflow-hidden max-w-40">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${chProgress.total ? (chProgress.completed / chProgress.total) * 100 : 0}%`,
                              backgroundColor: '#a87850',
                            }}
                          />
                        </div>
                        <span className="text-stone-400 text-xs">
                          {chProgress.completed}/{chProgress.total}
                        </span>
                        {chProgress.xpEarned > 0 && (
                          <span className="text-teak-600 text-xs font-medium">
                            {chProgress.xpEarned + (isChapterBonusEarned ? chapter.xpBonus : 0)} XP
                          </span>
                        )}
                      </div>
                    </div>

                    {/* XP and action */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-teak-600 text-xs font-medium mb-2">
                        {chapter.exercises.reduce((s, ex) => s + ex.xpReward, 0) + chapter.xpBonus} XP
                      </div>
                      {unlocked ? (
                        <Link
                          href={`/tutorial/${chapter.id}`}
                          className="inline-block px-4 py-1.5 rounded-md font-medium text-xs transition-colors bg-teak-600 hover:bg-teak-500 text-white"
                        >
                          {completed ? 'Review' : inProgress ? 'Continue' : 'Start'} &rarr;
                        </Link>
                      ) : (
                        <div className="text-stone-400 text-xs">Locked</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate CTA */}
        {progress && progress.completedChapters.length === chapters.length && (
          <div className="mt-8 border border-teak-300 bg-teak-50 rounded-lg p-6 text-center">
            <h3 className="text-stone-900 font-semibold text-lg mb-2">All Chapters Complete</h3>
            <p className="text-stone-600 text-sm mb-4">You&apos;ve mastered prompt engineering. Claim your certificate.</p>
            <Link
              href="/certificate"
              className="inline-block px-6 py-2.5 bg-teak-600 hover:bg-teak-500 text-white rounded-md font-medium text-sm transition-colors"
            >
              Get Certificate &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
