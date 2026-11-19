import React, { useState } from 'react';
import { ArrowRight, Flower2, Sparkles } from 'lucide-react';
import { SCREEN09_WELCOME_SCRIPT } from '../../data/screen09Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import { playPortalOpen } from '../../utils/soundEffects.ts';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';
import { TeacherChelseaIllustration } from '../game/TeacherChelseaIllustration.tsx';

interface GardenEnvironmentProps {
  mode: 'exterior' | 'welcome-dialogue';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  onEnterGarden?: () => void;
  onStartFinalActivity?: () => void;
}

export const GardenBackdropSvg: React.FC = () => (
  <svg viewBox="0 0 960 540" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="gdn-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="50%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#DCFCE7" />
      </linearGradient>
      <linearGradient id="gdn-stream" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#22D3EE" />
        <stop offset="100%" stopColor="#2DD4BF" />
      </linearGradient>
      <linearGradient id="gdn-grass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#BBF7D0" />
        <stop offset="100%" stopColor="#4ADE80" />
      </linearGradient>
    </defs>

    <rect width="960" height="540" fill="url(#gdn-sky)" />

    {/* Warm Sunbeams */}
    <circle cx="840" cy="84" r="54" fill="#FEF08A" opacity="0.85" />
    <circle cx="840" cy="84" r="88" fill="#FEF9C3" opacity="0.35" />

    {/* Transparent Crystal Glasshouse Greenhouse Dome */}
    <path
      d="M150 360 L150 185 Q480 35 810 185 L810 360 Z"
      fill="#FFFFFF"
      fillOpacity="0.46"
      stroke="#FFFFFF"
      strokeWidth="5"
    />
    <path d="M295 360 L295 135 M480 360 L480 105 M665 360 L665 135" stroke="#BAE6FD" strokeWidth="3" opacity="0.8" />
    <path d="M150 225 Q480 155 810 225" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.85" />

    {/* Rolling Lush Meadow */}
    <path d="M0 330 Q260 285 520 330 T960 320 L960 540 L0 540 Z" fill="url(#gdn-grass)" />

    {/* Winding Aqua Stream & Tropical Fish */}
    <path d="M0 445 Q260 390 480 435 T960 400 L960 500 Q720 475 480 505 T0 520 Z" fill="url(#gdn-stream)" opacity="0.9" />
    <ellipse cx="215" cy="462" rx="12" ry="6" fill="#FB923C" />
    <polygon points="203,462 194,456 194,468" fill="#F97316" />
    <ellipse cx="735" cy="445" rx="11" ry="5.5" fill="#FDE047" />
    <polygon points="724,445 715,440 715,450" fill="#EAB308" />

    {/* Arched Glass Bridge */}
    <path d="M370 430 Q480 360 590 430 L590 462 Q480 392 370 462 Z" fill="#E0F2FE" fillOpacity="0.88" stroke="#FFFFFF" strokeWidth="4" />

    {/* Stone Garden Path */}
    <ellipse cx="145" cy="390" rx="34" ry="12" fill="#FDE68A" stroke="#FFFFFF" strokeWidth="2.5" />
    <ellipse cx="255" cy="405" rx="36" ry="12" fill="#FDE68A" stroke="#FFFFFF" strokeWidth="2.5" />
    <ellipse cx="695" cy="400" rx="36" ry="12" fill="#FDE68A" stroke="#FFFFFF" strokeWidth="2.5" />

    {/* Glowing Flowers */}
    <g transform="translate(105, 345)">
      <line x1="0" y1="0" x2="0" y2="34" stroke="#16A34A" strokeWidth="4" />
      <circle cx="0" cy="0" r="14" fill="#F472B6" stroke="#FFFFFF" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="6" fill="#FEF08A" />
    </g>
    <g transform="translate(835, 345)">
      <line x1="0" y1="0" x2="0" y2="34" stroke="#16A34A" strokeWidth="4" />
      <circle cx="0" cy="0" r="15" fill="#A78BFA" stroke="#FFFFFF" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="6" fill="#FEF08A" />
    </g>

    {/* Floating Soap Bubbles & Pastel Butterflies */}
    <circle cx="240" cy="175" r="18" fill="#FFFFFF" fillOpacity="0.45" stroke="#FFFFFF" strokeWidth="2" />
    <circle cx="715" cy="185" r="22" fill="#A5F3FC" fillOpacity="0.4" stroke="#FFFFFF" strokeWidth="2" />
    <path d="M350 245 Q340 232 354 236 Q368 232 358 245 Z" fill="#F9A8D4" />
    <path d="M620 232 Q610 218 624 222 Q638 218 628 232 Z" fill="#FDE047" />
  </svg>
);

export const GardenEnvironment: React.FC<GardenEnvironmentProps> = ({
  mode,
  avatarConfig,
  nickname,
  settings,
  onEnterGarden,
  onStartFinalActivity,
}) => {
  const [welcomeIdx, setWelcomeIdx] = useState(0);

  if (mode === 'exterior') {
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-6">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden">
          <GardenBackdropSvg />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#064E3B]/25" />
        </div>

        <div className="relative z-10 w-full max-w-3xl rounded-[32px] border-2 border-white bg-white/92 backdrop-blur-md p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(21,128,61,0.34)] text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
            <Flower2 className="h-4 w-4" />
            <span>DETECTIVE TOWN · LOCATION 7 · DIGITAL SAFE GARDEN</span>
          </div>

          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
            DIGITAL SAFE GARDEN · FINAL MISSION
          </h2>

          <p className="text-sm sm:text-base font-semibold text-[#334155] max-w-xl mx-auto">
            Step across the crystal bridge into the sunlit glasshouse garden! Help Daniel with final
            online safety advice, explore the STOP-CHECK-DECIDE traffic light, and stamp your
            Digital Safety Passport!
          </p>

          <div className="flex items-end justify-center gap-8 py-1">
            <div className="flex flex-col items-center">
              <div className="w-22 h-28 sm:w-26 sm:h-34">
                <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />
              </div>
              <span className="rounded-full bg-purple-100 border border-purple-200 px-3 py-0.5 text-[11px] font-extrabold text-[#6D28D9]">
                {nickname}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-22 h-20 sm:w-24 sm:h-22">
                <PusheenIllustration expression="happy" pose="waving" />
              </div>
              <span className="rounded-full bg-sky-100 border border-sky-200 px-3 py-0.5 text-[11px] font-extrabold text-[#0369A1]">
                Detective Pusheen
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-22 h-26 sm:w-26 sm:h-30">
                <TeacherChelseaIllustration expression="happy" />
              </div>
              <span className="rounded-full bg-teal-100 border border-teal-200 px-3 py-0.5 text-[11px] font-extrabold text-[#0F766E]">
                Teacher Chelsea
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playPortalOpen();
              onEnterGarden?.();
            }}
            className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] border border-white px-8 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>ENTER DIGITAL SAFE GARDEN</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // 'welcome-dialogue'
  const step = SCREEN09_WELCOME_SCRIPT[welcomeIdx];
  const finishedDialogue = welcomeIdx >= SCREEN09_WELCOME_SCRIPT.length;

  return (
    <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 pb-44 sm:pb-48">
      <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden">
        <GardenBackdropSvg />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#064E3B]/25" />
      </div>

      <div className="relative z-10 w-full max-w-3xl rounded-[32px] border-2 border-white bg-white/92 backdrop-blur-md p-6 sm:p-8 shadow-2xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 border border-teal-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#0F766E]">
          <Sparkles className="h-4 w-4" />
          <span>MY FINAL ADVICE + REFLECTION</span>
        </div>

        <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
          Four Peaceful Garden Stations Await!
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left">
          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3">
            <p className="text-[11px] font-extrabold text-[#0284C7]">1 · FINAL ADVICE</p>
            <p className="text-[11px] font-semibold text-[#334155] mt-0.5">
              Guide Daniel safely
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-[11px] font-extrabold text-[#D97706]">2 · TRAFFIC LIGHT</p>
            <p className="text-[11px] font-semibold text-[#334155] mt-0.5">
              STOP, CHECK &amp; DECIDE
            </p>
          </div>
          <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3">
            <p className="text-[11px] font-extrabold text-[#7C3AED]">3 · SELF-CHECK</p>
            <p className="text-[11px] font-semibold text-[#334155] mt-0.5">
              Today, I can...
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
            <p className="text-[11px] font-extrabold text-[#16A34A]">4 · PROMISE TREE</p>
            <p className="text-[11px] font-semibold text-[#334155] mt-0.5">
              Grow your glowing leaf
            </p>
          </div>
        </div>

        {finishedDialogue && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onStartFinalActivity?.();
              }}
              className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] border border-white px-8 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>START FINAL ACTIVITY</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {step && (
        <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <DialogueBox
              speaker={step.speaker}
              speakerName={step.speakerName}
              playerNickname={nickname}
              playerAvatar={avatarConfig}
              expression={step.expression}
              text={step.text}
              settings={settings}
              nextLabel={
                welcomeIdx + 1 < SCREEN09_WELCOME_SCRIPT.length
                  ? 'NEXT'
                  : 'START FINAL ACTIVITY'
              }
              onReplay={() => setWelcomeIdx(0)}
              onSkipAll={() => onStartFinalActivity?.()}
              onNext={() => {
                if (welcomeIdx + 1 < SCREEN09_WELCOME_SCRIPT.length) {
                  setWelcomeIdx((p) => p + 1);
                } else {
                  setWelcomeIdx(SCREEN09_WELCOME_SCRIPT.length);
                  onStartFinalActivity?.();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
