import type { DialogueStep, Screen09Progress } from '../types/game.ts';

export function createDefaultScreen09Progress(): Screen09Progress {
  return {
    enteredGarden: false,
    welcomeDialogueDone: false,
    adviceOriginal: {
      task1Should: '',
      task2Shouldnt: '',
      task3Optional: '',
    },
    adviceFinal: {
      task1Should: '',
      task2Shouldnt: '',
      task3Optional: '',
    },
    adviceChecklist: {
      gaveGoodAdvice: false,
      usedShouldOrShouldnt: false,
      advisedAdult: false,
      warnedClickOrPassword: false,
    },
    adviceCompleted: false,
    trafficLightExplored: {
      redStop: false,
      yellowCheck: false,
      greenDecide: false,
    },
    trafficLightCompleted: false,
    reflectionSelected: [],
    reflectionCompleted: false,
    promiseOriginal: {
      nextTimeOnline: '',
      redFlagRemember: '',
    },
    promiseFinal: {
      nextTimeOnline: '',
      redFlagRemember: '',
    },
    promiseMade: false,
    passportCompleted: false,
    badgeAwarded: false,
    finalCeremonyUnlocked: false,
    completedAt: 0,
    currentStage: 'exterior',
  };
}

export const SCREEN09_WELCOME_SCRIPT: DialogueStep[] = [
  {
    id: 's09-w1',
    speaker: 'teacher-chelsea',
    speakerName: 'Teacher Chelsea',
    expression: 'happy',
    text: 'Welcome to the Digital Safe Garden, Detective!',
  },
  {
    id: 's09-w2',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'Look at the glowing flowers, the glass stream bridge, and our Promise Tree!',
  },
  {
    id: 's09-w3',
    speaker: 'teacher-chelsea',
    speakerName: 'Teacher Chelsea',
    expression: 'encouraging',
    text: "This peaceful place is for your final Detective activity: MY FINAL ADVICE + REFLECTION. Let's give Daniel caring advice, review our STOP-CHECK-DECIDE rule, and stamp your Digital Safety Passport!",
  },
];

export const SCREEN09_WORD_BANK = [
  'STOP',
  'CHECK',
  'CLICK',
  'PASSWORD',
  'TRUSTED ADULT',
  'PARENTS',
  'TEACHER',
  'SAFE',
  'RED FLAG',
  'UNKNOWN SENDER',
  'TELL',
  'CAREFUL',
];

export const SCREEN09_ADVICE_CHECKLIST: Array<{
  key: 'gaveGoodAdvice' | 'usedShouldOrShouldnt' | 'advisedAdult' | 'warnedClickOrPassword';
  label: string;
}> = [
  { key: 'gaveGoodAdvice', label: 'I gave Daniel kind and helpful online-safety advice.' },
  { key: 'usedShouldOrShouldnt', label: 'I used "should" and "shouldn\'t" clearly.' },
  { key: 'advisedAdult', label: 'I reminded Daniel to talk to a trusted adult.' },
  { key: 'warnedClickOrPassword', label: 'I warned Daniel not to click strange links or share passwords.' },
];

export const TRAFFIC_LIGHT_STATIONS = [
  {
    id: 'redStop' as const,
    colorName: 'RED LIGHT · STOP',
    shortLabel: 'STOP',
    bgGrad: 'from-[#FB7185] to-[#E11D48]',
    border: 'border-rose-300',
    pillBg: 'bg-rose-50 text-[#BE123C]',
    headline: 'Pause right away — do NOT tap or rush!',
    detail:
      'When a pop-up flashes a countdown timer or promises 2,000 free game coins, take your hands off the screen and pause calmly.',
  },
  {
    id: 'yellowCheck' as const,
    colorName: 'YELLOW LIGHT · CHECK',
    shortLabel: 'CHECK',
    bgGrad: 'from-[#FCD34D] to-[#D97706]',
    border: 'border-amber-300',
    pillBg: 'bg-amber-50 text-[#B45309]',
    headline: 'Look closely for the 5 Digital Red Flags:',
    points: [
      '1. Unknown or strange sender name',
      '2. Too-good-to-be-true free prizes or coins',
      '3. Urgent countdown or pressure to act fast',
      '4. Unknown or suspicious web link',
      '5. Request for your password or private details',
    ],
  },
  {
    id: 'greenDecide' as const,
    colorName: 'GREEN LIGHT · DECIDE',
    shortLabel: 'DECIDE',
    bgGrad: 'from-[#34D399] to-[#16A34A]',
    border: 'border-emerald-300',
    pillBg: 'bg-emerald-50 text-[#15803D]',
    headline: 'Choose the safest detective action!',
    detail:
      'Close the suspicious pop-up or message without clicking, block the unknown sender if needed, and show a trusted adult (parent, guardian, or teacher).',
  },
];

export const SCREEN09_REFLECTION_ITEMS = [
  {
    id: 'spot-red-flags',
    text: 'Spot warning signs in a suspicious pop-up or email.',
  },
  {
    id: 'ask-for-advice',
    text: 'Ask for advice politely when I feel unsure online.',
  },
  {
    id: 'give-safe-advice',
    text: 'Give safe advice to friends using "should" and "shouldn\'t".',
  },
  {
    id: 'stop-check-decide',
    text: 'Use STOP, CHECK, and DECIDE before clicking any link.',
  },
  {
    id: 'tell-trusted-adult',
    text: 'Tell a trusted adult whenever a message asks for my password.',
  },
];

export const SCREEN09_FINAL_GARDEN_SCRIPT: DialogueStep[] = [
  {
    id: 's09-fg1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: 'Look how brightly your leaf shines on the Digital Safety Promise Tree!',
  },
  {
    id: 's09-fg2',
    speaker: 'teacher-chelsea',
    speakerName: 'Teacher Chelsea',
    expression: 'celebrating',
    text: 'Your Digital Safety Passport is now officially stamped and you have earned the DIGITAL GUARDIAN badge!',
  },
];

export function validateScreen09FinalAdvice(params: {
  task1Should: string;
  task2Shouldnt: string;
  task3Optional: string;
}): { acceptable: boolean; feedback: string } {
  const t1 = params.task1Should.trim();
  const t2 = params.task2Shouldnt.trim();
  const t3 = params.task3Optional.trim();
  const combined = `${t1} ${t2} ${t3}`.toLowerCase();

  if (t1.length < 14 || t2.length < 14) {
    return {
      acceptable: false,
      feedback:
        'Please complete both Task 1 ("Daniel, you should...") and Task 2 ("You shouldn\'t...") with helpful words.',
    };
  }

  const badSmash = /(asdf|qwer|zxcv|hjkl|aaaa|ssss|xxxx|zzzz)/i;
  if (badSmash.test(combined)) {
    return {
      acceptable: false,
      feedback: 'Let us use clear English words from the Word Bank instead of random letters.',
    };
  }

  const hasShould = /\b(should|could)\b/i.test(t1);
  const hasShouldnt = /\b(shouldn't|should not|never|do not|don't)\b/i.test(t2);
  if (!hasShould || !hasShouldnt) {
    return {
      acceptable: false,
      feedback:
        'Check your sentences: Task 1 should include "should" and Task 2 should include "shouldn\'t"!',
    };
  }

  const unsafeTask1 =
    /\b(should)\b.{0,22}\b(click|tap|open|enter|share|give)\b.{0,20}\b(link|password|coins)\b/i.test(
      t1
    ) && !/\b(not|never|shouldn't)\b/i.test(t1);

  if (unsafeTask1) {
    return {
      acceptable: false,
      feedback:
        'Careful! Tell Daniel something SAFE he should do—like asking his parents or stopping to check!',
    };
  }

  const hasSafeKeyword =
    /\b(stop|check|ask|tell|adult|parent|parents|teacher|click|link|password|private|safe|ignore|close|delete)\b/i.test(
      combined
    );
  if (!hasSafeKeyword) {
    return {
      acceptable: false,
      feedback:
        'Remember to connect your advice to online safety—for example stopping, not clicking links, keeping passwords private, or telling a trusted adult!',
    };
  }

  return {
    acceptable: true,
    feedback: 'Warm, safe, and thoughtful advice for Daniel! Your words will help protect him online.',
  };
}

export function validateScreen09Promise(params: {
  nextTimeOnline: string;
  redFlagRemember: string;
}): { acceptable: boolean; feedback: string } {
  const p1 = params.nextTimeOnline.trim();
  const p2 = params.redFlagRemember.trim();
  if (p1.length < 10 || p2.length < 8) {
    return {
      acceptable: false,
      feedback: 'Please write a clear, meaningful promise in both boxes before placing your leaf!',
    };
  }

  const badSmash = /(asdf|qwer|zxcv|hjkl|aaaa|ssss|xxxx|zzzz)/i;
  if (badSmash.test(`${p1} ${p2}`)) {
    return {
      acceptable: false,
      feedback: 'Try writing clear English words for your Digital Safety Promise!',
    };
  }

  return {
    acceptable: true,
    feedback: 'Beautiful Digital Safety Promise! Ready to shine on the Promise Tree.',
  };
}
