import React from 'react';
import { ArrowRight, CheckSquare, Sparkles, Square } from 'lucide-react';
import { SCREEN09_REFLECTION_ITEMS } from '../../data/screen09Data.ts';
import { playPortalOpen, playSoftSelect } from '../../utils/soundEffects.ts';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface DetectiveReflectionCheckProps {
  selectedIds: string[];
  onToggleItem: (id: string) => void;
  onFinishReflection: () => void;
}

export const DetectiveReflectionCheck: React.FC<DetectiveReflectionCheckProps> = ({
  selectedIds,
  onToggleItem,
  onFinishReflection,
}) => {
  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 p-5 sm:p-8 shadow-[0_24px_60px_-10px_rgba(21,128,61,0.34)] space-y-5 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 shrink-0">
              <PusheenIllustration expression="encouraging" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C3AED]">
                SCENE 03 · MY DIGITAL DETECTIVE CHECK
              </p>
              <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
                TODAY, I CAN...
              </h2>
            </div>
          </div>

          <span className="rounded-full bg-purple-100 border border-purple-300 px-4 py-1.5 text-xs font-extrabold text-[#6D28D9]">
            MY REFLECTION PROGRESS: {selectedIds.length} / {SCREEN09_REFLECTION_ITEMS.length} SELECTED
          </span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-[#475569]">
          Tick each digital detective skill you feel ready to use in real life (no marks lost — be
          honest with yourself!).
        </p>

        <div className="space-y-2.5">
          {SCREEN09_REFLECTION_ITEMS.map((item) => {
            const checked = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  playSoftSelect();
                  onToggleItem(item.id);
                }}
                className={`w-full rounded-2xl border-2 px-4 py-3.5 text-left flex items-center gap-3 cursor-pointer transition-all ${
                  checked
                    ? 'bg-emerald-50 border-emerald-400 text-[#14532D]'
                    : 'bg-white border-purple-100 hover:border-purple-300 text-[#0E3558]'
                }`}
              >
                {checked ? (
                  <CheckSquare className="h-5 w-5 text-[#16A34A] shrink-0" />
                ) : (
                  <Square className="h-5 w-5 text-slate-400 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-bold">{item.text}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => {
              playPortalOpen();
              onFinishReflection();
            }}
            className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] disabled:opacity-50 px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>PLANT MY PROMISE LEAF</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
