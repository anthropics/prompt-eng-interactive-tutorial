'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useProgress } from '@/components/ProgressProvider';
import { getLevelFromXP } from '@/lib/types';
import XPBar from '@/components/XPBar';

interface LeaderboardEntry {
  username: string;
  totalXP: number;
  level: string;
  completedChapters: number;
  completedAt?: number;
  submittedAt: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { progress } = useProgress();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setEntries(data);
    } catch {
      setEntries([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleSubmitScore = async () => {
    if (!progress) return;
    setSubmitting(true);
    try {
      const level = getLevelFromXP(progress.totalXP);
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: progress.username,
          totalXP: progress.totalXP,
          level: level.name,
          completedChapters: progress.completedChapters.length,
          completedAt: progress.completedAt,
        }),
      });
      const data = await res.json();
      if (data.rank) setMyRank(data.rank);
      setSubmitted(true);
      await loadLeaderboard();
    } catch {
      // silently fail
    }
    setSubmitting(false);
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-amber-50 border-amber-300';
    if (rank === 2) return 'bg-stone-100 border-stone-300';
    if (rank === 3) return 'bg-orange-50 border-orange-300';
    return 'bg-white border-stone-200';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teak-50 border-b border-teak-100 pt-12 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-black text-stone-900 mb-2">Leaderboard</h1>
          <p className="text-stone-500">Top prompt engineers ranked by XP</p>

          {progress && (
            <div className="mt-6 inline-flex flex-col items-center gap-3">
              <div className="bg-white border border-teak-200 rounded-xl px-6 py-4">
                <XPBar xp={progress.totalXP} compact />
              </div>
              {!submitted ? (
                <button
                  onClick={handleSubmitScore}
                  disabled={submitting || progress.totalXP === 0}
                  className="px-6 py-3 bg-teak-700 hover:bg-teak-600 disabled:opacity-50 text-white rounded-md font-bold transition-colors"
                >
                  {submitting ? 'Submitting...' : '📊 Submit My Score'}
                </button>
              ) : (
                <div className="text-teak-700 font-bold">
                  ✓ Score submitted! {myRank ? `Your rank: #${myRank}` : ''}
                </div>
              )}
            </div>
          )}

          {!progress && (
            <div className="mt-4">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-teak-700 hover:bg-teak-600 text-white rounded-md font-bold transition-colors"
              >
                Start Learning to Earn XP
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16 text-stone-400">
            <div className="animate-spin text-4xl mb-4">⚙️</div>
            Loading leaderboard...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <div className="text-4xl mb-4">🌱</div>
            <div className="text-xl font-bold text-stone-600">No scores yet!</div>
            <p className="mt-2">Be the first to submit your score.</p>
            <Link
              href="/tutorial"
              className="inline-block mt-4 px-6 py-3 bg-teak-700 hover:bg-teak-600 text-white rounded-md font-bold transition-colors"
            >
              Start Learning
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const isMe = progress?.username.toLowerCase() === entry.username.toLowerCase();
              const levelData = getLevelFromXP(entry.totalXP);

              return (
                <div
                  key={entry.username}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                    getRankStyle(entry.rank)
                  } ${isMe ? 'ring-2 ring-teak-500 ring-offset-2 ring-offset-white' : ''}`}
                >
                  {/* Rank */}
                  <div className="w-12 text-center text-2xl font-black text-stone-900">
                    {getRankDisplay(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${levelData.color}cc, ${levelData.color}66)` }}
                  >
                    {entry.username.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900 font-bold truncate">
                        {entry.username}
                        {isMe && <span className="text-teak-600 text-xs ml-1">(you)</span>}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                        {levelData.emoji} {levelData.name}
                      </span>
                    </div>
                    <div className="text-stone-400 text-xs mt-0.5">
                      {entry.completedChapters} chapters complete
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <div className="text-teak-700 font-black text-lg">
                      {entry.totalXP.toLocaleString()}
                    </div>
                    <div className="text-stone-400 text-xs">XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={loadLeaderboard}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg text-sm transition-colors"
          >
            ↺ Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
