import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Download,
  FileBadge,
  FileCheck2,
  MessageSquareText,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  ALL_SEVEN_TOWN_BADGES,
  SCREEN10_REUNION_SCRIPT,
  createDefaultScreen10Progress,
} from '../../data/screen10Data.ts';
import type {
  GameSettings,
  SaveSyncStatus,
  Screen10Progress,
  StudentGameState,
} from '../../types/game.ts';
import {
  computeCertificateRecord,
  downloadCertificateAsPng,
  readAndCompressCertificateFile,
} from '../../utils/certificateExport.ts';
import type { CustomMapMedia } from '../../utils/customMapStorage.ts';
import { playPortalOpen, playSoftSelect, playVictorySound, setMusicMood } from '../../utils/soundEffects.ts';
import { AinaIllustration } from '../game/AinaIllustration.tsx';
import { ByteIllustration } from '../game/ByteIllustration.tsx';
import { DanielIllustration } from '../game/DanielIllustration.tsx';
import { DetectiveAvatar } from '../game/DetectiveAvatar.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { GameHud, type HudModalType } from '../game/GameHud.tsx';
import { HudModals } from '../game/HudModals.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';
import { TeacherChelseaIllustration } from '../game/TeacherChelseaIllustration.tsx';
import { DigitalSafetyPassport } from '../screen09/DigitalSafetyPassport.tsx';
import { PrintableCertificate } from './PrintableCertificate.tsx';

interface FinalCeremonyScreenProps {
  gameState: StudentGameState;
  saveStatus: SaveSyncStatus;
  customMapMedia?: CustomMapMedia | null;
  onUploadCustomMap?: (file: File) => Promise<void>;
  onResetCustomMap?: () => Promise<void>;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onPersistState: (nextState: StudentGameState) => Promise<void>;
  onReturnToTown: () => void;
  onEditCharacter: () => void;
  onReplayTutorial: () => void;
  onSignOut: () => void;
}

export const FinalCeremonyScreen: React.FC<FinalCeremonyScreenProps> = ({
  gameState,
  saveStatus,
  customMapMedia = null,
  onUploadCustomMap,
  onResetCustomMap,
  onUpdateSettings,
  onPersistState,
  onReturnToTown,
  onEditCharacter,
  onReplayTutorial,
  onSignOut,
}) => {
  const initialS10 = gameState.screen10Progress ?? createDefaultScreen10Progress();
  const [s10, setS10] = useState<Screen10Progress>(initialS10);
  const [replayingDialogue, setReplayingDialogue] = useState(!initialS10.reunionDialogueDone);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [revealedCount, setRevealedCount] = useState(
    initialS10.reunionDialogueDone ? ALL_SEVEN_TOWN_BADGES.length : 0
  );

  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [autoPrintCertificate, setAutoPrintCertificate] = useState(false);
  const [activeModal, setActiveModal] = useState<HudModalType | null>(null);

  const gameStateRef = useRef<StudentGameState>(gameState);
  gameStateRef.current = gameState;

  const nickname = gameState.detectiveNickname || 'Junior Detective';
  const avatarConfig = gameState.avatarConfig;

  useEffect(() => {
    setMusicMood('celebration');
    return () => setMusicMood('peaceful');
  }, []);

  const persistScreen10 = async (patch: Partial<Screen10Progress>) => {
    const mergedS10: Screen10Progress = {
      ...s10,
      ...patch,
    };
    setS10(mergedS10);
    const nextState: StudentGameState = {
      ...gameStateRef.current,
      screen10Progress: mergedS10,
      currentMission: mergedS10.ceremonyCompleted
        ? 'CERTIFIED DIGITAL SAFETY GUARDIAN · ALL MISSIONS COMPLETE'
        : gameStateRef.current.currentMission,
      updatedAt: Date.now(),
    };
    await onPersistState(nextState);
  };

  const handleUploadCertificateFile = async (file: File) => {
    const { dataUrl, fileName } = await readAndCompressCertificateFile(file);
    const nowTs = Date.now();
    const base = gameStateRef.current;
    const nextCert = {
      ...computeCertificateRecord(base, { nowTs }),
      issued: true,
      uploadedFileDataUrl: dataUrl,
      uploadedFileName: fileName,
      uploadedAt: nowTs,
      hasUploadedFile: true,
    };
    await onPersistState({
      ...base,
      certificateRecord: nextCert,
      updatedAt: nowTs,
    });
  };

  const handleRemoveUploadedCertificate = async () => {
    const nowTs = Date.now();
    const base = gameStateRef.current;
    const nextCert = computeCertificateRecord(
      {
        ...base,
        certificateRecord: {
          ...computeCertificateRecord(base, { nowTs }),
          uploadedFileDataUrl: undefined,
          uploadedFileName: undefined,
          uploadedAt: undefined,
          hasUploadedFile: false,
        },
      },
      { nowTs }
    );
    await onPersistState({
      ...base,
      certificateRecord: nextCert,
      updatedAt: nowTs,
    });
  };

  // Sequential animated reveal of all 7 town badges once reunion dialogue finishes
  useEffect(() => {
    if (replayingDialogue) return;
    if (revealedCount >= ALL_SEVEN_TOWN_BADGES.length) return;
    const delay = gameState.settings.reducedMotion ? 50 : 210;
    const timer = window.setTimeout(() => {
      setRevealedCount((c) => c + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [replayingDialogue, revealedCount, gameState.settings.reducedMotion]);

  const finishReunionDialogue = () => {
    playVictorySound();
    setReplayingDialogue(false);
    setRevealedCount(0);
    const completedAt = s10.completedAt || Date.now();
    void persistScreen10({
      reunionDialogueDone: true,
      ceremonyCompleted: true,
      completedAt,
    });
  };

  const badgeIdSet = new Set(gameState.inventory.badges.map((b) => b.id));
  const s7 = gameState.screen07Progress;
  const s8 = gameState.screen08Progress;
  const s9 = gameState.screen09Progress;
  const lo2 = gameState.teacherLo2Assessment;

  const locationsCompletedCount = [
    Boolean(gameState.screen03Progress?.inductionCompleted),
    Boolean(gameState.screen04Progress?.activityCompleted),
    Boolean(gameState.screen05Progress?.activityCompleted),
    Boolean(gameState.screen06Progress?.activityCompleted),
    Boolean(s7?.activityCompleted),
    Boolean(s8?.assessmentCompleted),
    Boolean(s9?.passportCompleted),
  ].filter(Boolean).length;

  const lo1Score = s8?.officialFirstAttemptSubmitted ? s8.firstAttemptScore : 0;
  const lo1StatusLabel = s8?.officialFirstAttemptSubmitted
    ? s8.lo1ReadingAchieved
      ? 'Achieved (4/5 or higher)'
      : 'Not Yet Achieved'
    : 'Not Attempted Yet';

  const lo2StatusLabel =
    lo2?.status === 'achieved'
      ? 'Achieved'
      : lo2?.status === 'not-yet-achieved'
        ? 'Not Yet Achieved'
        : 'Awaiting Teacher Review';

  const currentStep = SCREEN10_REUNION_SCRIPT[dialogueIdx];

  return (
    <div
      className={`min-h-dvh w-full flex flex-col bg-gradient-to-b from-[#67E8F9] via-[#E0F2FE] to-[#DCFCE7] ${
        gameState.settings.reducedMotion ? 'reduced-motion' : ''
      }`}
    >
      <div className="no-print">
        <GameHud
          gameState={gameState}
          saveStatus={saveStatus}
          spotlightTarget={null}
          onOpenModal={(m) => setActiveModal(m)}
          onSignOut={onSignOut}
        />
      </div>

      <main className="no-print flex-1 mx-auto w-full max-w-6xl px-3 sm:px-6 py-4 space-y-5">
        {/* STAGE 1: ALL-CHARACTER REUNION CELEBRATION */}
        <section
          aria-label="Digital Detective World Reunion Stage"
          className="aero-glass-card rounded-[32px] border-2 border-white bg-gradient-to-br from-[#F0F9FF]/95 via-[#FFFFFF]/95 to-[#ECFDF5]/95 p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.3)]"
        >
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-[#15803D]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>SCREEN 10 · FINAL ACHIEVEMENT CEREMONY</span>
              </div>

              {!replayingDialogue && (
                <button
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setDialogueIdx(0);
                    setReplayingDialogue(true);
                  }}
                  className="min-h-[34px] rounded-full bg-white hover:bg-sky-50 border border-sky-200 px-3.5 py-1 text-xs font-bold text-[#0369A1] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Replay Reunion Dialogue</span>
                </button>
              )}
            </div>

            <div className="text-center space-y-1">
              <h1 className="font-[var(--font-display)] text-2xl sm:text-4xl font-extrabold text-[#0E3558] casper-sub-halo">
                CONGRATULATIONS, {nickname.toUpperCase()}!
              </h1>
              <p className="text-sm sm:text-lg font-extrabold text-[#15803D] uppercase tracking-wide">
                OFFICIAL RANK UNLOCKED: DIGITAL SAFETY GUARDIAN
              </p>
            </div>

            {/* All 6 Reunion Characters Together */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 items-end rounded-3xl bg-gradient-to-b from-sky-50 via-white to-emerald-50 border-2 border-white px-3 py-4 shadow-inner">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20">
                  <PusheenIllustration expression="celebrating" pose="waving" />
                </div>
                <span className="mt-1 text-[10px] font-extrabold text-[#0369A1]">Pusheen</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-20 sm:w-20 sm:h-24">
                  <AinaIllustration expression="happy" />
                </div>
                <span className="mt-1 text-[10px] font-extrabold text-[#DB2777]">Aina</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-20 sm:w-20 sm:h-24">
                  {avatarConfig && <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />}
                </div>
                <span className="mt-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-extrabold text-[#6D28D9]">
                  {nickname}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-20 sm:w-20 sm:h-24">
                  <ByteIllustration expression="celebrating" />
                </div>
                <span className="mt-1 text-[10px] font-extrabold text-[#0284C7]">Byte</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-20 sm:w-20 sm:h-24">
                  <DanielIllustration expression="happy" />
                </div>
                <span className="mt-1 text-[10px] font-extrabold text-[#15803D]">Daniel</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-20 sm:w-20 sm:h-24">
                  <TeacherChelseaIllustration expression="celebrating" />
                </div>
                <span className="mt-1 text-[10px] font-extrabold text-[#0D9488]">
                  Teacher Chelsea
                </span>
              </div>
            </div>

            {replayingDialogue && currentStep && (
              <div className="pt-1">
                <DialogueBox
                  speaker={currentStep.speaker}
                  speakerName={currentStep.speakerName}
                  playerNickname={nickname}
                  playerAvatar={avatarConfig}
                  expression={currentStep.expression}
                  text={currentStep.text}
                  settings={gameState.settings}
                  onReplay={() => setDialogueIdx(0)}
                  onSkipAll={finishReunionDialogue}
                  onNext={() => {
                    if (dialogueIdx + 1 < SCREEN10_REUNION_SCRIPT.length) {
                      setDialogueIdx((i) => i + 1);
                    } else {
                      finishReunionDialogue();
                    }
                  }}
                />
              </div>
            )}
          </div>
        </section>

        {/* STAGE 2: ALL 7 MISSION BADGES & REAL DB DASHBOARD */}
        {!replayingDialogue && (
          <>
            <section
              aria-label="Seven Detective Town Mission Badges"
              className="rounded-[28px] border-2 border-white bg-white/92 p-5 sm:p-6 shadow-md space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-[var(--font-display)] text-lg sm:text-xl font-extrabold text-[#0E3558] inline-flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#F59E0B]" aria-hidden="true" />
                  <span>DETECTIVE TOWN BADGE COLLECTION</span>
                </h2>
                <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-extrabold text-[#B45309] tabular-nums">
                  {ALL_SEVEN_TOWN_BADGES.filter((b) => badgeIdSet.has(b.id)).length} / 7 EARNED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {ALL_SEVEN_TOWN_BADGES.map((badge, idx) => {
                  const earned = badgeIdSet.has(badge.id);
                  const visible = idx < revealedCount;
                  return (
                    <div
                      key={badge.id}
                      className={`rounded-2xl border-2 p-3.5 transition-all duration-300 ${
                        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      } ${
                        earned
                          ? `${badge.accentBg} shadow-xs`
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider ${earned ? badge.accentText : 'text-slate-500'}`}>
                          {badge.locationLabel}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                            earned
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {earned ? 'EARNED' : 'LOCKED'}
                        </span>
                      </div>
                      <p className="mt-1.5 font-[var(--font-display)] text-sm font-extrabold text-[#0E3558]">
                        {badge.name}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-[#475569]">
                        {badge.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Real Database Achievement Summary + Separate LO1 & LO2 */}
            <section
              aria-label="Official Learning Achievement Summary"
              className="grid grid-cols-1 lg:grid-cols-12 gap-4"
            >
              {/* Overall Stats */}
              <div className="lg:col-span-4 rounded-[28px] border-2 border-white bg-white/92 p-5 shadow-md space-y-3">
                <h2 className="font-[var(--font-display)] text-base font-extrabold text-[#0E3558]">
                  DETECTIVE PROFILE STATS
                </h2>
                <div className="grid grid-cols-2 gap-2.5 text-center">
                  <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3">
                    <p className="text-[10px] font-extrabold uppercase text-[#0369A1]">LEVEL</p>
                    <p className="font-[var(--font-display)] text-xl font-extrabold text-[#0E3558] tabular-nums">
                      Lv {gameState.level}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-purple-50 border border-purple-200 p-3">
                    <p className="text-[10px] font-extrabold uppercase text-[#6D28D9]">TOTAL XP</p>
                    <p className="font-[var(--font-display)] text-xl font-extrabold text-[#0E3558] tabular-nums">
                      {gameState.xp} XP
                    </p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
                    <p className="text-[10px] font-extrabold uppercase text-[#B45309]">STARS</p>
                    <p className="font-[var(--font-display)] text-xl font-extrabold text-[#B45309] inline-flex items-center gap-1 tabular-nums">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                      {gameState.stars}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
                    <p className="text-[10px] font-extrabold uppercase text-[#15803D]">LOCATIONS</p>
                    <p className="font-[var(--font-display)] text-xl font-extrabold text-[#15803D] tabular-nums">
                      {locationsCompletedCount} / 7
                    </p>
                  </div>
                </div>
                <p className="text-xs font-semibold text-[#475569]">
                  Digital Safety Passport:{' '}
                  <strong className="text-[#15803D]">
                    {s9?.passportCompleted
                      ? `Stamped (${s9.completedAt ? new Date(s9.completedAt).toLocaleDateString() : 'Completed'})`
                      : 'Pending in Digital Safe Garden'}
                  </strong>
                </p>
              </div>

              {/* LO1 Reading Card (Separate) */}
              <div className="lg:col-span-4 rounded-[28px] border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/90 to-white p-5 shadow-md space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#4338CA] inline-flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span>LO1 · READING (INDEPENDENT)</span>
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                      s8?.lo1ReadingAchieved
                        ? 'bg-emerald-100 text-[#15803D]'
                        : 'bg-amber-100 text-[#B45309]'
                    }`}
                  >
                    {s8?.officialFirstAttemptSubmitted
                      ? s8.lo1ReadingAchieved
                        ? 'Achieved'
                        : 'Not Yet Achieved'
                      : 'Pending'}
                  </span>
                </div>
                <p className="font-[var(--font-display)] text-2xl font-extrabold text-[#0E3558] tabular-nums">
                  {lo1Score} / 5 Marks
                </p>
                <p className="text-xs font-semibold text-[#334155]">
                  Official first-attempt score at Game Arcade: <strong>{lo1StatusLabel}</strong>.
                </p>
                <p className="text-[11px] font-semibold text-[#475569]">
                  Target: Identify at least 4 out of 5 specific pieces of information from Daniel&apos;s
                  digital-safety reading text.
                </p>
              </div>

              {/* LO2 Writing Card (Separate + Teacher Assessed) */}
              <div className="lg:col-span-4 rounded-[28px] border-2 border-teal-200 bg-gradient-to-br from-teal-50/90 to-white p-5 shadow-md space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#0F766E] inline-flex items-center gap-1.5">
                    <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                    <span>LO2 · WRITING (TEACHER REVIEW)</span>
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                      lo2?.status === 'achieved'
                        ? 'bg-emerald-100 text-[#15803D]'
                        : lo2?.status === 'not-yet-achieved'
                          ? 'bg-rose-100 text-[#BE123C]'
                          : 'bg-sky-100 text-[#0369A1]'
                    }`}
                  >
                    {lo2StatusLabel}
                  </span>
                </div>
                <p className="font-[var(--font-display)] text-lg font-extrabold text-[#0E3558]">
                  {lo2StatusLabel}
                </p>
                <div className="rounded-xl bg-white/90 border border-teal-100 p-2.5 text-xs space-y-1">
                  <p className="font-bold text-[#0F766E]">Saved Advice Writing:</p>
                  <p className="text-[#334155] line-clamp-2">
                    Advice Centre: &ldquo;{s7?.writingPortfolio?.mission2Giving || '—'}&rdquo;
                  </p>
                  <p className="text-[#334155] line-clamp-2">
                    Final Advice to Daniel: &ldquo;{s9?.adviceFinal?.task1Should || '—'}&rdquo;
                  </p>
                </div>
                {lo2?.comments && (
                  <p className="text-xs font-bold text-[#0E3558]">
                    Teacher Comment: &ldquo;{lo2.comments}&rdquo;
                  </p>
                )}
              </div>
            </section>

            {/* Final Action Controls */}
            <section className="rounded-[28px] border-2 border-white bg-white/92 p-5 shadow-md space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      playSoftSelect();
                      setShowPassportModal(true);
                    }}
                    className="min-h-[44px] rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 px-5 py-2 text-xs sm:text-sm font-extrabold text-[#92400E] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileBadge className="h-4 w-4" aria-hidden="true" />
                    <span>VIEW DIGITAL SAFETY PASSPORT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSoftSelect();
                      setAutoPrintCertificate(false);
                      setShowCertificateModal(true);
                      void persistScreen10({ certificateViewed: true });
                    }}
                    className="min-h-[44px] rounded-full bg-sky-100 hover:bg-sky-200 border border-sky-300 px-5 py-2 text-xs sm:text-sm font-extrabold text-[#0369A1] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    <span>VIEW / UPLOAD CERTIFICATE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      downloadCertificateAsPng(gameState, nickname);
                      void persistScreen10({ certificateViewed: true });
                    }}
                    className="aero-glossy-btn min-h-[44px] rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] hover:from-[#60A5FA] hover:to-[#0369A1] px-5 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <span>DOWNLOAD PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      setAutoPrintCertificate(true);
                      setShowCertificateModal(true);
                      void persistScreen10({ certificateViewed: true });
                    }}
                    className="aero-glossy-btn min-h-[44px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-5 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="h-4 w-4" aria-hidden="true" />
                    <span>PRINT / PDF</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    playSoftSelect();
                    await persistScreen10({
                      reunionDialogueDone: true,
                      ceremonyCompleted: true,
                      completedAt: s10.completedAt || Date.now(),
                    });
                    onReturnToTown();
                  }}
                  className="min-h-[44px] rounded-full bg-white hover:bg-emerald-50 border border-emerald-300 px-5 py-2 text-xs sm:text-sm font-extrabold text-[#15803D] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>RETURN TO TOWN</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs font-semibold text-[#475569]">
                <span className="inline-flex items-center gap-1.5 text-[#15803D]">
                  <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                  Live Certificate auto-updates after every activity and syncs to Teacher &amp; Parent portals.
                </span>
                {gameState.certificateRecord?.uploadedFileName && (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-bold text-[#15803D]">
                    Uploaded Copy Synced: {gameState.certificateRecord.uploadedFileName}
                  </span>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Digital Safety Passport Modal */}
      {showPassportModal && s9 && avatarConfig && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Digital Safety Passport Viewer"
          className="no-print fixed inset-0 z-[65] overflow-y-auto bg-[#0B2945]/55 backdrop-blur-xs pt-6 pb-10"
        >
          <DigitalSafetyPassport
            avatarConfig={avatarConfig}
            nickname={nickname}
            progress={s9}
            onCloseModal={() => setShowPassportModal(false)}
          />
        </div>
      )}

      {/* Printable A4 Landscape Certificate Modal */}
      {showCertificateModal && (
        <PrintableCertificate
          gameState={gameState}
          autoPrintOnMount={autoPrintCertificate}
          onUploadCertificate={handleUploadCertificateFile}
          onRemoveUploadedCertificate={handleRemoveUploadedCertificate}
          onClose={() => {
            setShowCertificateModal(false);
            setAutoPrintCertificate(false);
          }}
        />
      )}

      <div className="no-print">
        <HudModals
          activeModal={activeModal}
          gameState={gameState}
          canEditCharacter={true}
          customMapMedia={customMapMedia}
          onUploadCustomMap={onUploadCustomMap}
          onResetCustomMap={onResetCustomMap}
          onUpdateSettings={onUpdateSettings}
          onCloseModal={() => setActiveModal(null)}
          onEditCharacter={onEditCharacter}
          onReplayTutorial={onReplayTutorial}
          onOpenPassport={() => {
            setActiveModal(null);
            setShowPassportModal(true);
          }}
          onOpenCertificate={() => {
            setActiveModal(null);
            setAutoPrintCertificate(false);
            setShowCertificateModal(true);
          }}
        />
      </div>
    </div>
  );
};
