import type { DialogueStep, Screen08AnswerKey, Screen08Progress } from '../types/game.ts';

export function createDefaultScreen08Progress(): Screen08Progress {
  return {
    enteredArcade: false,
    welcomeDialogueDone: false,
    findDanielWrongClicks: 0,
    starsDeductedInSearch: 0,
    danielFound: false,
    assessmentStarted: false,
    assessmentCompleted: false,
    officialFirstAttemptSubmitted: false,
    firstAttemptScore: 0,
    bestScore: 0,
    lo1ReadingAchieved: false,
    responses: [],
    badgeAwarded: false,
    digitalSafeGardenUnlocked: false,
    currentStage: 'exterior',
  };
}

export type ArcadeBayId = 'racing-pods' | 'prize-counter' | 'claw-hoops' | 'gaming-lounge';

export interface ArcadeNpcSpot {
  id: string;
  bayId: ArcadeBayId;
  name: string;
  stationLabel: string;
  isDaniel: boolean;
  xPct: number;
  yPct: number;
  outfitColor: string;
  hairColor: string;
  bubbleHint: string;
}

export const ARCADE_NPC_SPOTS: ArcadeNpcSpot[] = [
  {
    id: 'npc-racer',
    bayId: 'racing-pods',
    name: 'Amir',
    stationLabel: 'Turbo Racing Pods',
    isDaniel: false,
    xPct: 22,
    yPct: 30,
    outfitColor: '#38BDF8',
    hairColor: '#1E293B',
    bubbleHint: 'Playing Turbo Racing 3000!',
  },
  {
    id: 'npc-prize',
    bayId: 'prize-counter',
    name: 'Kevin',
    stationLabel: 'Starlight Prize Counter',
    isDaniel: false,
    xPct: 78,
    yPct: 30,
    outfitColor: '#FBBF24',
    hairColor: '#0F172A',
    bubbleHint: 'Counting arcade prize tickets!',
  },
  {
    id: 'npc-claw',
    bayId: 'claw-hoops',
    name: 'Siti',
    stationLabel: 'Neon Claw & Hoops',
    isDaniel: false,
    xPct: 22,
    yPct: 75,
    outfitColor: '#F472B6',
    hairColor: '#451A03',
    bubbleHint: 'Trying to grab a Pusheen plushie!',
  },
  {
    id: 'npc-daniel',
    bayId: 'gaming-lounge',
    name: 'Daniel',
    stationLabel: 'Aqua Gaming Pod #4',
    isDaniel: true,
    xPct: 78,
    yPct: 75,
    outfitColor: '#7C3AED',
    hairColor: '#1E293B',
    bubbleHint: 'Staring nervously at his tablet...',
  },
];

export const SCREEN08_WELCOME_SCRIPT: DialogueStep[] = [
  {
    id: 's08-w1',
    speaker: 'teacher-chelsea',
    speakerName: 'Teacher Chelsea',
    expression: 'happy',
    text: 'Welcome to Game Arcade, Detective!',
  },
  {
    id: 's08-w2',
    speaker: 'player',
    expression: 'excited',
    text: 'Wow! This place looks amazing!',
  },
  {
    id: 's08-w3',
    speaker: 'teacher-chelsea',
    speakerName: 'Teacher Chelsea',
    expression: 'encouraging',
    text: 'It certainly does! But today, we have an important mission.',
  },
  {
    id: 's08-w4',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'curious',
    text: 'Someone here needs our help!',
  },
  {
    id: 's08-w5',
    speaker: 'player',
    expression: 'curious',
    text: 'Who is it?',
  },
  {
    id: 's08-w6',
    speaker: 'teacher-chelsea',
    speakerName: 'Teacher Chelsea',
    expression: 'worried',
    text: 'His name is Daniel. He has received a suspicious message while playing an online game.',
  },
  {
    id: 's08-w7',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: "Let's find him!",
  },
  {
    id: 's08-w8',
    speaker: 'player',
    expression: 'excited',
    text: "Let's go!",
  },
];

export const SCREEN08_DANIEL_PROBLEM_SCRIPT: DialogueStep[] = [
  {
    id: 's08-dp1',
    speaker: 'daniel',
    speakerName: 'Daniel',
    expression: 'worried',
    text: "Oh! Thank goodness you're here, Detective! While I was playing my game, a message popped up saying I won 2,000 free game coins!",
  },
  {
    id: 's08-dp2',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'curious',
    text: 'Did it ask you to click a link or enter your password, Daniel?',
  },
  {
    id: 's08-dp3',
    speaker: 'daniel',
    speakerName: 'Daniel',
    expression: 'thinking',
    text: 'Yes! It told me to tap a link and enter my account password quickly before the timer ran out!',
  },
  {
    id: 's08-dp4',
    speaker: 'teacher-chelsea',
    speakerName: 'Teacher Chelsea',
    expression: 'encouraging',
    text: "Now it is time for your Independent Reading Detective Mission! Read Daniel's story carefully on your own and answer all five questions.",
  },
];

export const SCREEN08_ASSESSMENT_RULES = [
  'Work completely on your own — this is your independent reading mission!',
  'Read both paragraphs of "DANIEL\'S GAME REWARD" carefully before choosing your answer.',
  'Use the magnifying glass button whenever you want larger, clearer reading text.',
  'Answer all 5 questions (1 mark each). Reach at least 4 out of 5 to achieve LO1 Reading!',
  'Stay calm and trust your detective skills — every careful detail is inside the passage!',
];

export const SCREEN08_READING_PASSAGE = {
  title: "DANIEL'S GAME REWARD",
  paragraphs: [
    'Last Saturday afternoon, Daniel was playing his favourite racing game, Turbo Track, in his living room. Suddenly, a shiny gold pop-up box appeared on his tablet screen with bright flashing stars. The message claimed that Daniel had won 2,000 free game coins and asked him to click a strange web link right away. It also told him to type his secret account password and home phone number before a ten-minute countdown clock reached zero.',
    'Daniel felt excited at first, but he paused and remembered the STOP, CHECK, and DECIDE rule he had learnt at Detective HQ. When he checked carefully, he noticed that the sender was an unknown player named "CoinMaster_99", not the official Turbo Track team. Realising these were classic red flags, Daniel did not click the link or enter his password. Instead, he closed the pop-up window safely and immediately showed his tablet to his older sister, Mei Ling, so they could tell their parents together.',
  ],
};

export interface Screen08QuestionItem {
  questionNumber: number;
  prompt: string;
  options: Record<Screen08AnswerKey, string>;
}

export const SCREEN08_QUESTIONS: Screen08QuestionItem[] = [
  {
    questionNumber: 1,
    prompt: 'What prize did the shiny gold pop-up box claim Daniel had won?',
    options: {
      A: 'A brand-new racing tablet',
      B: '5,000 bonus tickets',
      C: '2,000 free game coins',
      D: 'A secret racing car',
    },
  },
  {
    questionNumber: 2,
    prompt: 'What private details did the message ask Daniel to type in?',
    options: {
      A: 'His school name and favourite colour',
      B: 'His secret account password and home phone number',
      C: "His older sister's game username",
      D: "His teacher's email address",
    },
  },
  {
    questionNumber: 3,
    prompt: 'Why did Daniel become suspicious when he checked the sender?',
    options: {
      A: 'The message was written in a foreign language.',
      B: 'His friend Aina warned him in a text message.',
      C: 'The sender was an unknown player called "CoinMaster_99", not the official game team.',
      D: 'The countdown clock showed twenty hours left.',
    },
  },
  {
    questionNumber: 4,
    prompt: 'How did Daniel stay safe instead of clicking the link?',
    options: {
      A: 'He typed a fake password into the pop-up box.',
      B: 'He sent the link to his classmates to test it first.',
      C: 'He turned off the tablet and hid it under his bed.',
      D: 'He closed the pop-up window and showed his tablet to his older sister, Mei Ling.',
    },
  },
  {
    questionNumber: 5,
    prompt: 'Which safety rule helped Daniel pause before reacting to the pop-up?',
    options: {
      A: 'Ask, Write, and Reply',
      B: 'Click, Check, and Share',
      C: 'STOP, CHECK, and DECIDE',
      D: 'Play, Win, and Save',
    },
  },
];

export function getScreen08ResultBand(score: number): {
  bandLabel: string;
  achieved: boolean;
  summaryText: string;
  badgeColor: string;
} {
  if (score >= 5) {
    return {
      bandLabel: '5/5 · Excellent — LO1 Reading Achieved!',
      achieved: true,
      summaryText: 'Outstanding detective reading! You spotted every single detail independently.',
      badgeColor: 'bg-emerald-100 text-[#15803D] border-emerald-300',
    };
  }
  if (score === 4) {
    return {
      bandLabel: '4/5 · Good — LO1 Reading Achieved!',
      achieved: true,
      summaryText: 'Well done, Detective! You found at least 4 out of 5 key details from the passage.',
      badgeColor: 'bg-emerald-100 text-[#15803D] border-emerald-300',
    };
  }
  if (score === 3) {
    return {
      bandLabel: '3/5 · Developing — Not Yet Achieved',
      achieved: false,
      summaryText:
        'Good effort! Review the missed clues below with the passage, then try again to sharpen your reading!',
      badgeColor: 'bg-amber-100 text-[#B45309] border-amber-300',
    };
  }
  if (score === 2) {
    return {
      bandLabel: '2/5 · Beginning — Not Yet Achieved',
      achieved: false,
      summaryText:
        'Keep reading closely! Every answer is written directly inside the two paragraphs.',
      badgeColor: 'bg-amber-100 text-[#B45309] border-amber-300',
    };
  }
  return {
    bandLabel: `${score}/5 · Needs Support — Not Yet Achieved`,
    achieved: false,
    summaryText:
      'Use the magnifying glass to read each line slowly and match the exact words from the story!',
    badgeColor: 'bg-rose-100 text-[#BE123C] border-rose-300',
  };
}

export const SCREEN08_FINALE_SCRIPT: DialogueStep[] = [
  {
    id: 's08-f1',
    speaker: 'daniel',
    speakerName: 'Daniel',
    expression: 'celebrating',
    text: "Thank you, Detective! You helped me understand why that 2,000 free coins pop-up was a trap!",
  },
  {
    id: 's08-f2',
    speaker: 'teacher-chelsea',
    speakerName: 'Teacher Chelsea',
    expression: 'celebrating',
    text: 'Wonderful work! You earned the SAFE CLICKER badge! Let us head to the Digital Safe Garden for your final advice, promise, and celebration!',
  },
];
