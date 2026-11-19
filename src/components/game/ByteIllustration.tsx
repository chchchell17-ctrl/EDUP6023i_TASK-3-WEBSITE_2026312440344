import React, { useId } from 'react';
import type { DialogueExpression } from '../../types/game.ts';

interface ByteIllustrationProps {
  expression?: DialogueExpression;
  pose?: 'idle' | 'waving' | 'investigating';
  className?: string;
}

export const ByteIllustration: React.FC<ByteIllustrationProps> = ({
  expression = 'happy',
  pose = 'idle',
  className = 'w-full h-full',
}) => {
  const uid = useId().replace(/:/g, '');
  const isWorried = expression === 'worried' || expression === 'thinking';
  const isSurprised = expression === 'surprised';
  const isCelebrating = expression === 'celebrating' || expression === 'excited';

  return (
    <svg
      viewBox="0 0 160 175"
      className={className}
      role="img"
      aria-label={`Byte the Robot (${expression})`}
    >
      <defs>
        <radialGradient id={`${uid}-aura`} cx="0.5" cy="0.45" r="0.56">
          <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.88" />
          <stop offset="65%" stopColor="#E0F2FE" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-shell`} cx="0.35" cy="0.25" r="0.78">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="56%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#67C6F7" />
        </radialGradient>
        <linearGradient id={`${uid}-visor`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#091124" />
          <stop offset="60%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E3A5F" />
        </linearGradient>
        <linearGradient id={`${uid}-accent`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="55%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id={`${uid}-amber`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="55%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <radialGradient id={`${uid}-eye-glow`} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Luminous Halo & Soft Ground Shadow */}
      <circle cx="80" cy="92" r="72" fill={`url(#${uid}-aura)`} />
      <ellipse cx="80" cy="164" rx="42" ry="6" fill="#0369A1" opacity="0.22" />

      {/* Top Antenna with Glowing Bulb */}
      <line x1="80" y1="22" x2="80" y2="38" stroke="#0284C7" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="80" cy="17" r="13" fill={isWorried ? '#FDBA74' : '#FDE047'} opacity={isCelebrating ? 0.45 : 0.25} />
      <circle
        cx="80"
        cy="17"
        r="7.5"
        fill={isWorried ? '#FB923C' : `url(#${uid}-amber)`}
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />
      <circle cx="77.5" cy="14.5" r="2" fill="#FFFFFF" opacity="0.8" />

      {/* Left Arm */}
      <path
        d={pose === 'waving' ? 'M38 112 Q18 82 26 62' : 'M38 116 Q24 128 32 142'}
        fill="none"
        stroke={`url(#${uid}-accent)`}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle
        cx={pose === 'waving' ? 26 : 32}
        cy={pose === 'waving' ? 60 : 142}
        r="7"
        fill={`url(#${uid}-shell)`}
        stroke="#0284C7"
        strokeWidth="3"
      />

      {/* Right Arm */}
      <path
        d={pose === 'investigating' ? 'M122 114 Q142 98 134 78' : 'M122 116 Q136 128 128 142'}
        fill="none"
        stroke={`url(#${uid}-accent)`}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle
        cx={pose === 'investigating' ? 134 : 128}
        cy={pose === 'investigating' ? 76 : 142}
        r="7"
        fill={`url(#${uid}-shell)`}
        stroke="#0284C7"
        strokeWidth="3"
      />

      {/* Optional Magnifying Glass */}
      {pose === 'investigating' && (
        <g transform="translate(132, 62)">
          <circle cx="0" cy="0" r="12" fill="#BAE6FD" fillOpacity="0.6" stroke="#F59E0B" strokeWidth="3.5" />
          <path d="M-5,-5 Q0,-8 5,-4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="-8" y1="8" x2="-15" y2="16" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {/* Ear Audio Pods */}
      <rect x="24" y="58" width="12" height="28" rx="6" fill={`url(#${uid}-accent)`} stroke="#FFFFFF" strokeWidth="2" />
      <rect x="124" y="58" width="12" height="28" rx="6" fill={`url(#${uid}-accent)`} stroke="#FFFFFF" strokeWidth="2" />

      {/* Robot Body */}
      <rect
        x="42"
        y="104"
        width="76"
        height="52"
        rx="22"
        fill={`url(#${uid}-shell)`}
        stroke="#FFFFFF"
        strokeWidth="3"
      />
      {/* Chest Detective Core */}
      <rect
        x="56"
        y="115"
        width="48"
        height="28"
        rx="10"
        fill="#BAE6FD"
        stroke="#0284C7"
        strokeWidth="2"
      />
      <circle cx="80" cy="129" r="8" fill={`url(#${uid}-amber)`} stroke="#FFFFFF" strokeWidth="2" />
      <path
        d="M80 124 L81.8 127.6 L85.6 128 L82.8 130.6 L83.6 134.4 L80 132.4 L76.4 134.4 L77.2 130.6 L74.4 128 L78.2 127.6 Z"
        fill="#FFFFFF"
      />

      {/* Robot Rounded Head */}
      <rect
        x="34"
        y="36"
        width="92"
        height="68"
        rx="28"
        fill={`url(#${uid}-shell)`}
        stroke="#FFFFFF"
        strokeWidth="3.5"
      />
      <path
        d="M46 43 Q80 38 112 43"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.85"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Glossy Visor Screen */}
      <rect
        x="44"
        y="46"
        width="72"
        height="48"
        rx="18"
        fill={`url(#${uid}-visor)`}
        stroke="#38BDF8"
        strokeWidth="2.5"
      />

      {/* Visor Highlight Streak */}
      <path
        d="M52 52 Q80 48 106 53"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.28"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line x1="50" y1="84" x2="68" y2="50" stroke="#FFFFFF" strokeOpacity="0.09" strokeWidth="8" strokeLinecap="round" />

      {/* Digital Eyes with Soft Screen Glow */}
      {isWorried ? (
        <>
          <rect x="57" y="63" width="12" height="8" rx="4" fill="#FDE047" />
          <rect x="91" y="63" width="12" height="8" rx="4" fill="#FDE047" />
          <path d="M56 59 L70 62" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M104 59 L90 62" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : isSurprised ? (
        <>
          <circle cx="63" cy="67" r="12" fill={`url(#${uid}-eye-glow)`} />
          <circle cx="97" cy="67" r="12" fill={`url(#${uid}-eye-glow)`} />
          <circle cx="63" cy="67" r="7" fill="#38BDF8" />
          <circle cx="97" cy="67" r="7" fill="#38BDF8" />
          <circle cx="63" cy="67" r="3" fill="#FFFFFF" />
          <circle cx="97" cy="67" r="3" fill="#FFFFFF" />
        </>
      ) : isCelebrating ? (
        <>
          <path d="M56 68 Q63 59 70 68" fill="none" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" />
          <path d="M90 68 Q97 59 104 68" fill="none" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="63" cy="67" r="12" fill={`url(#${uid}-eye-glow)`} />
          <circle cx="97" cy="67" r="12" fill={`url(#${uid}-eye-glow)`} />
          <rect x="57" y="60" width="12" height="14" rx="6" fill="#38BDF8" />
          <rect x="91" y="60" width="12" height="14" rx="6" fill="#38BDF8" />
          <circle cx="61" cy="64" r="2.2" fill="#FFFFFF" />
          <circle cx="95" cy="64" r="2.2" fill="#FFFFFF" />
        </>
      )}

      {/* Digital Smile / Mouth */}
      {isWorried ? (
        <path d="M71 82 Q80 77 89 82" fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      ) : isSurprised ? (
        <circle cx="80" cy="82" r="4.5" fill="#FDE047" />
      ) : (
        <path d="M69 79 Q80 87 91 79" fill="none" stroke="#34D399" strokeWidth="3.2" strokeLinecap="round" />
      )}
    </svg>
  );
};
