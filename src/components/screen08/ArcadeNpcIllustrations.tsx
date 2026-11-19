import React from 'react';

export const AmirArcadeIllustration: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 160 175" className={className} role="img" aria-label="Amir at Turbo Racing Pods">
    <defs>
      <radialGradient id="amir-aura" cx="0.5" cy="0.45" r="0.55">
        <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.88" />
        <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="amir-skin" cx="0.45" cy="0.35" r="0.72">
        <stop offset="0%" stopColor="#FBE0C6" />
        <stop offset="72%" stopColor="#EDC09B" />
        <stop offset="100%" stopColor="#D69C72" />
      </radialGradient>
      <linearGradient id="amir-hair" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="amir-jacket" x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="60%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#075985" />
      </linearGradient>
    </defs>

    <circle cx="80" cy="88" r="74" fill="url(#amir-aura)" />
    <ellipse cx="80" cy="166" rx="46" ry="6" fill="#0369A1" opacity="0.24" />

    {/* Sporty Racing Jacket with Racing Stripes & High Collar */}
    <path
      d="M31 166 C34 128, 52 118, 80 118 C108 118, 126 128, 129 166 Z"
      fill="url(#amir-jacket)"
      stroke="#FFFFFF"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path d="M53 123 L53 164 M107 123 L107 164" stroke="#FFFFFF" strokeWidth="4.5" opacity="0.85" />
    <path d="M68 122 L80 144 L92 122 Z" fill="#0F172A" />
    <line x1="80" y1="143" x2="80" y2="165" stroke="#BAE6FD" strokeWidth="2.5" />
    {/* Checkered Patch */}
    <rect x="91" y="138" width="12" height="10" rx="2" fill="#FFFFFF" />
    <rect x="91" y="138" width="6" height="5" fill="#0F172A" />
    <rect x="97" y="143" width="6" height="5" fill="#0F172A" />

    {/* Ears & Shaded Neck */}
    <circle cx="49" cy="80" r="6.8" fill="url(#amir-skin)" stroke="#FFFFFF" strokeWidth="1.4" />
    <circle cx="111" cy="80" r="6.8" fill="url(#amir-skin)" stroke="#FFFFFF" strokeWidth="1.4" />
    <rect x="72" y="104" width="16" height="16" rx="6" fill="url(#amir-skin)" />
    <ellipse cx="80" cy="109" rx="11" ry="4" fill="#B87E56" opacity="0.4" />

    {/* Face */}
    <ellipse cx="80" cy="78" rx="29.5" ry="30" fill="url(#amir-skin)" stroke="#C88B61" strokeWidth="1.4" />

    {/* Swept Spiky Hair + Sheen */}
    <path
      d="M45 72 C44 35, 115 34, 115 72 C108 58, 97 52, 88 59 C81 51, 70 53, 62 60 C55 56, 49 62, 45 72 Z"
      fill="url(#amir-hair)"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Racing Goggles Perched on Forehead */}
    <rect x="52" y="42" width="56" height="14" rx="7" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2" />
    <rect x="57" y="44" width="19" height="10" rx="4" fill="#BAE6FD" stroke="#0F172A" strokeWidth="1.5" />
    <rect x="84" y="44" width="19" height="10" rx="4" fill="#BAE6FD" stroke="#0F172A" strokeWidth="1.5" />
    <line x1="61" y1="45" x2="66" y2="53" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
    <line x1="88" y1="45" x2="93" y2="53" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />

    {/* Confident Brows, Sparkling Eyes, Nose & Grin */}
    <path d="M59 66 Q66 63 72 66" fill="none" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M88 66 Q94 63 101 66" fill="none" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="66" cy="77" r="4.8" fill="#0F172A" />
    <circle cx="94" cy="77" r="4.8" fill="#0F172A" />
    <circle cx="64.3" cy="75.2" r="1.9" fill="#FFFFFF" />
    <circle cx="92.3" cy="75.2" r="1.9" fill="#FFFFFF" />
    <circle cx="67.7" cy="78.8" r="0.95" fill="#FFFFFF" opacity="0.85" />
    <circle cx="95.7" cy="78.8" r="0.95" fill="#FFFFFF" opacity="0.85" />
    <path d="M79 84 Q80 85.8 81 84" fill="none" stroke="#C88B61" strokeWidth="1.6" strokeLinecap="round" />
    <ellipse cx="59" cy="87" rx="5" ry="2.8" fill="#FB7185" opacity="0.48" />
    <ellipse cx="101" cy="87" rx="5" ry="2.8" fill="#FB7185" opacity="0.48" />
    <path d="M72 91 Q80 99 88 91 Z" fill="#FFFFFF" stroke="#9A3412" strokeWidth="1.8" />
  </svg>
);

export const SitiArcadeIllustration: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 160 175" className={className} role="img" aria-label="Siti at Neon Claw & Hoops">
    <defs>
      <radialGradient id="siti-aura" cx="0.5" cy="0.45" r="0.55">
        <stop offset="0%" stopColor="#FBCFE8" stopOpacity="0.88" />
        <stop offset="100%" stopColor="#FBCFE8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="siti-skin" cx="0.45" cy="0.35" r="0.72">
        <stop offset="0%" stopColor="#FFEAD7" />
        <stop offset="72%" stopColor="#FAD2B4" />
        <stop offset="100%" stopColor="#E6B08A" />
      </radialGradient>
      <linearGradient id="siti-hair" x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#5D4037" />
        <stop offset="100%" stopColor="#2D1B15" />
      </linearGradient>
      <linearGradient id="siti-cardigan" x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#F9A8D4" />
        <stop offset="60%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
    </defs>

    <circle cx="80" cy="88" r="74" fill="url(#siti-aura)" />
    <ellipse cx="80" cy="166" rx="46" ry="6" fill="#BE185D" opacity="0.22" />

    {/* Cute Twin-Puff Hair Buns + Star Hair Clips */}
    <circle cx="43" cy="46" r="15" fill="url(#siti-hair)" stroke="#FFFFFF" strokeWidth="2.4" />
    <circle cx="117" cy="46" r="15" fill="url(#siti-hair)" stroke="#FFFFFF" strokeWidth="2.4" />
    <circle cx="52" cy="53" r="5" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.5" />
    <circle cx="108" cy="53" r="5" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.5" />

    {/* Cozy Coral-Pink Cardigan + Cream Tee */}
    <path
      d="M32 166 C35 129, 53 119, 80 119 C107 119, 125 129, 128 166 Z"
      fill="url(#siti-cardigan)"
      stroke="#FFFFFF"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path d="M68 120 L80 155 L92 120 Z" fill="#FFFBEB" />
    {/* Plushie Heart Badge */}
    <circle cx="99" cy="143" r="7" fill="#FFFFFF" stroke="#F472B6" strokeWidth="1.5" />
    <circle cx="99" cy="143" r="3.5" fill="#FB7185" />

    {/* Ears & Neck */}
    <circle cx="49" cy="80" r="6.5" fill="url(#siti-skin)" stroke="#FFFFFF" strokeWidth="1.4" />
    <circle cx="111" cy="80" r="6.5" fill="url(#siti-skin)" stroke="#FFFFFF" strokeWidth="1.4" />
    <rect x="72" y="104" width="16" height="16" rx="6" fill="url(#siti-skin)" />
    <ellipse cx="80" cy="109" rx="10" ry="3.8" fill="#C98A65" opacity="0.4" />

    {/* Face */}
    <ellipse cx="80" cy="78" rx="29" ry="29.5" fill="url(#siti-skin)" stroke="#D99B78" strokeWidth="1.4" />

    {/* Rounded Bangs */}
    <path
      d="M47 71 C49 38, 111 38, 113 71 C100 56, 86 58, 80 62 C74 58, 60 56, 47 71 Z"
      fill="url(#siti-hair)"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Sparkling Eyes + Eyelashes + Rosy Cheeks */}
    <path d="M59 73 Q63 69.5 67 71" fill="none" stroke="#1E293B" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M101 73 Q97 69.5 93 71" fill="none" stroke="#1E293B" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="66" cy="77" r="5" fill="#1E293B" />
    <circle cx="94" cy="77" r="5" fill="#1E293B" />
    <circle cx="64.2" cy="75.1" r="2" fill="#FFFFFF" />
    <circle cx="92.2" cy="75.1" r="2" fill="#FFFFFF" />
    <circle cx="67.7" cy="78.8" r="1" fill="#FFFFFF" opacity="0.85" />
    <circle cx="95.7" cy="78.8" r="1" fill="#FFFFFF" opacity="0.85" />
    <ellipse cx="59" cy="87" rx="5.5" ry="3.2" fill="#FDA4AF" opacity="0.78" />
    <ellipse cx="101" cy="87" rx="5.5" ry="3.2" fill="#FDA4AF" opacity="0.78" />
    <path d="M79 84 Q80 85.5 81 84" fill="none" stroke="#D99B78" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M73 91.5 Q80 97.5 87 91.5" fill="none" stroke="#9A3412" strokeWidth="2.3" strokeLinecap="round" />
  </svg>
);

export const KevinArcadeIllustration: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 160 175" className={className} role="img" aria-label="Kevin at Starlight Prize Counter">
    <defs>
      <radialGradient id="kevin-aura" cx="0.5" cy="0.45" r="0.55">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="kevin-skin" cx="0.45" cy="0.35" r="0.72">
        <stop offset="0%" stopColor="#FFF2E5" />
        <stop offset="72%" stopColor="#FFE1C8" />
        <stop offset="100%" stopColor="#F0BA95" />
      </radialGradient>
      <linearGradient id="kevin-hair" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#1C1917" />
      </linearGradient>
      <linearGradient id="kevin-vest" x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>

    <circle cx="80" cy="88" r="74" fill="url(#kevin-aura)" />
    <ellipse cx="80" cy="166" rx="46" ry="6" fill="#B45309" opacity="0.22" />

    {/* White Tee + Sunny Amber Varsity Vest */}
    <path
      d="M32 166 C35 129, 53 119, 80 119 C107 119, 125 129, 128 166 Z"
      fill="#FFFFFF"
      stroke="#CBD5E1"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M46 125 L68 121 L72 165 L42 165 Z M114 125 L92 121 L88 165 L118 165 Z"
      fill="url(#kevin-vest)"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Star Emblem */}
    <circle cx="58" cy="144" r="6" fill="#0F172A" />
    <circle cx="58" cy="144" r="3" fill="#FDE047" />

    {/* Ears & Neck */}
    <circle cx="49" cy="80" r="6.5" fill="url(#kevin-skin)" stroke="#FFFFFF" strokeWidth="1.4" />
    <circle cx="111" cy="80" r="6.5" fill="url(#kevin-skin)" stroke="#FFFFFF" strokeWidth="1.4" />
    <rect x="72" y="104" width="16" height="16" rx="6" fill="url(#kevin-skin)" />
    <ellipse cx="80" cy="109" rx="10" ry="3.8" fill="#D99B78" opacity="0.4" />

    {/* Face */}
    <ellipse cx="80" cy="78" rx="29.5" ry="30" fill="url(#kevin-skin)" stroke="#E5A982" strokeWidth="1.4" />

    {/* Neat Side-Parted Hair */}
    <path
      d="M47 71 C46 37, 114 37, 113 71 C100 54, 78 52, 62 63 C56 58, 51 64, 47 71 Z"
      fill="url(#kevin-hair)"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Eyes + Teal Round Glasses */}
    <circle cx="66" cy="77" r="4.6" fill="#0F172A" />
    <circle cx="94" cy="77" r="4.6" fill="#0F172A" />
    <circle cx="64.4" cy="75.3" r="1.8" fill="#FFFFFF" />
    <circle cx="92.4" cy="75.3" r="1.8" fill="#FFFFFF" />
    <circle cx="67.6" cy="78.7" r="0.9" fill="#FFFFFF" opacity="0.85" />
    <circle cx="95.6" cy="78.7" r="0.9" fill="#FFFFFF" opacity="0.85" />
    <circle cx="66" cy="77" r="10.5" fill="#FFFFFF" fillOpacity="0.22" stroke="#0D9488" strokeWidth="2.1" />
    <circle cx="94" cy="77" r="10.5" fill="#FFFFFF" fillOpacity="0.22" stroke="#0D9488" strokeWidth="2.1" />
    <line x1="76.5" y1="77" x2="83.5" y2="77" stroke="#0D9488" strokeWidth="2.1" />
    <line x1="60" y1="71" x2="65" y2="81" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    <line x1="88" y1="71" x2="93" y2="81" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />

    {/* Cheeks, Nose & Cheerful Smile */}
    <path d="M79 84 Q80 85.5 81 84" fill="none" stroke="#D99B78" strokeWidth="1.6" strokeLinecap="round" />
    <ellipse cx="59" cy="88" rx="5" ry="2.8" fill="#FDA4AF" opacity="0.7" />
    <ellipse cx="101" cy="88" rx="5" ry="2.8" fill="#FDA4AF" opacity="0.7" />
    <path d="M73 91.5 Q80 97.5 87 91.5" fill="none" stroke="#9A3412" strokeWidth="2.3" strokeLinecap="round" />

    {/* Held Fanned Prize Tickets */}
    <g transform="translate(107, 118) rotate(12)">
      <rect x="0" y="0" width="22" height="30" rx="3" fill="#FB7185" stroke="#FFFFFF" strokeWidth="1.8" />
      <rect x="7" y="4" width="22" height="30" rx="3" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.8" />
      <text x="18" y="23" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="900">★</text>
    </g>
  </svg>
);
