import { ALL_SEVEN_TOWN_BADGES } from '../data/screen10Data.ts';
import type { PortalStudentRecord } from '../types/auth.ts';
import type { CertificateRecord, StudentGameState } from '../types/game.ts';

export function countCompletedTownActivities(state: Pick<
  StudentGameState,
  | 'screen03Progress'
  | 'screen04Progress'
  | 'screen05Progress'
  | 'screen06Progress'
  | 'screen07Progress'
  | 'screen08Progress'
  | 'screen09Progress'
>): number {
  return [
    Boolean(state.screen03Progress?.inductionCompleted),
    Boolean(state.screen04Progress?.activityCompleted),
    Boolean(state.screen05Progress?.activityCompleted),
    Boolean(state.screen06Progress?.activityCompleted),
    Boolean(state.screen07Progress?.activityCompleted),
    Boolean(state.screen08Progress?.assessmentCompleted),
    Boolean(state.screen09Progress?.passportCompleted),
  ].filter(Boolean).length;
}

export function computeCertificateRecord(
  state: StudentGameState,
  options?: {
    preserveExistingUpload?: CertificateRecord;
    nowTs?: number;
  }
): CertificateRecord {
  const activitiesCompletedCount = countCompletedTownActivities(state);
  const badgesCount = state.inventory?.badges?.length ?? 0;
  const s8 = state.screen08Progress;
  const lo1Score = s8?.officialFirstAttemptSubmitted ? s8.firstAttemptScore : 0;
  const lo1Achieved = Boolean(s8?.lo1ReadingAchieved);
  const lo2Status = state.teacherLo2Assessment?.status ?? 'awaiting';

  const currentUpload = state.certificateRecord;
  const fallbackUpload = options?.preserveExistingUpload;

  const hasExplicitRemoval =
    currentUpload !== undefined &&
    currentUpload.uploadedFileDataUrl === undefined &&
    currentUpload.hasUploadedFile === false;

  const uploadedFileDataUrl = hasExplicitRemoval
    ? undefined
    : currentUpload?.uploadedFileDataUrl ?? fallbackUpload?.uploadedFileDataUrl;
  const uploadedFileName = hasExplicitRemoval
    ? undefined
    : currentUpload?.uploadedFileName ?? fallbackUpload?.uploadedFileName;
  const uploadedAt = hasExplicitRemoval
    ? undefined
    : currentUpload?.uploadedAt ?? fallbackUpload?.uploadedAt;

  return {
    issued:
      activitiesCompletedCount > 0 ||
      badgesCount > 0 ||
      Boolean(state.screen10Progress?.ceremonyCompleted) ||
      Boolean(uploadedFileDataUrl),
    lastUpdatedAt: options?.nowTs ?? Date.now(),
    activitiesCompletedCount,
    badgesCount,
    lo1Score,
    lo1Achieved,
    lo2Status,
    ...(uploadedFileDataUrl ? { uploadedFileDataUrl } : {}),
    ...(uploadedFileName ? { uploadedFileName } : {}),
    ...(uploadedAt ? { uploadedAt } : {}),
    hasUploadedFile: Boolean(uploadedFileDataUrl || currentUpload?.hasUploadedFile),
  };
}

export function toCookieSafeCertificateRecord(
  record?: CertificateRecord
): CertificateRecord | undefined {
  if (!record) return undefined;
  const { uploadedFileDataUrl, ...rest } = record;
  return {
    ...rest,
    hasUploadedFile: Boolean(uploadedFileDataUrl || record.hasUploadedFile),
  };
}

export function portalStudentToGameState(student: PortalStudentRecord): StudentGameState {
  const badgeMap: Array<{ id: string; name: string; earned: boolean }> = [
    {
      id: 'badge-junior-detective',
      name: 'Junior Detective Badge',
      earned: student.screen03Completed,
    },
    {
      id: 'badge-red-flag-spotter',
      name: 'Red Flag Spotter',
      earned: Boolean(student.screen04Progress?.activityCompleted),
    },
    {
      id: 'badge-safe-adviser',
      name: 'Safe Adviser Badge',
      earned: Boolean(student.screen05Progress?.activityCompleted),
    },
    {
      id: 'badge-bytes-helper',
      name: "Byte's Helper",
      earned: Boolean(student.screen06Progress?.badgeAwarded),
    },
    {
      id: 'badge-advice-helper',
      name: 'Words That Help Badge',
      earned: Boolean(student.screen07Progress?.activityCompleted),
    },
    {
      id: 'badge-safe-clicker',
      name: 'SAFE CLICKER',
      earned: Boolean(student.screen08Progress?.badgeAwarded),
    },
    {
      id: 'badge-digital-safety-guardian',
      name: 'Digital Safety Guardian',
      earned: Boolean(student.screen09Progress?.badgeAwarded),
    },
  ];

  const derivedBadges =
    student.inventory?.badges && student.inventory.badges.length > 0
      ? student.inventory.badges
      : badgeMap
          .filter((b) => b.earned)
          .map((b) => ({
            id: b.id,
            name: b.name,
            category: 'badges' as const,
            description: `${b.name} earned in Detective Town.`,
          }));

  const state: StudentGameState = {
    detectiveNickname: student.detectiveNickname || student.displayName || student.studentCode,
    avatarConfig: student.avatarConfig ?? null,
    tutorialProgress: {
      characterConfirmed: true,
      welcomeConversationDone: true,
      profileExplored: true,
      bagExplored: true,
      missionTrackerExplored: true,
      settingsExplored: true,
      buildingsDiscovered: student.unlockedBuildings ?? ['detective-hq'],
      movementCompleted: true,
      hqSelected: true,
      tutorialCompleted: true,
    },
    screen03Progress: {
      hqEntered: true,
      missionBriefingCompleted: student.screen03Completed,
      videoCompleted: student.screen03Completed,
      problemIdentified: student.screen03Completed,
      decisionChoice: 'no',
      decisionCompleted: student.screen03Completed,
      safetyIntroDone: student.screen03Completed,
      rulesCompleted: {
        rule1: student.screen03Completed,
        rule2: student.screen03Completed,
        rule3: student.screen03Completed,
      },
      knowledgeCheckCompleted: student.screen03Completed,
      inductionCompleted: student.screen03Completed,
      redFlagCentreUnlocked: student.unlockedBuildings.includes('red-flag-centre'),
      currentStage: 'completion',
    },
    screen04Progress: student.screen04Progress,
    screen05Progress: student.screen05Progress,
    screen06Progress: student.screen06Progress,
    screen07Progress: student.screen07Progress,
    screen08Progress: student.screen08Progress,
    screen09Progress: student.screen09Progress,
    screen10Progress: student.screen10Progress,
    teacherLo2Assessment: student.teacherLo2Assessment,
    certificateRecord: student.certificateRecord,
    settings: {
      soundEffects: true,
      backgroundMusic: true,
      dialogueNarration: false,
      subtitles: true,
      textSize: 'medium',
      reducedMotion: false,
    },
    inventory: student.inventory ?? {
      badges: derivedBadges,
      collectibles: [],
      missionItems: [],
      specialRewards: [],
    },
    xp: student.xp,
    stars: student.stars,
    level: student.level,
    currentMission: student.currentMission,
    completedMissions: student.completedMissions,
    unlockedBuildings: student.unlockedBuildings,
    lastPosition: { x: 45, y: 84.5, nodeId: 'plaza-center' },
    lastScene: 'town',
    updatedAt: student.updatedAt,
  };

  if (!state.certificateRecord) {
    state.certificateRecord = computeCertificateRecord(state, { nowTs: student.updatedAt });
  }
  return state;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
): number {
  const words = text.split(/\s+/);
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let i = 0; i < words.length; i += 1) {
    const candidate = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      lineCount += 1;
      if (lineCount >= maxLines) return currentY + lineHeight;
      line = words[i];
      currentY += lineHeight;
    } else {
      line = candidate;
    }
  }
  if (line && lineCount < maxLines) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function triggerDownloadUrl(href: string, filename: string): void {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    document.body.removeChild(link);
  }, 150);
}

export function downloadCertificateAsPng(gameState: StudentGameState, fileNameHint?: string): void {
  const width = 1754;
  const height = 1240;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const nickname = (gameState.detectiveNickname || fileNameHint || 'Junior Detective').trim();
  const s8 = gameState.screen08Progress;
  const s9 = gameState.screen09Progress;
  const lo2 = gameState.teacherLo2Assessment;
  const badgeSet = new Set(gameState.inventory.badges.map((b) => b.id));
  const badgesEarned = ALL_SEVEN_TOWN_BADGES.filter((b) => badgeSet.has(b.id));
  const activitiesCount =
    gameState.certificateRecord?.activitiesCompletedCount ?? countCompletedTownActivities(gameState);

  const lo1Score = s8?.officialFirstAttemptSubmitted ? s8.firstAttemptScore : 0;
  const lo1Status = s8?.officialFirstAttemptSubmitted
    ? s8.lo1ReadingAchieved
      ? 'Achieved (4/5 or higher)'
      : 'Not Yet Achieved'
    : 'Not Attempted Yet';

  const lo2Label =
    lo2?.status === 'achieved'
      ? 'Achieved'
      : lo2?.status === 'not-yet-achieved'
        ? 'Not Yet Achieved'
        : 'Awaiting Teacher Review';

  const completedTs =
    gameState.certificateRecord?.lastUpdatedAt ||
    gameState.screen10Progress?.completedAt ||
    s9?.completedAt ||
    gameState.updatedAt ||
    Date.now();
  const formattedDate = new Date(completedTs).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Outer Frutiger Aero gradient backdrop
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#DCFCE7');
  bgGrad.addColorStop(0.5, '#F8FAFC');
  bgGrad.addColorStop(1, '#E0F2FE');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft glowing ambient orbs
  const orb1 = ctx.createRadialGradient(240, 200, 20, 240, 200, 420);
  orb1.addColorStop(0, 'rgba(52, 211, 153, 0.25)');
  orb1.addColorStop(1, 'rgba(52, 211, 153, 0)');
  ctx.fillStyle = orb1;
  ctx.fillRect(0, 0, width, height);

  const orb2 = ctx.createRadialGradient(1520, 1020, 20, 1520, 1020, 440);
  orb2.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
  orb2.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = orb2;
  ctx.fillRect(0, 0, width, height);

  // Outer Emerald Border Sheet
  drawRoundedRect(ctx, 48, 48, width - 96, height - 96, 44);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#34D399';
  ctx.stroke();

  // Inner Dashed Gold Border
  drawRoundedRect(ctx, 84, 84, width - 168, height - 168, 32);
  ctx.save();
  ctx.setLineDash([16, 12]);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#F59E0B';
  ctx.stroke();
  ctx.restore();

  // Top Header Glass Sheen
  drawRoundedRect(ctx, 114, 114, width - 228, 175, 24);
  const hdrGrad = ctx.createLinearGradient(114, 114, width - 114, 289);
  hdrGrad.addColorStop(0, '#ECFEFF');
  hdrGrad.addColorStop(0.5, '#FFFFFF');
  hdrGrad.addColorStop(1, '#ECFDF5');
  ctx.fillStyle = hdrGrad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#A7F3D0';
  ctx.stroke();

  ctx.fillStyle = '#0D9488';
  ctx.font = '800 22px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('SJKC MING TAO  ·  DIGITAL DETECTIVE WORLD  ·  YEAR 5 ENGLISH', 152, 168);

  ctx.fillStyle = '#0E3558';
  ctx.font = '900 54px "Fredoka", "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 152, 238);

  // Official Rank Crest Pill on Right of Header
  drawRoundedRect(ctx, 1220, 140, 385, 118, 24);
  const sealGrad = ctx.createLinearGradient(1220, 140, 1605, 258);
  sealGrad.addColorStop(0, '#FEF3C7');
  sealGrad.addColorStop(1, '#D1FAE5');
  ctx.fillStyle = sealGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#F59E0B';
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#B45309';
  ctx.font = '800 18px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(activitiesCount >= 7 ? 'OFFICIAL RANK' : 'DETECTIVE PROGRESS', 1412, 182);

  ctx.fillStyle = '#15803D';
  ctx.font = '900 26px "Fredoka", "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('DIGITAL SAFETY GUARDIAN', 1412, 224);
  ctx.textAlign = 'left';

  // Recipient Center Banner
  drawRoundedRect(ctx, 114, 322, width - 228, 285, 28);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#BAE6FD';
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#475569';
  ctx.font = '700 22px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('THIS CERTIFICATE IS PROUDLY PRESENTED TO', width / 2, 376);

  ctx.fillStyle = '#6D28D9';
  ctx.font = '900 66px "Fredoka", "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(nickname, width / 2, 456);

  // Stat pill row
  drawRoundedRect(ctx, width / 2 - 330, 478, 660, 44, 22);
  ctx.fillStyle = '#E0F2FE';
  ctx.fill();
  ctx.fillStyle = '#0369A1';
  ctx.font = '800 20px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(
    `LEVEL ${gameState.level}  ·  ${gameState.xp} XP  ·  ${gameState.stars} STARS  ·  ${activitiesCount}/7 ACTIVITIES`,
    width / 2,
    507
  );

  ctx.fillStyle = '#18466E';
  ctx.font = '600 23px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(
    'for investigating digital warning signs, helping friends stay safe online, and building strong digital safety wisdom.',
    width / 2,
    568
  );
  ctx.textAlign = 'left';

  // Three Evidence Cards (Badges, LO1 Reading, LO2 Writing)
  const cardY = 636;
  const cardH = 310;
  const cardGap = 28;
  const cardW = (width - 228 - cardGap * 2) / 3;

  // Card 1: Badges
  drawRoundedRect(ctx, 114, cardY, cardW, cardH, 24);
  ctx.fillStyle = '#ECFDF5';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#86EFAC';
  ctx.stroke();

  ctx.fillStyle = '#15803D';
  ctx.font = '800 20px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(`BADGES EARNED (${badgesEarned.length} / 7)`, 142, cardY + 46);

  ctx.fillStyle = '#0E3558';
  ctx.font = '700 20px "Plus Jakarta Sans", Arial, sans-serif';
  if (badgesEarned.length > 0) {
    badgesEarned.slice(0, 7).forEach((badge, idx) => {
      ctx.fillText(`✓  ${badge.name}`, 142, cardY + 92 + idx * 30);
    });
  } else {
    wrapText(
      ctx,
      'Complete Detective Town locations to collect all 7 official digital safety badges.',
      142,
      cardY + 98,
      cardW - 56,
      30,
      4
    );
  }

  // Card 2: LO1 Reading
  const c2X = 114 + cardW + cardGap;
  drawRoundedRect(ctx, c2X, cardY, cardW, cardH, 24);
  ctx.fillStyle = '#EEF2FF';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#A5B4FC';
  ctx.stroke();

  ctx.fillStyle = '#4338CA';
  ctx.font = '800 20px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('LO1 · INDEPENDENT READING', c2X + 28, cardY + 46);

  ctx.fillStyle = '#0E3558';
  ctx.font = '900 44px "Fredoka", "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(`${lo1Score} / 5 Marks`, c2X + 28, cardY + 114);

  ctx.fillStyle = '#4338CA';
  ctx.font = '800 22px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(lo1Status, c2X + 28, cardY + 162);

  ctx.fillStyle = '#334155';
  ctx.font = '600 19px "Plus Jakarta Sans", Arial, sans-serif';
  wrapText(
    ctx,
    'Assessed at Game Arcade on unseen digital-safety comprehension questions (minimum target: 4/5).',
    c2X + 28,
    cardY + 214,
    cardW - 56,
    28,
    3
  );

  // Card 3: LO2 Writing
  const c3X = c2X + cardW + cardGap;
  drawRoundedRect(ctx, c3X, cardY, cardW, cardH, 24);
  ctx.fillStyle = '#F0FDFA';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#99F6E4';
  ctx.stroke();

  ctx.fillStyle = '#0F766E';
  ctx.font = '800 20px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('LO2 · ADVICE WRITING', c3X + 28, cardY + 46);

  ctx.fillStyle = '#0E3558';
  ctx.font = '900 32px "Fredoka", "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(lo2Label, c3X + 28, cardY + 110);

  ctx.fillStyle = '#334155';
  ctx.font = '600 20px "Plus Jakarta Sans", Arial, sans-serif';
  wrapText(
    ctx,
    lo2?.comments
      ? `Teacher Note: "${lo2.comments}"`
      : 'Teacher reviews functional safety advice written across Advice Centre & Digital Safe Garden.',
    c3X + 28,
    cardY + 168,
    cardW - 56,
    29,
    4
  );

  // Bottom Promise & Signatures
  ctx.strokeStyle = '#D1FAE5';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(114, 982);
  ctx.lineTo(width - 114, 982);
  ctx.stroke();

  ctx.fillStyle = '#0369A1';
  ctx.font = '800 18px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('MY DIGITAL SAFETY PROMISE', 120, 1022);

  ctx.fillStyle = '#18466E';
  ctx.font = 'italic 600 22px "Plus Jakarta Sans", Arial, sans-serif';
  const promiseText =
    s9?.promiseFinal?.nextTimeOnline ||
    'I promise to STOP, CHECK for red flags, and talk to a trusted adult before clicking.';
  wrapText(ctx, `"${promiseText}"`, 120, 1060, 860, 30, 2);

  // Signatures on right
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0D9488';
  ctx.font = '900 28px "Fredoka", "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('Teacher Chelsea', 1230, 1060);
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(1100, 1074);
  ctx.lineTo(1360, 1074);
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.font = '700 17px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('CLASS TEACHER ENDORSEMENT', 1230, 1102);

  ctx.fillStyle = '#0E3558';
  ctx.font = '800 24px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(formattedDate, 1510, 1060);
  ctx.beginPath();
  ctx.moveTo(1395, 1074);
  ctx.lineTo(1625, 1074);
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.font = '700 17px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('LAST UPDATED', 1510, 1102);
  ctx.textAlign = 'left';

  const slug = nickname.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'detective';
  const pngUrl = canvas.toDataURL('image/png');
  triggerDownloadUrl(pngUrl, `digital-safety-certificate-${slug}.png`);
}

export function downloadUploadedCertificateFile(dataUrl: string, fileName?: string): void {
  if (!dataUrl) return;
  triggerDownloadUrl(dataUrl, fileName || 'uploaded-certificate.png');
}

export async function readAndCompressCertificateFile(
  file: File
): Promise<{ dataUrl: string; fileName: string }> {
  const lower = file.name.toLowerCase();
  const isPdf = file.type === 'application/pdf' || lower.endsWith('.pdf');
  const isImage =
    file.type.startsWith('image/') ||
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.webp');

  if (!isPdf && !isImage) {
    throw new Error('Please choose a PNG, JPG, WebP, or PDF certificate file.');
  }

  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });

  if (isPdf) {
    if (rawDataUrl.length > 1_600_000) {
      throw new Error('PDF certificate must be smaller than 1.2 MB.');
    }
    return { dataUrl: rawDataUrl, fileName: file.name };
  }

  // Image: keep crisp up to 1600px width, compress gently if > 650KB
  if (rawDataUrl.length <= 650_000) {
    return { dataUrl: rawDataUrl, fileName: file.name };
  }

  const compressedUrl = await new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 1600;
      const scale = img.width > maxW ? maxW / img.width : 1;
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const context = c.getContext('2d');
      if (!context) {
        reject(new Error('Could not process certificate image.'));
        return;
      }
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, w, h);
      context.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = () => reject(new Error('Could not decode image file.'));
    img.src = rawDataUrl;
  });

  return { dataUrl: compressedUrl, fileName: file.name };
}
