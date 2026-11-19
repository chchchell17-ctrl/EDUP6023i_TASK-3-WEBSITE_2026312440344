import express, { type Request, type Response } from 'express';
import type { Screen08AnswerKey } from '../src/types/game.ts';

interface QuestionKeySpec {
  correctKey: Screen08AnswerKey;
  explanation: string;
  evidenceExcerpt: string;
}

const SCREEN08_ANSWER_KEYS: Record<number, QuestionKeySpec> = {
  1: {
    correctKey: 'C',
    explanation: 'The shiny gold pop-up box claimed that Daniel had won 2,000 free game coins.',
    evidenceExcerpt:
      '"The message claimed that Daniel had won 2,000 free game coins and asked him to click a strange web link right away."',
  },
  2: {
    correctKey: 'B',
    explanation:
      'It asked Daniel to type in his secret account password and home phone number before the timer ended.',
    evidenceExcerpt:
      '"It also told him to type his secret account password and home phone number before a ten-minute countdown clock reached zero."',
  },
  3: {
    correctKey: 'C',
    explanation:
      'Daniel noticed the sender was an unknown player named "CoinMaster_99", not the official Turbo Track team.',
    evidenceExcerpt:
      '"When he checked carefully, he noticed that the sender was an unknown player named \\"CoinMaster_99\\", not the official Turbo Track team."',
  },
  4: {
    correctKey: 'D',
    explanation:
      'Daniel closed the pop-up window safely and showed his tablet to his older sister, Mei Ling, so they could tell their parents.',
    evidenceExcerpt:
      '"Instead, he closed the pop-up window safely and immediately showed his tablet to his older sister, Mei Ling, so they could tell their parents together."',
  },
  5: {
    correctKey: 'C',
    explanation:
      'Daniel remembered the STOP, CHECK, and DECIDE rule he had learnt at Detective HQ.',
    evidenceExcerpt:
      '"Daniel felt excited at first, but he paused and remembered the STOP, CHECK, and DECIDE rule he had learnt at Detective HQ."',
  },
};

export function gradeScreen08Question(
  questionNumber: number,
  selectedAnswer: Screen08AnswerKey
): {
  correct: boolean;
  explanation: string;
  evidenceExcerpt: string;
} {
  const spec = SCREEN08_ANSWER_KEYS[questionNumber];
  if (!spec) {
    return {
      correct: false,
      explanation: 'Question not found.',
      evidenceExcerpt: '',
    };
  }

  return {
    correct: spec.correctKey === selectedAnswer,
    explanation: spec.explanation,
    evidenceExcerpt: spec.evidenceExcerpt,
  };
}

export function createScreen08Router(): express.Router {
  const router = express.Router();
  router.use(express.json({ limit: '16kb' }));

  router.post('/grade', (req: Request, res: Response) => {
    const qNum = Number(req.body?.questionNumber);
    const rawAns = String(req.body?.selectedAnswer ?? '').toUpperCase();
    if (
      !Number.isInteger(qNum) ||
      qNum < 1 ||
      qNum > 5 ||
      !['A', 'B', 'C', 'D'].includes(rawAns)
    ) {
      res.status(400).json({ ok: false, message: 'Invalid question or answer.' });
      return;
    }

    const result = gradeScreen08Question(qNum, rawAns as Screen08AnswerKey);
    res.json({ ok: true, ...result });
  });

  return router;
}
