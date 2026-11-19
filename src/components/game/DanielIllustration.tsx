import React from 'react';
import type { DialogueExpression } from '../../types/game.ts';

interface DanielIllustrationProps {
  expression?: DialogueExpression;
  holdingTablet?: boolean;
  className?: string;
}

export const DanielIllustration: React.FC<DanielIllustrationProps> = ({
  expression = 'happy',
  holdingTablet = false,
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
      aria-label={`Daniel (${expression})`}
    >
      <defs>
        <radialGradient id="daniel-aura" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#EDE9FE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="daniel-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="60%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <radialGradient id="daniel-skin" cx="0.45" cy="0.35" r="0.72">
          <stop offset="0%" stopColor="#FFF0E0" />
          <stop offset="70%" stopColor="#FFDFC4" />
          <stop offset="100%" stopColor="#F0B78C" />
        </radialGradient>
        <linearGradient id="daniel-hoodie" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="daniel-cap" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="55%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <radialGradient id="daniel-tablet-glow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Luminous Halo & Ground Shadow */}
      <circle cx="80" cy="88" r="74" fill="url(#daniel-aura)" />
      <ellipse cx="80" cy="166" rx="46" ry="6" fill="#4C1D95" opacity="0.22" />

      {/* Violet Gamer Hoodie + Shoulder Rim Light */}
      <path
        d="M31 166 C34 128, 52 118, 80 118 C108 118, 126 128, 129 166 Z"
        fill="url(#daniel-hoodie)"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M36 146 C40 129, 53 122, 65 121" fill="none" stroke="#EDE9FE" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* Aqua Hoodie Collar & Drawstrings */}
      <path d="M56 121 Q80 137 104 121" fill="none" stroke="#67E8F9" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M71 130 L70 144 M89 130 L90 144" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />

      {/* Electric Bolt Crest */}
      <circle cx="80" cy="150" r="10.5" fill="#FFFFFF" opacity="0.95" />
      <path d="M82 142.5 L75 150.5 L80 150.5 L78 157 L85 148.5 L80 148.5 Z" fill="#0284C7" />

      {/* Ears & Shaded Neck */}
      <circle cx="48" cy="80" r="7.2" fill="#F3C09A" stroke="#FFFFFF" strokeWidth="1.4" />
      <circle cx="112" cy="80" r="7.2" fill="#F3C09A" stroke="#FFFFFF" strokeWidth="1.4" />
      <rect x="72" y="105" width="16" height="16" rx="6" fill="url(#daniel-skin)" />
      <ellipse cx="80" cy="110" rx="11" ry="4" fill="#D98A62" opacity="0.4" />

      {/* Face with Warm Gradient */}
      <ellipse cx="80" cy="79" rx="30" ry="30.5" fill="url(#daniel-skin)" stroke="#D99B78" strokeWidth="1.4" />

      {/* Soft Cap Brim Shadow Across Forehead */}
      <path d="M52 62 Q80 71 108 62" fill="none" stroke="#C27D56" strokeWidth="6" opacity="0.24" strokeLinecap="round" />

      {/* Messy Boyish Hair + Glossy Aqua Cap */}
      <path
        d="M46 72 C46 38, 114 38, 114 72 C104 56, 94 62, 85 56 C76 63, 66 55, 56 64 Z"
        fill="url(#daniel-hair)"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M49 56 C54 32, 106 32, 111 56 Z"
        fill="url(#daniel-cap)"
        stroke="#FFFFFF"
        strokeWidth="2.2"
      />
      {/* Cap Curved Visor & Gloss Highlight */}
      <path d="M51 55 Q80 48 109 55" fill="none" stroke="#E0F2FE" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      <rect x="74" y="40" width="12" height="9" rx="4" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.2" />

      {/* Cheeks */}
      <ellipse cx="60" cy="88" rx="5.2" ry="3" fill="#FDA4AF" opacity="0.72" />
      <ellipse cx="100" cy="88" rx="5.2" ry="3" fill="#FDA4AF" opacity="0.72" />

      {/* Eyebrows */}
      {isWorried ? (
        <>
          <path d="M59 66 Q65 62 71 67" fill="none" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M101 66 Q95 62 89 67" fill="none" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M59 65 Q65 62 72 65" fill="none" stroke="#0F172A" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M88 65 Q95 62 101 65" fill="none" stroke="#0F172A" strokeWidth="2.3" strokeLinecap="round" />
        </>
      )}

      {/* Bright Expressive Eyes with Double Catchlights */}
      <circle cx="66" cy="77" r="5" fill="#0F172A" />
      <circle cx="94" cy="77" r="5" fill="#0F172A" />
      <circle cx="64.3" cy="75.2" r="2" fill="#FFFFFF" />
      <circle cx="92.3" cy="75.2" r="2" fill="#FFFFFF" />
      <circle cx="67.7" cy="78.8" r="1" fill="#FFFFFF" opacity="0.85" />
      <circle cx="95.7" cy="78.8" r="1" fill="#FFFFFF" opacity="0.85" />

      {/* Nose & Mouth */}
      <path d="M79 84 Q80 86 81 84" fill="none" stroke="#D99B78" strokeWidth="1.6" strokeLinecap="round" />
      {isWorried ? (
        <path d="M74 96 Q80 91 86 96" fill="none" stroke="#9A3412" strokeWidth="2.3" strokeLinecap="round" />
      ) : isSurprised ? (
        <ellipse cx="80" cy="95" rx="4.2" ry="4.8" fill="#BE123C" />
      ) : isCelebrating ? (
        <path d="M71 91 Q80 101 89 91 Z" fill="#FB7185" stroke="#9A3412" strokeWidth="1.6" />
      ) : (
        <path d="M73 91.5 Q80 98 87 91.5" fill="none" stroke="#9A3412" strokeWidth="2.3" strokeLinecap="round" />
      )}

      {holdingTablet && (
        <g transform="translate(105, 112) rotate(8)">
          <circle cx="16" cy="22" r="28" fill="url(#daniel-tablet-glow)" />
          <rect x="0" y="0" width="33" height="45" rx="6" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.4" />
          <rect x="3" y="4" width="27" height="35" rx="3" fill="#FEF08A" />
          <rect x="6" y="10" width="21" height="9" rx="2" fill="#F59E0B" />
          <rect x="6" y="23" width="21" height="5" rx="2" fill="#E11D48" />
          <ellipse cx="3" cy="24" rx="5" ry="6.5" fill="url(#daniel-skin)" stroke="#D99B78" strokeWidth="1.2" />
        </g>
      )}
    </svg>
  );
};
