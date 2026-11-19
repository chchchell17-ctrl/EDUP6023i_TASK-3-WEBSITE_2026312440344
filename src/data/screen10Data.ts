import type { DialogueStep, Screen10Progress } from '../types/game.ts';

export function createDefaultScreen10Progress(): Screen10Progress {
  return {
    reunionDialogueDone: false,
    ceremonyCompleted: false,
    certificateViewed: false,
    completedAt: 0,
  };
}

export interface CanonicalTownBadge {
  id: string;
  name: string;
  locationLabel: string;
  description: string;
  accentBg: string;
  accentText: string;
}

export const ALL_SEVEN_TOWN_BADGES: CanonicalTownBadge[] = [
  {
    id: 'badge-junior-detective',
    name: 'Junior Detective Badge',
    locationLabel: 'Detective HQ',
    description: 'Completed induction & online safety pledge at Detective HQ.',
    accentBg: 'bg-sky-50 border-sky-300',
    accentText: 'text-[#0369A1]',
  },
  {
    id: 'badge-red-flag-spotter',
    name: 'Red Flag Spotter',
    locationLabel: 'Red Flag Centre',
    description: 'Uncovered all 5 warning signs hidden inside a suspicious email.',
    accentBg: 'bg-rose-50 border-rose-300',
    accentText: 'text-[#BE123C]',
  },
  {
    id: 'badge-ainas-helper',
    name: "Aina's Helper Badge",
    locationLabel: "Aina's House",
    description: 'Helped Aina solve the mysterious prize tablet case file.',
    accentBg: 'bg-purple-50 border-purple-300',
    accentText: 'text-[#7C3AED]',
  },
  {
    id: 'badge-bytes-helper',
    name: "Byte's Helper Badge",
    locationLabel: 'Cyber Café',
    description: 'Classified 10 digital message files & cleared the mini challenge.',
    accentBg: 'bg-amber-50 border-amber-300',
    accentText: 'text-[#B45309]',
  },
  {
    id: 'badge-words-that-help',
    name: 'Words That Help Badge',
    locationLabel: 'Advice Centre',
    description: 'Wrote caring messages asking for, giving, and responding to advice.',
    accentBg: 'bg-teal-50 border-teal-300',
    accentText: 'text-[#0F766E]',
  },
  {
    id: 'badge-safe-clicker',
    name: 'SAFE CLICKER',
    locationLabel: 'Game Arcade',
    description: 'Helped Daniel & completed the independent reading detective mission.',
    accentBg: 'bg-indigo-50 border-indigo-300',
    accentText: 'text-[#4338CA]',
  },
  {
    id: 'badge-digital-guardian',
    name: 'DIGITAL GUARDIAN',
    locationLabel: 'Digital Safe Garden',
    description: 'Stamped the Digital Safety Passport & placed a leaf on the Promise Tree.',
    accentBg: 'bg-emerald-50 border-emerald-300',
    accentText: 'text-[#15803D]',
  },
];

export const SCREEN10_REUNION_SCRIPT: DialogueStep[] = [
  {
    id: 's10-r1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: 'Look, everyone! Our Junior Detective has completed every single mission across Detective Town!',
  },
  {
    id: 's10-r2',
    speaker: 'aina',
    speakerName: 'Aina',
    expression: 'happy',
    text: 'Thank you for helping me check that strange tablet message earlier — I always ask my mum first now!',
  },
  {
    id: 's10-r3',
    speaker: 'byte',
    speakerName: 'Byte the Robot',
    expression: 'celebrating',
    text: 'Beep-boop! Our Cyber Café scanners are 100% sparkling clean thanks to your sharp detective eyes!',
  },
  {
    id: 's10-r4',
    speaker: 'daniel',
    speakerName: 'Daniel',
    expression: 'happy',
    text: 'And I did not fall for the 2,000 free game coins trick! STOP, CHECK, and DECIDE really works!',
  },
  {
    id: 's10-r5',
    speaker: 'teacher-chelsea',
    speakerName: 'Teacher Chelsea',
    expression: 'celebrating',
    text: 'We are all so proud of you! Today, you officially become a certified Digital Safety Guardian!',
  },
];
