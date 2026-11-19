import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  SCREEN09_ADVICE_CHECKLIST,
  SCREEN09_WORD_BANK,
  validateScreen09FinalAdvice,
} from '../../data/screen09Data.ts';
import type { Screen09Progress } from '../../types/game.ts';
import {
  playErrorTone,
  playPortalOpen,
  playSoftSelect,
  playVictorySound,
} from '../../utils/soundEffects.ts';
import { DanielIllustration } from '../game/DanielIllustration.tsx';

interface FinalAdviceTaskProps {
  nickname: string;
  initialProgress: Screen09Progress;
  onSaveFinalAdvice: (payload: {
    task1Should: string;
    task2Shouldnt: string;
    task3Optional: string;
    checklist: Screen09Progress['adviceChecklist'];
  }) => void;
  onProceedToTrafficLight: () => void;
}

export const FinalAdviceTask: React.FC<FinalAdviceTaskProps> = ({
  nickname,
  initialProgress,
  onSaveFinalAdvice,
  onProceedToTrafficLight,
}) => {
  const [task1Should, setTask1Should] = useState(
    initialProgress.adviceFinal.task1Should || 'Daniel, you should '
  );
  const [task2Shouldnt, setTask2Shouldnt] = useState(
    initialProgress.adviceFinal.task2Shouldnt || "You shouldn't "
  );
  const [task3Optional, setTask3Optional] = useState(
    initialProgress.adviceFinal.task3Optional || ''
  );
  const [focusedField, setFocusedField] = useState<'t1' | 't2' | 't3'>('t1');
  const [showWordBank, setShowWordBank] = useState(true);
  const [checklist, setChecklist] = useState(initialProgress.adviceChecklist);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(
    initialProgress.adviceCompleted
      ? {
          ok: true,
          message: 'Your final advice for Daniel is saved! You can revise it or continue.',
        }
      : null
  );

  const insertWord = (word: string) => {
    playSoftSelect();
    const piece = word.toLowerCase();
    if (focusedField === 't1') {
      setTask1Should((prev) => `${prev.trimEnd()} ${piece} `);
    } else if (focusedField === 't2') {
      setTask2Shouldnt((prev) => `${prev.trimEnd()} ${piece} `);
    } else {
      setTask3Optional((prev) =>
        prev.trim() ? `${prev.trimEnd()} ${piece} ` : `I think you should ${piece} `
      );
    }
  };

  const toggleCheck = (
    key: keyof Screen09Progress['adviceChecklist']
  ) => {
    playSoftSelect();
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateScreen09FinalAdvice({
      task1Should,
      task2Shouldnt,
      task3Optional,
    });

    if (!result.acceptable) {
      playErrorTone();
      setFeedback({ ok: false, message: result.feedback });
      return;
    }

    playVictorySound();
    setFeedback({ ok: true, message: result.feedback });
    onSaveFinalAdvice({
      task1Should: task1Should.trim(),
      task2Shouldnt: task2Shouldnt.trim(),
      task3Optional: task3Optional.trim(),
      checklist,
    });
  };

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(21,128,61,0.34)] space-y-5 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-18 shrink-0">
              <DanielIllustration expression={feedback?.ok ? 'celebrating' : 'curious'} />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#16A34A]">
                SCENE 01 · MY FINAL ADVICE FOR DANIEL
              </p>
              <h2 className="font-[var(--font-display)] text-lg sm:text-2xl font-bold text-[#0E3558]">
                Daniel asks Detective {nickname}: &ldquo;What should I do next time?&rdquo;
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSoftSelect();
              setShowWordBank((p) => !p);
            }}
            className="rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-1.5 text-xs font-extrabold text-[#6D28D9] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Word Bank ({SCREEN09_WORD_BANK.length})</span>
            {showWordBank ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {showWordBank && (
          <div className="rounded-2xl bg-purple-50/75 border border-purple-200 p-3.5 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C3AED]">
              TAP A HELPFUL WORD TO INSERT IT INTO YOUR ACTIVE BOX:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SCREEN09_WORD_BANK.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => insertWord(w)}
                  className="rounded-lg bg-white hover:bg-purple-100 border border-purple-200 px-2.5 py-1 text-[11px] font-extrabold text-[#5B21B6] cursor-pointer"
                >
                  + {w}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
                TASK 1 (REQUIRED) · &ldquo;Daniel, you should ____&rdquo;
              </label>
              <textarea
                rows={3}
                value={task1Should}
                onFocus={() => setFocusedField('t1')}
                onChange={(e) => setTask1Should(e.target.value)}
                placeholder="Complete the advice using what Daniel should do to stay safe..."
                className="w-full rounded-2xl border-2 border-sky-200 bg-sky-50/40 px-4 py-3 text-sm font-semibold text-[#0E3558] focus:outline-none focus-visible:border-[#0284C7]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#BE123C]">
                TASK 2 (REQUIRED) · &ldquo;You shouldn&apos;t ____&rdquo;
              </label>
              <textarea
                rows={3}
                value={task2Shouldnt}
                onFocus={() => setFocusedField('t2')}
                onChange={(e) => setTask2Shouldnt(e.target.value)}
                placeholder="Warn Daniel about what he shouldn't click or share..."
                className="w-full rounded-2xl border-2 border-rose-200 bg-rose-50/40 px-4 py-3 text-sm font-semibold text-[#0E3558] focus:outline-none focus-visible:border-[#E11D48]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0D9488]">
              TASK 3 (OPTIONAL EXTRA ADVICE) · &ldquo;I think you should ____&rdquo;
            </label>
            <textarea
              rows={2}
              value={task3Optional}
              onFocus={() => setFocusedField('t3')}
              onChange={(e) => setTask3Optional(e.target.value)}
              placeholder="Optional: Add one more kind tip for Daniel (e.g., I think you should...)"
              className="w-full rounded-2xl border-2 border-teal-200 bg-teal-50/35 px-4 py-2.5 text-sm font-semibold text-[#0E3558] focus:outline-none focus-visible:border-[#0D9488]"
            />
          </div>

          {/* Interactive 4-Item Self-Check */}
          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200 p-4 space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
              CHECK YOUR OWN ADVICE (TAP EACH BOX):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SCREEN09_ADVICE_CHECKLIST.map((item) => {
                const checked = checklist[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleCheck(item.key)}
                    className={`rounded-xl border-2 px-3.5 py-2 text-left text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                      checked
                        ? 'bg-emerald-100 border-emerald-400 text-[#14532D]'
                        : 'bg-white border-emerald-200 text-[#334155]'
                    }`}
                  >
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${
                        checked ? 'text-[#16A34A]' : 'text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-2xl border-2 px-4 py-3 text-xs sm:text-sm font-bold ${
                feedback.ok
                  ? 'bg-emerald-50 border-emerald-400 text-[#14532D]'
                  : 'bg-amber-50 border-amber-300 text-[#92400E]'
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="submit"
              className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] px-6 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>CHECK &amp; SAVE MY ADVICE</span>
            </button>

            {feedback?.ok && (
              <button
                type="button"
                onClick={() => {
                  playPortalOpen();
                  onProceedToTrafficLight();
                }}
                className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>NEXT: STOP, CHECK, DECIDE</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
