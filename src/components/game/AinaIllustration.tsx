import React, { useId } from 'react';
import type { DialogueExpression } from '../../types/game.ts';

interface AinaIllustrationProps {
  expression?: DialogueExpression;
  holdingPhone?: boolean;
  className?: string;
}

export const AinaIllustration: React.FC<AinaIllustrationProps> = ({
  expression = 'happy',
  holdingPhone = false,
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
      aria-label={`Aina (${expression})`}
    >
      <defs>
        <radialGradient id={`${uid}-aura`} cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stopColor="#FBCFE8" stopOpacity="0.88" />
          <stop offset="68%" stopColor="#FDF2F8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FDF2F8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-hijab-outer`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#FDE2F2" />
          <stop offset="48%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <linearGradient id={`${uid}-hijab-fold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF1F7" />
          <stop offset="55%" stopColor="#F9A8D4" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
        <linearGradient id={`${uid}-underscarf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FCE7F3" />
        </linearGradient>
        <linearGradient id={`${uid}-hoodie`} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#EDE9FE" />
          <stop offset="55%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <radialGradient id={`${uid}-skin`} cx="0.44" cy="0.34" r="0.72">
          <stop offset="0%" stopColor="#FFF2E6" />
          <stop offset="68%" stopColor="#FFE0C6" />
          <stop offset="100%" stopColor="#EBB086" />
        </radialGradient>
      </defs>

      {/* Luminous Halo & Soft Ground Shadow */}
      <circle cx="80" cy="88" r="74" fill={`url(#${uid}-aura)`} />
      <ellipse cx="80" cy="166" rx="46" ry="6" fill="#9D174D" opacity="0.2" />

      {/* Rounded Outer Tudung Back Hood */}
      <path
        d="M36 82 C36 28, 124 28, 124 82 C124 106, 117 122, 108 130 L52 130 C43 122, 36 106, 36 82 Z"
        fill={`url(#${uid}-hijab-outer)`}
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Lavender Hoodie Shoulders & Torso + Shoulder Rim Highlight */}
      <path
        d="M32 166 C34 130, 52 120, 80 120 C108 120, 126 130, 128 166 Z"
        fill={`url(#${uid}-hoodie)`}
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M36 146 C40 129, 52 123, 64 122" fill="none" stroke="#F5F3FF" strokeWidth="2" strokeLinecap="round" opacity="0.72" />

      {/* Cute Star Emblem on Lower Chest */}
      <circle cx="80" cy="151" r="9.5" fill="#FFFFFF" opacity="0.96" />
      <path
        d="M80 144.5 L82 149 L86.8 149.6 L83.2 152.9 L84.1 157.6 L80 155.2 L75.9 157.6 L76.8 152.9 L73.2 149.6 L78 149 Z"
        fill="#F59E0B"
      />

      {/* Smooth Tudung Front Chest Drape */}
      <path
        d="M44 98 C44 82, 116 82, 116 98 C122 117, 108 134, 80 135 C52 134, 38 117, 44 98 Z"
        fill={`url(#${uid}-hijab-fold)`}
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Soft Outer Tudung Frame Hugging Cheeks & Chin */}
      <path
        d="M42 78 C42 38, 118 38, 118 78 C118 103, 101 117, 80 117 C59 117, 42 103, 42 78 Z"
        fill={`url(#${uid}-hijab-outer)`}
        stroke="#FFFFFF"
        strokeWidth="2.2"
      />

      {/* Cute Face Oval Neatly Framed Inside the Tudung */}
      <ellipse
        cx="80"
        cy="78"
        rx="28"
        ry="29.5"
        fill={`url(#${uid}-skin)`}
        stroke="#F472B6"
        strokeWidth="1.8"
      />

      {/* Tidy Anak Tudung (Inner Cap) Following Upper Forehead Curve */}
      <path
        d="M52.5 70 C55 48, 105 48, 107.5 70 C95 58, 65 58, 52.5 70 Z"
        fill={`url(#${uid}-underscarf)`}
        stroke="#F472B6"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Top Tudung Outer Edge Band + Soft Sheen Highlight */}
      <path
        d="M46 74 C48 41, 112 41, 114 74 C106 50, 54 50, 46 74 Z"
        fill={`url(#${uid}-hijab-outer)`}
      />
      <path
        d="M59 44 Q80 35 101 44"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.58"
      />

      {/* Gentle Chin-Wrap Scarf Fold & Highlight */}
      <path
        d="M50 99 Q80 120 110 99 Q106 116 80 119 Q54 116 50 99 Z"
        fill={`url(#${uid}-hijab-fold)`}
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M57 116 Q80 127 104 115"
        fill="none"
        stroke="#BE185D"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.32"
      />
      <path
        d="M62 123 Q80 131 98 122"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.68"
      />

      {/* Cute Gold Star Brooch Pin Tucked on Shawl Fold */}
      <g transform="translate(97, 114)">
        <circle cx="0" cy="0" r="5.5" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.8" />
        <path
          d="M0 -3.2 L0.9 -0.8 L3.5 -0.6 L1.5 1 L2.1 3.4 L0 2 L-2.1 3.4 L-1.5 1 L-3.5 -0.6 L-0.9 -0.8 Z"
          fill="#D97706"
        />
      </g>

      {/* Rosy Cheeks */}
      <ellipse cx="61" cy="85.5" rx="5.5" ry="3.2" fill="#FDA4AF" opacity="0.78" />
      <ellipse cx="99" cy="85.5" rx="5.5" ry="3.2" fill="#FDA4AF" opacity="0.78" />

      {/* Eyebrows */}
      {isWorried ? (
        <>
          <path d="M60 66 Q66 63 72 67" fill="none" stroke="#6B3A26" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M100 66 Q94 63 88 67" fill="none" stroke="#6B3A26" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : isSurprised ? (
        <>
          <path d="M60 62 Q66 58 72 62" fill="none" stroke="#6B3A26" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M88 62 Q94 58 100 62" fill="none" stroke="#6B3A26" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M60 65 Q66 62 72 65" fill="none" stroke="#6B3A26" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M88 65 Q94 62 100 65" fill="none" stroke="#6B3A26" strokeWidth="2.3" strokeLinecap="round" />
        </>
      )}

      {/* Big Cute Sparkling Eyes + Tiny Eyelashes */}
      <path d="M61 73 Q63 70.5 66 72" fill="none" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M99 73 Q97 70.5 94 72" fill="none" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="67" cy="76" r="5.2" fill="#1E293B" />
      <circle cx="93" cy="76" r="5.2" fill="#1E293B" />
      <circle cx="65.2" cy="74.1" r="2" fill="#FFFFFF" />
      <circle cx="91.2" cy="74.1" r="2" fill="#FFFFFF" />
      <circle cx="68.8" cy="78.1" r="1" fill="#FFFFFF" opacity="0.85" />
      <circle cx="94.8" cy="78.1" r="1" fill="#FFFFFF" opacity="0.85" />

      {/* Tiny Cute Nose */}
      <path d="M79 83 Q80 84.5 81 83" fill="none" stroke="#D99B78" strokeWidth="1.6" strokeLinecap="round" />

      {/* Mouth */}
      {isWorried ? (
        <path d="M74 94 Q80 90 86 94" fill="none" stroke="#9A3412" strokeWidth="2.4" strokeLinecap="round" />
      ) : isSurprised ? (
        <ellipse cx="80" cy="93.5" rx="4.2" ry="5" fill="#BE123C" />
      ) : isCelebrating ? (
        <path d="M72 90 Q80 100 88 90 Z" fill="#FB7185" stroke="#9A3412" strokeWidth="1.8" />
      ) : (
        <path d="M73 90.5 Q80 97 87 90.5" fill="none" stroke="#9A3412" strokeWidth="2.4" strokeLinecap="round" />
      )}

      {/* Optional Held Smartphone with Glow */}
      {holdingPhone && (
        <g transform="translate(109, 108) rotate(8)">
          <rect
            x="0"
            y="0"
            width="28"
            height="46"
            rx="6"
            fill="#0F172A"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          <rect x="3" y="5" width="22" height="34" rx="3" fill="#BAE6FD" />
          <rect x="6" y="10" width="16" height="8" rx="2" fill="#FDE047" />
          <rect x="6" y="21" width="16" height="4" rx="2" fill="#0284C7" />
          <rect x="6" y="28" width="12" height="4" rx="2" fill="#E11D48" />
          <ellipse cx="4" cy="26" rx="5.5" ry="7.5" fill={`url(#${uid}-skin)`} stroke="#F472B6" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
};
