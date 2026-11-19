import React, { useState } from 'react';
import { ArrowRight, Gamepad2, Sparkles } from 'lucide-react';
import {
  SCREEN08_DANIEL_PROBLEM_SCRIPT,
  SCREEN08_WELCOME_SCRIPT,
} from '../../data/screen08Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import { playPortalOpen } from '../../utils/soundEffects.ts';
import { DanielIllustration } from '../game/DanielIllustration.tsx';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';
import { TeacherChelseaIllustration } from '../game/TeacherChelseaIllustration.tsx';

interface ArcadeEnvironmentProps {
  mode: 'exterior' | 'interior-explore' | 'welcome-dialogue' | 'daniel-problem';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  onEnterInterior?: () => void;
  onStartWelcomeDialogue?: () => void;
  onFinishWelcomeDialogue?: () => void;
  onFinishDanielProblem?: () => void;
}

export const ArcadeBackdropSvg: React.FC<{ doorOpen?: boolean; variant?: 'exterior' | 'interior' }> = ({
  doorOpen = false,
  variant = 'interior',
}) => {
  if (variant === 'exterior') {
    return (
      <svg viewBox="0 0 960 540" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="arc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="48%" stopColor="#DDD6FE" />
            <stop offset="100%" stopColor="#CFFAFE" />
          </linearGradient>
          <radialGradient id="arc-sun-beam" cx="0.22" cy="0.12" r="0.65">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="arc-dome" x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="48%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
          <linearGradient id="arc-roof-cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A5F3FC" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="arc-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.72" />
          </linearGradient>
          <radialGradient id="arc-door-glow" cx="0.5" cy="0" r="0.85">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity={doorOpen ? '0.85' : '0.42'} />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="960" height="540" fill="url(#arc-sky)" />
        <rect width="960" height="540" fill="url(#arc-sun-beam)" />

        {/* Soft Frutiger Aero Light Orbs & Clouds */}
        <circle cx="140" cy="110" r="68" fill="#FFFFFF" opacity="0.45" />
        <circle cx="820" cy="95" r="78" fill="#FFFFFF" opacity="0.42" />
        <circle cx="725" cy="145" r="24" fill="#A5F3FC" opacity="0.65" />
        <circle cx="215" cy="155" r="18" fill="#F9A8D4" opacity="0.55" />

        {/* Glossy Plaza Ground + Architectural Building Shadow */}
        <ellipse cx="480" cy="520" rx="540" ry="125" fill="#E0F2FE" stroke="#FFFFFF" strokeWidth="4" />
        <ellipse cx="480" cy="434" rx="295" ry="26" fill="#312E81" opacity="0.22" />
        <path d="M350 540 L430 415 L530 415 L610 540 Z" fill="#FDE68A" opacity="0.78" />
        <path d="M380 540 L438 418 L522 418 L580 540 Z" fill="url(#arc-door-glow)" />

        {/* Rounded Purble-Place Arcade Dome Building with 3D Shading */}
        <rect x="210" y="165" width="540" height="260" rx="58" fill="url(#arc-dome)" stroke="#FFFFFF" strokeWidth="6" />
        <ellipse cx="480" cy="175" rx="225" ry="62" fill="#C084FC" stroke="#FFFFFF" strokeWidth="5" />
        <ellipse cx="480" cy="150" rx="165" ry="44" fill="url(#arc-roof-cap)" stroke="#FFFFFF" strokeWidth="4" />
        {/* Roof Specular Glass Reflection */}
        <path d="M350 138 Q480 110 610 138" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.65" />

        {/* Glowing Roof Orbs */}
        <circle cx="315" cy="160" r="16" fill="#FDE047" stroke="#FFFFFF" strokeWidth="3" />
        <circle cx="645" cy="160" r="16" fill="#F472B6" stroke="#FFFFFF" strokeWidth="3" />

        {/* Big-Eyes Marquee Signboard */}
        <rect x="330" y="196" width="300" height="58" rx="26" fill="#0F172A" stroke="#67E8F9" strokeWidth="4" />
        <circle cx="364" cy="225" r="15" fill="#FFFFFF" />
        <circle cx="367" cy="225" r="7" fill="#0F172A" />
        <circle cx="369" cy="222" r="2.5" fill="#FFFFFF" />
        <circle cx="596" cy="225" r="15" fill="#FFFFFF" />
        <circle cx="593" cy="225" r="7" fill="#0F172A" />
        <circle cx="595" cy="222" r="2.5" fill="#FFFFFF" />
        <text x="480" y="232" textAnchor="middle" fill="#67E8F9" fontSize="22" fontWeight="900" fontFamily="sans-serif">
          GAME ARCADE
        </text>

        {/* Left & Right Illuminated Glass Windows with Specular Sheen */}
        <rect x="242" y="274" width="142" height="122" rx="24" fill="url(#arc-glass)" stroke="#FFFFFF" strokeWidth="4" />
        <rect x="262" y="314" width="38" height="66" rx="8" fill="#6D28D9" opacity="0.72" />
        <rect x="316" y="304" width="44" height="76" rx="8" fill="#EC4899" opacity="0.72" />
        <line x1="258" y1="286" x2="296" y2="334" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.55" />

        <rect x="576" y="274" width="142" height="122" rx="24" fill="url(#arc-glass)" stroke="#FFFFFF" strokeWidth="4" />
        <rect x="596" y="308" width="44" height="72" rx="8" fill="#F59E0B" opacity="0.72" />
        <rect x="656" y="316" width="38" height="64" rx="8" fill="#10B981" opacity="0.72" />
        <line x1="592" y1="286" x2="630" y2="334" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.55" />

        {/* Central Animated Glass Entrance Doors */}
        <rect x="412" y="274" width="136" height="151" rx="28" fill="#0F172A" stroke="#FFFFFF" strokeWidth="5" />
        <rect
          x={doorOpen ? 378 : 418}
          y="280"
          width="60"
          height="140"
          rx="14"
          fill="#67E8F9"
          fillOpacity="0.88"
          stroke="#FFFFFF"
          strokeWidth="3"
          style={{ transition: 'x 500ms ease' }}
        />
        <rect
          x={doorOpen ? 522 : 482}
          y="280"
          width="60"
          height="140"
          rx="14"
          fill="#C084FC"
          fillOpacity="0.88"
          stroke="#FFFFFF"
          strokeWidth="3"
          style={{ transition: 'x 500ms ease' }}
        />
      </svg>
    );
  }

  // Spacious, Illuminated Frutiger Aero Arcade Atrium (uncluttered back walls + open glowing floor)
  return (
    <svg viewBox="0 0 960 540" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="arc-int-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="48%" stopColor="#3B2378" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
        <linearGradient id="arc-int-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="45%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#CFFAFE" />
        </linearGradient>
        <radialGradient id="arc-spot-left" cx="0.5" cy="0" r="0.85">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#67E8F9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="arc-spot-center" cx="0.5" cy="0" r="0.85">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="arc-spot-right" cx="0.5" cy="0" r="0.85">
          <stop offset="0%" stopColor="#F9A8D4" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#F9A8D4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="arc-skylight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#A5F3FC" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Atmospheric Twilight Wall */}
      <rect width="960" height="540" fill="url(#arc-int-wall)" />

      {/* Glass Atrium Skylight Arch */}
      <path d="M180 0 Q480 96 780 0 Z" fill="url(#arc-skylight)" />
      <path d="M120 44 Q480 122 840 44" fill="none" stroke="#67E8F9" strokeWidth="4" opacity="0.65" />
      <path d="M180 68 Q480 140 780 68" fill="none" stroke="#F472B6" strokeWidth="3" opacity="0.55" />

      {/* Volumetric Ceiling Light Cones */}
      <polygon points="195,40 70,380 340,380" fill="url(#arc-spot-left)" />
      <polygon points="480,30 330,410 630,410" fill="url(#arc-spot-center)" />
      <polygon points="765,40 620,380 890,380" fill="url(#arc-spot-right)" />

      {/* Subtle Corner Bokeh Lights */}
      <circle cx="115" cy="115" r="14" fill="#67E8F9" opacity="0.28" />
      <circle cx="845" cy="108" r="16" fill="#F9A8D4" opacity="0.28" />
      <circle cx="480" cy="84" r="10" fill="#FDE047" opacity="0.45" />

      {/* Far Back Wall Cabinets (cleanly recessed to top-left & top-right wings, leaving open center stage) */}
      {/* Left: Compact Turbo Racing Pod */}
      <g transform="translate(56, 178)">
        <ellipse cx="62" cy="156" rx="58" ry="10" fill="#0F172A" opacity="0.25" />
        <rect x="4" y="0" width="116" height="154" rx="18" fill="#0284C7" stroke="#FFFFFF" strokeWidth="3.5" />
        <rect x="16" y="16" width="92" height="56" rx="10" fill="#BAE6FD" stroke="#67E8F9" strokeWidth="2.5" />
        <line x1="22" y1="24" x2="54" y2="62" stroke="#FFFFFF" strokeWidth="3" opacity="0.55" />
        <rect x="26" y="88" width="72" height="50" rx="12" fill="#38BDF8" />
        <circle cx="62" cy="108" r="13" fill="#0F172A" stroke="#FDE047" strokeWidth="2.5" />
      </g>

      {/* Left-Center: Compact Claw Showcase */}
      <g transform="translate(198, 186)">
        <ellipse cx="52" cy="148" rx="48" ry="9" fill="#0F172A" opacity="0.22" />
        <rect x="2" y="0" width="100" height="146" rx="18" fill="#EC4899" stroke="#FFFFFF" strokeWidth="3.5" />
        <rect x="14" y="16" width="76" height="72" rx="10" fill="#E0F2FE" fillOpacity="0.92" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="52" y1="18" x2="52" y2="42" stroke="#64748B" strokeWidth="3" />
        <circle cx="36" cy="72" r="9" fill="#FDE047" />
        <circle cx="56" cy="75" r="9" fill="#C084FC" />
        <circle cx="72" cy="72" r="8" fill="#67E8F9" />
      </g>

      {/* Right: Illuminated Starlight Prize Counter */}
      <g transform="translate(692, 186)">
        <ellipse cx="106" cy="148" rx="104" ry="10" fill="#0F172A" opacity="0.24" />
        <rect x="0" y="0" width="212" height="146" rx="20" fill="#6D28D9" stroke="#FFFFFF" strokeWidth="3.5" />
        <rect x="16" y="14" width="180" height="32" rx="10" fill="#0F172A" stroke="#FDE047" strokeWidth="2.5" />
        <text x="106" y="35" textAnchor="middle" fill="#FDE047" fontSize="13" fontWeight="900" fontFamily="sans-serif">
          PRIZE COUNTER
        </text>
        <rect x="12" y="84" width="188" height="58" rx="10" fill="#F5F3FF" stroke="#C4B5FD" strokeWidth="2.5" />
        <circle cx="50" cy="69" r="10" fill="#F472B6" />
        <rect x="92" y="57" width="26" height="22" rx="5" fill="#34D399" />
        <circle cx="158" cy="68" r="11" fill="#FBBF24" />
      </g>

      {/* Open Glossy Terrazzo Stage Floor with Perspective Grid & Soft Horizon Sheen */}
      <path d="M0 328 L960 328 L960 540 L0 540 Z" fill="url(#arc-int-floor)" />
      <line x1="0" y1="328" x2="960" y2="328" stroke="#67E8F9" strokeWidth="5" />
      <line x1="0" y1="333" x2="960" y2="333" stroke="#FFFFFF" strokeWidth="2" opacity="0.85" />
      {/* Floor Perspective Tiles */}
      <g stroke="#CBD5E1" strokeWidth="1.5" opacity="0.45">
        <line x1="160" y1="330" x2="40" y2="540" />
        <line x1="320" y1="330" x2="250" y2="540" />
        <line x1="480" y1="330" x2="480" y2="540" />
        <line x1="640" y1="330" x2="710" y2="540" />
        <line x1="800" y1="330" x2="920" y2="540" />
        <line x1="0" y1="382" x2="960" y2="382" />
        <line x1="0" y1="450" x2="960" y2="450" />
      </g>

      {/* Soft Glowing Stage Pools on Open Floor */}
      <ellipse cx="260" cy="430" rx="115" ry="24" fill="#67E8F9" opacity="0.22" />
      <ellipse cx="480" cy="436" rx="125" ry="26" fill="#FDE68A" opacity="0.25" />
      <ellipse cx="705" cy="430" rx="115" ry="24" fill="#DDD6FE" opacity="0.3" />
    </svg>
  );
};

export const ArcadeEnvironment: React.FC<ArcadeEnvironmentProps> = ({
  mode,
  avatarConfig,
  nickname,
  settings,
  onEnterInterior,
  onStartWelcomeDialogue,
  onFinishWelcomeDialogue,
  onFinishDanielProblem,
}) => {
  const [doorOpen, setDoorOpen] = useState(false);
  const [welcomeIdx, setWelcomeIdx] = useState(0);
  const [problemIdx, setProblemIdx] = useState(0);

  if (mode === 'exterior') {
    const handleStepInside = () => {
      playPortalOpen();
      setDoorOpen(true);
      const delay = settings.reducedMotion ? 160 : 620;
      window.setTimeout(() => {
        onEnterInterior?.();
      }, delay);
    };

    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-6">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden">
          <ArcadeBackdropSvg variant="exterior" doorOpen={doorOpen} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#0B2945]/35" />
        </div>

        <div className="relative z-10 w-full max-w-3xl rounded-[32px] border-2 border-white bg-white/92 backdrop-blur-md p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(76,29,149,0.38)] text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 border border-purple-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#6D28D9]">
            <Gamepad2 className="h-4 w-4" />
            <span>DETECTIVE TOWN · LOCATION 6 · GAME ARCADE</span>
          </div>

          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
            GAME ARCADE · DANIEL&apos;S FINAL DETECTIVE MISSION
          </h2>

          <p className="text-sm sm:text-base font-semibold text-[#334155] max-w-xl mx-auto">
            Look at the glowing purple &amp; aqua neon doors! Walk inside the arcade with Detective
            Pusheen to meet Teacher Chelsea and help Daniel!
          </p>

          <div
            className="flex items-end justify-center gap-10 py-1 transition-transform duration-500"
            style={doorOpen ? { transform: 'translateY(-14px) scale(0.95)' } : undefined}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-30 sm:w-28 sm:h-36 drop-shadow-xl">
                <DetectiveAvatar config={avatarConfig} view="front" pose={doorOpen ? 'walk' : 'wave'} />
              </div>
              <span className="rounded-full bg-purple-100 border border-purple-200 px-3 py-0.5 text-[11px] font-extrabold text-[#6D28D9]">
                {nickname}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-22 sm:w-26 sm:h-24 drop-shadow-xl">
                <PusheenIllustration expression="excited" pose="waving" />
              </div>
              <span className="rounded-full bg-cyan-100 border border-cyan-200 px-3 py-0.5 text-[11px] font-extrabold text-[#0369A1]">
                Detective Pusheen
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={doorOpen}
            onClick={handleStepInside}
            className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#A855F7] to-[#7C3AED] hover:from-[#C084FC] hover:to-[#6D28D9] border border-white px-8 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>{doorOpen ? 'OPENING ARCADE DOORS...' : 'WALK INTO GAME ARCADE'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'interior-explore') {
    return (
      <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div className="rounded-[32px] border-2 border-white bg-white/95 p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(76,29,149,0.35)] space-y-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 border border-cyan-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
            <Gamepad2 className="h-4 w-4" />
            <span>INSIDE THE GAME ARCADE</span>
          </div>

          <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
            Bright Neon Cabinets, Racing Pods &amp; Prize Counters!
          </h2>

          <div className="relative w-full aspect-[16/9] min-h-[280px] rounded-[24px] border-4 border-white overflow-hidden shadow-inner">
            <ArcadeBackdropSvg variant="interior" />
            <div className="absolute inset-x-0 bottom-5 flex items-end justify-around px-6 sm:px-14">
              <div className="flex flex-col items-center">
                <div className="w-18 h-22 sm:w-24 sm:h-30 drop-shadow-xl">
                  <DetectiveAvatar config={avatarConfig} view="front" pose="idle" />
                </div>
                <span className="mt-1 rounded-full bg-white/95 border border-purple-200 px-3 py-0.5 text-[10px] font-extrabold text-[#6D28D9] shadow">
                  {nickname}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-14 sm:w-22 sm:h-20 drop-shadow-xl">
                  <PusheenIllustration expression="curious" />
                </div>
                <span className="mt-1 rounded-full bg-white/95 border border-sky-200 px-3 py-0.5 text-[10px] font-extrabold text-[#0369A1] shadow">
                  Pusheen
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-22 sm:w-26 sm:h-28 drop-shadow-xl">
                  <TeacherChelseaIllustration expression="happy" />
                </div>
                <span className="mt-1 rounded-full bg-white/95 border border-teal-200 px-3 py-0.5 text-[10px] font-extrabold text-[#0D9488] shadow">
                  Teacher Chelsea
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playPortalOpen();
              onStartWelcomeDialogue?.();
            }}
            className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#2DD4BF] to-[#0D9488] hover:from-[#5EEAD4] hover:to-[#0F766E] border border-white px-8 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span>TALK TO TEACHER CHELSEA</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const activeScript =
    mode === 'welcome-dialogue' ? SCREEN08_WELCOME_SCRIPT : SCREEN08_DANIEL_PROBLEM_SCRIPT;
  const activeIdx = mode === 'welcome-dialogue' ? welcomeIdx : problemIdx;
  const step = activeScript[activeIdx];

  return (
    <div className="relative flex-1 w-full flex flex-col items-center justify-end pb-44 sm:pb-48">
      <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden">
        <ArcadeBackdropSvg variant="interior" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-[#0B2945]/40" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-14 flex items-end justify-between gap-4">
        <div className="flex items-end gap-5">
          <div className="flex flex-col items-center">
            <div className="w-22 h-28 sm:w-28 sm:h-36 drop-shadow-xl">
              <DetectiveAvatar config={avatarConfig} view="front" pose="idle" />
            </div>
            <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-extrabold text-[#6D28D9] shadow">
              {nickname}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-18 sm:w-24 sm:h-22 drop-shadow-xl">
              <PusheenIllustration expression={mode === 'daniel-problem' ? 'curious' : 'happy'} />
            </div>
            <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-extrabold text-[#0369A1] shadow">
              Pusheen
            </span>
          </div>
        </div>

        <div className="flex items-end gap-5">
          {mode === 'daniel-problem' && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-28 sm:w-30 sm:h-34 drop-shadow-xl">
                <DanielIllustration expression="worried" holdingTablet={true} />
              </div>
              <span className="rounded-full bg-white/95 px-3 py-0.5 text-[11px] font-extrabold text-[#7C3AED] shadow">
                Daniel
              </span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="w-24 h-28 sm:w-30 sm:h-34 drop-shadow-xl">
              <TeacherChelseaIllustration
                expression={mode === 'daniel-problem' ? 'encouraging' : 'happy'}
              />
            </div>
            <span className="rounded-full bg-white/95 px-3 py-0.5 text-[11px] font-extrabold text-[#0D9488] shadow">
              Teacher Chelsea
            </span>
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
                activeIdx + 1 < activeScript.length
                  ? 'NEXT'
                  : mode === 'welcome-dialogue'
                    ? 'SEARCH FOR DANIEL!'
                    : 'START FINAL MISSION BRIEFING'
              }
              onReplay={() => (mode === 'welcome-dialogue' ? setWelcomeIdx(0) : setProblemIdx(0))}
              onSkipAll={() =>
                mode === 'welcome-dialogue' ? onFinishWelcomeDialogue?.() : onFinishDanielProblem?.()
              }
              onNext={() => {
                if (activeIdx + 1 < activeScript.length) {
                  if (mode === 'welcome-dialogue') setWelcomeIdx((p) => p + 1);
                  else setProblemIdx((p) => p + 1);
                } else {
                  if (mode === 'welcome-dialogue') onFinishWelcomeDialogue?.();
                  else onFinishDanielProblem?.();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
