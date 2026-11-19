import React from 'react';
import type { DialogueExpression } from '../../types/game.ts';

interface TeacherChelseaIllustrationProps {
  expression?: DialogueExpression;
  className?: string;
}

export const TeacherChelseaIllustration: React.FC<TeacherChelseaIllustrationProps> = ({
  expression = 'happy',
  className = 'w-full h-full',
}) => {
  const isWorried = expression === 'worried' || expression === 'thinking';
  const isSurprised = expression === 'surprised';
  const isCelebrating = expression === 'celebrating' || expression === 'excited';

  return (
    <svg
      viewBox="0 0 160 175"
      className={className}
      role="img"
      aria-label={`Teacher Chelsea (${expression})`}
    >
      <defs>
        <radialGradient id="chelsea-aura" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stopColor="#99F6E4" stopOpacity="0.88" />
          <stop offset="68%" stopColor="#CCFBF1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#CCFBF1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="chelsea-bun-grad" cx="0.38" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="55%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </radialGradient>
        <linearGradient id="chelsea-hair" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#795548" />
          <stop offset="55%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>
        <radialGradient id="chelsea-skin" cx="0.45" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#FFF0E3" />
          <stop offset="70%" stopColor="#FFE1C8" />
          <stop offset="100%" stopColor="#F2BC98" />
        </radialGradient>
        <linearGradient id="chelsea-blazer" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#5EEAD4" />
          <stop offset="55%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <linearGradient id="chelsea-lapel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#99F6E4" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
        <linearGradient id="chelsea-blouse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
      </defs>

      {/* Luminous Halo & Soft Ground Shadow */}
      <circle cx="80" cy="88" r="74" fill="url(#chelsea-aura)" />
      <ellipse cx="80" cy="166" rx="46" ry="6" fill="#0F766E" opacity="0.2" />

      {/* Top Hair Bun + Satin Ribbon Band */}
      <circle cx="80" cy="28" r="17" fill="url(#chelsea-bun-grad)" stroke="#FFFFFF" strokeWidth="2.4" />
      <path d="M72 19 Q80 14 88 19" fill="none" stroke="#BCAAA4" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
      <path d="M65 39 Q80 34 95 39" fill="none" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />

      {/* Layered Flowing Back Hair */}
      <path
        d="M40 78 C38 38, 122 38, 120 78 C122 100, 120 116, 112 122 L48 122 C40 116, 38 100, 40 78 Z"
        fill="url(#chelsea-hair)"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Structured Pastel-Teal Blazer with Lapels & Blouse */}
      <path
        d="M30 166 C33 128, 52 118, 80 118 C108 118, 127 128, 130 166 Z"
        fill="url(#chelsea-blazer)"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Shoulder Rim Highlight */}
      <path d="M36 144 C40 128, 54 122, 66 121" fill="none" stroke="#CCFBF1" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* Crisply Shaded White Blouse V-Front */}
      <path d="M63 119 L80 153 L97 119 Z" fill="url(#chelsea-blouse)" stroke="#BAE6FD" strokeWidth="1.2" />
      {/* Blazer Folded Lapels */}
      <path d="M62 119 L55 137 L74 147 Z" fill="url(#chelsea-lapel)" stroke="#FFFFFF" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M98 119 L105 137 L86 147 Z" fill="url(#chelsea-lapel)" stroke="#FFFFFF" strokeWidth="1.3" strokeLinejoin="round" />

      {/* Stylish Warm Ribbon Tie & Gold Star Pin */}
      <path d="M75 123 L85 123 L83 141 L80 145 L77 141 Z" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1" />
      <circle cx="80" cy="124" r="3.5" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="1.2" />

      {/* Teacher Star Badge Pin */}
      <g transform="translate(106, 143)">
        <rect x="-12" y="-6" width="24" height="12" rx="5" fill="#FEF08A" stroke="#FFFFFF" strokeWidth="1.6" />
        <path d="M0 -3.5 L1 -1 L3.8 -0.6 L1.6 1.2 L2.2 3.8 L0 2.3 L-2.2 3.8 L-1.6 1.2 L-3.8 -0.6 L-1 -1 Z" fill="#D97706" />
      </g>

      {/* Ears & Softly Shaded Neck */}
      <circle cx="49" cy="80" r="6.5" fill="#F7C7A3" stroke="#FFFFFF" strokeWidth="1.4" />
      <circle cx="111" cy="80" r="6.5" fill="#F7C7A3" stroke="#FFFFFF" strokeWidth="1.4" />
      <circle cx="49" cy="86" r="2.2" fill="#FDE047" />
      <circle cx="111" cy="86" r="2.2" fill="#FDE047" />
      <rect x="72" y="104" width="16" height="18" rx="6" fill="url(#chelsea-skin)" />
      {/* Under-chin Drop Shadow */}
      <ellipse cx="80" cy="109" rx="11" ry="4" fill="#D98A62" opacity="0.4" />

      {/* Smooth Face Oval with Warm Shading */}
      <ellipse cx="80" cy="77" rx="29.5" ry="30.5" fill="url(#chelsea-skin)" stroke="#E69F77" strokeWidth="1.4" />
      {/* Subtle Forehead Hairline Shadow */}
      <path d="M52 67 Q80 56 108 67" fill="none" stroke="#D99B78" strokeWidth="3.5" opacity="0.22" strokeLinecap="round" />

      {/* Side-Swept Soft Curtain Fringe */}
      <path
        d="M47 73 C47 41, 113 41, 113 73 C101 57, 87 55, 81 62 C74 54, 59 56, 47 73 Z"
        fill="url(#chelsea-hair)"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M59 51 Q76 45 96 50" fill="none" stroke="#A1887F" strokeWidth="2" strokeLinecap="round" opacity="0.55" />

      {/* Warm Cheeks */}
      <ellipse cx="59" cy="86.5" rx="5.5" ry="3.2" fill="#FDA4AF" opacity="0.72" />
      <ellipse cx="101" cy="86.5" rx="5.5" ry="3.2" fill="#FDA4AF" opacity="0.72" />

      {/* Eyebrows */}
      {isWorried ? (
        <>
          <path d="M58 63 Q66 60 72 64" fill="none" stroke="#3E2723" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M102 63 Q94 60 88 64" fill="none" stroke="#3E2723" strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M58 62 Q66 59 73 62.5" fill="none" stroke="#3E2723" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M87 62.5 Q94 59 102 62" fill="none" stroke="#3E2723" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}

      {/* Expressive Kind Eyes + Lashes + Double Catchlights */}
      <path d="M59.5 73 Q63 69.5 67 71" fill="none" stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M100.5 73 Q97 69.5 93 71" fill="none" stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="66" cy="76.5" r="4.8" fill="#1E293B" />
      <circle cx="94" cy="76.5" r="4.8" fill="#1E293B" />
      <circle cx="64.3" cy="74.7" r="1.9" fill="#FFFFFF" />
      <circle cx="92.3" cy="74.7" r="1.9" fill="#FFFFFF" />
      <circle cx="67.8" cy="78.3" r="0.95" fill="#FFFFFF" opacity="0.85" />
      <circle cx="95.8" cy="78.3" r="0.95" fill="#FFFFFF" opacity="0.85" />

      {/* Chic Thin-Rim Teacher Glasses + Diagonal Lens Glare */}
      <g>
        <circle cx="66" cy="76.5" r="11" fill="#FFFFFF" fillOpacity="0.2" stroke="#D97706" strokeWidth="2.1" />
        <circle cx="94" cy="76.5" r="11" fill="#FFFFFF" fillOpacity="0.2" stroke="#D97706" strokeWidth="2.1" />
        <path d="M77 75.5 Q80 73.5 83 75.5" fill="none" stroke="#D97706" strokeWidth="2.1" strokeLinecap="round" />
        <line x1="51" y1="75" x2="55" y2="76" stroke="#D97706" strokeWidth="2" />
        <line x1="105" y1="76" x2="109" y2="75" stroke="#D97706" strokeWidth="2" />
        <line x1="59" y1="71" x2="65" y2="82" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
        <line x1="87" y1="71" x2="93" y2="82" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* Cute Nose & Warm Smile */}
      <path d="M79 83.5 Q80 85.2 81 83.5" fill="none" stroke="#D99B78" strokeWidth="1.6" strokeLinecap="round" />
      {isWorried ? (
        <path d="M74 95.5 Q80 91.5 86 95.5" fill="none" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" />
      ) : isSurprised ? (
        <ellipse cx="80" cy="94.5" rx="4" ry="4.5" fill="#BE123C" />
      ) : isCelebrating ? (
        <path d="M71 91 Q80 101 89 91 Z" fill="#FB7185" stroke="#9A3412" strokeWidth="1.6" />
      ) : (
        <path d="M72.5 91.5 Q80 98 87.5 91.5" fill="none" stroke="#9A3412" strokeWidth="2.3" strokeLinecap="round" />
      )}
    </svg>
  );
};
