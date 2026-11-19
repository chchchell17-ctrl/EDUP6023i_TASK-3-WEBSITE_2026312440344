import React, { useId } from 'react';
import type {
  AccessoryId,
  AvatarConfig,
  BaseAppearanceId,
  HairColorId,
  HairStyleId,
  HijabColorId,
  OutfitColorId,
  OutfitStyleId,
  ShoeColorId,
  ShoeStyleId,
  SkinToneId,
} from '../../types/game.ts';

export const SKIN_TONES: Record<
  SkinToneId,
  { label: string; highlight: string; fill: string; shade: string }
> = {
  fair: { label: 'Porcelain', highlight: '#FFF2E6', fill: '#FFE2CC', shade: '#E8B796' },
  light: { label: 'Warm Peach', highlight: '#FFE0C4', fill: '#F7C9A6', shade: '#DA9F76' },
  medium: { label: 'Golden Honey', highlight: '#F3C29B', fill: '#E2A87C', shade: '#BD7E50' },
  tan: { label: 'Caramel', highlight: '#DBA06E', fill: '#C88753', shade: '#9B5F31' },
  brown: { label: 'Chestnut', highlight: '#B5774B', fill: '#9A5F36', shade: '#6F3F1D' },
  deep: { label: 'Deep Cocoa', highlight: '#855336', fill: '#6B3E24', shade: '#452310' },
};

export const HAIR_COLORS: Record<
  HairColorId,
  { label: string; fill: string; highlight: string; deep: string }
> = {
  black: { label: 'Ink Black', fill: '#2B2420', highlight: '#524741', deep: '#161210' },
  'dark-brown': { label: 'Dark Brown', fill: '#5C3A21', highlight: '#855838', deep: '#3B2312' },
  chestnut: { label: 'Chestnut', fill: '#8B542E', highlight: '#B67749', deep: '#62381A' },
  blonde: { label: 'Honey Blonde', fill: '#E4B453', highlight: '#FAE09B', deep: '#BA8727' },
  auburn: { label: 'Auburn', fill: '#A8442A', highlight: '#D16649', deep: '#7A2C18' },
  midnight: { label: 'Midnight Blue', fill: '#2E4272', highlight: '#5371B3', deep: '#1B284A' },
};

export const HIJAB_COLORS: Record<
  HijabColorId,
  { label: string; light: string; main: string; dark: string; inner: string }
> = {
  rose: { label: 'Soft Rose', light: '#FBCFE8', main: '#F472B6', dark: '#DB2777', inner: '#FFF1F7' },
  aqua: { label: 'Aero Aqua', light: '#BAE6FD', main: '#38BDF8', dark: '#0284C7', inner: '#F0F9FF' },
  lavender: {
    label: 'Soft Lavender',
    light: '#DDD6FE',
    main: '#A78BFA',
    dark: '#6D28D9',
    inner: '#FAF5FF',
  },
  mint: { label: 'Mint Sage', light: '#BBF7D0', main: '#4ADE80', dark: '#15803D', inner: '#F0FDF4' },
  cream: {
    label: 'Pearl Cream',
    light: '#FFFBEB',
    main: '#F3DFC1',
    dark: '#C49F72',
    inner: '#FFFFFF',
  },
  navy: { label: 'Royal Navy', light: '#93C5FD', main: '#2563EB', dark: '#1E3A8A', inner: '#EFF6FF' },
  mocha: {
    label: 'Warm Mocha',
    light: '#E7D5C4',
    main: '#B08968',
    dark: '#7F5539',
    inner: '#FDF8F3',
  },
  black: {
    label: 'Classic Black',
    light: '#475569',
    main: '#1E293B',
    dark: '#0F172A',
    inner: '#F1F5F9',
  },
};

export const OUTFIT_COLORS: Record<
  OutfitColorId,
  { label: string; main: string; dark: string; accent: string }
> = {
  aqua: { label: 'Aero Aqua', main: '#38BDF8', dark: '#0284C7', accent: '#BAE6FD' },
  mint: { label: 'Fresh Mint', main: '#4ADE80', dark: '#16A34A', accent: '#DCFCE7' },
  lavender: { label: 'Soft Lavender', main: '#A78BFA', dark: '#6D28D9', accent: '#EDE9FE' },
  gold: { label: 'Sunny Gold', main: '#FBBF24', dark: '#D97706', accent: '#FEF3C7' },
  coral: { label: 'Pastel Coral', main: '#F472B6', dark: '#DB2777', accent: '#FCE7F3' },
  navy: { label: 'Detective Navy', main: '#3B82F6', dark: '#1D4ED8', accent: '#DBEAFE' },
};

export const SHOE_COLORS: Record<
  ShoeColorId,
  { label: string; highlight: string; main: string; sole: string }
> = {
  white: { label: 'Cloud White', highlight: '#FFFFFF', main: '#F1F5F9', sole: '#94A3B8' },
  sky: { label: 'Sky Blue', highlight: '#BAE6FD', main: '#38BDF8', sole: '#E2E8F0' },
  charcoal: { label: 'Slate', highlight: '#64748B', main: '#334155', sole: '#CBD5E1' },
  berry: { label: 'Berry Pink', highlight: '#F9A8D4', main: '#EC4899', sole: '#FCE7F3' },
};

export const BASE_APPEARANCES: Record<BaseAppearanceId, string> = {
  cheerful: 'Cheerful Smile',
  curious: 'Curious Spark',
  friendly: 'Warm Grin',
  bold: 'Confident Gaze',
};

export const HAIR_STYLES: Record<HairStyleId, string> = {
  short: 'Short Crop',
  long: 'Long Flowing',
  curly: 'Curly Puff',
  bob: 'Sleek Bob',
  spiky: 'Spiky Tufts',
  pigtails: 'Twin Pigtails',
  hijab: 'Hijab (Tudung)',
};

export const OUTFIT_STYLES: Record<OutfitStyleId, string> = {
  hoodie: 'Hoodie',
  jacket: 'Detective Jacket',
  polo: 'Polo Shirt',
  casual: 'Casual Tee',
  overalls: 'Overalls',
};

export const ACCESSORIES: Record<AccessoryId, string> = {
  none: 'None',
  glasses: 'Round Glasses',
  headband: 'Star Headband',
  cap: 'Detective Cap',
  backpack: 'Explorer Backpack',
  'magnifier-pin': 'Magnifier Badge',
};

export const SHOE_STYLES: Record<ShoeStyleId, string> = {
  trainers: 'Trainers',
  boots: 'Explorer Boots',
  casual: 'Casual Shoes',
};

interface DetectiveAvatarProps {
  config: AvatarConfig;
  view?: 'front' | 'right' | 'back' | 'left';
  pose?: 'idle' | 'walk' | 'wave';
  className?: string;
}

export const DetectiveAvatar: React.FC<DetectiveAvatarProps> = ({
  config,
  view = 'front',
  pose = 'idle',
  className = 'w-full h-full',
}) => {
  const uid = useId().replace(/:/g, '');
  const skin = SKIN_TONES[config.skinTone] ?? SKIN_TONES.light;
  const hair = HAIR_COLORS[config.hairColor] ?? HAIR_COLORS['dark-brown'];
  const hijab = HIJAB_COLORS[config.hijabColor ?? 'rose'] ?? HIJAB_COLORS.rose;
  const outfit = OUTFIT_COLORS[config.outfitColor] ?? OUTFIT_COLORS.aqua;
  const shoe = SHOE_COLORS[config.shoesColor] ?? SHOE_COLORS.white;

  const isHijab = config.hairStyle === 'hijab';
  const isBack = view === 'back';
  const isSide = view === 'left' || view === 'right';
  const flipX = view === 'left' ? -1 : 1;

  const isWalking = pose === 'walk';
  const isWaving = pose === 'wave';

  return (
    <svg
      viewBox="0 0 180 240"
      className={className}
      role="img"
      aria-label="Customisable Junior Detective character"
    >
      <defs>
        <radialGradient id={`${uid}-skin`} cx="0.42" cy="0.34" r="0.72">
          <stop offset="0%" stopColor={skin.highlight} />
          <stop offset="66%" stopColor={skin.fill} />
          <stop offset="100%" stopColor={skin.shade} />
        </radialGradient>
        <linearGradient id={`${uid}-hair`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={hair.highlight} />
          <stop offset="52%" stopColor={hair.fill} />
          <stop offset="100%" stopColor={hair.deep} />
        </linearGradient>
        <linearGradient id={`${uid}-hijab-outer`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={hijab.light} />
          <stop offset="50%" stopColor={hijab.main} />
          <stop offset="100%" stopColor={hijab.dark} />
        </linearGradient>
        <linearGradient id={`${uid}-hijab-fold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hijab.inner} />
          <stop offset="45%" stopColor={hijab.light} />
          <stop offset="100%" stopColor={hijab.main} />
        </linearGradient>
        <linearGradient id={`${uid}-outfit`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={outfit.accent} />
          <stop offset="42%" stopColor={outfit.main} />
          <stop offset="100%" stopColor={outfit.dark} />
        </linearGradient>
        <linearGradient id={`${uid}-pants`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id={`${uid}-shoe`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shoe.highlight} />
          <stop offset="65%" stopColor={shoe.main} />
          <stop offset="100%" stopColor={shoe.sole} />
        </linearGradient>
        <linearGradient id={`${uid}-backpack`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="55%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id={`${uid}-cap`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4A373" />
          <stop offset="55%" stopColor="#B88456" />
          <stop offset="100%" stopColor="#84542F" />
        </linearGradient>
      </defs>

      {/* Soft Ground Shadow */}
      <ellipse
        cx="90"
        cy="226"
        rx="40"
        ry="8"
        fill="#10375C"
        opacity="0.2"
        className={isWalking ? 'animate-walk-shadow' : ''}
      />

      <g transform={`translate(90, 0) scale(${flipX}, 1) translate(-90, 0)`}>
        <g className={isWalking ? 'animate-walk-bob' : ''}>
          {/* Explorer Backpack (behind torso when front/side) */}
          {config.accessory === 'backpack' && !isBack && (
            <g>
              <rect
                x="54"
                y="108"
                width="72"
                height="52"
                rx="14"
                fill={`url(#${uid}-backpack)`}
                stroke="#78350F"
                strokeWidth="3"
              />
              <rect x="60" y="114" width="60" height="14" rx="6" fill="#FDE047" opacity="0.7" />
            </g>
          )}

          {/* Long Hair / Pigtails Back Layer */}
          {config.hairStyle === 'long' && !isBack && (
            <path
              d="M52,58 C44,82 46,122 54,134 L126,134 C134,122 136,82 128,58 Z"
              fill={`url(#${uid}-hair)`}
              stroke="#2B2420"
              strokeWidth="2.8"
            />
          )}
          {config.hairStyle === 'pigtails' && (
            <g fill={`url(#${uid}-hair)`} stroke="#2B2420" strokeWidth="2.8">
              <ellipse cx="45" cy="84" rx="11" ry="22" transform="rotate(14 45 84)" />
              <ellipse cx="135" cy="84" rx="11" ry="22" transform="rotate(-14 135 84)" />
              <path d="M41,72 Q40,84 44,96" fill="none" stroke={hair.highlight} strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
              <path d="M139,72 Q140,84 136,96" fill="none" stroke={hair.highlight} strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
              <circle cx="52" cy="68" r="4.5" fill={outfit.main} />
              <circle cx="128" cy="68" r="4.5" fill={outfit.main} />
            </g>
          )}

          {/* Hijab Back Hood Dome (behind torso & head on front/side) */}
          {isHijab && !isBack && (
            <path
              d={
                isSide
                  ? 'M52,66 C48,26 128,24 128,68 C130,96 120,120 106,128 L60,128 C52,116 54,94 52,66 Z'
                  : 'M44,74 C44,24 136,24 136,74 C136,104 128,120 116,130 L64,130 C52,120 44,104 44,74 Z'
              }
              fill={`url(#${uid}-hijab-outer)`}
              stroke="#1E293B"
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
          )}

          {/* Back Arm (side view) */}
          {isSide && (
            <g
              style={{ transformOrigin: '94px 114px' }}
              className={isWalking ? 'animate-walk-arm-b' : ''}
            >
              <path
                d="M94,114 L104,148"
                fill="none"
                stroke={outfit.dark}
                strokeWidth="14"
                strokeLinecap="round"
              />
              <circle
                cx="104"
                cy="150"
                r="7"
                fill={skin.shade}
                stroke="#2B2420"
                strokeWidth="2.2"
              />
            </g>
          )}

          {/* Legs & Shoes */}
          <g>
            {/* Back / Left Leg */}
            <g
              style={{ transformOrigin: isSide ? '92px 160px' : '74px 160px' }}
              className={isWalking ? 'animate-walk-leg-a' : ''}
            >
              <rect
                x={isSide ? '82' : '64'}
                y="158"
                width="20"
                height="44"
                rx="8"
                fill={
                  config.outfitStyle === 'overalls'
                    ? outfit.dark
                    : isSide
                      ? '#1E293B'
                      : `url(#${uid}-pants)`
                }
                stroke="#1E293B"
                strokeWidth="2.8"
              />
              <line
                x1={isSide ? '86' : '68'}
                y1="164"
                x2={isSide ? '86' : '68'}
                y2="194"
                stroke="#FFFFFF"
                strokeOpacity="0.18"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              {config.shoesStyle === 'boots' ? (
                <path
                  d={`M${isSide ? 80 : 62},192 H${isSide ? 104 : 86} V212 Q${isSide ? 104 : 86},218 ${isSide ? 96 : 78},218 H${isSide ? 76 : 58} Q${isSide ? 76 : 58},208 ${isSide ? 80 : 62},204 Z`}
                  fill={`url(#${uid}-shoe)`}
                  stroke="#1E293B"
                  strokeWidth="2.8"
                />
              ) : (
                <rect
                  x={isSide ? '78' : '58'}
                  y="198"
                  width="28"
                  height="18"
                  rx={config.shoesStyle === 'casual' ? '9' : '6'}
                  fill={`url(#${uid}-shoe)`}
                  stroke="#1E293B"
                  strokeWidth="2.8"
                />
              )}
              <rect
                x={isSide ? '78' : '58'}
                y="211"
                width="28"
                height="6"
                rx="3"
                fill={shoe.sole}
                stroke="#1E293B"
                strokeWidth="2"
              />
            </g>

            {/* Front / Right Leg */}
            <g
              style={{ transformOrigin: isSide ? '86px 160px' : '106px 160px' }}
              className={isWalking ? 'animate-walk-leg-b' : ''}
            >
              <rect
                x={isSide ? '76' : '96'}
                y="158"
                width="20"
                height="44"
                rx="8"
                fill={config.outfitStyle === 'overalls' ? outfit.dark : `url(#${uid}-pants)`}
                stroke="#1E293B"
                strokeWidth="2.8"
              />
              <line
                x1={isSide ? '80' : '100'}
                y1="164"
                x2={isSide ? '80' : '100'}
                y2="194"
                stroke="#FFFFFF"
                strokeOpacity="0.18"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              {config.shoesStyle === 'boots' ? (
                <path
                  d={`M${isSide ? 74 : 94},192 H${isSide ? 98 : 118} V204 Q${isSide ? 102 : 122},208 ${isSide ? 102 : 122},218 H${isSide ? 82 : 102} Q${isSide ? 74 : 94},218 ${isSide ? 74 : 94},212 Z`}
                  fill={`url(#${uid}-shoe)`}
                  stroke="#1E293B"
                  strokeWidth="2.8"
                />
              ) : (
                <rect
                  x={isSide ? '76' : '94'}
                  y="198"
                  width="28"
                  height="18"
                  rx={config.shoesStyle === 'casual' ? '9' : '6'}
                  fill={`url(#${uid}-shoe)`}
                  stroke="#1E293B"
                  strokeWidth="2.8"
                />
              )}
              <rect
                x={isSide ? '76' : '94'}
                y="211"
                width="28"
                height="6"
                rx="3"
                fill={shoe.sole}
                stroke="#1E293B"
                strokeWidth="2"
              />
            </g>
          </g>

          {/* Left / Front-Side Arm */}
          <g
            style={{ transformOrigin: isSide ? '86px 114px' : '58px 114px' }}
            className={isWalking ? 'animate-walk-arm-a' : ''}
          >
            <path
              d={isSide ? 'M86,114 L74,148' : 'M58,112 C46,124 44,142 50,152'}
              fill="none"
              stroke={outfit.dark}
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              d={isSide ? 'M86,114 L74,148' : 'M58,112 C46,124 44,142 50,152'}
              fill="none"
              stroke={`url(#${uid}-outfit)`}
              strokeWidth="10.5"
              strokeLinecap="round"
            />
            <circle
              cx={isSide ? '74' : '50'}
              cy={isSide ? '150' : '153'}
              r="7.5"
              fill={`url(#${uid}-skin)`}
              stroke="#2B2420"
              strokeWidth="2.4"
            />
          </g>

          {/* Torso / Outfit */}
          <g>
            <rect
              x={isSide ? '66' : '58'}
              y="102"
              width={isSide ? '48' : '64'}
              height="62"
              rx="16"
              fill={`url(#${uid}-outfit)`}
              stroke="#1E293B"
              strokeWidth="3"
            />
            {/* Shoulder & Chest Rim Highlight */}
            <path
              d={isSide ? 'M70,114 Q70,106 82,106' : 'M63,118 C64,107 72,105 84,105'}
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.52"
              strokeWidth="2.6"
              strokeLinecap="round"
            />

            {/* Outfit Details */}
            {config.outfitStyle === 'hoodie' && !isBack && (
              <g>
                <path
                  d="M74,104 Q90,118 106,104"
                  fill="none"
                  stroke={outfit.accent}
                  strokeWidth="3.5"
                />
                <rect
                  x="72"
                  y="136"
                  width="36"
                  height="18"
                  rx="7"
                  fill={outfit.dark}
                  opacity="0.58"
                />
                <line
                  x1="84"
                  y1="112"
                  x2="84"
                  y2="126"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <line
                  x1="96"
                  y1="112"
                  x2="96"
                  y2="126"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {config.outfitStyle === 'jacket' && !isBack && (
              <g>
                <line x1="90" y1="103" x2="90" y2="163" stroke="#1E293B" strokeWidth="2.6" />
                <polygon points="74,104 90,122 80,104" fill={outfit.accent} />
                <polygon points="106,104 90,122 100,104" fill={outfit.accent} />
                <rect x="66" y="138" width="14" height="12" rx="3" fill={outfit.dark} />
                <rect x="100" y="138" width="14" height="12" rx="3" fill={outfit.dark} />
              </g>
            )}

            {config.outfitStyle === 'polo' && !isBack && (
              <g>
                <polygon
                  points="74,102 90,116 106,102"
                  fill="#FFFFFF"
                  stroke="#1E293B"
                  strokeWidth="2"
                />
                <circle cx="90" cy="122" r="2.2" fill="#FFFFFF" />
                <circle cx="90" cy="130" r="2.2" fill="#FFFFFF" />
              </g>
            )}

            {config.outfitStyle === 'overalls' && !isBack && (
              <g>
                <rect x="66" y="102" width="48" height="22" rx="6" fill="#FFFFFF" />
                <rect x="68" y="102" width="10" height="62" fill={outfit.dark} />
                <rect x="102" y="102" width="10" height="62" fill={outfit.dark} />
                <rect x="68" y="122" width="44" height="42" rx="8" fill={outfit.dark} />
                <circle cx="73" cy="126" r="2.6" fill="#FBBF24" />
                <circle cx="107" cy="126" r="2.6" fill="#FBBF24" />
              </g>
            )}

            {config.outfitStyle === 'casual' && !isBack && (
              <circle cx="90" cy="132" r="10" fill={outfit.accent} opacity="0.88" />
            )}

            {/* Front Chest Shawl Drape when wearing Hijab */}
            {isHijab && !isBack && (
              <g>
                <path
                  d={
                    isSide
                      ? 'M60,94 C62,82 120,82 120,96 C122,115 108,131 86,132 C68,131 58,114 60,94 Z'
                      : 'M51,95 C52,82 128,82 129,95 C134,114 118,131 90,133 C62,131 46,114 51,95 Z'
                  }
                  fill={`url(#${uid}-hijab-fold)`}
                  stroke="#1E293B"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
                <path
                  d={isSide ? 'M70,118 Q90,126 110,117' : 'M65,116 Q90,127 115,116'}
                  fill="none"
                  stroke={hijab.dark}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.32"
                />
                <path
                  d={isSide ? 'M74,123 Q90,129 106,123' : 'M70,122 Q90,130 110,122'}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.68"
                />
                {/* Gold Star Hijab Pin */}
                <g transform={`translate(${isSide ? 101 : 109}, 113)`}>
                  <circle cx="0" cy="0" r="4.6" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.4" />
                  <circle cx="0" cy="0" r="1.8" fill="#D97706" />
                </g>
              </g>
            )}

            {/* Magnifier Pin Accessory */}
            {config.accessory === 'magnifier-pin' && !isBack && (
              <g transform={isHijab ? 'translate(105, 138)' : 'translate(103, 120)'}>
                <circle cx="0" cy="0" r="6" fill="#FEF08A" stroke="#78350F" strokeWidth="2" />
                <line
                  x1="4"
                  y1="4"
                  x2="8"
                  y2="8"
                  stroke="#78350F"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>

          {/* Right Arm */}
          {!isSide && (
            <g
              style={{ transformOrigin: '122px 114px' }}
              className={
                isWaving
                  ? 'animate-[pusheenPawWave_1.2s_ease-in-out_infinite]'
                  : isWalking
                    ? 'animate-walk-arm-b'
                    : ''
              }
            >
              <path
                d={
                  isWaving
                    ? 'M122,112 C136,100 144,82 140,70'
                    : 'M122,112 C134,124 136,142 130,152'
                }
                fill="none"
                stroke={outfit.dark}
                strokeWidth="15"
                strokeLinecap="round"
              />
              <path
                d={
                  isWaving
                    ? 'M122,112 C136,100 144,82 140,70'
                    : 'M122,112 C134,124 136,142 130,152'
                }
                fill="none"
                stroke={`url(#${uid}-outfit)`}
                strokeWidth="10.5"
                strokeLinecap="round"
              />
              <circle
                cx={isWaving ? '140' : '130'}
                cy={isWaving ? '68' : '153'}
                r="7.5"
                fill={`url(#${uid}-skin)`}
                stroke="#2B2420"
                strokeWidth="2.4"
              />
            </g>
          )}

          {/* Explorer Backpack on Back View */}
          {config.accessory === 'backpack' && isBack && (
            <g>
              <rect
                x="58"
                y="106"
                width="64"
                height="52"
                rx="14"
                fill={`url(#${uid}-backpack)`}
                stroke="#78350F"
                strokeWidth="3"
              />
              <rect
                x="64"
                y="112"
                width="52"
                height="16"
                rx="7"
                fill="#F59E0B"
                stroke="#78350F"
                strokeWidth="2"
              />
              <circle cx="90" cy="134" r="5" fill="#FEF3C7" />
            </g>
          )}

          {/* Neck + Under-chin Shadow */}
          {!isHijab && (
            <>
              <rect x="81" y="90" width="18" height="16" rx="7" fill={skin.shade} />
              <ellipse cx="90" cy="96" rx="11" ry="4" fill="#8B5A3C" opacity="0.24" />
            </>
          )}

          {/* Head */}
          <g>
            {/* Ears (tucked safely inside when wearing hijab) */}
            {!isSide && !isHijab && (
              <>
                <circle
                  cx="52"
                  cy="66"
                  r="8"
                  fill={`url(#${uid}-skin)`}
                  stroke="#2B2420"
                  strokeWidth="2.6"
                />
                <circle
                  cx="128"
                  cy="66"
                  r="8"
                  fill={`url(#${uid}-skin)`}
                  stroke="#2B2420"
                  strokeWidth="2.6"
                />
              </>
            )}

            {/* Outer Tudung Frame Behind Cheeks (Front & Side Hijab) */}
            {isHijab && !isBack && (
              <ellipse
                cx="90"
                cy="65"
                rx={isSide ? '36' : '42'}
                ry="39"
                fill={`url(#${uid}-hijab-outer)`}
                stroke="#1E293B"
                strokeWidth="2.6"
              />
            )}

            {/* Face Circle */}
            <ellipse
              cx="90"
              cy="64"
              rx={isHijab ? (isSide ? '29' : '32') : isSide ? '31' : '36'}
              ry={isHijab ? '31' : '34'}
              fill={`url(#${uid}-skin)`}
              stroke={isHijab ? hijab.dark : '#2B2420'}
              strokeWidth={isHijab ? '2' : '3'}
            />

            {/* Anak Tudung Forehead Band & Chin-Wrap Fold (Hijab Front/Side) */}
            {isHijab && !isBack && (
              <>
                <path
                  d="M58,58 C62,33 118,33 122,58 C108,44 72,44 58,58 Z"
                  fill={hijab.inner}
                  stroke={hijab.dark}
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M49,64 C50,27 130,27 131,64 C122,38 58,38 49,64 Z"
                  fill={`url(#${uid}-hijab-outer)`}
                />
                <path
                  d="M64,34 Q90,26 116,34"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <path
                  d="M54,88 Q90,111 126,88 Q121,103 90,106 Q59,103 54,88 Z"
                  fill={`url(#${uid}-hijab-fold)`}
                  stroke="#1E293B"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* Facial Features (Front & Side only) */}
            {!isBack && (
              <g transform={isSide ? 'translate(10, 0)' : ''}>
                {/* Rosy Cheeks */}
                <ellipse cx="68" cy="74" rx="5.5" ry="3.2" fill="#F48FB1" opacity="0.58" />
                {!isSide && (
                  <ellipse cx="112" cy="74" rx="5.5" ry="3.2" fill="#F48FB1" opacity="0.58" />
                )}

                {/* Eyes & Brows by Base Appearance (with double catchlights!) */}
                {config.baseStyle === 'curious' ? (
                  <>
                    <path
                      d="M68,52 Q74,47 80,52"
                      fill="none"
                      stroke="#2B2420"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    {!isSide && (
                      <path
                        d="M100,50 Q106,45 112,50"
                        fill="none"
                        stroke="#2B2420"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                    )}
                    <circle cx="74" cy="62" r="4.9" fill="#1E293B" />
                    <circle cx="72.4" cy="60.2" r="1.8" fill="#FFFFFF" />
                    <circle cx="75.7" cy="63.7" r="0.9" fill="#FFFFFF" opacity="0.85" />
                    {!isSide && (
                      <>
                        <circle cx="106" cy="62" r="4.9" fill="#1E293B" />
                        <circle cx="104.4" cy="60.2" r="1.8" fill="#FFFFFF" />
                        <circle cx="107.7" cy="63.7" r="0.9" fill="#FFFFFF" opacity="0.85" />
                      </>
                    )}
                  </>
                ) : config.baseStyle === 'bold' ? (
                  <>
                    <line
                      x1="68"
                      y1="53"
                      x2="80"
                      y2="55"
                      stroke="#2B2420"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                    {!isSide && (
                      <line
                        x1="112"
                        y1="53"
                        x2="100"
                        y2="55"
                        stroke="#2B2420"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                      />
                    )}
                    <circle cx="74" cy="63" r="4.7" fill="#1E293B" />
                    <circle cx="72.5" cy="61.3" r="1.7" fill="#FFFFFF" />
                    <circle cx="75.6" cy="64.5" r="0.85" fill="#FFFFFF" opacity="0.85" />
                    {!isSide && (
                      <>
                        <circle cx="106" cy="63" r="4.7" fill="#1E293B" />
                        <circle cx="104.5" cy="61.3" r="1.7" fill="#FFFFFF" />
                        <circle cx="107.6" cy="64.5" r="0.85" fill="#FFFFFF" opacity="0.85" />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <circle cx="74" cy="63" r="4.8" fill="#1E293B" />
                    <circle cx="72.5" cy="61.2" r="1.8" fill="#FFFFFF" />
                    <circle cx="75.7" cy="64.5" r="0.9" fill="#FFFFFF" opacity="0.85" />
                    {!isSide && (
                      <>
                        <circle cx="106" cy="63" r="4.8" fill="#1E293B" />
                        <circle cx="104.5" cy="61.2" r="1.8" fill="#FFFFFF" />
                        <circle cx="107.7" cy="64.5" r="0.9" fill="#FFFFFF" opacity="0.85" />
                      </>
                    )}
                  </>
                )}

                {/* Tiny Cute Nose */}
                <path
                  d="M89,69 Q90,71 91,69"
                  fill="none"
                  stroke={skin.shade}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                {/* Mouth */}
                {config.baseStyle === 'friendly' ? (
                  <path
                    d="M80,77 Q90,85 100,77 Z"
                    fill="#F472B6"
                    stroke="#2B2420"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d={isSide ? 'M82,78 Q88,83 94,78' : 'M81,77 Q90,85 99,77'}
                    fill="none"
                    stroke="#2B2420"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                )}

                {/* Round Glasses Accessory */}
                {config.accessory === 'glasses' && (
                  <g stroke="#1E293B" strokeWidth="2.4" fill="rgba(224,242,254,0.35)">
                    <circle cx="74" cy="63" r="9" />
                    <line
                      x1="68"
                      y1="58"
                      x2="73"
                      y2="67"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity="0.55"
                    />
                    {!isSide && (
                      <>
                        <circle cx="106" cy="63" r="9" />
                        <line x1="83" y1="63" x2="97" y2="63" />
                        <line
                          x1="100"
                          y1="58"
                          x2="105"
                          y2="67"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          opacity="0.55"
                        />
                      </>
                    )}
                  </g>
                )}
              </g>
            )}

            {/* Hairstyles / Hijab Back View */}
            {isBack ? (
              isHijab ? (
                <g>
                  <path
                    d="M46,66 C45,28 68,20 90,20 C112,20 135,28 134,66 C135,96 128,118 118,128 Q90,136 62,128 C52,118 45,96 46,66 Z"
                    fill={`url(#${uid}-hijab-outer)`}
                    stroke="#1E293B"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M62,36 Q90,26 118,36"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    opacity="0.48"
                  />
                  <path
                    d="M60,104 Q90,115 120,104"
                    fill="none"
                    stroke={hijab.dark}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </g>
              ) : (
                <g>
                  <path
                    d={
                      config.hairStyle === 'long'
                        ? 'M52,58 C46,85 48,125 56,134 L124,134 C132,125 134,85 128,58 C124,34 108,26 90,26 C72,26 56,34 52,58 Z'
                        : 'M53,62 C52,35 70,25 90,25 C110,25 128,35 127,62 C126,82 115,92 90,92 C65,92 54,82 53,62 Z'
                    }
                    fill={`url(#${uid}-hair)`}
                    stroke="#2B2420"
                    strokeWidth="2.8"
                  />
                  <path
                    d="M66,38 Q90,31 114,38"
                    fill="none"
                    stroke={hair.highlight}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                </g>
              )
            ) : (
              !isHijab && (
                <g fill={`url(#${uid}-hair)`} stroke="#2B2420" strokeWidth="2.8" strokeLinejoin="round">
                  {config.hairStyle === 'short' && (
                    <path d="M54,58 C54,32 72,24 90,24 C108,24 126,32 126,58 C120,44 106,40 90,42 C74,40 60,44 54,58 Z" />
                  )}
                  {config.hairStyle === 'long' && (
                    <path d="M53,58 C53,32 72,24 90,24 C108,24 127,32 127,58 C118,46 105,40 90,44 C75,40 62,46 53,58 Z" />
                  )}
                  {config.hairStyle === 'curly' && (
                    <g>
                      <circle cx="64" cy="40" r="14" />
                      <circle cx="82" cy="31" r="15" />
                      <circle cx="102" cy="31" r="15" />
                      <circle cx="117" cy="41" r="14" />
                      <circle cx="56" cy="54" r="10" />
                      <circle cx="124" cy="54" r="10" />
                    </g>
                  )}
                  {config.hairStyle === 'bob' && (
                    <path d="M50,68 C48,36 68,24 90,24 C112,24 132,36 130,68 L124,84 C122,64 114,44 90,44 C66,44 58,64 56,84 Z" />
                  )}
                  {config.hairStyle === 'spiky' && (
                    <path d="M54,58 L48,40 L66,44 L72,22 L90,34 L106,20 L114,42 L132,36 L126,58 C114,44 98,42 90,42 C82,42 66,44 54,58 Z" />
                  )}
                  {config.hairStyle === 'pigtails' && (
                    <path d="M54,58 C54,32 72,24 90,24 C108,24 126,32 126,58 C118,44 104,40 90,44 C76,40 62,44 54,58 Z" />
                  )}
                  {/* Hair Specular Highlight */}
                  <path
                    d="M66,34 Q88,28 112,34"
                    fill="none"
                    stroke={hair.highlight}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    opacity="0.65"
                  />
                </g>
              )
            )}

            {/* Star Headband Accessory */}
            {config.accessory === 'headband' && (
              <g>
                <path
                  d="M54,48 Q90,26 126,48"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <circle cx="110" cy="36" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
              </g>
            )}

            {/* Detective Cap Accessory */}
            {config.accessory === 'cap' && (
              <g transform="translate(54, 14)">
                <path
                  d="M10,26 C10,10 24,2 36,2 C48,2 62,10 62,26 Z"
                  fill={`url(#${uid}-cap)`}
                  stroke="#5D5048"
                  strokeWidth="2.8"
                />
                <path
                  d="M22,6 L20,25 M50,6 L52,25 M14,16 L58,16"
                  stroke="#7D502D"
                  strokeWidth="1.6"
                  opacity="0.7"
                />
                <path
                  d="M2,26 Q36,20 72,26 Q36,32 2,26 Z"
                  fill="#9E6B40"
                  stroke="#5D5048"
                  strokeWidth="2.8"
                />
              </g>
            )}
          </g>
        </g>
      </g>
    </svg>
  );
};

interface DetectiveAvatarPortraitProps {
  config: AvatarConfig;
  className?: string;
}

export const DetectiveAvatarPortrait: React.FC<DetectiveAvatarPortraitProps> = ({
  config,
  className = 'w-11 h-11',
}) => {
  return (
    <svg viewBox="40 12 100 100" className={className} aria-hidden="true">
      <svg x="0" y="0" width="180" height="240" viewBox="0 0 180 240">
        <DetectiveAvatar config={config} view="front" pose="idle" />
      </svg>
    </svg>
  );
};
