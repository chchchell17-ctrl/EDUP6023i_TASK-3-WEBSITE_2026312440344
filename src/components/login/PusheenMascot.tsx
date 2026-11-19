import React, { useId } from 'react';
import { playMascotChirp } from '../../utils/soundEffects.ts';

interface PusheenMascotProps {
  compact?: boolean;
}

export const PusheenMascot: React.FC<PusheenMascotProps> = ({ compact = false }) => {
  const uid = useId().replace(/:/g, '');

  return (
    <aside
      aria-label="Detective Pusheen welcome message"
      className={`flex items-end gap-2.5 sm:gap-3.5 ${
        compact ? 'justify-center' : 'justify-center lg:justify-end'
      }`}
    >
      {/* Translucent Welcome Speech Bubble */}
      <div className="relative max-w-[235px] sm:max-w-[265px] rounded-2xl bg-white/88 backdrop-blur-md border border-white/95 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_12px_26px_-8px_rgba(16,55,92,0.22)] text-left">
        <p className="font-[var(--font-display)] text-[11px] sm:text-xs font-bold tracking-wide text-[#0E5B88]">
          DETECTIVE PUSHEEN:
        </p>
        <p className="mt-0.5 text-xs sm:text-[13px] font-medium leading-snug text-[#10375C]">
          &ldquo;Hello there! Welcome to Digital Detective World. Choose your portal to begin!&rdquo;
        </p>
        <span
          aria-hidden="true"
          className="absolute -right-2 bottom-4 h-3.5 w-3.5 rotate-45 bg-white/90 border-r border-t border-white/95"
        />
      </div>

      {/* Detective Pusheen SVG Character (Shaded) */}
      <button
        type="button"
        onClick={() => playMascotChirp()}
        aria-label="Say hello to Detective Pusheen"
        className="shrink-0 w-[92px] sm:w-[116px] lg:w-[126px] rounded-2xl transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/60 cursor-pointer"
      >
        <svg
          viewBox="0 0 180 155"
          role="img"
          aria-label="Detective Pusheen wearing a brown plaid deerstalker hat and holding a magnifying glass"
          className="w-full h-auto drop-shadow-[0_10px_16px_rgba(16,55,92,0.18)]"
        >
          <defs>
            <radialGradient id={`${uid}-fur`} cx="0.45" cy="0.34" r="0.72">
              <stop offset="0%" stopColor="#CFC4B8" />
              <stop offset="62%" stopColor="#A69B91" />
              <stop offset="100%" stopColor="#85796F" />
            </radialGradient>
            <radialGradient id={`${uid}-belly`} cx="0.5" cy="0.4" r="0.65">
              <stop offset="0%" stopColor="#EDE5DC" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#CFC4B8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${uid}-hat-dome`} x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#D6A170" />
              <stop offset="55%" stopColor="#B88456" />
              <stop offset="100%" stopColor="#8A5730" />
            </linearGradient>
            <linearGradient id={`${uid}-hat-brim`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8A5730" />
              <stop offset="50%" stopColor="#B07A4B" />
              <stop offset="100%" stopColor="#7C4E2B" />
            </linearGradient>
            <radialGradient id={`${uid}-lens`} cx="0.35" cy="0.3" r="0.75">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
              <stop offset="55%" stopColor="#BAE6FD" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.48" />
            </radialGradient>
          </defs>

          {/* Soft floor shadow */}
          <ellipse cx="92" cy="142" rx="54" ry="9" fill="#9E8BB8" opacity="0.34" />

          <g className="animate-pusheen-breathe">
            {/* Striped Tail */}
            <path
              d="M36,115 C14,116 8,98 20,90 C28,85 37,93 40,104"
              fill={`url(#${uid}-fur)`}
              stroke="#5D5048"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M18,96 C21,98 23,103 22,107" stroke="#5D5048" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M27,93 C30,96 31,101 30,105" stroke="#5D5048" strokeWidth="3.5" strokeLinecap="round" />

            {/* Chubby Cat Body & Ears */}
            <path
              d="M44,126
                 C37,114 38,80 46,60
                 L43,39
                 C43,35 48,34 52,38
                 L64,48
                 C76,44 102,44 114,48
                 L126,38
                 C130,34 135,35 135,39
                 L132,60
                 C140,80 141,114 134,126
                 C128,137 114,139 90,139
                 C66,139 50,137 44,126 Z"
              fill={`url(#${uid}-fur)`}
              stroke="#5D5048"
              strokeWidth="4.2"
              strokeLinejoin="round"
            />

            {/* Soft Belly Sheen & Inner Ear Tint */}
            <ellipse cx="89" cy="108" rx="34" ry="22" fill={`url(#${uid}-belly)`} />
            <polygon points="48,43 51,53 59,50" fill="#F2ACB4" opacity="0.55" />
            <polygon points="130,43 127,53 119,50" fill="#F2ACB4" opacity="0.55" />

            {/* Back & Side Tabby Stripes */}
            <path d="M41,94 L50,94" stroke="#6E5F56" strokeWidth="4" strokeLinecap="round" />
            <path d="M40,105 L49,104" stroke="#6E5F56" strokeWidth="4" strokeLinecap="round" />
            <path d="M137,94 L128,94" stroke="#6E5F56" strokeWidth="4" strokeLinecap="round" />
            <path d="M138,105 L129,104" stroke="#6E5F56" strokeWidth="4" strokeLinecap="round" />

            {/* Tiny Bottom Paws */}
            <ellipse cx="64" cy="136" rx="8" ry="5" fill={`url(#${uid}-fur)`} stroke="#5D5048" strokeWidth="3.8" />
            <ellipse cx="116" cy="136" rx="8" ry="5" fill={`url(#${uid}-fur)`} stroke="#5D5048" strokeWidth="3.8" />

            {/* Gentle Head Tilt Group */}
            <g className="animate-pusheen-head">
              <path d="M81,46 L81,56" stroke="#6E5F56" strokeWidth="3.8" strokeLinecap="round" />
              <path d="M89,45 L89,58" stroke="#6E5F56" strokeWidth="3.8" strokeLinecap="round" />
              <path d="M97,46 L97,56" stroke="#6E5F56" strokeWidth="3.8" strokeLinecap="round" />

              {/* Brown Plaid Deerstalker Detective Hat */}
              <g transform="translate(65, 16)">
                <path
                  d="M6,26 C6,10 17,4 25,4 C33,4 44,10 44,26 Z"
                  fill={`url(#${uid}-hat-dome)`}
                  stroke="#5D5048"
                  strokeWidth="3.6"
                />
                <path d="M16,7 L14,25 M34,7 L36,25 M9,17 L41,17" stroke="#7D502D" strokeWidth="1.8" opacity="0.7" />
                <path d="M13,12 Q22,8 30,11" fill="none" stroke="#F5E6D3" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
                <path
                  d="M2,26 Q25,21 48,26 Q25,31 2,26 Z"
                  fill={`url(#${uid}-hat-brim)`}
                  stroke="#5D5048"
                  strokeWidth="3.4"
                />
                <circle cx="25" cy="4" r="3.2" fill="#8C5932" stroke="#5D5048" strokeWidth="2.4" />
              </g>

              {/* Rosy Cheeks */}
              <ellipse cx="67" cy="76" rx="5.8" ry="3.4" fill="#F2ACB4" opacity="0.8" />
              <ellipse cx="111" cy="76" rx="5.8" ry="3.4" fill="#F2ACB4" opacity="0.8" />

              {/* Eyes with Blink + Double Catchlights */}
              <g className="animate-pusheen-blink">
                <circle cx="72" cy="68" r="4.2" fill="#3B2F2A" />
                <circle cx="70.7" cy="66.5" r="1.4" fill="#FFFFFF" />
                <circle cx="73.4" cy="69.2" r="0.8" fill="#FFFFFF" opacity="0.8" />
                <circle cx="106" cy="68" r="4.2" fill="#3B2F2A" />
                <circle cx="104.7" cy="66.5" r="1.4" fill="#FFFFFF" />
                <circle cx="107.4" cy="69.2" r="0.8" fill="#FFFFFF" opacity="0.8" />
              </g>

              {/* Whiskers */}
              <path d="M35,66 L48,68 M34,75 L48,74" stroke="#5D5048" strokeWidth="3.4" strokeLinecap="round" />
              <path d="M143,66 L130,68 M144,75 L130,74" stroke="#5D5048" strokeWidth="3.4" strokeLinecap="round" />

              {/* Mouth */}
              <path
                d="M82,70 Q85.5,75 89,70 Q92.5,75 96,70"
                fill="none"
                stroke="#5D5048"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M85,73 C85,80 93,80 93,73 Z"
                fill="#EE8E9D"
                stroke="#5D5048"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
            </g>

            {/* Right Waving Paw */}
            <g className="animate-pusheen-paw">
              <path
                d="M126,102 C142,96 149,84 143,78 C138,73 128,83 122,92"
                fill={`url(#${uid}-fur)`}
                stroke="#5D5048"
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M150,70 L155,66 M153,79 L159,78" stroke="#F4B740" strokeWidth="2.8" strokeLinecap="round" />
            </g>

            {/* Left Paw + Wooden Magnifying Glass */}
            <g className="animate-pusheen-glass">
              <rect
                x="44"
                y="102"
                width="9"
                height="24"
                rx="4.5"
                transform="rotate(24 48 114)"
                fill="#9E6B43"
                stroke="#5D5048"
                strokeWidth="3.2"
              />
              <circle cx="57" cy="88" r="15.5" fill={`url(#${uid}-lens)`} stroke="#5D5048" strokeWidth="4" />
              <circle cx="57" cy="88" r="12.5" fill="none" stroke="#C58E5C" strokeWidth="2.8" />
              <path d="M48,83 Q53,77 61,79" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
              <ellipse
                cx="51"
                cy="104"
                rx="8.5"
                ry="6.5"
                transform="rotate(-15 51 104)"
                fill={`url(#${uid}-fur)`}
                stroke="#5D5048"
                strokeWidth="3.6"
              />
            </g>
          </g>
        </svg>
      </button>
    </aside>
  );
};
