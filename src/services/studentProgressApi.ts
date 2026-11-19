import type { StudentSession } from '../types/auth.ts';
import type { Screen08AnswerKey, StudentGameState } from '../types/game.ts';
import { createDefaultStudentGameState } from '../data/townData.ts';
import { createDefaultScreen03Progress } from '../data/screen03Data.ts';
import { createDefaultScreen04Progress } from '../data/screen04Data.ts';
import { createDefaultScreen05Progress } from '../data/screen05Data.ts';
import { createDefaultScreen06Progress } from '../data/screen06Data.ts';
import { createDefaultScreen07Progress } from '../data/screen07Data.ts';
import { createDefaultScreen08Progress } from '../data/screen08Data.ts';
import { createDefaultScreen09Progress } from '../data/screen09Data.ts';
import { createDefaultScreen10Progress } from '../data/screen10Data.ts';
import { computeCertificateRecord } from '../utils/certificateExport.ts';

function getLocalStorageKey(session: StudentSession): string {
  return `ddw_student_state_${session.classCode}_${session.studentCode}`;
}

export function loadLocalCachedState(session: StudentSession): StudentGameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(getLocalStorageKey(session));
    if (!raw) return null;
    return JSON.parse(raw) as StudentGameState;
  } catch {
    return null;
  }
}

export function saveLocalCachedState(
  session: StudentSession,
  state: StudentGameState,
  pendingSync: boolean
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      getLocalStorageKey(session),
      JSON.stringify({ ...state, _pendingSync: pendingSync })
    );
  } catch {
    // Ignore storage quota issues
  }
}

export function buildInitialStudentStateFromSession(session: StudentSession): StudentGameState {
  const defaults = createDefaultStudentGameState();
  const p = session.progress;

  const resolvedLastScene: StudentGameState['lastScene'] = !p.avatarConfig
    ? 'customisation'
    : p.lastPosition === 'screen-10-handoff'
      ? 'screen-10-handoff'
      : p.lastPosition === 'screen-09-handoff'
        ? 'screen-09-handoff'
        : p.lastPosition === 'screen-08-handoff'
          ? 'screen-08-handoff'
          : p.lastPosition === 'screen-07-handoff'
            ? 'screen-07-handoff'
            : p.lastPosition === 'screen-06-handoff'
              ? 'screen-06-handoff'
              : p.lastPosition === 'screen-05-handoff'
                ? 'screen-05-handoff'
                : p.lastPosition === 'screen-04-handoff'
                  ? 'screen-04-handoff'
                  : p.lastPosition === 'screen-03-handoff'
                    ? 'screen-03-handoff'
                    : 'town';

  const serverState: StudentGameState = {
    detectiveNickname: p.detectiveNickname || '',
    avatarConfig: p.avatarConfig ?? null,
    tutorialProgress: p.tutorialProgress ?? defaults.tutorialProgress,
    screen03Progress: p.screen03Progress ?? createDefaultScreen03Progress(),
    screen04Progress: p.screen04Progress ?? createDefaultScreen04Progress(),
    screen05Progress: p.screen05Progress ?? createDefaultScreen05Progress(),
    screen06Progress: p.screen06Progress ?? createDefaultScreen06Progress(),
    screen07Progress: p.screen07Progress ?? createDefaultScreen07Progress(),
    screen08Progress: p.screen08Progress ?? createDefaultScreen08Progress(),
    screen09Progress: p.screen09Progress ?? createDefaultScreen09Progress(),
    screen10Progress: p.screen10Progress ?? createDefaultScreen10Progress(),
    teacherLo2Assessment: p.teacherLo2Assessment,
    certificateRecord: p.certificateRecord,
    settings: p.settings ?? defaults.settings,
    inventory: p.inventory ?? defaults.inventory,
    xp: p.xp ?? 0,
    stars: p.stars ?? 0,
    level: Math.max(1, Math.floor((p.xp ?? 0) / 100) + 1),
    currentMission: p.currentMission || defaults.currentMission,
    completedMissions: p.completedMissions ?? [],
    unlockedBuildings: p.unlockedBuildings ?? ['detective-hq'],
    lastPosition: p.townPosition ?? defaults.lastPosition,
    lastScene: resolvedLastScene,
    updatedAt: p.updatedAt ?? 0,
  };

  // Merge newer offline-cached progress only if it is genuinely newer than server state
  const local = loadLocalCachedState(session);
  if (local && local.updatedAt > serverState.updatedAt && local.avatarConfig) {
    return {
      ...local,
      teacherLo2Assessment: serverState.teacherLo2Assessment ?? local.teacherLo2Assessment,
      certificateRecord: computeCertificateRecord(local, {
        preserveExistingUpload: local.certificateRecord ?? serverState.certificateRecord,
        nowTs: local.updatedAt,
      }),
    };
  }

  return {
    ...serverState,
    certificateRecord: computeCertificateRecord(serverState, {
      preserveExistingUpload: serverState.certificateRecord,
      nowTs: serverState.updatedAt || Date.now(),
    }),
  };
}

export async function fetchStudentStateFromServer(): Promise<{
  ok: boolean;
  state?: StudentGameState;
}> {
  try {
    const res = await fetch('/api/student/state', {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as { ok?: boolean; state?: StudentGameState };
    if (data.ok && data.state) {
      return { ok: true, state: data.state };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

export async function saveStudentStateToServer(
  session: StudentSession,
  state: StudentGameState
): Promise<{ ok: boolean; offline: boolean; state: StudentGameState }> {
  const nowTs = Date.now();
  const stamped: StudentGameState = {
    ...state,
    certificateRecord: computeCertificateRecord(state, { nowTs }),
    updatedAt: nowTs,
  };

  // Always cache locally immediately
  saveLocalCachedState(session, stamped, true);

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { ok: false, offline: true, state: stamped };
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId =
    controller !== null ? window.setTimeout(() => controller.abort(), 3500) : null;

  try {
    const res = await fetch('/api/student/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ state: stamped }),
      signal: controller?.signal,
    });

    if (!res.ok) {
      return { ok: false, offline: res.status >= 500 || res.status === 0, state: stamped };
    }

    const data = (await res.json()) as { ok?: boolean; state?: StudentGameState };
    const confirmed = data.state ?? stamped;
    saveLocalCachedState(session, confirmed, false);
    return { ok: true, offline: false, state: confirmed };
  } catch {
    return { ok: false, offline: true, state: stamped };
  } finally {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  }
}

// Offline-only fallback evaluator used solely when browser is offline or backend unreachable
function offlineGradeFallback(
  questionNumber: number,
  selectedAnswer: Screen08AnswerKey
): { correct: boolean; explanation: string; evidenceExcerpt: string } {
  const encodedOffsets = [0, 2, 1, 2, 3, 2]; // char codes shifted from 'A'
  const expected = String.fromCharCode(65 + (encodedOffsets[questionNumber] ?? 0));
  const specs: Record<number, { explanation: string; evidenceExcerpt: string }> = {
    1: {
      explanation: 'The shiny gold pop-up box claimed Daniel had won 2,000 free game coins.',
      evidenceExcerpt:
        '"The message claimed that Daniel had won 2,000 free game coins and asked him to click a strange web link right away."',
    },
    2: {
      explanation: 'It told him to type his secret account password and home phone number.',
      evidenceExcerpt:
        '"It also told him to type his secret account password and home phone number before a ten-minute countdown clock reached zero."',
    },
    3: {
      explanation: 'The sender was an unknown player named "CoinMaster_99", not the official game team.',
      evidenceExcerpt:
        '"When he checked carefully, he noticed that the sender was an unknown player named \\"CoinMaster_99\\", not the official Turbo Track team."',
    },
    4: {
      explanation: 'Daniel closed the pop-up window and showed his tablet to his older sister, Mei Ling.',
      evidenceExcerpt:
        '"Instead, he closed the pop-up window safely and immediately showed his tablet to his older sister, Mei Ling, so they could tell their parents together."',
    },
    5: {
      explanation: 'Daniel remembered the STOP, CHECK, and DECIDE rule from Detective HQ.',
      evidenceExcerpt:
        '"Daniel felt excited at first, but he paused and remembered the STOP, CHECK, and DECIDE rule he had learnt at Detective HQ."',
    },
  };
  const info = specs[questionNumber] ?? { explanation: '', evidenceExcerpt: '' };
  return {
    correct: selectedAnswer === expected,
    explanation: info.explanation,
    evidenceExcerpt: info.evidenceExcerpt,
  };
}

export async function gradeScreen08ReadingAnswer(
  questionNumber: number,
  selectedAnswer: Screen08AnswerKey
): Promise<{ correct: boolean; explanation: string; evidenceExcerpt: string }> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return offlineGradeFallback(questionNumber, selectedAnswer);
  }

  try {
    const res = await fetch('/api/screen08/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ questionNumber, selectedAnswer }),
    });
    if (!res.ok) {
      return offlineGradeFallback(questionNumber, selectedAnswer);
    }
    const data = (await res.json()) as {
      ok?: boolean;
      correct?: boolean;
      explanation?: string;
      evidenceExcerpt?: string;
    };
    if (typeof data.correct === 'boolean') {
      return {
        correct: data.correct,
        explanation: data.explanation ?? '',
        evidenceExcerpt: data.evidenceExcerpt ?? '',
      };
    }
    return offlineGradeFallback(questionNumber, selectedAnswer);
  } catch {
    return offlineGradeFallback(questionNumber, selectedAnswer);
  }
}
