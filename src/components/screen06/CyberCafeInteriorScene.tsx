import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Armchair,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Coffee,
  Cpu,
  Footprints,
  Laptop,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import cyberCafeInteriorBg from '../../assets/images/cyber_cafe_interior_1795083706722.jpg';
import {
  CAFE_COMPUTER_SEATS,
  CAFE_FLOOR_ROOMS,
  type CafeRoomDefinition,
  type CafeRoomId,
  type CafeSeatOption,
} from '../../data/screen06Data.ts';
import type { AvatarConfig, GameSettings } from '../../types/game.ts';
import {
  playErrorTone,
  playLoginSuccess,
  playPortalOpen,
  playSoftSelect,
  playVictorySound,
} from '../../utils/soundEffects.ts';
import { ByteIllustration } from '../game/ByteIllustration.tsx';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface CyberCafeInteriorSceneProps {
  mode: 'exterior' | 'interior-explore' | 'meet-byte' | 'seat-select' | 'workstation-ready';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  selectedSeatId: string | null;
  onEnterCafe?: () => void;
  onStartMeetByte?: () => void;
  onSeatSelected?: (seatId: string) => void;
  onBeginMission03?: () => void;
}

const CafeRoomFurnitureSvg: React.FC<{ roomId: CafeRoomId }> = ({ roomId }) => {
  if (roomId === 'computer-stations') {
    return (
      <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="0" y="0" width="240" height="135" fill="#EFF6FF" />
        <line x1="0" y1="108" x2="240" y2="108" stroke="#DBEAFE" strokeWidth="2" />
        {/* Long Computer Desk */}
        <rect x="16" y="76" width="208" height="12" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
        <rect x="26" y="88" width="10" height="28" fill="#94A3B8" />
        <rect x="204" y="88" width="10" height="28" fill="#94A3B8" />
        {/* Twin Glowing Aqua Monitors */}
        <rect x="34" y="38" width="66" height="36" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
        <rect x="40" y="43" width="54" height="25" rx="3" fill="#BAE6FD" />
        <rect x="61" y="74" width="12" height="4" fill="#64748B" />
        <rect x="136" y="38" width="66" height="36" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
        <rect x="142" y="43" width="54" height="25" rx="3" fill="#A5F3FC" />
        <rect x="163" y="74" width="12" height="4" fill="#64748B" />
        {/* Chairs */}
        <rect x="48" y="92" width="38" height="18" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
        <rect x="150" y="92" width="38" height="18" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
      </svg>
    );
  }

  if (roomId === 'robotics-corner') {
    return (
      <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="0" y="0" width="240" height="135" fill="#ECFEFF" />
        <line x1="0" y1="108" x2="240" y2="108" stroke="#CFFAFE" strokeWidth="2" />
        {/* Glass Window & Server Rack */}
        <rect x="18" y="18" width="46" height="94" rx="6" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
        <circle cx="30" cy="34" r="3.5" fill="#22C55E" />
        <circle cx="42" cy="34" r="3.5" fill="#38BDF8" />
        <rect x="26" y="46" width="30" height="8" rx="2" fill="#BAE6FD" />
        <rect x="26" y="60" width="30" height="8" rx="2" fill="#BAE6FD" />
        {/* Byte Diagnostic Console & Dock */}
        <rect x="86" y="32" width="130" height="46" rx="8" fill="#0F172A" stroke="#06B6D4" strokeWidth="2.5" />
        <rect x="94" y="40" width="54" height="30" rx="4" fill="#67E8F9" />
        <rect x="156" y="40" width="52" height="30" rx="4" fill="#A7F3D0" />
        <rect x="82" y="84" width="138" height="28" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
      </svg>
    );
  }

  if (roomId === 'seating-lounge') {
    return (
      <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="0" y="0" width="240" height="135" fill="#F5F3FF" />
        <line x1="0" y1="108" x2="240" y2="108" stroke="#EDE9FE" strokeWidth="2" />
        {/* Hanging Cafe Pendant Lamps */}
        <line x1="72" y1="0" x2="72" y2="26" stroke="#94A3B8" strokeWidth="2" />
        <ellipse cx="72" cy="30" rx="14" ry="7" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
        <line x1="172" y1="0" x2="172" y2="26" stroke="#94A3B8" strokeWidth="2" />
        <ellipse cx="172" cy="30" rx="14" ry="7" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
        {/* Booth Sofa Left + Round Cafe Table */}
        <rect x="16" y="60" width="52" height="50" rx="10" fill="#A78BFA" stroke="#6D28D9" strokeWidth="2" />
        <rect x="24" y="70" width="18" height="16" rx="4" fill="#FDE68A" />
        <rect x="74" y="76" width="56" height="10" rx="5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
        <rect x="97" y="86" width="10" height="24" fill="#94A3B8" />
        <rect x="85" y="64" width="12" height="12" rx="3" fill="#FB7185" />
        <rect x="106" y="64" width="12" height="12" rx="3" fill="#38BDF8" />
        {/* Booth Sofa Right + Extra Chairs */}
        <rect x="136" y="62" width="86" height="46" rx="12" fill="#7DD3FC" stroke="#0284C7" strokeWidth="2.5" />
        <rect x="148" y="52" width="62" height="16" rx="7" fill="#38BDF8" />
        <rect x="150" y="70" width="16" height="13" rx="4" fill="#F9A8D4" />
        <rect x="192" y="70" width="16" height="13" rx="4" fill="#FDE047" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 135" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width="240" height="135" fill="#FFFBEB" />
      <line x1="0" y1="108" x2="240" y2="108" stroke="#FEF3C7" strokeWidth="2" />
      {/* Menu Board */}
      <rect x="26" y="18" width="96" height="36" rx="6" fill="#0F172A" stroke="#F59E0B" strokeWidth="2.5" />
      <line x1="38" y1="30" x2="108" y2="30" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="42" x2="90" y2="42" stroke="#67E8F9" strokeWidth="3" strokeLinecap="round" />
      {/* Snack Bar Counter */}
      <rect x="20" y="72" width="144" height="40" rx="8" fill="#FFFFFF" stroke="#D97706" strokeWidth="2.5" />
      <rect x="20" y="66" width="144" height="12" rx="4" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      {/* Blender & Smoothie Cups */}
      <rect x="44" y="42" width="20" height="24" rx="4" fill="#FB7185" stroke="#BE123C" strokeWidth="1.5" />
      <rect x="86" y="48" width="14" height="18" rx="3" fill="#34D399" />
      <rect x="108" y="48" width="14" height="18" rx="3" fill="#38BDF8" />
      {/* Cafe Stools */}
      <circle cx="192" cy="84" r="14" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
      <rect x="188" y="96" width="8" height="18" fill="#94A3B8" />
    </svg>
  );
};

interface CafeRoomRect {
  id: CafeRoomId;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  centerX: number;
  centerY: number;
}

const CAFE_ROOM_RECTS: CafeRoomRect[] = [
  { id: 'computer-stations', x1: 3, y1: 6, x2: 40, y2: 45, centerX: 24, centerY: 28 },
  { id: 'robotics-corner', x1: 60, y1: 6, x2: 97, y2: 45, centerX: 76, centerY: 28 },
  { id: 'seating-lounge', x1: 3, y1: 55, x2: 40, y2: 94, centerX: 24, centerY: 75 },
  { id: 'snack-bar', x1: 60, y1: 55, x2: 97, y2: 94, centerX: 76, centerY: 75 },
];

function detectCafeRoomAt(x: number, y: number): CafeRoomId | null {
  for (const r of CAFE_ROOM_RECTS) {
    if (x >= r.x1 && x <= r.x2 - 2 && y >= r.y1 && y <= r.y2) {
      return r.id;
    }
  }
  return null;
}

function clampPositionToWalkableCafe(x: number, y: number): { x: number; y: number } {
  const nx = Math.max(8, Math.min(92, x));
  let ny = Math.max(15, Math.min(88, y));

  // Floor divider between upper floor (y < 46) and ground floor (y > 54) except central walkway/stairs (42 <= x <= 58)
  const inWalkwayColumn = nx >= 42 && nx <= 58;
  if (!inWalkwayColumn && ny > 44 && ny < 58) {
    ny = ny < 51 ? 44 : 58;
  }

  return { x: nx, y: ny };
}

export const CyberCafeInteriorScene: React.FC<CyberCafeInteriorSceneProps> = ({
  mode,
  avatarConfig,
  nickname,
  settings,
  selectedSeatId,
  onEnterCafe,
  onStartMeetByte,
  onSeatSelected,
  onBeginMission03,
}) => {
  const [bgFailed, setBgFailed] = useState(false);

  // Walkable floor plan exploration state (matching Aina's House layout & controls)
  const [wrongBanner, setWrongBanner] = useState<{ roomName: string; message: string } | null>(null);
  const [checkedWrongRooms, setCheckedWrongRooms] = useState<CafeRoomId[]>([]);
  const [foundByte, setFoundByte] = useState<boolean>(false);

  const [avatarPos, setAvatarPos] = useState<{ x: number; y: number }>({ x: 50, y: 78 });
  const [facing, setFacing] = useState<'front' | 'left' | 'right'>('front');
  const [isMoving, setIsMoving] = useState(false);
  const posRef = useRef(avatarPos);
  posRef.current = avatarPos;
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const activeRoomRef = useRef<CafeRoomId | null>(null);
  const foundByteRef = useRef(foundByte);
  foundByteRef.current = foundByte;
  const floorPlanRef = useRef<HTMLDivElement | null>(null);

  // Seat selection feedback
  const [occupiedAlert, setOccupiedAlert] = useState<string | null>(null);
  const [connectingSeat, setConnectingSeat] = useState<CafeSeatOption | null>(null);

  const triggerAreaVisit = useCallback((roomId: CafeRoomId) => {
    if (foundByteRef.current) return;
    const room = CAFE_FLOOR_ROOMS.find((r) => r.id === roomId);
    if (!room) return;

    if (!room.isByteHere) {
      playErrorTone();
      targetRef.current = null;
      setWrongBanner({
        roomName: room.name,
        message: room.wrongRoomMessage || "No, Byte is not here. Let's find him again!",
      });
      setCheckedWrongRooms((prev) => (prev.includes(room.id) ? prev : [...prev, room.id]));
      return;
    }

    playVictorySound();
    targetRef.current = null;
    setWrongBanner(null);
    setFoundByte(true);
  }, []);

  // Auto-focus floor plan when entering interior exploration so WASD works immediately
  useEffect(() => {
    if (mode === 'interior-explore' && !foundByte) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      floorPlanRef.current?.focus({ preventScroll: true });
    }
  }, [mode, foundByte]);

  // WASD + Arrow keys when exploring Cyber Cafe floor plan
  useEffect(() => {
    if (mode !== 'interior-explore' || foundByte) {
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
  }, [mode, foundByte]);

  // Smooth movement loop (WASD + click-to-walk)
  useEffect(() => {
    if (mode !== 'interior-explore' || foundByte) return;

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
        const speed = 34;
        nextX = cur.x + (dx / len) * speed * dt;
        nextY = cur.y + (dy / len) * speed * dt;
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
          const speed = 36;
          nextX = cur.x + (tx / dist) * speed * dt;
          nextY = cur.y + (ty / dist) * speed * dt;
          moving = true;
          if (tx < -1) setFacing('left');
          else if (tx > 1) setFacing('right');
          else setFacing('front');
        }
      }

      if (moving) {
        const clamped = clampPositionToWalkableCafe(nextX, nextY);
        posRef.current = clamped;
        setAvatarPos(clamped);
        setIsMoving(true);

        const roomNow = detectCafeRoomAt(clamped.x, clamped.y);
        if (roomNow && roomNow !== activeRoomRef.current) {
          activeRoomRef.current = roomNow;
          triggerAreaVisit(roomNow);
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
  }, [mode, foundByte, triggerAreaVisit]);

  const handleFloorPlanClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (foundByte || !floorPlanRef.current) return;
    const rect = floorPlanRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    targetRef.current = clampPositionToWalkableCafe(clickX, clickY);
  };

  const walkToRoomCard = (room: CafeRoomDefinition) => {
    if (foundByte) return;
    playSoftSelect();
    const rect = CAFE_ROOM_RECTS.find((r) => r.id === room.id);
    if (!rect) return;
    const cur = posRef.current;
    const dist = Math.hypot(rect.centerX - cur.x, rect.centerY - cur.y);
    if (dist < 14) {
      triggerAreaVisit(room.id);
      return;
    }
    targetRef.current = { x: rect.centerX, y: rect.centerY };
  };

  const nudgeDirection = (dx: number, dy: number) => {
    if (foundByte) return;
    targetRef.current = null;
    const cur = posRef.current;
    const clamped = clampPositionToWalkableCafe(cur.x + dx, cur.y + dy);
    posRef.current = clamped;
    setAvatarPos(clamped);
    if (dx < 0) setFacing('left');
    else if (dx > 0) setFacing('right');
    else setFacing('front');

    const roomNow = detectCafeRoomAt(clamped.x, clamped.y);
    if (roomNow && roomNow !== activeRoomRef.current) {
      activeRoomRef.current = roomNow;
      triggerAreaVisit(roomNow);
    } else if (!roomNow) {
      activeRoomRef.current = null;
    }
  };

  const handleSeatClick = (seat: CafeSeatOption) => {
    if (connectingSeat) return;

    if (seat.occupied) {
      playErrorTone();
      setOccupiedAlert('Oops! Someone is already using this computer. Try another seat!');
      return;
    }

    setOccupiedAlert(null);
    playLoginSuccess();
    setConnectingSeat(seat);

    const delay = settings.reducedMotion ? 260 : 950;
    window.setTimeout(() => {
      playPortalOpen();
      setConnectingSeat(null);
      onSeatSelected?.(seat.id);
    }, delay);
  };

  if (mode === 'exterior') {
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-6">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#E0F2FE]">
          {!bgFailed ? (
            <img
              src={cyberCafeInteriorBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setBgFailed(true)}
              className="w-full h-full object-cover object-center blur-[3px] scale-105 opacity-75"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #BAE6FD 0%, #E0F2FE 55%, #ECFEFF 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/25 via-transparent to-[#0B2945]/40" />
        </div>

        <div className="relative z-10 w-full max-w-3xl rounded-[32px] border-2 border-white bg-white/92 backdrop-blur-md p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(14,53,88,0.35)] text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 border border-cyan-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#0369A1]">
            <Coffee className="h-4 w-4" />
            <span>DETECTIVE TOWN · CYBER CAFÉ ARRIVAL</span>
          </div>

          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
            WELCOME TO THE CYBER CAFÉ!
          </h2>

          <p className="text-sm sm:text-base font-semibold text-[#334155] max-w-xl mx-auto">
            Inside this bright digital café, Byte the Robot needs your help checking real-looking
            digital messages to see which ones are safe, suspicious, or need more information!
          </p>

          <div className="flex items-end justify-center gap-10 py-2">
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
                <PusheenIllustration expression="excited" pose="waving" />
              </div>
              <span className="rounded-full bg-sky-100 border border-sky-200 px-3 py-0.5 text-[11px] font-extrabold text-[#0369A1]">
                Detective Pusheen
              </span>
            </div>
          </div>

          {onEnterCafe && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onEnterCafe();
              }}
              className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] hover:from-[#60A5FA] hover:to-[#0369A1] border border-white px-8 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>ENTER CYBER CAFÉ</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'meet-byte') {
    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-end pb-44 sm:pb-48">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#E0F2FE]">
          {!bgFailed ? (
            <img
              src={cyberCafeInteriorBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setBgFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #E0F2FE 0%, #CFFAFE 55%, #F0FDF4 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-[#0B2945]/35" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-14 flex items-end justify-between gap-4">
          <div className="flex items-end gap-4">
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
                <PusheenIllustration expression="happy" />
              </div>
              <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-extrabold text-[#0369A1] shadow">
                Pusheen
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-28 h-30 sm:w-36 sm:h-38 drop-shadow-xl">
              <ByteIllustration expression="happy" pose="waving" />
            </div>
            <span className="rounded-full bg-white/95 px-3 py-0.5 text-[11px] font-extrabold text-[#0284C7] shadow">
              Byte the Robot
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'workstation-ready') {
    const chosenSeat =
      CAFE_COMPUTER_SEATS.find((s) => s.id === selectedSeatId) ?? CAFE_COMPUTER_SEATS[1];

    return (
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-6">
        <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#E0F2FE]">
          {!bgFailed && (
            <img
              src={cyberCafeInteriorBg}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setBgFailed(true)}
              className="w-full h-full object-cover object-center opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-[#0B2945]/45 backdrop-blur-xs" />
        </div>

        <div className="relative z-10 w-full max-w-2xl rounded-[32px] border-2 border-cyan-200 bg-white/96 p-6 sm:p-8 shadow-2xl text-center space-y-5">
          <div className="mx-auto w-24 h-24">
            <ByteIllustration expression="celebrating" pose="investigating" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
            <CheckCircle2 className="h-4 w-4" />
            <span>WORKSTATION CONNECTED!</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
              {chosenSeat.label} · {chosenSeat.stationName}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-[#334155]">
              Monitor synced with Byte&apos;s security terminal! Let&apos;s begin{' '}
              <span className="font-extrabold text-[#0284C7]">
                MISSION 03: THE DIGITAL MESSAGE FILES
              </span>{' '}
              and classify all 10 message cases!
            </p>
          </div>

          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 text-xs sm:text-sm font-bold text-[#0369A1]">
            Remember: Look at the SENDER, MESSAGE BODY, REQUESTS, and LINKS before choosing SAFE,
            SUSPICIOUS, or NEED MORE INFORMATION.
          </div>

          {onBeginMission03 && (
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                onBeginMission03();
              }}
              className="aero-glossy-btn min-h-[50px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] border border-white px-8 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>START MISSION 03 · 10 CASES</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Exact Aina's House Walkable 2D Floor Plan Cutaway when mode === 'interior-explore'
  if (mode === 'interior-explore') {
    return (
      <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div
          style={{
            background:
              'linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(224,242,254,0.94) 55%, rgba(236,254,255,0.94) 100%)',
          }}
          className="aero-glass-card rounded-[32px] border-2 border-white p-4 sm:p-6 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.35)] space-y-4"
        >
          <div className="relative z-10 space-y-3.5">
            {/* Header matching Aina's House */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0284C7] inline-flex items-center gap-1.5">
                  <Coffee className="h-3.5 w-3.5" />
                  <span>CYBER CAFÉ · EXPLORE ROOMS</span>
                </p>
                <h2 className="font-[var(--font-display)] text-lg sm:text-2xl font-bold text-[#0E3558]">
                  {foundByte
                    ? 'YOU FOUND BYTE THE ROBOT!'
                    : 'Walk around with WASD / Arrows or click a café area to find Byte!'}
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-sky-50 border border-sky-200 px-3 py-1.5">
                <div className="w-8 h-8 shrink-0">
                  <PusheenIllustration
                    expression={foundByte ? 'celebrating' : wrongBanner ? 'encouraging' : 'curious'}
                  />
                </div>
                <span className="text-xs font-bold text-[#0369A1]">
                  {foundByte
                    ? "That's Byte! Let's talk to him!"
                    : wrongBanner
                      ? wrongBanner.message
                      : 'Use WASD / Arrows to explore the seating area & café rooms!'}
                </span>
              </div>
            </div>

            {!foundByte ? (
              <>
                {/* Wrong-Area Inline Alert Message */}
                {wrongBanner && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-[#FFE4E6] via-[#FFF1F2] to-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-[#E11D48] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                        !
                      </div>
                      <div className="text-left">
                        <p className="text-xs sm:text-sm font-extrabold text-[#9F1239]">
                          {wrongBanner.message}
                        </p>
                        <p className="text-[11px] font-semibold text-[#475569]">
                          Checked {wrongBanner.roomName}. Keep exploring to find Byte the Robot!
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playSoftSelect();
                        setWrongBanner(null);
                      }}
                      className="rounded-full bg-white border border-rose-200 px-3 py-1 text-[11px] font-extrabold text-[#BE123C] cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Walkable 2D Floor Plan Stage (Exact 2x2 Cutaway Layout of Aina's House) */}
                <div
                  ref={floorPlanRef}
                  tabIndex={-1}
                  onClick={handleFloorPlanClick}
                  className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[340px] rounded-[26px] border-4 border-white bg-gradient-to-b from-[#E0F2FE] via-[#ECFEFF] to-[#F5F3FF] shadow-inner overflow-hidden select-none cursor-crosshair focus:outline-none"
                >
                  {/* Top Signboard Beam */}
                  <div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-r from-[#7DD3FC] via-[#A5F3FC] to-[#7DD3FC] border-b border-white flex items-center justify-center">
                    <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#0C4A6E]">
                      CYBER CAFÉ WALKABLE FLOOR PLAN · UPPER &amp; GROUND AREAS
                    </span>
                  </div>

                  {/* Central Hallway & Walkway Stairs */}
                  <div
                    aria-hidden="true"
                    className="absolute left-[42%] top-[7%] w-[16%] h-[88%] bg-gradient-to-b from-[#FEF3C7]/70 to-[#FDE68A]/55 border-x-2 border-dashed border-amber-300/80 flex flex-col items-center justify-center"
                  >
                    <div className="w-full px-2 py-2 flex flex-col gap-1 items-center">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800 bg-white/80 rounded-full px-2 py-0.5">
                        Aisle
                      </span>
                      {[0, 1, 2, 3, 4].map((stepIdx) => (
                        <div
                          key={stepIdx}
                          className="w-full h-2.5 rounded-sm bg-amber-300/90 border border-amber-500/40"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Horizontal Floor Divider Beam (left & right wings) */}
                  <div
                    aria-hidden="true"
                    className="absolute left-0 right-[58%] top-[48%] h-[4%] bg-[#CBD5E1] border-y border-white shadow-xs"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute left-[58%] right-0 top-[48%] h-[4%] bg-[#CBD5E1] border-y border-white shadow-xs"
                  />

                  {/* 4 Walkable Cafe Areas (Equal Visual Weight — no glow spoiler) */}
                  {CAFE_FLOOR_ROOMS.map((room) => {
                    const r = CAFE_ROOM_RECTS.find((item) => item.id === room.id)!;
                    const alreadyCheckedWrong = checkedWrongRooms.includes(room.id);
                    const Icon =
                      room.id === 'computer-stations'
                        ? Laptop
                        : room.id === 'robotics-corner'
                          ? Cpu
                          : room.id === 'seating-lounge'
                            ? Armchair
                            : Coffee;

                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          walkToRoomCard(room);
                        }}
                        style={{
                          left: `${r.x1}%`,
                          top: `${r.y1 + 2}%`,
                          width: `${r.x2 - r.x1}%`,
                          height: `${r.y2 - r.y1 - 2}%`,
                        }}
                        className="absolute rounded-[20px] border-2 border-white bg-white/90 hover:border-sky-300 shadow-md overflow-hidden group cursor-pointer transition-shadow"
                      >
                        <div className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity">
                          <CafeRoomFurnitureSvg roomId={room.id} />
                        </div>

                        {/* Room Label Pill */}
                        <div className="relative z-10 m-2 flex items-center justify-between gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 border border-sky-100 px-2.5 py-0.5 text-[10px] sm:text-xs font-extrabold text-[#0E3558] shadow-xs">
                            <Icon className="h-3 w-3 text-[#0284C7]" />
                            {room.name}
                          </span>
                          {alreadyCheckedWrong && (
                            <span className="rounded-full bg-rose-100 border border-rose-300 px-2 py-0.5 text-[9px] font-extrabold text-[#BE123C]">
                              Not here
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Warm Open Doorway Thresholds connecting Walkway & Cafe Areas */}
                  <div aria-hidden="true" className="pointer-events-none">
                    <div className="absolute left-[39.5%] top-[24%] w-[3%] h-[11%] rounded-sm bg-amber-200/90 border border-amber-400/70" />
                    <div className="absolute left-[57.5%] top-[24%] w-[3%] h-[11%] rounded-sm bg-amber-200/90 border border-amber-400/70" />
                    <div className="absolute left-[39.5%] top-[70%] w-[3%] h-[11%] rounded-sm bg-amber-200/90 border border-amber-400/70" />
                    <div className="absolute left-[57.5%] top-[70%] w-[3%] h-[11%] rounded-sm bg-amber-200/90 border border-amber-400/70" />
                  </div>

                  {/* Walkable Player Avatar + Detective Pusheen Follower */}
                  <div
                    style={{
                      left: `${avatarPos.x}%`,
                      top: `${avatarPos.y}%`,
                      transform: 'translate(-50%, -72%)',
                    }}
                    className="pointer-events-none absolute z-30 flex flex-col items-center"
                  >
                    {wrongBanner && (
                      <div className="mb-1 whitespace-nowrap rounded-full bg-white/98 border-2 border-rose-300 px-3 py-1 text-[10px] sm:text-xs font-extrabold text-[#9F1239] shadow-lg">
                        {wrongBanner.message}
                      </div>
                    )}
                    <div className="flex items-end gap-1">
                      <div className="w-12 h-16 sm:w-16 sm:h-20 drop-shadow-lg">
                        <DetectiveAvatar
                          config={avatarConfig}
                          view={facing}
                          pose={isMoving ? 'walk' : 'idle'}
                        />
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 -ml-2 mb-1 drop-shadow-md">
                        <PusheenIllustration expression={wrongBanner ? 'encouraging' : 'curious'} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls Bar (WASD hint + Mobile/Touch D-Pad) */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/85 border border-sky-100 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0E3558]">
                    <Footprints className="h-4 w-4 text-[#0284C7]" />
                    <span>
                      Move with{' '}
                      <kbd className="rounded bg-sky-100 px-1.5 py-0.5 text-[11px] font-extrabold">
                        W A S D
                      </kbd>{' '}
                      or{' '}
                      <kbd className="rounded bg-sky-100 px-1.5 py-0.5 text-[11px] font-extrabold">
                        Arrow Keys
                      </kbd>
                      , or tap any café room to walk inside and look for Byte!
                    </span>
                  </div>

                  {/* Touch / Click D-Pad */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Walk left"
                      onClick={() => nudgeDirection(-12, 0)}
                      className="h-9 w-9 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-200 flex items-center justify-center text-[#0369A1] cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Walk up"
                      onClick={() => nudgeDirection(0, -14)}
                      className="h-9 w-9 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-200 flex items-center justify-center text-[#0369A1] cursor-pointer"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Walk down"
                      onClick={() => nudgeDirection(0, 14)}
                      className="h-9 w-9 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-200 flex items-center justify-center text-[#0369A1] cursor-pointer"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Walk right"
                      onClick={() => nudgeDirection(12, 0)}
                      className="h-9 w-9 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-200 flex items-center justify-center text-[#0369A1] cursor-pointer"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Found Byte the Robot Celebration Reveal */
              <div className="rounded-[26px] border-2 border-cyan-200 bg-gradient-to-b from-cyan-50/90 to-sky-50/90 p-5 sm:p-7 flex flex-col items-center text-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
                  <Sparkles className="h-4 w-4" />
                  <span>YOU FOUND BYTE THE ROBOT!</span>
                </div>

                <div className="flex items-end justify-center gap-6 py-1">
                  <div className="w-24 h-28 drop-shadow-xl">
                    <ByteIllustration expression="celebrating" pose="waving" />
                  </div>
                  <div className="w-20 h-18 drop-shadow-lg">
                    <PusheenIllustration expression="happy" pose="waving" />
                  </div>
                </div>

                <div className="max-w-lg rounded-2xl bg-white border border-cyan-200 px-4 py-3 text-xs sm:text-sm font-bold text-[#0E3558]">
                  <span className="text-[#0284C7]">Byte:</span> &ldquo;Beep-boop! You found me in the
                  Robotics Control Corner! Ready to help me check our Cyber Café message files?&rdquo;
                </div>

                {onStartMeetByte && (
                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      onStartMeetByte();
                    }}
                    className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] border border-white px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>TALK TO BYTE</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 'seat-select' stage
  return (
    <div className="relative z-20 w-full max-w-6xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.35)] p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0284C7] inline-flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5" />
              <span>CYBER CAFÉ · STEP 2: CHOOSE AN EMPTY COMPUTER SEAT</span>
            </p>
            <h2 className="font-[var(--font-display)] text-lg sm:text-2xl font-bold text-[#0E3558]">
              Select an empty computer station to connect with Byte!
            </h2>
          </div>
        </div>

        <div className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[380px] rounded-[24px] border-2 border-sky-200 overflow-hidden bg-[#E0F2FE] shadow-inner select-none">
          {!bgFailed ? (
            <img
              src={cyberCafeInteriorBg}
              alt="Cyber Café interior"
              referrerPolicy="no-referrer"
              onError={() => setBgFailed(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(155deg, #BAE6FD 0%, #E0F2FE 55%, #ECFDF5 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2945]/45 via-transparent to-white/15" />

          {/* Byte standing by his central workstation */}
          <div
            style={{ left: '47%', top: '34%', transform: 'translate(-50%, -50%)' }}
            className="pointer-events-none absolute z-10 flex flex-col items-center"
          >
            <div className="w-14 h-16 sm:w-20 sm:h-22 drop-shadow-xl">
              <ByteIllustration expression="happy" pose="waving" />
            </div>
            <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-extrabold text-[#0284C7] shadow">
              Byte
            </span>
          </div>

          {CAFE_COMPUTER_SEATS.map((seat) => {
            const isConnecting = connectingSeat?.id === seat.id;
            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => handleSeatClick(seat)}
                style={{
                  left: `${seat.xPct}%`,
                  top: `${seat.yPct}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-20 rounded-2xl border-2 px-3 py-2 shadow-lg text-left min-w-[128px] sm:min-w-[155px] cursor-pointer transition-transform hover:scale-105 ${
                  seat.occupied
                    ? 'bg-rose-50/95 border-rose-300 text-[#9F1239]'
                    : isConnecting
                      ? 'bg-emerald-500 border-white text-white ring-4 ring-emerald-300'
                      : 'bg-white/95 border-emerald-400 text-[#0E3558] ring-4 ring-emerald-300/50'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[11px] font-extrabold inline-flex items-center gap-1">
                    {seat.occupied ? (
                      <UserCheck className="h-3.5 w-3.5 text-[#E11D48]" />
                    ) : (
                      <Laptop className="h-3.5 w-3.5 text-[#059669]" />
                    )}
                    {seat.label}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                      seat.occupied
                        ? 'bg-rose-200 text-[#9F1239]'
                        : 'bg-emerald-100 text-[#15803D]'
                    }`}
                  >
                    {seat.occupied ? `Used (${seat.occupantName})` : 'Empty'}
                  </span>
                </div>
                <p className="text-[10px] font-semibold opacity-85 mt-0.5 truncate">
                  {seat.stationName}
                </p>
              </button>
            );
          })}

          <div
            style={{
              left: `${connectingSeat ? connectingSeat.xPct : 50}%`,
              top: `${connectingSeat ? connectingSeat.yPct + 12 : 76}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="pointer-events-none absolute z-30 transition-all duration-500 flex items-end"
          >
            <div className="w-12 h-16 sm:w-16 sm:h-20 drop-shadow-xl">
              <DetectiveAvatar
                config={avatarConfig}
                view="front"
                pose={connectingSeat ? 'walk' : 'idle'}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {occupiedAlert && (
            <div
              role="alert"
              className="rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 flex items-center gap-3 text-left"
            >
              <AlertCircle className="h-5 w-5 text-[#E11D48] shrink-0" />
              <p className="text-xs sm:text-sm font-extrabold text-[#9F1239]">{occupiedAlert}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {CAFE_COMPUTER_SEATS.map((seat) => (
              <button
                key={seat.id}
                type="button"
                onClick={() => handleSeatClick(seat)}
                className={`rounded-2xl border-2 p-3 text-left cursor-pointer transition-all ${
                  seat.occupied
                    ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300'
                    : 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-500 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0E3558]">{seat.label}</span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      seat.occupied
                        ? 'bg-rose-200 text-[#9F1239]'
                        : 'bg-emerald-200 text-[#14532D]'
                    }`}
                  >
                    {seat.occupied ? 'Occupied' : 'Available'}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#334155] mt-1">{seat.stationName}</p>
                <p className="text-[11px] font-medium text-[#475569] mt-0.5">{seat.seatNote}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
