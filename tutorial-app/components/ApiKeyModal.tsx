'use client';

import { useState, useEffect } from 'react';
import {
  getStoredAnthropicKey,
  getStoredGroqKey,
  saveAnthropicKey,
  saveGroqKey,
  getActiveProvider,
  hasConfiguredProvider,
} from '@/lib/providerStore';

// Backward-compat export used in Navbar
export { hasConfiguredProvider as getStoredApiKey };

interface ApiKeyModalProps {
  onClose: () => void;
}

type Tab = 'groq' | 'anthropic';

export default function ApiKeyModal({ onClose }: ApiKeyModalProps) {
  const [tab, setTab] = useState<Tab>('groq');
  const [groqKey, setGroqKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGroqKey(getStoredGroqKey());
    setAnthropicKey(getStoredAnthropicKey());
    setTab(getStoredAnthropicKey() ? 'anthropic' : 'groq');
  }, []);

  const currentKey = tab === 'groq' ? groqKey : anthropicKey;
  const setCurrentKey = tab === 'groq' ? setGroqKey : setAnthropicKey;
  const storedKey = tab === 'groq' ? getStoredGroqKey() : getStoredAnthropicKey();
  const activeProvider = getActiveProvider();

  const handleSave = () => {
    if (tab === 'groq') saveGroqKey(groqKey.trim());
    else saveAnthropicKey(anthropicKey.trim());
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  const handleClear = () => {
    if (tab === 'groq') { saveGroqKey(''); setGroqKey(''); }
    else { saveAnthropicKey(''); setAnthropicKey(''); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white border border-stone-200 rounded-lg shadow-xl p-7 w-full max-w-md mx-4">

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-stone-900 mb-1">AI Provider Settings</h2>
          <p className="text-stone-500 text-sm">
            Choose a provider to run exercises. Both support all prompt engineering concepts.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-md border border-stone-200 overflow-hidden mb-5 text-sm font-medium">
          <button
            onClick={() => setTab('groq')}
            className={`flex-1 py-2 flex items-center justify-center gap-2 transition-colors ${
              tab === 'groq'
                ? 'bg-stone-100 text-stone-900'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span className="text-green-600 text-xs font-bold uppercase tracking-wide">Free</span>
            Groq
            {getStoredGroqKey() && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-0.5" />
            )}
            {activeProvider === 'groq' && !getStoredAnthropicKey() && (
              <span className="text-[10px] bg-teak-100 text-teak-700 px-1.5 py-0.5 rounded">active</span>
            )}
          </button>
          <button
            onClick={() => setTab('anthropic')}
            className={`flex-1 py-2 flex items-center justify-center gap-2 transition-colors ${
              tab === 'anthropic'
                ? 'bg-stone-100 text-stone-900'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wide">Premium</span>
            Anthropic
            {getStoredAnthropicKey() && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5" />
            )}
            {activeProvider === 'anthropic' && (
              <span className="text-[10px] bg-teak-100 text-teak-700 px-1.5 py-0.5 rounded">active</span>
            )}
          </button>
        </div>

        {/* Info box */}
        <div className="border border-stone-200 bg-stone-50 rounded-md p-4 mb-5 text-sm text-stone-600">
          {tab === 'groq' ? (
            <>
              <strong className="text-stone-800">Free tier with generous rate limits.</strong>
              <br />
              Sign up at{' '}
              <span className="font-mono bg-stone-100 text-teak-700 px-1.5 py-0.5 rounded text-xs">groq.com</span>
              {' '}→ API Keys → Create. Key starts with{' '}
              <span className="font-mono bg-stone-100 text-teak-700 px-1.5 py-0.5 rounded text-xs">gsk_</span>
              <br /><br />
              Runs on <strong className="text-stone-800">Llama 3.3 70B</strong>. All prompt engineering
              concepts (zero-shot, few-shot, chain-of-thought, etc.) work the same way.
            </>
          ) : (
            <>
              <strong className="text-stone-800">Uses real Claude models.</strong>
              <br />
              Visit{' '}
              <span className="font-mono bg-stone-100 text-teak-700 px-1.5 py-0.5 rounded text-xs">console.anthropic.com</span>
              {' '}→ API Keys → Create. Key starts with{' '}
              <span className="font-mono bg-stone-100 text-teak-700 px-1.5 py-0.5 rounded text-xs">sk-ant-</span>
              <br /><br />
              Unlocks <strong className="text-stone-800">prefill</strong> (Anthropic-exclusive feature).
              When both keys are set, Anthropic is used automatically.
            </>
          )}
          <br />
          <strong className="text-stone-800">Privacy:</strong> Keys are stored only in your browser&apos;s localStorage.
        </div>

        {/* Key input */}
        <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
          {tab === 'groq' ? 'Groq' : 'Anthropic'} API Key
        </label>
        <input
          type="password"
          value={currentKey}
          onChange={(e) => setCurrentKey(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder={tab === 'groq' ? 'gsk_...' : 'sk-ant-api03-...'}
          className="w-full px-4 py-2.5 border border-stone-300 bg-white focus:border-teak-400 focus:ring-1 focus:ring-teak-400 rounded-md font-mono text-sm text-stone-900 placeholder-stone-400 outline-none transition-colors mb-4"
          autoFocus
        />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!currentKey.trim()}
            className="flex-1 py-2.5 bg-teak-700 hover:bg-teak-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md font-medium text-sm transition-colors"
          >
            {saved ? 'Saved!' : 'Save Key'}
          </button>
          {storedKey && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 border border-stone-300 text-stone-500 hover:text-red-600 hover:border-red-300 rounded-md font-medium text-sm transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-700 rounded-md font-medium text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
