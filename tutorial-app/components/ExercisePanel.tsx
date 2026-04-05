'use client';

import { useState, useCallback } from 'react';
import { Exercise } from '@/lib/types';
import { calculateXPForExercise } from '@/lib/store';
import { TEST_INPUTS } from '@/lib/chapters';
import XPToast from './XPToast';
import { getActiveProvider, getActiveApiKey } from '@/lib/providerStore';

interface ExercisePanelProps {
  exercise: Exercise;
  chapterId: string;
  onComplete: (xpEarned: number, exerciseId: string) => void;
  isCompleted?: boolean;
  previousXP?: number;
}

function substituteVariables(prompt: string, exerciseId: string): string {
  const inputs = TEST_INPUTS[exerciseId];
  if (!inputs) return prompt;
  let result = prompt;
  for (const [key, value] of Object.entries(inputs)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

export default function ExercisePanel({
  exercise,
  chapterId,
  onComplete,
  isCompleted,
  previousXP,
}: ExercisePanelProps) {
  const [prompt, setPrompt] = useState(exercise.initialPrompt);
  const [systemPrompt, setSystemPrompt] = useState(exercise.initialSystemPrompt || '');
  const [prefill, setPrefill] = useState(exercise.initialPrefill || '');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [passed, setPassed] = useState(isCompleted || false);
  const [xpToast, setXpToast] = useState<{ xp: number; message: string } | null>(null);
  const [startTime] = useState(Date.now());

  const handleRun = useCallback(async () => {
    setLoading(true);
    setError('');
    setResponse('');

    const substituted = substituteVariables(prompt, exercise.id);
    const substitutedSystem = substituteVariables(systemPrompt, exercise.id);
    const substitutedPrefill = substituteVariables(prefill, exercise.id);

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: substituted,
          systemPrompt: substitutedSystem || undefined,
          prefill: substitutedPrefill || undefined,
          apiKey: getActiveApiKey() || undefined,
          provider: getActiveProvider(),
        }),
      });

      const data = await res.json();
      if (data.error === 'NO_API_KEY') {
        setError(data.message);
        setLoading(false);
        return;
      }
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      const text = data.text;
      setResponse(text);
      setAttempts((a) => a + 1);

      const newAttempts = attempts + 1;
      const gradingResult = exercise.gradingFn(text);

      if (gradingResult && !passed) {
        setPassed(true);
        const xpEarned = calculateXPForExercise(newAttempts, hintUsed, exercise.xpReward);

        onComplete(xpEarned, exercise.id);
        setXpToast({ xp: xpEarned, message: 'Exercise complete!' });
      }
    } catch {
      setError('Failed to connect. Check your API key configuration in Settings (⚙ icon).');
    }

    setLoading(false);
  }, [prompt, systemPrompt, prefill, exercise, attempts, hintUsed, passed, onComplete, startTime]);

  const handleShowHint = () => {
    setShowHint(true);
    setHintUsed(true);
  };

  const variables = TEST_INPUTS[exercise.id];

  return (
    <div className={`rounded-lg border transition-all duration-200 ${
      passed
        ? 'border-teak-400 bg-teak-50'
        : 'border-stone-200 bg-white'
    }`}>
      {xpToast && (
        <XPToast
          xp={xpToast.xp}
          message={xpToast.message}
          onDone={() => setXpToast(null)}
        />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                passed ? 'bg-teak-600 text-white' : 'bg-stone-100 text-stone-400'
              }`}>
                {passed ? '✓' : '·'}
              </span>
              <h3 className="font-semibold text-stone-900 text-base">{exercise.title}</h3>
            </div>
            <p className="text-stone-500 text-sm ml-7">{exercise.description}</p>
          </div>
          <div className="text-right ml-4 flex-shrink-0">
            <div className="text-teak-600 font-medium text-sm">{exercise.xpReward} XP</div>
            {previousXP && <div className="text-teak-500 text-xs">Earned: {previousXP}</div>}
          </div>
        </div>

        {/* Instructions */}
        <div className="border border-stone-200 bg-stone-50 rounded-md p-4 mb-4">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Task</div>
          <div className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">{exercise.instruction}</div>
        </div>

        {/* Test Variables */}
        {variables && (
          <div className="border border-stone-200 bg-stone-50 rounded-md p-3 mb-4">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Test Variables</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(variables).map(([key, val]) => (
                <div key={key} className="bg-white border border-stone-200 rounded px-2.5 py-1 text-xs">
                  <span className="text-teak-600 font-mono">{'{' + key + '}'}</span>
                  <span className="text-stone-400"> = </span>
                  <span className="text-stone-700 font-mono">&quot;{typeof val === 'string' && val.length > 40 ? val.slice(0, 40) + '…' : val}&quot;</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Editors */}
        <div className="space-y-3 mb-4">
          {exercise.hasSystemPrompt && (
            <div>
              <label className="block text-xs font-semibold text-stone-400 mb-1 uppercase tracking-wider">
                System Prompt
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder={exercise.systemPlaceholder || 'Enter system prompt...'}
                className="w-full h-20 px-3 py-2 bg-white border border-stone-300 rounded-md text-sm font-mono text-stone-800 resize-y focus:outline-none focus:ring-1 focus:ring-teak-400 focus:border-teak-400 placeholder-stone-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1 uppercase tracking-wider">
              User Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={exercise.placeholder || 'Enter your prompt...'}
              className="w-full h-28 px-3 py-2 bg-white border border-stone-300 rounded-md text-sm font-mono text-stone-800 resize-y focus:outline-none focus:ring-1 focus:ring-teak-400 focus:border-teak-400 placeholder-stone-400"
            />
          </div>

          {exercise.hasPrefill && (
            <div>
              <label className="block text-xs font-semibold text-stone-400 mb-1 uppercase tracking-wider">
                Prefill
              </label>
              <textarea
                value={prefill}
                onChange={(e) => setPrefill(e.target.value)}
                placeholder={exercise.prefillPlaceholder || 'Prefill text...'}
                className="w-full h-16 px-3 py-2 bg-white border border-stone-300 rounded-md text-sm font-mono text-stone-800 resize-y focus:outline-none focus:ring-1 focus:ring-teak-400 focus:border-teak-400 placeholder-stone-400"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleRun}
            disabled={loading || !prompt.trim()}
            className="flex-1 py-2.5 bg-teak-700 hover:bg-teak-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md font-medium text-sm transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Running...
              </span>
            ) : (
              'Run Prompt'
            )}
          </button>

          {!showHint && !passed && (
            <button
              onClick={handleShowHint}
              className="px-4 py-2.5 border border-stone-300 text-stone-500 hover:text-stone-700 hover:border-stone-400 rounded-md font-medium text-sm transition-colors"
            >
              Hint &minus;30% XP
            </button>
          )}
        </div>

        {/* Hint */}
        {showHint && (
          <div className="border border-teak-200 bg-teak-50 rounded-md p-4 mb-4">
            <div className="text-xs font-semibold text-teak-600 uppercase tracking-wider mb-1.5">Hint</div>
            <div className="text-sm text-stone-700">{exercise.hint}</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 rounded-md p-3 mb-4">
            <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Error</div>
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Response */}
        {response && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                AI Response
              </label>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${
                exercise.gradingFn(response)
                  ? 'border-teak-300 bg-teak-50 text-teak-700'
                  : 'border-red-200 bg-red-50 text-red-600'
              }`}>
                {exercise.gradingFn(response) ? '✓ Passed' : '✗ Not quite'}
              </div>
            </div>
            <div className="bg-stone-50 border border-stone-200 text-stone-800 rounded-md p-4 text-sm font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
              {response}
            </div>
            {!exercise.gradingFn(response) && (
              <div className="mt-2 text-xs text-stone-500">
                <span className="font-semibold text-stone-600">Criteria:</span> {exercise.gradingDescription}
              </div>
            )}
          </div>
        )}

        {attempts > 0 && (
          <div className="mt-3 text-xs text-stone-400 text-right">
            {attempts} attempt{attempts !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
