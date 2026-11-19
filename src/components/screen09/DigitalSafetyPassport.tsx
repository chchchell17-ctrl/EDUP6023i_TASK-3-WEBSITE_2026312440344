import React from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Map,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SCREEN09_REFLECTION_ITEMS } from '../../data/screen09Data.ts';
import type { AvatarConfig, Screen09Progress } from '../../types/game.ts';
import { playPortalOpen, playSoftSelect } from '../../utils/soundEffects.ts';
import { ByteIllustration } from '../game/ByteIllustration.tsx';
import { DetectiveAvatarPortrait } from '../game/DetectiveAvatar.tsx';

interface DigitalSafetyPassportProps {
  avatarConfig: AvatarConfig;
  nickname: string;
  progress: Screen09Progress;
  onViewFinalAchievement?: () => void;
  onReturnToTown?: () => void;
  onCloseModal?: () => void;
  onPlayAgainLevel?: () => void;
}

export const DigitalSafetyPassport: React.FC<DigitalSafetyPassportProps> = ({
  avatarConfig,
  nickname,
  progress,
  onViewFinalAchievement,
  onReturnToTown,
  onCloseModal,
  onPlayAgainLevel,
}) => {
  const stampedDate = progress.completedAt
    ? new Date(progress.completedAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div className="rounded-[34px] border-4 border-amber-200 bg-gradient-to-br from-[#FFFBEB] via-white to-[#ECFDF5] p-5 sm:p-8 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.38)] space-y-5 text-left">
        {/* Passport Cover Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-amber-200 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 border-2 border-sky-300 p-1 shrink-0">
              <DetectiveAvatarPortrait config={avatarConfig} className="w-full h-full" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#B45309]">
                OFFICIAL DETECTIVE PASSPORT · STAMPED &amp; VERIFIED
              </p>
              <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-extrabold text-[#0E3558]">
                DIGITAL SAFETY PASSPORT · {nickname.toUpperCase()}
              </h2>
              <p className="text-xs font-bold text-[#475569]">Date Completed: {stampedDate}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-100 border-2 border-emerald-400 px-4 py-2 text-center rotate-[-2deg] shadow-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#15803D]">
              GARDEN SEAL
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-[#14532D] inline-flex items-center gap-1">
              <Award className="h-4 w-4 text-[#16A34A]" />
              <span>DIGITAL GUARDIAN</span>
            </p>
          </div>
        </div>

        {/* 4 Passport Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border-2 border-sky-200 p-4 space-y-1.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0284C7]">
              SECTION 1 · MY ADVICE FOR DANIEL
            </p>
            <p className="text-xs font-semibold text-[#0E3558]">
              <strong>Should:</strong> {progress.adviceFinal.task1Should || '—'}
            </p>
            <p className="text-xs font-semibold text-[#0E3558]">
              <strong>Shouldn&apos;t:</strong> {progress.adviceFinal.task2Shouldnt || '—'}
            </p>
            {progress.adviceFinal.task3Optional && (
              <p className="text-xs font-semibold text-[#0E3558]">
                <strong>Extra Tip:</strong> {progress.adviceFinal.task3Optional}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white border-2 border-amber-200 p-4 space-y-1.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#D97706]">
              SECTION 2 · STOP, CHECK, DECIDE
            </p>
            <p className="text-xs font-semibold text-[#334155]">
              All 3 Safety Lights Mastered:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded-full bg-rose-100 text-[#BE123C] px-2.5 py-0.5 text-[11px] font-extrabold">
                RED · STOP ✓
              </span>
              <span className="rounded-full bg-amber-100 text-[#B45309] px-2.5 py-0.5 text-[11px] font-extrabold">
                YELLOW · CHECK ✓
              </span>
              <span className="rounded-full bg-emerald-100 text-[#15803D] px-2.5 py-0.5 text-[11px] font-extrabold">
                GREEN · DECIDE ✓
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white border-2 border-purple-200 p-4 space-y-1.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C3AED]">
              SECTION 3 · TODAY, I CAN...
            </p>
            <ul className="space-y-1 text-xs font-semibold text-[#0E3558]">
              {SCREEN09_REFLECTION_ITEMS.filter((item) =>
                progress.reflectionSelected.includes(item.id)
              ).map((item) => (
                <li key={item.id} className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white border-2 border-emerald-200 p-4 space-y-1.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#16A34A]">
              SECTION 4 · DIGITAL SAFETY PROMISE
            </p>
            <p className="text-xs font-semibold text-[#0E3558]">
              <strong>Next Time Online:</strong> {progress.promiseFinal.nextTimeOnline || '—'}
            </p>
            <p className="text-xs font-semibold text-[#0E3558]">
              <strong>Red Flag Remembered:</strong> {progress.promiseFinal.redFlagRemember || '—'}
            </p>
          </div>
        </div>

        {/* Byte Notification + CTA */}
        <div className="rounded-2xl bg-cyan-50 border-2 border-cyan-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0">
              <ByteIllustration expression="celebrating" pose="waving" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
                BYTE NOTIFICATION · ALL 7 LOCATIONS COMPLETE!
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#0E3558]">
                &ldquo;Beep-boop! Your DIGITAL GUARDIAN badge is saved! Ready for your Final
                Achievement Ceremony?&rdquo;
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onReturnToTown && (
              <button
                type="button"
                onClick={() => {
                  playSoftSelect();
                  onReturnToTown();
                }}
                className="min-h-[44px] rounded-full bg-white hover:bg-sky-50 border-2 border-sky-200 px-5 py-2 text-xs font-extrabold text-[#0369A1] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Map className="h-4 w-4" />
                <span>TOWN MAP</span>
              </button>
            )}

            {onPlayAgainLevel && (
              <button
                type="button"
                onClick={onPlayAgainLevel}
                className="min-h-[44px] rounded-full bg-white hover:bg-emerald-50 border-2 border-emerald-200 px-5 py-2 text-xs font-extrabold text-[#15803D] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>PLAY AGAIN</span>
              </button>
            )}

            {onViewFinalAchievement && (
              <button
                type="button"
                onClick={() => {
                  playPortalOpen();
                  onViewFinalAchievement();
                }}
                className="aero-glossy-btn min-h-[46px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] border border-white px-6 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>VIEW MY FINAL ACHIEVEMENT</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {onCloseModal && (
              <button
                type="button"
                onClick={onCloseModal}
                className="min-h-[42px] rounded-full bg-[#0284C7] px-5 py-2 text-xs font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>CLOSE PASSPORT</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
