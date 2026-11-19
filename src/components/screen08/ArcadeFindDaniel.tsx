import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  CarFront,
  Footprints,
  Gamepad2,
  Gift,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  ARCADE_NPC_SPOTS,
  type ArcadeBayId,
  type ArcadeNpcSpot,
} from '../../data/screen08Data.ts';
import type { AvatarConfig } from '../../types/game.ts';
import {
  playErrorTone,
  playPortalOpen,
  playSoftSelect,
  playVictorySound,
} from '../../utils/soundEffects.ts';
import { DanielIllustration } from '../game/DanielIllustration.tsx';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';
import {
  AmirArcadeIllustration,
  KevinArcadeIllustration,
  SitiArcadeIllustration,
} from './ArcadeNpcIllustrations.tsx';

interface ArcadeFindDanielProps {
  avatarConfig: AvatarConfig;
  nickname: string;
  currentStars: number;
  initiallyFound: boolean;
  onWrongNpcClick: () => void;
  onDanielFound: () => void;
  onProceedToProblem: () => void;
}

const ArcadeBayFurnitureSvg: React.FC<{ bayId: ArcadeBayId }> = ({ bayId }) => {
  if (bayId === 'racing-pods') {
    return (
      <svg viewBox="0 0 260 150" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="bay-race-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>
          <radialGradient id="bay-race-glow" cx="0.3" cy="0.1" r="0.8">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="260" height="150" fill="url(#bay-race-bg)" />
        <rect width="260" height="150" fill="url(#bay-race-glow)" />
        <line x1="0" y1="122" x2="260" y2="122" stroke="#7DD3FC" strokeWidth="2.5" />
        {/* Racing Pod Arcade Cabinet cleanly docked left */}
        <ellipse cx="64" cy="126" rx="46" ry="8" fill="#0369A1" opacity="0.18" />
        <rect x="20" y="34" width="88" height="90" rx="14" fill="#0284C7" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="30" y="44" width="68" height="40" rx="7" fill="#E0F2FE" stroke="#67E8F9" strokeWidth="2" />
        <path d="M36 74 L58 56 L78 68 L92 50" fill="none" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
        <rect x="32" y="92" width="64" height="26" rx="8" fill="#38BDF8" />
        <circle cx="64" cy="105" r="10" fill="#0F172A" stroke="#FDE047" strokeWidth="2.5" />
      </svg>
    );
  }

  if (bayId === 'prize-counter') {
    return (
      <svg viewBox="0 0 260 150" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="bay-prize-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
          <radialGradient id="bay-prize-lamp" cx="0.72" cy="0.1" r="0.75">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="260" height="150" fill="url(#bay-prize-bg)" />
        <rect width="260" height="150" fill="url(#bay-prize-lamp)" />
        <line x1="0" y1="122" x2="260" y2="122" stroke="#FCD34D" strokeWidth="2.5" />
        {/* Showcase Shelf & Prize Counter cleanly docked right */}
        <ellipse cx="192" cy="126" rx="52" ry="8" fill="#B45309" opacity="0.16" />
        <rect x="138" y="34" width="104" height="32" rx="8" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="160" cy="50" r="8" fill="#F472B6" />
        <rect x="178" y="41" width="18" height="18" rx="4" fill="#34D399" />
        <circle cx="218" cy="50" r="9" fill="#FDE047" />
        <rect x="136" y="76" width="108" height="48" rx="10" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2.5" />
        <rect x="136" y="70" width="108" height="10" rx="5" fill="#FBBF24" />
      </svg>
    );
  }

  if (bayId === 'claw-hoops') {
    return (
      <svg viewBox="0 0 260 150" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="bay-claw-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCE7F3" />
            <stop offset="100%" stopColor="#FBCFE8" />
          </linearGradient>
        </defs>
        <rect width="260" height="150" fill="url(#bay-claw-bg)" />
        <line x1="0" y1="122" x2="260" y2="122" stroke="#F9A8D4" strokeWidth="2.5" />
        {/* Pastel Claw Machine docked left */}
        <ellipse cx="64" cy="126" rx="44" ry="8" fill="#BE185D" opacity="0.16" />
        <rect x="22" y="28" width="84" height="96" rx="14" fill="#EC4899" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="32" y="38" width="64" height="48" rx="8" fill="#E0F2FE" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="64" y1="38" x2="64" y2="56" stroke="#64748B" strokeWidth="2.5" />
        <circle cx="48" cy="76" r="7" fill="#FDE047" />
        <circle cx="64" cy="78" r="7.5" fill="#C084FC" />
        <circle cx="80" cy="76" r="7" fill="#67E8F9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 260 150" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="bay-lounge-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#DDD6FE" />
        </linearGradient>
        <radialGradient id="bay-monitor-glow" cx="0.75" cy="0.45" r="0.55">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#67E8F9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="260" height="150" fill="url(#bay-lounge-bg)" />
      <rect width="260" height="150" fill="url(#bay-monitor-glow)" />
      <line x1="0" y1="122" x2="260" y2="122" stroke="#C4B5FD" strokeWidth="2.5" />
      {/* Aqua Gaming Pod #4 docked right */}
      <ellipse cx="192" cy="126" rx="48" ry="8" fill="#4C1D95" opacity="0.18" />
      <rect x="148" y="82" width="90" height="42" rx="10" fill="#FFFFFF" stroke="#06B6D4" strokeWidth="2.5" />
      <rect x="160" y="34" width="66" height="44" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
      <rect x="166" y="40" width="54" height="32" rx="4" fill="#A5F3FC" />
      <line x1="193" y1="78" x2="193" y2="84" stroke="#64748B" strokeWidth="4" />
    </svg>
  );
};

interface BayRect {
  spot: ArcadeNpcSpot;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  approachX: number;
  approachY: number;
}

const BAY_RECTS: BayRect[] = ARCADE_NPC_SPOTS.map((spot) => {
  const isLeft = spot.xPct < 50;
  const isTop = spot.yPct < 50;
  return {
    spot,
    x1: isLeft ? 3 : 59,
    y1: isTop ? 7 : 54,
    x2: isLeft ? 41 : 97,
    y2: isTop ? 45 : 93,
    approachX: isLeft ? 34 : 66,
    approachY: isTop ? 31 : 74,
  };
});

function detectBayAt(x: number, y: number): ArcadeNpcSpot | null {
  for (const bay of BAY_RECTS) {
    if (x >= bay.x1 && x <= bay.x2 && y >= bay.y1 && y <= bay.y2) {
      return bay.spot;
    }
  }
  return null;
}

function clampArcadeWalk(x: number, y: number): { x: number; y: number } {
  const nx = Math.max(8, Math.min(92, x));
  let ny = Math.max(15, Math.min(89, y));
  const inCentralWalkway = nx >= 42 && nx <= 58;
  if (!inCentralWalkway && ny > 44 && ny < 56) {
    ny = ny < 50 ? 44 : 56;
  }
  return { x: nx, y: ny };
}

const UniqueArcadeNpcPortrait: React.FC<{ spot: ArcadeNpcSpot }> = ({ spot }) => {
  if (spot.isDaniel) {
    return <DanielIllustration expression="worried" holdingTablet={true} />;
  }
  if (spot.id === 'npc-racer') {
    return <AmirArcadeIllustration />;
  }
  if (spot.id === 'npc-claw') {
    return <SitiArcadeIllustration />;
  }
  return <KevinArcadeIllustration />;
};

export const ArcadeFindDaniel: React.FC<ArcadeFindDanielProps> = ({
  avatarConfig,
  currentStars,
  initiallyFound,
  onWrongNpcClick,
  onDanielFound,
  onProceedToProblem,
}) => {
  const [foundDaniel, setFoundDaniel] = useState(initiallyFound);
  const [checkedWrongIds, setCheckedWrongIds] = useState<string[]>([]);
  const [wrongOverlay, setWrongOverlay] = useState<{
    name: string;
    station: string;
  } | null>(null);

  const [avatarPos, setAvatarPos] = useState<{ x: number; y: number }>({ x: 50, y: 51 });
  const [facing, setFacing] = useState<'front' | 'left' | 'right'>('front');
  const [isMoving, setIsMoving] = useState(false);
  const posRef = useRef(avatarPos);
  posRef.current = avatarPos;
  const targetRef = useRef<{ x: number; y: number; spot?: ArcadeNpcSpot } | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const activeBayRef = useRef<string | null>(null);
  const floorPlanRef = useRef<HTMLDivElement | null>(null);

  const inspectSpot = useCallback(
    (spot: ArcadeNpcSpot) => {
      if (foundDaniel) return;
      targetRef.current = null;
      if (spot.isDaniel) {
        playVictorySound();
        setWrongOverlay(null);
        setFoundDaniel(true);
        onDanielFound();
      } else {
        playErrorTone();
        setWrongOverlay({ name: spot.name, station: spot.stationLabel });
        setCheckedWrongIds((prev) => (prev.includes(spot.id) ? prev : [...prev, spot.id]));
        onWrongNpcClick();
      }
    },
    [foundDaniel, onDanielFound, onWrongNpcClick]
  );

  useEffect(() => {
    if (!foundDaniel) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      floorPlanRef.current?.focus({ preventScroll: true });
    }
  }, [foundDaniel]);

  useEffect(() => {
    if (foundDaniel) {
      keysRef.current.clear();
      setIsMoving(false);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        e.preventDefault();
        keysRef.current.add(k);
        targetRef.current = null;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    const clearKeys = () => keysRef.current.clear();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, [foundDaniel]);

  useEffect(() => {
    if (foundDaniel) return;
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const keys = keysRef.current;
      let dx = 0;
      let dy = 0;
      if (keys.has('w') || keys.has('arrowup')) dy -= 1;
      if (keys.has('s') || keys.has('arrowdown')) dy += 1;
      if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
      if (keys.has('d') || keys.has('arrowright')) dx += 1;

      const cur = posRef.current;
      let nextX = cur.x;
      let nextY = cur.y;
      let moving = false;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        nextX = cur.x + (dx / len) * 34 * dt;
        nextY = cur.y + (dy / len) * 34 * dt;
        moving = true;
        setFacing(dx < -0.1 ? 'left' : dx > 0.1 ? 'right' : 'front');
      } else if (targetRef.current) {
        const tx = targetRef.current.x - cur.x;
        const ty = targetRef.current.y - cur.y;
        const dist = Math.hypot(tx, ty);
        if (dist < 2.2) {
          const reachedSpot = targetRef.current.spot;
          targetRef.current = null;
          if (reachedSpot) inspectSpot(reachedSpot);
        } else {
          nextX = cur.x + (tx / dist) * 40 * dt;
          nextY = cur.y + (ty / dist) * 40 * dt;
          moving = true;
          setFacing(tx < -1 ? 'left' : tx > 1 ? 'right' : 'front');
        }
      }

      if (moving) {
        const clamped = clampArcadeWalk(nextX, nextY);
        posRef.current = clamped;
        setAvatarPos(clamped);
        setIsMoving(true);

        const baySpot = detectBayAt(clamped.x, clamped.y);
        if (baySpot && baySpot.id !== activeBayRef.current) {
          activeBayRef.current = baySpot.id;
          inspectSpot(baySpot);
        } else if (!baySpot && activeBayRef.current !== null) {
          activeBayRef.current = null;
        }
      } else {
        setIsMoving(false);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [foundDaniel, inspectSpot]);

  const handleFloorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (foundDaniel || !floorPlanRef.current) return;
    const rect = floorPlanRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    targetRef.current = clampArcadeWalk(clickX, clickY);
  };

  const handleBayClick = (bay: BayRect) => {
    if (foundDaniel) return;
    playSoftSelect();
    setWrongOverlay(null);
    const dist = Math.hypot(bay.approachX - posRef.current.x, bay.approachY - posRef.current.y);
    if (dist < 10) {
      inspectSpot(bay.spot);
    } else {
      targetRef.current = { x: bay.approachX, y: bay.approachY, spot: bay.spot };
    }
  };

  const nudgeDirection = (dx: number, dy: number) => {
    if (foundDaniel) return;
    targetRef.current = null;
    const clamped = clampArcadeWalk(posRef.current.x + dx, posRef.current.y + dy);
    posRef.current = clamped;
    setAvatarPos(clamped);
    setFacing(dx < 0 ? 'left' : dx > 0 ? 'right' : 'front');

    const baySpot = detectBayAt(clamped.x, clamped.y);
    if (baySpot && baySpot.id !== activeBayRef.current) {
      activeBayRef.current = baySpot.id;
      inspectSpot(baySpot);
    } else if (!baySpot) {
      activeBayRef.current = null;
    }
  };

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(243,232,255,0.95) 55%, rgba(224,242,254,0.95) 100%)',
        }}
        className="aero-glass-card rounded-[32px] border-2 border-white p-4 sm:p-6 shadow-[0_24px_60px_-10px_rgba(76,29,149,0.34)] space-y-4"
      >
        {/* Crisp Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-left">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C3AED] inline-flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              <span>FIND DANIEL · ARCADE FLOOR PLAN</span>
            </p>
            <h2 className="font-[var(--font-display)] text-lg sm:text-2xl font-bold text-[#0E3558]">
              {foundDaniel
                ? 'DANIEL FOUND!'
                : 'Walk down the arcade aisle or click a bay to find who needs help!'}
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-3.5 py-2 shadow-xs">
            <Star className="h-4 w-4 text-[#D97706] fill-[#FBBF24]" />
            <span className="text-xs sm:text-sm font-extrabold text-[#92400E] tabular-nums">
              Game Stars: {currentStars}
            </span>
          </div>
        </div>

        {/* Clean 2x2 Zoned Arcade Floor Plan (matching Cyber Cafe clarity + soft lighting) */}
        <div
          ref={floorPlanRef}
          tabIndex={-1}
          onClick={handleFloorClick}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[340px] rounded-[26px] border-4 border-white bg-gradient-to-b from-[#EDE9FE] via-[#E0F2FE] to-[#F5F3FF] shadow-inner overflow-hidden select-none cursor-crosshair focus:outline-none"
        >
          {/* Top Signboard Beam */}
          <div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-r from-[#C084FC] via-[#67E8F9] to-[#C084FC] border-b border-white flex items-center justify-center">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#1E1B4B]">
              STARLIGHT GAME ARCADE · 4 GAMING BAYS
            </span>
          </div>

          {/* Illuminated Central Walkway Aisle */}
          <div
            aria-hidden="true"
            className="absolute left-[42%] top-[7%] w-[16%] h-[88%] bg-gradient-to-b from-[#FFFBEB]/80 via-[#FEF3C7]/65 to-[#E0F2FE]/80 border-x-2 border-dashed border-purple-300/75 flex flex-col items-center justify-center"
          >
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-800 bg-white/90 rounded-full px-2.5 py-0.5 shadow-xs">
              Arcade Aisle
            </span>
          </div>

          {/* Horizontal Divider Beams */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-[58%] top-[48%] h-[4%] bg-[#CBD5E1] border-y border-white shadow-xs"
          />
          <div
            aria-hidden="true"
            className="absolute left-[58%] right-0 top-[48%] h-[4%] bg-[#CBD5E1] border-y border-white shadow-xs"
          />

          {/* 4 Zoned Gaming Bays with Unique Shaded NPCs */}
          {BAY_RECTS.map((bay) => {
            const { spot } = bay;
            const checkedWrong = checkedWrongIds.includes(spot.id);
            const highlightDaniel = foundDaniel && spot.isDaniel;
            const isLeft = spot.xPct < 50;
            const BayIcon =
              spot.bayId === 'racing-pods'
                ? CarFront
                : spot.bayId === 'prize-counter'
                  ? Award
                  : spot.bayId === 'claw-hoops'
                    ? Gift
                    : Gamepad2;

            return (
              <button
                key={spot.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBayClick(bay);
                }}
                style={{
                  left: `${bay.x1}%`,
                  top: `${bay.y1 + 2}%`,
                  width: `${bay.x2 - bay.x1}%`,
                  height: `${bay.y2 - bay.y1 - 2}%`,
                }}
                className={`absolute rounded-[20px] border-2 bg-white/92 shadow-md overflow-hidden group cursor-pointer transition-all ${
                  highlightDaniel
                    ? 'border-emerald-400 ring-4 ring-emerald-200'
                    : checkedWrong
                      ? 'border-rose-300'
                      : 'border-white hover:border-purple-300'
                }`}
              >
                {/* Illuminated Bay Furniture Backdrop */}
                <div className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity">
                  <ArcadeBayFurnitureSvg bayId={spot.bayId} />
                </div>

                {/* Single Crisp Top Bay Label */}
                <div className="relative z-10 m-2 flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 border border-purple-100 px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold text-[#0E3558] shadow-xs">
                    <BayIcon className="h-3 w-3 text-[#7C3AED]" />
                    <span>{spot.stationLabel}</span>
                  </span>
                  {checkedWrong && (
                    <span className="rounded-full bg-rose-100 border border-rose-300 px-2 py-0.5 text-[9px] font-extrabold text-[#BE123C]">
                      Not Daniel
                    </span>
                  )}
                </div>

                {/* Unique Character Portrait Standing Cleanly on Open Side of the Bay */}
                <div
                  className={`absolute bottom-1.5 z-10 flex flex-col items-center ${
                    isLeft ? 'right-3 sm:right-5' : 'left-3 sm:left-5'
                  }`}
                >
                  <div className="w-14 h-16 sm:w-18 sm:h-20 drop-shadow-lg transition-transform group-hover:scale-105">
                    <UniqueArcadeNpcPortrait spot={spot} />
                  </div>
                  <span className=" -mt-1 rounded-full bg-[#0F172A]/85 text-white px-2.5 py-0.5 text-[10px] font-extrabold shadow-sm">
                    {spot.name}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Walkable Player Avatar + Detective Pusheen */}
          <div
            style={{
              left: `${avatarPos.x}%`,
              top: `${avatarPos.y}%`,
              transform: 'translate(-50%, -72%)',
            }}
            className="pointer-events-none absolute z-30 flex items-end gap-1"
          >
            <div className="w-12 h-16 sm:w-16 sm:h-20 drop-shadow-xl">
              <DetectiveAvatar
                config={avatarConfig}
                view={facing}
                pose={isMoving ? 'walk' : 'idle'}
              />
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 -ml-2 mb-1 drop-shadow-md">
              <PusheenIllustration expression={foundDaniel ? 'celebrating' : 'curious'} />
            </div>
          </div>

          {/* Wrong NPC Red Alert Overlay */}
          {wrongOverlay && !foundDaniel && (
            <div
              role="alert"
              className="absolute inset-0 z-40 bg-rose-950/70 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <div className="max-w-md w-full rounded-[28px] border-4 border-rose-300 bg-white p-5 sm:p-6 text-center shadow-2xl space-y-3">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-100 text-[#E11D48] flex items-center justify-center">
                  <AlertTriangle className="h-7 w-7" />
                </div>
                <h3 className="font-[var(--font-display)] text-xl sm:text-2xl font-extrabold text-[#BE123C]">
                  NOT DANIEL, DETECTIVE!
                </h3>
                <p className="text-sm font-bold text-[#0E3558]">
                  Keep looking! That&apos;s {wrongOverlay.name} at the {wrongOverlay.station}.
                </p>
                <p className="text-xs font-extrabold text-[#B45309] bg-amber-50 border border-amber-200 rounded-xl py-1.5 px-3">
                  -1 Game Star (Your XP &amp; reading marks are completely safe!)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setWrongOverlay(null);
                  }}
                  className="aero-glossy-btn min-h-[44px] rounded-full bg-gradient-to-b from-[#FB7185] to-[#E11D48] px-6 py-2 text-xs sm:text-sm font-extrabold text-white cursor-pointer"
                >
                  KEEP LOOKING
                </button>
              </div>
            </div>
          )}

          {/* Daniel Found Celebration Overlay */}
          {foundDaniel && (
            <div className="absolute inset-0 z-40 bg-indigo-950/65 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="max-w-lg w-full rounded-[30px] border-4 border-emerald-300 bg-white p-6 text-center shadow-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
                  <Sparkles className="h-4 w-4" />
                  <span>DANIEL FOUND!</span>
                </div>
                <div className="flex items-end justify-center gap-5">
                  <div className="w-24 h-28">
                    <DanielIllustration expression="surprised" holdingTablet={true} />
                  </div>
                  <div className="w-20 h-18">
                    <PusheenIllustration expression="celebrating" pose="waving" />
                  </div>
                </div>
                <p className="text-sm font-bold text-[#0E3558]">
                  Pusheen: &ldquo;Look! Daniel is at Aqua Gaming Pod #4 holding his tablet with a
                  worried face. Let&apos;s see what happened!&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    onProceedToProblem();
                  }}
                  className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] border border-white px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>TALK TO DANIEL</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clean Controls Bar with WASD & D-Pad */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-purple-50/90 border border-purple-200 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5B21B6]">
            <Footprints className="h-4 w-4 text-[#7C3AED] shrink-0" />
            <span>
              Walk with <kbd className="rounded bg-white px-1.5 py-0.5 text-[11px] font-extrabold border border-purple-200">W A S D</kbd> or Arrow Keys, or click any bay to check on the player! Clue: Look for a glowing tablet!
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Walk left"
              onClick={() => nudgeDirection(-12, 0)}
              className="h-9 w-9 rounded-xl bg-white hover:bg-purple-100 border border-purple-200 flex items-center justify-center text-[#6D28D9] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Walk up"
              onClick={() => nudgeDirection(0, -14)}
              className="h-9 w-9 rounded-xl bg-white hover:bg-purple-100 border border-purple-200 flex items-center justify-center text-[#6D28D9] cursor-pointer"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Walk down"
              onClick={() => nudgeDirection(0, 14)}
              className="h-9 w-9 rounded-xl bg-white hover:bg-purple-100 border border-purple-200 flex items-center justify-center text-[#6D28D9] cursor-pointer"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Walk right"
              onClick={() => nudgeDirection(12, 0)}
              className="h-9 w-9 rounded-xl bg-white hover:bg-purple-100 border border-purple-200 flex items-center justify-center text-[#6D28D9] cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
