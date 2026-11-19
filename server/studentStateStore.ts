import fs from 'node:fs';
import path from 'node:path';
import express, { type Request, type Response } from 'express';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PortalStudentRecord } from '../src/types/auth.ts';
import type {
  AvatarConfig,
  BuildingId,
  CertificateRecord,
  InventoryState,
  Lo2AssessmentStatus,
  Screen03Progress,
  Screen04Progress,
  Screen05Progress,
  Screen06Progress,
  Screen07Progress,
  Screen08Progress,
  Screen09Progress,
  Screen10Progress,
  StudentGameState,
  TeacherLo2Assessment,
  TutorialProgress,
} from '../src/types/game.ts';
import { createDefaultStudentGameState } from '../src/data/townData.ts';
import { createDefaultScreen03Progress } from '../src/data/screen03Data.ts';
import {
  computeCertificateRecord,
  toCookieSafeCertificateRecord,
} from '../src/utils/certificateExport.ts';
import { parseSessionFromRequest, signAndSetSessionCookie } from './authService.ts';

const PREVIEW_STORE_PATH = path.resolve(process.cwd(), '.ddw-preview-students.json');
const memoryPreviewStore = new Map<string, StudentGameState>();

function loadPreviewStoreFromDisk(): void {
  if (memoryPreviewStore.size > 0) return;
  try {
    if (fs.existsSync(PREVIEW_STORE_PATH)) {
      const raw = fs.readFileSync(PREVIEW_STORE_PATH, 'utf8');
      const parsed = JSON.parse(raw) as Record<string, StudentGameState>;
      for (const [k, v] of Object.entries(parsed)) {
        memoryPreviewStore.set(k, v);
      }
    }
  } catch {
    // Ignore disk read errors in read-only serverless runtimes
  }
}

function flushPreviewStoreToDisk(): void {
  try {
    const obj: Record<string, StudentGameState> = {};
    for (const [k, v] of memoryPreviewStore.entries()) {
      obj[k] = v;
    }
    fs.writeFileSync(PREVIEW_STORE_PATH, JSON.stringify(obj, null, 2), 'utf8');
  } catch {
    // Fallback gracefully to in-memory storage if filesystem is read-only
  }
}

export function getPreviewStudentKey(classCode: string, studentCode: string): string {
  return `${classCode.trim().toUpperCase()}::${studentCode.trim().toUpperCase()}`;
}

export function getPreviewStudentState(
  classCode: string,
  studentCode: string
): StudentGameState | null {
  loadPreviewStoreFromDisk();
  return memoryPreviewStore.get(getPreviewStudentKey(classCode, studentCode)) ?? null;
}

export function listAllPreviewStudents(): Array<{
  classCode: string;
  studentCode: string;
  state: StudentGameState;
}> {
  loadPreviewStoreFromDisk();
  const entries: Array<{ classCode: string; studentCode: string; state: StudentGameState }> = [];
  for (const [key, state] of memoryPreviewStore.entries()) {
    const [classCode = '5M', studentCode = 'UNKNOWN'] = key.split('::');
    entries.push({ classCode, studentCode, state });
  }
  entries.sort((a, b) => (b.state.updatedAt || 0) - (a.state.updatedAt || 0));
  return entries;
}

export function savePreviewStudentState(
  classCode: string,
  studentCode: string,
  state: StudentGameState
): StudentGameState {
  loadPreviewStoreFromDisk();
  const key = getPreviewStudentKey(classCode, studentCode);
  const existing = memoryPreviewStore.get(key);

  // Prevent older client payloads from overwriting newer saved progress
  if (existing && existing.updatedAt > state.updatedAt) {
    return existing;
  }

  const resolvedLo2 = existing?.teacherLo2Assessment ?? state.teacherLo2Assessment;
  const mergedForCert: StudentGameState = {
    ...state,
    teacherLo2Assessment: resolvedLo2,
  };
  const nextCertificate = computeCertificateRecord(mergedForCert, {
    preserveExistingUpload: existing?.certificateRecord,
  });

  const nextState: StudentGameState = {
    ...mergedForCert,
    certificateRecord: nextCertificate,
    updatedAt: Date.now(),
  };
  memoryPreviewStore.set(key, nextState);
  flushPreviewStoreToDisk();
  return nextState;
}

function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    return null;
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function resolveLastSceneFromCloud(
  rawPosition: unknown,
  hasAvatar: boolean
): StudentGameState['lastScene'] {
  if (rawPosition === 'screen-10-handoff') return 'screen-10-handoff';
  if (rawPosition === 'screen-09-handoff') return 'screen-09-handoff';
  if (rawPosition === 'screen-08-handoff') return 'screen-08-handoff';
  if (rawPosition === 'screen-07-handoff') return 'screen-07-handoff';
  if (rawPosition === 'screen-06-handoff') return 'screen-06-handoff';
  if (rawPosition === 'screen-05-handoff') return 'screen-05-handoff';
  if (rawPosition === 'screen-04-handoff') return 'screen-04-handoff';
  if (rawPosition === 'screen-03' || rawPosition === 'screen-03-handoff') {
    return 'screen-03-handoff';
  }
  return hasAvatar ? 'town' : 'customisation';
}

type PackedTutorialPayload = TutorialProgress & {
  __screen03?: Screen03Progress;
  __screen04?: Screen04Progress;
  __screen05?: Screen05Progress;
  __screen06?: Screen06Progress;
  __screen07?: Screen07Progress;
  __screen08?: Screen08Progress;
  __screen09?: Screen09Progress;
  __screen10?: Screen10Progress;
  __teacherLo2?: TeacherLo2Assessment;
  __certificate?: CertificateRecord;
  __currentMission?: string;
};

function mapCloudRowToPortalRecord(
  row: Record<string, unknown>,
  classCodeFallback: string,
  classNameFallback: string
): PortalStudentRecord {
  const rawTutorial = (row.tutorial_progress ?? {}) as PackedTutorialPayload;
  const classObj = row.classes as Record<string, unknown> | null | undefined;
  const classCode = String(classObj?.class_code ?? classCodeFallback);
  const className = String(classObj?.class_name ?? classNameFallback);
  const xp = Number(row.xp ?? 0);

  return {
    studentId: String(row.id),
    studentCode: String(row.student_code ?? ''),
    displayName: String(row.display_name ?? row.detective_nickname ?? 'Student'),
    detectiveNickname: String(row.detective_nickname ?? ''),
    classCode,
    className,
    xp,
    stars: Number(row.stars ?? 0),
    level: Math.max(1, Math.floor(xp / 100) + 1),
    currentMission:
      rawTutorial.__currentMission || 'MISSION 01: THE MYSTERY OF THE UNEXPECTED PRIZE',
    completedMissions: Array.isArray(row.completed_missions)
      ? row.completed_missions.map(String)
      : [],
    unlockedBuildings: Array.isArray(row.unlocked_buildings)
      ? (row.unlocked_buildings as BuildingId[])
      : ['detective-hq'],
    lastScene: String(row.last_position ?? 'town'),
    avatarConfig: (row.avatar_config as AvatarConfig | null) ?? null,
    inventory: (row.inventory as InventoryState | undefined) ?? undefined,
    screen03Completed: Boolean(rawTutorial.__screen03?.inductionCompleted),
    screen04Progress: rawTutorial.__screen04,
    screen05Progress: rawTutorial.__screen05,
    screen06Progress: rawTutorial.__screen06,
    screen07Progress: rawTutorial.__screen07,
    screen08Progress: rawTutorial.__screen08,
    screen09Progress: rawTutorial.__screen09,
    screen10Progress: rawTutorial.__screen10,
    teacherLo2Assessment: rawTutorial.__teacherLo2,
    certificateRecord: rawTutorial.__certificate,
    updatedAt: row.updated_at ? new Date(String(row.updated_at)).getTime() : 0,
  };
}

function mapPreviewEntryToPortalRecord(entry: {
  classCode: string;
  studentCode: string;
  state: StudentGameState;
}): PortalStudentRecord {
  const { classCode, studentCode, state } = entry;
  return {
    studentId: `preview-${classCode}-${studentCode}`,
    studentCode,
    displayName: state.detectiveNickname || `Detective ${studentCode}`,
    detectiveNickname: state.detectiveNickname || '',
    classCode,
    className: `Class ${classCode}`,
    xp: state.xp ?? 0,
    stars: state.stars ?? 0,
    level: state.level ?? Math.max(1, Math.floor((state.xp ?? 0) / 100) + 1),
    currentMission: state.currentMission,
    completedMissions: state.completedMissions ?? [],
    unlockedBuildings: state.unlockedBuildings ?? ['detective-hq'],
    lastScene: state.lastScene ?? 'town',
    avatarConfig: state.avatarConfig ?? null,
    inventory: state.inventory,
    screen03Completed: Boolean(state.screen03Progress?.inductionCompleted),
    screen04Progress: state.screen04Progress,
    screen05Progress: state.screen05Progress,
    screen06Progress: state.screen06Progress,
    screen07Progress: state.screen07Progress,
    screen08Progress: state.screen08Progress,
    screen09Progress: state.screen09Progress,
    screen10Progress: state.screen10Progress,
    teacherLo2Assessment: state.teacherLo2Assessment,
    certificateRecord:
      state.certificateRecord ?? computeCertificateRecord(state, { nowTs: state.updatedAt }),
    updatedAt: state.updatedAt ?? 0,
  };
}

function sanitizeIncomingCertificateRecord(
  incoming?: CertificateRecord
): CertificateRecord | undefined {
  if (!incoming || typeof incoming !== 'object') return undefined;
  let safeDataUrl: string | undefined = undefined;
  if (typeof incoming.uploadedFileDataUrl === 'string') {
    const trimmed = incoming.uploadedFileDataUrl.trim();
    const isValidMime =
      trimmed.startsWith('data:image/png;base64,') ||
      trimmed.startsWith('data:image/jpeg;base64,') ||
      trimmed.startsWith('data:image/jpg;base64,') ||
      trimmed.startsWith('data:image/webp;base64,') ||
      trimmed.startsWith('data:application/pdf;base64,');
    if (isValidMime && trimmed.length <= 2_200_000) {
      safeDataUrl = trimmed;
    }
  }
  return {
    ...incoming,
    ...(safeDataUrl ? { uploadedFileDataUrl: safeDataUrl } : { uploadedFileDataUrl: undefined }),
    uploadedFileName:
      typeof incoming.uploadedFileName === 'string'
        ? incoming.uploadedFileName.trim().slice(0, 120)
        : undefined,
    hasUploadedFile: Boolean(safeDataUrl || incoming.hasUploadedFile),
  };
}

export function createStudentRouter(): express.Router {
  const router = express.Router();
  router.use(express.json({ limit: '3mb' }));

  router.get('/state', async (req: Request, res: Response) => {
    const session = parseSessionFromRequest(req);
    if (!session || session.role !== 'student') {
      res.status(401).json({ ok: false, message: 'Student session required.' });
      return;
    }

    const supabase = getSupabaseAdminClient();
    const isPreviewSession = session.id.startsWith('preview-');
    if (!supabase || isPreviewSession) {
      const saved =
        getPreviewStudentState(session.classCode, session.studentCode) ??
        createDefaultStudentGameState();
      res.json({
        ok: true,
        source: 'preview',
        state: saved,
      });
      return;
    }

    try {
      const { data: row, error } = await supabase
        .from('students')
        .select(
          'detective_nickname, avatar_config, tutorial_progress, settings, inventory, xp, stars, completed_missions, unlocked_buildings, town_position, last_position, updated_at'
        )
        .eq('id', session.id)
        .maybeSingle();

      if (error || !row) {
        res.status(404).json({ ok: false, message: 'Student profile not found.' });
        return;
      }

      const defaults = createDefaultStudentGameState();
      const rawTutorial = (row.tutorial_progress ?? {}) as PackedTutorialPayload;
      const {
        __screen03,
        __screen04,
        __screen05,
        __screen06,
        __screen07,
        __screen08,
        __screen09,
        __screen10,
        __teacherLo2,
        __certificate,
        __currentMission,
        ...cleanTutorial
      } = rawTutorial;

      const state: StudentGameState = {
        detectiveNickname: String(row.detective_nickname ?? ''),
        avatarConfig: row.avatar_config ?? null,
        tutorialProgress: row.tutorial_progress ? cleanTutorial : defaults.tutorialProgress,
        screen03Progress: __screen03 ?? createDefaultScreen03Progress(),
        screen04Progress: __screen04,
        screen05Progress: __screen05,
        screen06Progress: __screen06,
        screen07Progress: __screen07,
        screen08Progress: __screen08,
        screen09Progress: __screen09,
        screen10Progress: __screen10,
        teacherLo2Assessment: __teacherLo2,
        certificateRecord: __certificate,
        settings: row.settings ?? defaults.settings,
        inventory: row.inventory ?? defaults.inventory,
        xp: Number(row.xp ?? 0),
        stars: Number(row.stars ?? 0),
        level: Math.max(1, Math.floor(Number(row.xp ?? 0) / 100) + 1),
        currentMission: __currentMission || defaults.currentMission,
        completedMissions: Array.isArray(row.completed_missions)
          ? row.completed_missions.map(String)
          : [],
        unlockedBuildings: Array.isArray(row.unlocked_buildings)
          ? row.unlocked_buildings
          : ['detective-hq'],
        lastPosition: row.town_position ?? defaults.lastPosition,
        lastScene: resolveLastSceneFromCloud(row.last_position, Boolean(row.avatar_config)),
        updatedAt: row.updated_at ? new Date(String(row.updated_at)).getTime() : Date.now(),
      };
      if (!state.certificateRecord) {
        state.certificateRecord = computeCertificateRecord(state, { nowTs: state.updatedAt });
      }

      res.json({ ok: true, source: 'cloud', state });
    } catch {
      res.status(500).json({ ok: false, message: 'Could not load student progress.' });
    }
  });

  router.put('/state', async (req: Request, res: Response) => {
    const session = parseSessionFromRequest(req);
    if (!session || session.role !== 'student') {
      res.status(401).json({ ok: false, message: 'Student session required.' });
      return;
    }

    const incoming = req.body?.state as StudentGameState | undefined;
    if (!incoming || typeof incoming !== 'object') {
      res.status(400).json({ ok: false, message: 'Invalid student state payload.' });
      return;
    }

    const cleanNickname = String(incoming.detectiveNickname ?? '').trim().slice(0, 24);
    const { teacherLo2Assessment: _ignoredClientLo2, ...clientSafeState } = incoming;
    const sanitizedCert = sanitizeIncomingCertificateRecord(incoming.certificateRecord);
    const sanitizedState: StudentGameState = {
      ...clientSafeState,
      ...(sanitizedCert ? { certificateRecord: sanitizedCert } : {}),
      detectiveNickname: cleanNickname,
      updatedAt: Number(incoming.updatedAt || Date.now()),
    };

    const supabase = getSupabaseAdminClient();
    const isPreviewSession = session.id.startsWith('preview-');
    if (!supabase || isPreviewSession) {
      const saved = savePreviewStudentState(session.classCode, session.studentCode, sanitizedState);

      const updatedSession = {
        ...session,
        isFirstTime: !saved.avatarConfig,
        progress: {
          ...session.progress,
          hasAvatar: Boolean(saved.avatarConfig),
          detectiveNickname: saved.detectiveNickname,
          avatarConfig: saved.avatarConfig,
          xp: saved.xp,
          stars: saved.stars,
          completedMissions: saved.completedMissions,
          tutorialProgress: saved.tutorialProgress,
          screen03Progress: saved.screen03Progress,
          screen04Progress: saved.screen04Progress,
          screen05Progress: saved.screen05Progress,
          screen06Progress: saved.screen06Progress,
          screen07Progress: saved.screen07Progress,
          screen08Progress: saved.screen08Progress,
          screen09Progress: saved.screen09Progress,
          screen10Progress: saved.screen10Progress,
          teacherLo2Assessment: saved.teacherLo2Assessment,
          certificateRecord: toCookieSafeCertificateRecord(saved.certificateRecord),
          currentMission: saved.currentMission,
          settings: saved.settings,
          inventory: saved.inventory,
          unlockedBuildings: saved.unlockedBuildings,
          townPosition: saved.lastPosition,
          lastPosition: saved.lastScene,
          updatedAt: saved.updatedAt,
        },
      };
      signAndSetSessionCookie(res, req, updatedSession);

      res.json({
        ok: true,
        source: 'preview',
        state: saved,
      });
      return;
    }

    try {
      const { data: existingRow } = await supabase
        .from('students')
        .select('updated_at, tutorial_progress')
        .eq('id', session.id)
        .maybeSingle();

      const serverUpdatedAt = existingRow?.updated_at
        ? new Date(String(existingRow.updated_at)).getTime()
        : 0;

      if (serverUpdatedAt > sanitizedState.updatedAt + 1000) {
        res.status(409).json({
          ok: false,
          code: 'STALE_LOCAL_DATA',
          message: 'Newer progress exists on the server.',
        });
        return;
      }

      const existingTutorial = (existingRow?.tutorial_progress ?? null) as PackedTutorialPayload | null;
      const preservedTeacherLo2 = existingTutorial?.__teacherLo2;
      const nowIso = new Date().toISOString();
      const nowMs = new Date(nowIso).getTime();

      const liveCertRecord = computeCertificateRecord(
        {
          ...sanitizedState,
          teacherLo2Assessment: preservedTeacherLo2,
        },
        {
          preserveExistingUpload: existingTutorial?.__certificate,
          nowTs: nowMs,
        }
      );

      const packedTutorialProgress: PackedTutorialPayload = {
        ...sanitizedState.tutorialProgress,
        ...(sanitizedState.screen03Progress ? { __screen03: sanitizedState.screen03Progress } : {}),
        ...(sanitizedState.screen04Progress ? { __screen04: sanitizedState.screen04Progress } : {}),
        ...(sanitizedState.screen05Progress ? { __screen05: sanitizedState.screen05Progress } : {}),
        ...(sanitizedState.screen06Progress ? { __screen06: sanitizedState.screen06Progress } : {}),
        ...(sanitizedState.screen07Progress ? { __screen07: sanitizedState.screen07Progress } : {}),
        ...(sanitizedState.screen08Progress ? { __screen08: sanitizedState.screen08Progress } : {}),
        ...(sanitizedState.screen09Progress ? { __screen09: sanitizedState.screen09Progress } : {}),
        ...(sanitizedState.screen10Progress ? { __screen10: sanitizedState.screen10Progress } : {}),
        ...(preservedTeacherLo2 ? { __teacherLo2: preservedTeacherLo2 } : {}),
        __certificate: liveCertRecord,
        ...(sanitizedState.currentMission ? { __currentMission: sanitizedState.currentMission } : {}),
      };
      const { error: updateError } = await supabase
        .from('students')
        .update({
          detective_nickname: sanitizedState.detectiveNickname,
          avatar_config: sanitizedState.avatarConfig,
          tutorial_progress: packedTutorialProgress,
          settings: sanitizedState.settings,
          inventory: sanitizedState.inventory,
          unlocked_buildings: sanitizedState.unlockedBuildings,
          town_position: sanitizedState.lastPosition,
          last_position: sanitizedState.lastScene,
          xp: sanitizedState.xp,
          stars: sanitizedState.stars,
          completed_missions: sanitizedState.completedMissions,
          updated_at: nowIso,
        })
        .eq('id', session.id);

      if (updateError) {
        res.status(500).json({ ok: false, message: 'Could not save progress to cloud.' });
        return;
      }

      const savedState: StudentGameState = {
        ...sanitizedState,
        teacherLo2Assessment: preservedTeacherLo2,
        certificateRecord: liveCertRecord,
        updatedAt: nowMs,
      };

      const updatedSession = {
        ...session,
        isFirstTime: !savedState.avatarConfig,
        progress: {
          ...session.progress,
          hasAvatar: Boolean(savedState.avatarConfig),
          detectiveNickname: savedState.detectiveNickname,
          avatarConfig: savedState.avatarConfig,
          xp: savedState.xp,
          stars: savedState.stars,
          completedMissions: savedState.completedMissions,
          tutorialProgress: savedState.tutorialProgress,
          screen03Progress: savedState.screen03Progress,
          screen04Progress: savedState.screen04Progress,
          screen05Progress: savedState.screen05Progress,
          screen06Progress: savedState.screen06Progress,
          screen07Progress: savedState.screen07Progress,
          screen08Progress: savedState.screen08Progress,
          screen09Progress: savedState.screen09Progress,
          screen10Progress: savedState.screen10Progress,
          teacherLo2Assessment: savedState.teacherLo2Assessment,
          certificateRecord: toCookieSafeCertificateRecord(savedState.certificateRecord),
          currentMission: savedState.currentMission,
          settings: savedState.settings,
          inventory: savedState.inventory,
          unlockedBuildings: savedState.unlockedBuildings,
          townPosition: savedState.lastPosition,
          lastPosition: savedState.lastScene,
          updatedAt: savedState.updatedAt,
        },
      };
      signAndSetSessionCookie(res, req, updatedSession);

      res.json({
        ok: true,
        source: 'cloud',
        state: savedState,
      });
    } catch {
      res.status(500).json({ ok: false, message: 'Could not save progress.' });
    }
  });

  return router;
}

export function createPortalRouter(): express.Router {
  const router = express.Router();
  router.use(express.json({ limit: '32kb' }));

  router.get('/teacher/overview', async (req: Request, res: Response) => {
    const session = parseSessionFromRequest(req);
    if (!session || session.role !== 'teacher') {
      res.status(401).json({ ok: false, source: 'preview', students: [], message: 'Teacher session required.' });
      return;
    }

    const supabase = getSupabaseAdminClient();
    const isPreview = session.id.startsWith('preview-');
    if (!supabase || isPreview) {
      const entries = listAllPreviewStudents();
      res.json({
        ok: true,
        source: 'preview',
        students: entries.map(mapPreviewEntryToPortalRecord),
      });
      return;
    }

    try {
      const { data: classRows, error: classErr } = await supabase
        .from('classes')
        .select('id, class_code, class_name')
        .eq('teacher_id', session.id)
        .eq('is_active', true);

      if (classErr || !classRows || classRows.length === 0) {
        res.json({ ok: true, source: 'cloud', students: [] });
        return;
      }

      const classIds = classRows.map((c) => c.id);
      const classMap = new Map(classRows.map((c) => [String(c.id), c]));

      const { data: studentRows, error: studErr } = await supabase
        .from('students')
        .select(
          'id, class_id, student_code, display_name, detective_nickname, avatar_config, inventory, xp, stars, completed_missions, unlocked_buildings, last_position, tutorial_progress, updated_at'
        )
        .in('class_id', classIds)
        .eq('is_active', true);

      if (studErr || !studentRows) {
        res.status(500).json({ ok: false, source: 'cloud', students: [], message: 'Could not load class roster.' });
        return;
      }

      const students = studentRows.map((row) => {
        const cls = classMap.get(String(row.class_id));
        return mapCloudRowToPortalRecord(
          row as Record<string, unknown>,
          String(cls?.class_code ?? ''),
          String(cls?.class_name ?? '')
        );
      });

      res.json({ ok: true, source: 'cloud', students });
    } catch {
      res.status(500).json({ ok: false, source: 'cloud', students: [], message: 'Could not load teacher overview.' });
    }
  });

  router.get('/parent/overview', async (req: Request, res: Response) => {
    const session = parseSessionFromRequest(req);
    if (!session || session.role !== 'parent') {
      res.status(401).json({ ok: false, source: 'preview', children: [], message: 'Parent session required.' });
      return;
    }

    const supabase = getSupabaseAdminClient();
    const isPreview = session.id.startsWith('preview-');
    if (!supabase || isPreview) {
      const entries = listAllPreviewStudents();
      res.json({
        ok: true,
        source: 'preview',
        children: entries.map(mapPreviewEntryToPortalRecord),
      });
      return;
    }

    try {
      const childIds = session.linkedChildren.map((c) => c.studentId);
      if (childIds.length === 0) {
        res.json({ ok: true, source: 'cloud', children: [] });
        return;
      }

      const { data: studentRows, error: studErr } = await supabase
        .from('students')
        .select(
          'id, student_code, display_name, detective_nickname, avatar_config, inventory, xp, stars, completed_missions, unlocked_buildings, last_position, tutorial_progress, updated_at, classes(class_code, class_name)'
        )
        .in('id', childIds)
        .eq('is_active', true);

      if (studErr || !studentRows) {
        res.status(500).json({ ok: false, source: 'cloud', children: [], message: 'Could not load linked child progress.' });
        return;
      }

      const children = studentRows.map((row) =>
        mapCloudRowToPortalRecord(row as Record<string, unknown>, '', '')
      );

      res.json({ ok: true, source: 'cloud', children });
    } catch {
      res.status(500).json({ ok: false, source: 'cloud', children: [], message: 'Could not load parent dashboard.' });
    }
  });

  router.post('/teacher/lo2-assessment', async (req: Request, res: Response) => {
    const session = parseSessionFromRequest(req);
    if (!session || session.role !== 'teacher') {
      res.status(401).json({ ok: false, message: 'Only teachers can grade LO2 Writing.' });
      return;
    }

    const classCode = String(req.body?.classCode ?? '').trim().toUpperCase();
    const studentCode = String(req.body?.studentCode ?? '').trim().toUpperCase();
    const studentId = String(req.body?.studentId ?? '').trim();
    const rawStatus = String(req.body?.status ?? '');
    const comments = String(req.body?.comments ?? '').trim().slice(0, 600);

    const status: Lo2AssessmentStatus =
      rawStatus === 'achieved' || rawStatus === 'not-yet-achieved' ? rawStatus : 'awaiting';

    const assessment: TeacherLo2Assessment = {
      status,
      comments,
      reviewedBy: session.displayName || 'Teacher',
      reviewedAt: Date.now(),
    };

    const supabase = getSupabaseAdminClient();
    const isPreview = session.id.startsWith('preview-') || studentId.startsWith('preview-');

    if (!supabase || isPreview) {
      loadPreviewStoreFromDisk();
      const key = getPreviewStudentKey(classCode, studentCode);
      const existing = memoryPreviewStore.get(key);
      if (!existing) {
        res.status(404).json({ ok: false, message: 'Student record not found in preview store.' });
        return;
      }
      const nextCert = computeCertificateRecord(
        {
          ...existing,
          teacherLo2Assessment: assessment,
        },
        { preserveExistingUpload: existing.certificateRecord }
      );
      const nextState: StudentGameState = {
        ...existing,
        teacherLo2Assessment: assessment,
        certificateRecord: nextCert,
        updatedAt: Date.now(),
      };
      memoryPreviewStore.set(key, nextState);
      flushPreviewStoreToDisk();
      res.json({ ok: true, source: 'preview', assessment, certificateRecord: nextCert });
      return;
    }

    try {
      const { data: studentRow, error: fetchErr } = await supabase
        .from('students')
        .select('id, tutorial_progress')
        .eq('id', studentId)
        .maybeSingle();

      if (fetchErr || !studentRow) {
        res.status(404).json({ ok: false, message: 'Student profile not found.' });
        return;
      }

      const existingTutorial = (studentRow.tutorial_progress ?? {}) as PackedTutorialPayload;
      const existingCert = existingTutorial.__certificate;
      const updatedCert: CertificateRecord | undefined = existingCert
        ? {
            ...existingCert,
            lo2Status: assessment.status,
            lastUpdatedAt: Date.now(),
          }
        : undefined;
      const updatedTutorial: PackedTutorialPayload = {
        ...existingTutorial,
        __teacherLo2: assessment,
        ...(updatedCert ? { __certificate: updatedCert } : {}),
      };

      const { error: updateErr } = await supabase
        .from('students')
        .update({ tutorial_progress: updatedTutorial })
        .eq('id', studentRow.id);

      if (updateErr) {
        res.status(500).json({ ok: false, message: 'Could not save LO2 assessment.' });
        return;
      }

      res.json({ ok: true, source: 'cloud', assessment, certificateRecord: updatedCert });
    } catch {
      res.status(500).json({ ok: false, message: 'Could not save LO2 assessment.' });
    }
  });

  return router;
}
