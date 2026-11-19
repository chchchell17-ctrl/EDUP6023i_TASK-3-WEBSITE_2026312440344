import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Armchair,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Footprints,
  HeartHandshake,
  MessageCircle,
  PenTool,
  Sparkles,
} from 'lucide-react';
import adviceCentreExtBg from '../../assets/images/advice_centre_exterior_1795083708291.jpg';
import adviceCentreIntBg from '../../assets/images/advice_centre_interior_1795083708166.jpg';
import {
  ADVICE_CENTRE_ZONES,
  SCREEN07_PUSHEEN_INTRO_SCRIPT,
} from '../../data/screen07Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import { playLoginSuccess, playPortalOpen, playSoftSelect } from '../../utils/soundEffects.ts';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface AdviceCentreEnvironmentProps {
  mode: 'exterior' | 'interior-explore' | 'pusheen-intro';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  onEnterInterior?: () => void;
  onStartIntroDialogue?: () => void;
  onFinishIntro?: () => void;
}

type AdviceRoomId =
  | 'communication-wall'
  | 'writing-corner'
  | 'advice-desk'
  | 'conversation-area';

interface AdviceRoomRect {
  id: AdviceRoomId;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  centerX: number;
  centerY: number;
}

const ADVICE_ROOM_RECTS: AdviceRoomRect[] = [
  { id: 'communication-wall', x1: 3, y1: 6, x2: 40, y2: 45, centerX: 24, centerY: 28 },
  { id: 'writing-corner', x1: 60, y1: 6, x2: 97, y2: 45, centerX: 76, centerY: 28 },
  { id: 'advice-desk', x1: 3, y1: 55, x2: 40, y2: 94, centerX: 24, centerY: 75 },
  { id: 'conversation-area', x1: 60, y1: 55, x2: 97, y2: 94, centerX: 76, centerY: 75 },
];

function detectAdviceRoomAt(x: number, y: number): AdviceRoomId | null {
  for (const r of ADVICE_ROOM_RECTS) {
    if (x >= r.x1 && x <= r.x2 - 2 && y >= r.y1 && y <= r.y2) {
      return r.id;
    }
  }
  return null;
}

function clampPositionToWalkableAdvice(x: number, y: number): { x: number; y: number } {
  const nx = Math.max(8, Math.min(92, x));
  let ny = Math.max(15, Math.min(88, y));

  const inWalkwayColumn = nx >= 42 && nx <= 58;
  if (!inWalkwayColumn && ny > 44 && ny < 58) {
    ny = ny < 51 ? 44 : 58;
  }

  return { x: nx, y: ny };
}

const AdviceRoomFurnitureSvg: React.FC<{ roomId: AdviceRoomId }> = ({ roomId }) => {
  if (roomId === 'communication-wall') {
    return (
      <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="0" y="0" width="240" height="135" fill="#F5F3FF" />
        <line x1="0" y1="108" x2="240" y2="108" stroke="#EDE9FE" strokeWidth="2" />
        {/* Friendly Corkboard & Speech Bubbles */}
        <rect x="24" y="18" width="192" height="72" rx="10" fill="#FFFFFF" stroke="#A78BFA" strokeWidth="2.5" />
        <rect x="38" y="30" width="66" height="22" rx="11" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
        <rect x="132" y="28" width="68" height="22" rx="11" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
        <rect x="74" y="58" width="90" height="22" rx="11" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
        {/* Potted Plant & Bench */}
        <rect x="28" y="96" width="184" height="14" rx="6" fill="#DDD6FE" stroke="#8B5CF6" strokeWidth="1.5" />
      </svg>
    );
  }

  if (roomId === 'writing-corner') {
    return (
      <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="0" y="0" width="240" height="135" fill="#FFFBEB" />
        <line x1="0" y1="108" x2="240" y2="108" stroke="#FEF3C7" strokeWidth="2" />
        {/* Sunny Window */}
        <rect x="24" y="16" width="62" height="48" rx="8" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2.5" />
        <line x1="55" y1="16" x2="55" y2="64" stroke="#FFFFFF" strokeWidth="2" />
        {/* Wooden Writing Desk */}
        <rect x="44" y="74" width="158" height="14" rx="5" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
        <rect x="54" y="88" width="10" height="26" fill="#B45309" />
        <rect x="182" y="88" width="10" height="26" fill="#B45309" />
        {/* Notebook, Pen Jar & Desk Lamp */}
        <rect x="86" y="60" width="44" height="14" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
        <rect x="148" y="52" width="16" height="22" rx="4" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
        <circle cx="182" cy="48" r="10" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
        <rect x="179" y="58" width="6" height="16" fill="#94A3B8" />
      </svg>
    );
  }

  if (roomId === 'advice-desk') {
    return (
      <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="0" y="0" width="240" height="135" fill="#ECFDF5" />
        <line x1="0" y1="108" x2="240" y2="108" stroke="#D1FAE5" strokeWidth="2" />
        {/* Welcome Banner */}
        <rect x="56" y="16" width="128" height="24" rx="8" fill="#FFFFFF" stroke="#2DD4BF" strokeWidth="2" />
        <line x1="74" y1="28" x2="166" y2="28" stroke="#0D9488" strokeWidth="4" strokeLinecap="round" />
        {/* Warm Pastel Advice Counter */}
        <rect x="34" y="68" width="172" height="44" rx="12" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2.5" />
        <rect x="34" y="62" width="172" height="12" rx="6" fill="#99F6E4" stroke="#0D9488" strokeWidth="2" />
        {/* Heart Sign & Flower Vase */}
        <circle cx="72" cy="52" r="9" fill="#F9A8D4" stroke="#DB2777" strokeWidth="1.5" />
        <rect x="158" y="46" width="14" height="16" rx="4" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width="240" height="135" fill="#EFF6FF" />
      <line x1="0" y1="108" x2="240" y2="108" stroke="#DBEAFE" strokeWidth="2" />
      {/* Friendly Lounge Armchairs & Round Table */}
      <rect x="22" y="56" width="54" height="52" rx="14" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="2" />
      <rect x="32" y="68" width="34" height="18" rx="6" fill="#EDE9FE" />
      <rect x="164" y="56" width="54" height="52" rx="14" fill="#7DD3FC" stroke="#0284C7" strokeWidth="2" />
      <rect x="174" y="68" width="34" height="18" rx="6" fill="#E0F2FE" />
      <rect x="88" y="76" width="64" height="12" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
      <rect x="115" y="88" width="10" height="22" fill="#94A3B8" />
      {/* Tea Cup & Cookie Plate */}
      <rect x="102" y="64" width="14" height="12" rx="3" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
      <ellipse cx="132" cy="72" rx="10" ry="4" fill="#F9A8D4" />
    </svg>
  );
};

export const AdviceCentreEnvironment: React.FC<AdviceCentreEnvironmentProps> = ({
  mode,
  avatarConfig,
  nickname,
  settings,
  onEnterInterior,
  onStartIntroDialogue,
  onFinishIntro,
}) => {
  const [extFailed, setExtFailed] = useState(false);
  const [intFailed, setIntFailed] = useState(false);
  const [activeZoneId, setActiveZoneId] = useState<string>('advice-desk');
  const [visitedZones, setVisitedZones] = useState<string[]>(['advice-desk']);
  const [introIdx, setIntroIdx] = useState(0);

  // Walkable 2x2 floor plan exploration state (matching Cyber Café & Aina's House)
  const [avatarPos, setAvatarPos] = useState<{ x: number; y: number }>({ x: 50, y: 78 });
  const [facing, setFacing] = useState<'front' | 'left' | 'right'>('front');
  const [isMoving, setIsMoving] = useState(false);
  const posRef = useRef(avatarPos);
  posRef.current = avatarPos;
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const activeRoomRef = useRef<AdviceRoomId | null>(null);
  const floorPlanRef = useRef<HTMLDivElement | null>(null);

  const visitRoom = useCallback((roomId: AdviceRoomId) => {
    setActiveZoneId(roomId);
    setVisitedZones((prev) => {
      if (prev.includes(roomId)) return prev;
      playLoginSuccess();
      return [...prev, roomId];
    });
  }, []);

  useEffect(() => {
    if (mode === 'interior-explore') {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      floorPlanRef.current?.focus({ preventScroll: true });
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== 'interior-explore') {
      keysRef.current.clear();
      setIsMoving(false);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (
        targetEl &&
        (targetEl.tagName === 'INPUT' ||
          targetEl.tagName === 'TEXTAREA' ||
          targetEl.isContentEditable)
      ) {
        return;
      }
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

    const clearKeys = () => {
      keysRef.current.clear();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== 'interior-explore') return;
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
        if (dx < -0.1) setFacing('left');
        else if (dx > 0.1) setFacing('right');
        else setFacing('front');
      } else if (targetRef.current) {
        const tx = targetRef.current.x - cur.x;
        const ty = targetRef.current.y - cur.y;
        const dist = Math.hypot(tx, ty);
        if (dist < 1.2) {
          targetRef.current = null;
        } else {
          nextX = cur.x + (tx / dist) * 36 * dt;
          nextY = cur.y + (ty / dist) * 36 * dt;
          moving = true;
          if (tx < -1) setFacing('left');
          else if (tx > 1) setFacing('right');
          else setFacing('front');
        }
      }

      if (moving) {
        const clamped = clampPositionToWalkableAdvice(nextX, nextY);
        posRef.current = clamped;
        setAvatarPos(clamped);
        setIsMoving(true);

        const roomNow = detectAdviceRoomAt(clamped.x, clamped.y);
        if (roomNow && roomNow !== activeRoomRef.current) {
          activeRoomRef.current = roomNow;
          visitRoom(roomNow);
        } else if (!roomNow && activeRoomRef.current !== null) {
          activeRoomRef.current = null;
        }
      } else {
        setIsMoving(false);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [mode, visitRoom]);

  const handleFloorPlanClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!floorPlanRef.current) return;
    const rect = floorPlanRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    targetRef.current = clampPositionToWalkableAdvice(clickX, clickY);
  };

  const walkToRoomCard = (roomId: AdviceRoomId) => {
    playSoftSelect();
    const rect = ADVICE_ROOM_RECTS.find((r) => r.id === roomId);
    if (!rect) return;
    const cur = posRef.current;
    const dist = Math.hypot(rect.centerX - cur.x, rect.centerY - cur.y);
    if (dist < 14) {
      visitRoom(roomId);
      return;
    }
    targetRef.current = { x: rect.centerX, y: rect.centerY };
  };

  const nudgeDirection = (dx: number, dy: number) => {
    targetRef.current = null;
    const cur = posRef.current;
    const clamped = clampPositionToWalkableAdvice(cur.x + dx, cur.y + dy);
    posRef.current = clamped;
    setAvatarPos(clamped);
    if (dx < 0) setFacing('left');
    else if (dx > 0) setFacing('right');
    else setFacing('front');

    const roomNow = detectAdviceRoomAt(clamped.x, clamped.y);
    if (roomNow && roomNow !== activeRoomRef.current) {
      activeRoomRef.current = roomNow;
      visitRoom(roomNow);
    } else if (!roomNow) {
      activeRoomRef.current = null;
    }
  };

  if (mode === 'exterior') {
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-6">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#F3E8FF]">
          {!extFailed ? (
            <img
              src={adviceCentreExtBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setExtFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #CCFBF1 0%, #EDE9FE 55%, #E0F2FE 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-[#0B2945]/35" />
        </div>

        <div className="relative z-10 w-full max-w-3xl rounded-[32px] border-2 border-white bg-white/92 backdrop-blur-md p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(14,53,88,0.34)] text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 border border-teal-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#0F766E]">
            <HeartHandshake className="h-4 w-4" />
            <span>DETECTIVE TOWN · ADVICE CENTRE</span>
          </div>

          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
            ADVICE CENTRE · WORDS THAT HELP
          </h2>

          <p className="text-sm sm:text-base font-semibold text-[#334155] max-w-xl mx-auto">
            Step inside the welcoming pastel Advice Centre to explore the rooms and practise
            writing real messages that ask for advice, give safe advice, and respond kindly!
          </p>

          <div className="flex items-end justify-center gap-10 py-1">
            <div className="flex flex-col items-center">
              <div className="w-24 h-30 sm:w-28 sm:h-36">
                <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />
              </div>
              <span className="rounded-full bg-purple-100 border border-purple-200 px-3 py-0.5 text-[11px] font-extrabold text-[#6D28D9]">
                {nickname}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-22 sm:w-26 sm:h-24">
                <PusheenIllustration expression="happy" pose="waving" />
              </div>
              <span className="rounded-full bg-teal-100 border border-teal-200 px-3 py-0.5 text-[11px] font-extrabold text-[#0F766E]">
                Detective Pusheen
              </span>
            </div>
          </div>

          {onEnterInterior && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onEnterInterior();
              }}
              className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#2DD4BF] to-[#0D9488] hover:from-[#5EEAD4] hover:to-[#0F766E] border border-white px-8 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>STEP INSIDE ADVICE CENTRE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'pusheen-intro') {
    const step = SCREEN07_PUSHEEN_INTRO_SCRIPT[introIdx];
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 pb-44 sm:pb-48">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#F5F3FF]">
          {!intFailed ? (
            <img
              src={adviceCentreIntBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setIntFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #EDE9FE 0%, #CCFBF1 55%, #E0F2FE 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-[#0B2945]/35" />
        </div>

        {/* Floating Mission 04 Overview Cards */}
        <div className="relative z-10 w-full max-w-4xl rounded-[30px] border-2 border-white bg-white/92 backdrop-blur-md p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C3AED]">
                MISSION 04 · WORDS THAT HELP
              </p>
              <h2 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[#0E3558]">
                Three Essential Communication Skills
              </h2>
            </div>
            <div className="w-14 h-12">
              <PusheenIllustration expression={step?.expression || 'happy'} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5">
              <p className="text-xs font-extrabold text-[#0284C7]">1 · ASKING FOR ADVICE</p>
              <p className="text-xs font-semibold text-[#334155] mt-1">
                Ask clearly when a message seems suspicious!
              </p>
            </div>
            <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3.5">
              <p className="text-xs font-extrabold text-[#7C3AED]">2 · GIVING ADVICE</p>
              <p className="text-xs font-semibold text-[#334155] mt-1">
                Use &ldquo;You should&rdquo;, &ldquo;You shouldn&apos;t&rdquo; &amp; &ldquo;You
                could&rdquo;!
              </p>
            </div>
            <div className="rounded-2xl bg-teal-50 border border-teal-200 p-3.5">
              <p className="text-xs font-extrabold text-[#0D9488]">3 · RESPONDING POLITELY</p>
              <p className="text-xs font-semibold text-[#334155] mt-1">
                Thank your helper &amp; explain your safe plan!
              </p>
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
                  introIdx + 1 < SCREEN07_PUSHEEN_INTRO_SCRIPT.length
                    ? 'NEXT'
                    : 'OPEN ADVICE LEARNING CORNER'
                }
                onReplay={() => setIntroIdx(0)}
                onSkipAll={() => onFinishIntro?.()}
                onNext={() => {
                  if (introIdx + 1 < SCREEN07_PUSHEEN_INTRO_SCRIPT.length) {
                    setIntroIdx((p) => p + 1);
                  } else {
                    onFinishIntro?.();
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  const activeZone =
    ADVICE_CENTRE_ZONES.find((z) => z.id === activeZoneId) ?? ADVICE_CENTRE_ZONES[0];

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(243,232,255,0.94) 55%, rgba(204,251,241,0.94) 100%)',
        }}
        className="aero-glass-card rounded-[32px] border-2 border-white p-4 sm:p-6 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.34)] space-y-4"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0D9488] inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>ADVICE CENTRE · EXPLORE THE ROOMS</span>
            </p>
            <h2 className="font-[var(--font-display)] text-lg sm:text-2xl font-bold text-[#0E3558]">
              Walk around with WASD / Arrows or tap each warm corner to explore!
            </h2>
          </div>

          {onStartIntroDialogue && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onStartIntroDialogue();
              }}
              className="aero-glossy-btn min-h-[46px] rounded-full bg-gradient-to-b from-[#2DD4BF] to-[#0D9488] border border-white px-6 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>MEET PUSHEEN · MISSION 04</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Walkable 2D Floor Plan Cutaway (Exact 2x2 Layout matching Cyber Café & Aina's House) */}
        <div
          ref={floorPlanRef}
          tabIndex={-1}
          onClick={handleFloorPlanClick}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[340px] rounded-[26px] border-4 border-white bg-gradient-to-b from-[#F5F3FF] via-[#ECFDF5] to-[#E0F2FE] shadow-inner overflow-hidden select-none cursor-crosshair focus:outline-none"
        >
          {/* Top Signboard Beam */}
          <div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-r from-[#A7F3D0] via-[#DDD6FE] to-[#A7F3D0] border-b border-white flex items-center justify-center">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#0F766E]">
              ADVICE CENTRE WALKABLE FLOOR PLAN · HELPFUL CORNERS
            </span>
          </div>

          {/* Central Hallway & Walkway */}
          <div
            aria-hidden="true"
            className="absolute left-[42%] top-[7%] w-[16%] h-[88%] bg-gradient-to-b from-[#FEF3C7]/70 to-[#FDE68A]/55 border-x-2 border-dashed border-amber-300/80 flex flex-col items-center justify-center"
          >
            <div className="w-full px-2 py-2 flex flex-col gap-1 items-center">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800 bg-white/85 rounded-full px-2 py-0.5">
                Hallway
              </span>
              {[0, 1, 2, 3, 4].map((stepIdx) => (
                <div
                  key={stepIdx}
                  className="w-full h-2.5 rounded-sm bg-amber-300/90 border border-amber-500/40"
                />
              ))}
            </div>
          </div>

          {/* Horizontal Divider Beam */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-[58%] top-[48%] h-[4%] bg-[#CBD5E1] border-y border-white shadow-xs"
          />
          <div
            aria-hidden="true"
            className="absolute left-[58%] right-0 top-[48%] h-[4%] bg-[#CBD5E1] border-y border-white shadow-xs"
          />

          {/* 4 Pastel Advice Centre Rooms */}
          {ADVICE_ROOM_RECTS.map((r) => {
            const zone = ADVICE_CENTRE_ZONES.find((z) => z.id === r.id)!;
            const visited = visitedZones.includes(r.id);
            const active = activeZoneId === r.id;
            const Icon =
              r.id === 'communication-wall'
                ? BookOpen
                : r.id === 'writing-corner'
                  ? PenTool
                  : r.id === 'advice-desk'
                    ? HeartHandshake
                    : Armchair;

            return (
              <button
                key={r.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToRoomCard(r.id);
                }}
                style={{
                  left: `${r.x1}%`,
                  top: `${r.y1 + 2}%`,
                  width: `${r.x2 - r.x1}%`,
                  height: `${r.y2 - r.y1 - 2}%`,
                }}
                className={`absolute rounded-[20px] border-2 bg-white/90 shadow-md overflow-hidden group cursor-pointer transition-all ${
                  active
                    ? 'border-[#0D9488] ring-2 ring-teal-300/70'
                    : 'border-white hover:border-purple-300'
                }`}
              >
                <div className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity">
                  <AdviceRoomFurnitureSvg roomId={r.id} />
                </div>

                <div className="relative z-10 m-2 flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 border border-teal-100 px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold text-[#0E3558] shadow-xs">
                    <Icon className="h-3 w-3 text-[#0D9488]" />
                    {zone.label}
                  </span>
                  {visited && (
                    <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[9px] font-extrabold text-[#15803D]">
                      Visited
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Open Doorway Thresholds */}
          <div aria-hidden="true" className="pointer-events-none">
            <div className="absolute left-[39.5%] top-[24%] w-[3%] h-[11%] rounded-sm bg-amber-200/90 border border-amber-400/70" />
            <div className="absolute left-[57.5%] top-[24%] w-[3%] h-[11%] rounded-sm bg-amber-200/90 border border-amber-400/70" />
            <div className="absolute left-[39.5%] top-[70%] w-[3%] h-[11%] rounded-sm bg-amber-200/90 border border-amber-400/70" />
            <div className="absolute left-[57.5%] top-[70%] w-[3%] h-[11%] rounded-sm bg-amber-200/90 border border-amber-400/70" />
          </div>

          {/* Walkable Player Avatar + Detective Pusheen */}
          <div
            style={{
              left: `${avatarPos.x}%`,
              top: `${avatarPos.y}%`,
              transform: 'translate(-50%, -72%)',
            }}
            className="pointer-events-none absolute z-30 flex items-end gap-1"
          >
            <div className="w-12 h-16 sm:w-16 sm:h-20 drop-shadow-lg">
              <DetectiveAvatar
                config={avatarConfig}
                view={facing}
                pose={isMoving ? 'walk' : 'idle'}
              />
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 -ml-2 mb-1 drop-shadow-md">
              <PusheenIllustration expression="happy" />
            </div>
          </div>
        </div>

        {/* Controls Bar (WASD hint + Mobile/Touch D-Pad) */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/85 border border-purple-100 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0E3558]">
            <Footprints className="h-4 w-4 text-[#0D9488]" />
            <span>
              Move with{' '}
              <kbd className="rounded bg-purple-100 px-1.5 py-0.5 text-[11px] font-extrabold">
                W A S D
              </kbd>{' '}
              or{' '}
              <kbd className="rounded bg-purple-100 px-1.5 py-0.5 text-[11px] font-extrabold">
                Arrow Keys
              </kbd>
              , or click any room to walk inside!
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Walk left"
              onClick={() => nudgeDirection(-12, 0)}
              className="h-9 w-9 rounded-xl bg-teal-100 hover:bg-teal-200 border border-teal-200 flex items-center justify-center text-[#0F766E] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Walk up"
              onClick={() => nudgeDirection(0, -14)}
              className="h-9 w-9 rounded-xl bg-teal-100 hover:bg-teal-200 border border-teal-200 flex items-center justify-center text-[#0F766E] cursor-pointer"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Walk down"
              onClick={() => nudgeDirection(0, 14)}
              className="h-9 w-9 rounded-xl bg-teal-100 hover:bg-teal-200 border border-teal-200 flex items-center justify-center text-[#0F766E] cursor-pointer"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Walk right"
              onClick={() => nudgeDirection(12, 0)}
              className="h-9 w-9 rounded-xl bg-teal-100 hover:bg-teal-200 border border-teal-200 flex items-center justify-center text-[#0F766E] cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Friendly Pusheen Room Guide */}
        <div className="rounded-2xl bg-purple-50/90 border border-purple-200 p-4 flex flex-wrap items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 shrink-0">
              <PusheenIllustration expression="encouraging" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#7C3AED]">
                {activeZone.label} ({visitedZones.length}/{ADVICE_CENTRE_ZONES.length} corners visited)
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#0E3558]">
                {activeZone.description}
              </p>
              <p className="text-xs font-semibold text-[#5B21B6] mt-0.5">
                Pusheen: &ldquo;{activeZone.pusheenNote}&rdquo;
              </p>
            </div>
          </div>

          {onStartIntroDialogue && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onStartIntroDialogue();
              }}
              className="min-h-[40px] rounded-full bg-white hover:bg-purple-100 border border-purple-300 px-4 py-1.5 text-xs font-extrabold text-[#6D28D9] cursor-pointer"
            >
              Start Mission 04 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
