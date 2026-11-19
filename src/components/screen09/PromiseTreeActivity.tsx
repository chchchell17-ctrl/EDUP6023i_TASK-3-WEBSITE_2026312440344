import React, { useState } from 'react';
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import {
  SCREEN09_FINAL_GARDEN_SCRIPT,
  validateScreen09Promise,
} from '../../data/screen09Data.ts';
import type { AvatarConfig, GameSettings, Screen09Progress } from '../../types/game.ts';
import {
  playErrorTone,
  playPortalOpen,
  playVictorySound,
} from '../../utils/soundEffects.ts';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';

interface PromiseTreeActivityProps {
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  initialProgress: Screen09Progress;
  onPromiseLeafPlaced: (payload: { nextTimeOnline: string; redFlagRemember: string }) => void;
  onCompletePromiseCeremony: () => void;
}

const PromiseTreeSvg: React.FC<{ hasPlayerLeaf: boolean; glowing: boolean; nickname: string }> = ({
  hasPlayerLeaf,
  glowing,
  nickname,
}) => (
  <svg viewBox="0 0 360 280" className="w-full h-full" aria-label="The Digital Safety Promise Tree">
    <defs>
      <radialGradient id="leaf-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="65%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#16A34A" />
      </radialGradient>
    </defs>

    {/* Meadow Mound */}
    <ellipse cx="180" cy="254" rx="135" ry="20" fill="#86EFAC" />

    {/* Warm Trunk & Branches */}
    <path
      d="M158 250 Q164 190 156 142 Q125 118 98 104 M202 250 Q196 190 204 142 Q235 118 262 104 M180 170 L180 112"
      fill="none"
      stroke="#92400E"
      strokeWidth="22"
      strokeLinecap="round"
    />

    {/* Lush Canopy */}
    <circle cx="115" cy="108" r="52" fill="#4ADE80" />
    <circle cx="245" cy="108" r="52" fill="#22C55E" />
    <circle cx="180" cy="76" r="64" fill="#86EFAC" />
    <circle cx="180" cy="110" r="58" fill="#34D399" />

    {/* Existing Friendship Leaves */}
    <ellipse cx="122" cy="94" rx="16" ry="9" transform="rotate(-18 122 94)" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
    <ellipse cx="238" cy="102" rx="16" ry="9" transform="rotate(18 238 102)" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
    <ellipse cx="152" cy="128" rx="15" ry="8" transform="rotate(-10 152 128)" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />

    {/* Student's Glowing Golden-Emerald Promise Leaf */}
    {hasPlayerLeaf && (
      <g transform="translate(182, 74)">
        {glowing && <circle cx="0" cy="0" r="34" fill="#FEF08A" opacity="0.55" />}
        <ellipse
          cx="0"
          cy="0"
          rx="26"
          ry="15"
          transform="rotate(-14)"
          fill="url(#leaf-glow)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        <text x="0" y="30" textAnchor="middle" fill="#064E3B" fontSize="11" fontWeight="900">
          {nickname}&apos;s Promise
        </text>
      </g>
    )}
  </svg>
);

export const PromiseTreeActivity: React.FC<PromiseTreeActivityProps> = ({
  avatarConfig,
  nickname,
  settings,
  initialProgress,
  onPromiseLeafPlaced,
  onCompletePromiseCeremony,
}) => {
  const [nextTimeOnline, setNextTimeOnline] = useState(
    initialProgress.promiseFinal.nextTimeOnline || ''
  );
  const [redFlagRemember, setRedFlagRemember] = useState(
    initialProgress.promiseFinal.redFlagRemember || ''
  );
  const [leafPlaced, setLeafPlaced] = useState(initialProgress.promiseMade);
  const [promiseConfirmed, setPromiseConfirmed] = useState(initialProgress.promiseMade);
  const [errorNote, setErrorNote] = useState<string | null>(null);
  const [dialogueIdx, setDialogueIdx] = useState(0);

  const handleGrowLeaf = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateScreen09Promise({ nextTimeOnline, redFlagRemember });
    if (!res.acceptable) {
      playErrorTone();
      setErrorNote(res.feedback);
      return;
    }

    playVictorySound();
    setErrorNote(null);
    setLeafPlaced(true);
    onPromiseLeafPlaced({
      nextTimeOnline: nextTimeOnline.trim(),
      redFlagRemember: redFlagRemember.trim(),
    });
  };

  const step = promiseConfirmed ? SCREEN09_FINAL_GARDEN_SCRIPT[dialogueIdx] : null;

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 pb-44 sm:pb-48 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(21,128,61,0.34)] space-y-5">
        <div className="text-left">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#16A34A]">
            SCENE 04 · MY DIGITAL READING PROMISE &amp; TREE
          </p>
          <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
            The Digital Safety Promise Tree
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive Promise Form OR Final Illuminated Panel */}
          <div className="lg:col-span-6 space-y-4 text-left">
            {!leafPlaced ? (
              <form onSubmit={handleGrowLeaf} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
                    NEXT TIME I AM ONLINE, I WILL...
                  </label>
                  <textarea
                    rows={3}
                    value={nextTimeOnline}
                    onChange={(e) => {
                      setNextTimeOnline(e.target.value);
                      if (errorNote) setErrorNote(null);
                    }}
                    placeholder="Write what safe step you will take next time you see an online message..."
                    className="w-full rounded-2xl border-2 border-sky-200 bg-sky-50/40 px-4 py-3 text-sm font-semibold text-[#0E3558] focus:outline-none focus-visible:border-[#0284C7]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#7C3AED]">
                    ONE RED FLAG I WILL REMEMBER IS...
                  </label>
                  <textarea
                    rows={2}
                    value={redFlagRemember}
                    onChange={(e) => {
                      setRedFlagRemember(e.target.value);
                      if (errorNote) setErrorNote(null);
                    }}
                    placeholder="Write one digital warning sign you will always watch out for..."
                    className="w-full rounded-2xl border-2 border-purple-200 bg-purple-50/40 px-4 py-3 text-sm font-semibold text-[#0E3558] focus:outline-none focus-visible:border-[#7C3AED]"
                  />
                </div>

                {errorNote && (
                  <p className="rounded-xl bg-amber-50 border border-amber-300 px-3.5 py-2 text-xs font-bold text-[#92400E]">
                    {errorNote}
                  </p>
                )}

                <button
                  type="submit"
                  className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Leaf className="h-4 w-4" />
                  <span>ATTACH PROMISE LEAF TO TREE</span>
                </button>
              </form>
            ) : (
              <div className="rounded-[26px] border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 p-5 space-y-4 shadow-md">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-[11px] font-extrabold text-[#15803D]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>FINAL ILLUMINATED PROMISE</span>
                </div>

                <h3 className="font-[var(--font-display)] text-lg sm:text-xl font-extrabold text-[#0E3558]">
                  &ldquo;I WILL STOP, CHECK AND DECIDE BEFORE I CLICK!&rdquo;
                </h3>

                <div className="rounded-xl bg-white/90 border border-emerald-200 p-3 text-xs font-semibold text-[#334155] space-y-1">
                  <p>
                    <strong className="text-[#0284C7]">My Safe Action:</strong> {nextTimeOnline}
                  </p>
                  <p>
                    <strong className="text-[#7C3AED]">Red Flag Remembered:</strong>{' '}
                    {redFlagRemember}
                  </p>
                </div>

                {!promiseConfirmed ? (
                  <button
                    type="button"
                    onClick={() => {
                      playVictorySound();
                      setPromiseConfirmed(true);
                    }}
                    className="aero-glossy-btn min-h-[50px] w-full rounded-full bg-gradient-to-b from-[#FBBF24] to-[#D97706] border border-white px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white inline-flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>I MAKE MY DIGITAL SAFETY PROMISE!</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      onCompletePromiseCeremony();
                    }}
                    className="aero-glossy-btn min-h-[48px] w-full rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] border border-white px-6 py-2.5 text-sm font-extrabold text-white inline-flex items-center justify-center gap-2 shadow cursor-pointer"
                  >
                    <span>OPEN STAMPED DIGITAL SAFETY PASSPORT</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Interactive Tree + Avatar Raising Hand */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-emerald-50 rounded-[26px] border-2 border-emerald-200 p-4">
            <div className="w-full max-w-[340px] h-[230px]">
              <PromiseTreeSvg
                hasPlayerLeaf={leafPlaced}
                glowing={promiseConfirmed}
                nickname={nickname}
              />
            </div>
            <div className="flex items-center gap-3 -mt-2">
              <div className="w-16 h-20">
                <DetectiveAvatar
                  config={avatarConfig}
                  view="front"
                  pose={promiseConfirmed ? 'wave' : 'idle'}
                />
              </div>
              <span className="rounded-full bg-white border border-emerald-200 px-3 py-1 text-xs font-extrabold text-[#15803D]">
                {promiseConfirmed
                  ? `${nickname} pledges Digital Safety!`
                  : 'Complete your promise to grow your glowing leaf!'}
              </span>
            </div>
          </div>
        </div>
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
                dialogueIdx + 1 < SCREEN09_FINAL_GARDEN_SCRIPT.length
                  ? 'NEXT'
                  : 'VIEW DIGITAL SAFETY PASSPORT'
              }
              onNext={() => {
                if (dialogueIdx + 1 < SCREEN09_FINAL_GARDEN_SCRIPT.length) {
                  setDialogueIdx((p) => p + 1);
                } else {
                  onCompletePromiseCeremony();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
