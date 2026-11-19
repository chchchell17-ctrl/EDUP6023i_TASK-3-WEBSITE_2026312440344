import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  FileCheck2,
  Printer,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { ALL_SEVEN_TOWN_BADGES } from '../../data/screen10Data.ts';
import type { StudentGameState } from '../../types/game.ts';
import {
  countCompletedTownActivities,
  downloadCertificateAsPng,
  downloadUploadedCertificateFile,
} from '../../utils/certificateExport.ts';
import {
  playBackClick,
  playErrorTone,
  playPortalOpen,
  playSoftSelect,
} from '../../utils/soundEffects.ts';
import { DetectiveAvatarPortrait } from '../game/DetectiveAvatar.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';

interface PrintableCertificateProps {
  gameState: StudentGameState;
  autoPrintOnMount?: boolean;
  readOnly?: boolean;
  onUploadCertificate?: (file: File) => Promise<void>;
  onRemoveUploadedCertificate?: () => Promise<void>;
  onClose: () => void;
}

export const PrintableCertificate: React.FC<PrintableCertificateProps> = ({
  gameState,
  autoPrintOnMount = false,
  readOnly = false,
  onUploadCertificate,
  onRemoveUploadedCertificate,
  onClose,
}) => {
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const nickname = gameState.detectiveNickname || 'Junior Detective';
  const s8 = gameState.screen08Progress;
  const s9 = gameState.screen09Progress;
  const lo2 = gameState.teacherLo2Assessment;
  const certRecord = gameState.certificateRecord;

  const badgeSet = new Set(gameState.inventory.badges.map((b) => b.id));
  const badgesEarned = ALL_SEVEN_TOWN_BADGES.filter((b) => badgeSet.has(b.id));
  const activitiesCompleted =
    certRecord?.activitiesCompletedCount ?? countCompletedTownActivities(gameState);
  const lo1Score = s8?.officialFirstAttemptSubmitted ? s8.firstAttemptScore : 0;
  const lo1Achieved = Boolean(s8?.lo1ReadingAchieved);

  const lo2Label =
    lo2?.status === 'achieved'
      ? 'Achieved'
      : lo2?.status === 'not-yet-achieved'
        ? 'Not Yet Achieved'
        : 'Awaiting Teacher Review';

  const completedTs =
    certRecord?.lastUpdatedAt ||
    gameState.screen10Progress?.completedAt ||
    s9?.completedAt ||
    gameState.updatedAt ||
    Date.now();
  const formattedDate = new Date(completedTs).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (!autoPrintOnMount) return;
    const t = window.setTimeout(() => {
      window.print();
    }, 260);
    return () => window.clearTimeout(t);
  }, [autoPrintOnMount]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playBackClick();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onUploadCertificate) return;
    setUploadBusy(true);
    setUploadFeedback(null);
    try {
      await onUploadCertificate(file);
      playPortalOpen();
      setUploadFeedback({
        type: 'success',
        text: `Uploaded "${file.name}" and synced to Teacher and Parent logins!`,
      });
    } catch (err) {
      playErrorTone();
      setUploadFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to upload certificate file.',
      });
    } finally {
      setUploadBusy(false);
    }
  };

  const handleRemoveUpload = async () => {
    if (!onRemoveUploadedCertificate) return;
    setUploadBusy(true);
    setUploadFeedback(null);
    try {
      await onRemoveUploadedCertificate();
      playSoftSelect();
      setUploadFeedback({
        type: 'success',
        text: 'Removed uploaded certificate copy.',
      });
    } catch {
      playErrorTone();
      setUploadFeedback({
        type: 'error',
        text: 'Could not remove uploaded certificate.',
      });
    } finally {
      setUploadBusy(false);
    }
  };

  return (
    <div
      id="ddw-certificate-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Digital Safety Guardian Printable Certificate"
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#0B2945]/65 backdrop-blur-sm p-3 sm:p-6 flex flex-col items-center justify-start sm:justify-center gap-3"
    >
      {/* Screen-only Action Toolbar */}
      <div className="no-print w-full max-w-[1040px] rounded-2xl bg-white/95 border border-white px-4 py-3 shadow-lg space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#16A34A]" aria-hidden="true" />
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-[#0E3558]">
                A4 LANDSCAPE CERTIFICATE · AUTO-UPDATED AFTER ACTIVITIES
              </p>
              <p className="text-[11px] font-semibold text-[#475569] tabular-nums">
                Progress synced: {activitiesCompleted} / 7 activities · {badgesEarned.length} / 7
                badges · Updated {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                downloadCertificateAsPng(gameState, nickname);
              }}
              className="aero-glossy-btn min-h-[40px] rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] hover:from-[#60A5FA] hover:to-[#0369A1] px-4 py-1.5 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>DOWNLOAD PNG</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                window.print();
              }}
              className="aero-glossy-btn min-h-[40px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-4 py-1.5 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              <span>PRINT / PDF</span>
            </button>

            {!readOnly && onUploadCertificate && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf,.png,.jpg,.jpeg,.webp,.pdf"
                  className="hidden"
                  onChange={handleFileSelected}
                />
                <button
                  type="button"
                  disabled={uploadBusy}
                  onClick={() => {
                    playSoftSelect();
                    fileInputRef.current?.click();
                  }}
                  className="min-h-[40px] rounded-full bg-amber-100 hover:bg-amber-200 disabled:opacity-60 border border-amber-300 px-4 py-1.5 text-xs sm:text-sm font-extrabold text-[#92400E] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  <span>{uploadBusy ? 'UPLOADING...' : 'UPLOAD CERTIFICATE'}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                playSoftSelect();
                onClose();
              }}
              aria-label="Close certificate view"
              className="min-h-[40px] rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 px-4 py-1.5 text-xs sm:text-sm font-bold text-[#0E3558] inline-flex items-center gap-1 cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Uploaded Copy Bar & Feedback */}
        {(certRecord?.uploadedFileDataUrl || uploadFeedback) && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {certRecord?.uploadedFileDataUrl && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-bold text-[#15803D]">
                  <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    Uploaded Copy: {certRecord.uploadedFileName || 'certificate-file'}
                    {certRecord.uploadedAt
                      ? ` (${new Date(certRecord.uploadedAt).toLocaleDateString()})`
                      : ''}
                  </span>
                </span>
              )}
              {uploadFeedback && (
                <span
                  role="status"
                  className={`font-bold ${
                    uploadFeedback.type === 'success' ? 'text-[#15803D]' : 'text-rose-700'
                  }`}
                >
                  {uploadFeedback.text}
                </span>
              )}
            </div>

            {certRecord?.uploadedFileDataUrl && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    downloadUploadedCertificateFile(
                      certRecord.uploadedFileDataUrl!,
                      certRecord.uploadedFileName
                    );
                  }}
                  className="min-h-[34px] rounded-full bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-3.5 py-1 text-xs font-extrabold text-[#15803D] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Download Uploaded Copy</span>
                </button>
                {!readOnly && onRemoveUploadedCertificate && (
                  <button
                    type="button"
                    disabled={uploadBusy}
                    onClick={handleRemoveUpload}
                    className="min-h-[34px] rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Printable A4 Landscape Sheet with Frutiger Aero Lighting & Shading */}
      <article
        id="ddw-certificate-sheet"
        className="relative overflow-hidden w-full max-w-[1040px] rounded-[28px] border-[6px] border-[#34D399] bg-gradient-to-br from-[#ECFDF5] via-[#FFFFFF] to-[#E0F2FE] p-5 sm:p-8 shadow-[0_28px_70px_-10px_rgba(14,53,88,0.48),inset_0_2px_0_rgba(255,255,255,0.95)] text-[#0E3558]"
      >
        {/* Ambient radial sunbeams & top glossy refraction sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-radial from-emerald-200/45 via-cyan-100/20 to-transparent blur-xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-radial from-sky-200/45 via-amber-100/20 to-transparent blur-xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-2 h-20 rounded-t-[22px] bg-gradient-to-b from-white/75 to-transparent"
        />

        <div className="relative z-10 rounded-[20px] border-2 border-dashed border-[#F59E0B] bg-white/92 p-5 sm:p-7 space-y-5 shadow-[inset_0_2px_10px_rgba(14,165,233,0.06)]">
          {/* Top School Header & Seals */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-emerald-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-sky-50 to-cyan-100/70 border-2 border-sky-200 p-1 shrink-0 shadow-sm">
                <PusheenIllustration expression="celebrating" pose="waving" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0D9488]">
                  SJKC MING TAO · DIGITAL DETECTIVE WORLD · YEAR 5 ENGLISH
                </p>
                <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl font-extrabold tracking-wide text-[#0E3558]">
                  CERTIFICATE OF ACHIEVEMENT
                </h1>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-emerald-100 border-2 border-amber-400 px-4 py-2 text-center shadow-[0_6px_16px_-4px_rgba(245,158,11,0.32),inset_0_1px_0_rgba(255,255,255,0.9)]">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#B45309]">
                {activitiesCompleted >= 7 ? 'OFFICIAL RANK' : 'DETECTIVE PROGRESS'}
              </p>
              <p className="font-[var(--font-display)] text-sm sm:text-base font-extrabold text-[#15803D] inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>DIGITAL SAFETY GUARDIAN</span>
              </p>
            </div>
          </div>

          {/* Pupil Award Recipient Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-3 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-sky-50 via-white to-emerald-50 border-2 border-sky-200 p-3 shadow-[inset_0_2px_8px_rgba(56,189,248,0.12)]">
              <div className="w-24 h-24">
                {gameState.avatarConfig && (
                  <DetectiveAvatarPortrait config={gameState.avatarConfig} className="w-full h-full" />
                )}
              </div>
              <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#0369A1] tabular-nums">
                Lv {gameState.level} · {gameState.xp} XP · {gameState.stars} Stars
              </p>
              <p className="text-[10px] font-bold text-[#15803D] tabular-nums">
                {activitiesCompleted} / 7 Activities Done
              </p>
            </div>

            <div className="md:col-span-9 space-y-2.5 text-center md:text-left">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#475569]">
                This certificate is proudly presented to
              </p>
              <p className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#6D28D9]">
                {nickname}
              </p>
              <p className="text-sm font-semibold text-[#18466E] leading-relaxed">
                for investigating online warning signs, completing reading and caring advice
                writing missions across Detective Town, and earning the{' '}
                <strong>Digital Safety Guardian</strong> recognition.
              </p>
            </div>
          </div>

          {/* Badges & LO1/LO2 Assessment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            <div className="rounded-2xl bg-gradient-to-b from-emerald-50/90 to-white border border-emerald-200 p-3.5 space-y-1.5 shadow-xs">
              <p className="font-extrabold uppercase tracking-wider text-[#15803D] inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Badges Earned ({badgesEarned.length} / 7)</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {badgesEarned.length > 0 ? (
                  badgesEarned.map((badge) => (
                    <span
                      key={badge.id}
                      className="rounded-lg bg-white border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold text-[#0E3558]"
                    >
                      ✓ {badge.name}
                    </span>
                  ))
                ) : (
                  <span className="text-[#475569] font-semibold">
                    Complete Detective Town missions to collect all 7 badges.
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-indigo-50/90 to-white border border-indigo-200 p-3.5 space-y-1 shadow-xs">
              <p className="font-extrabold uppercase tracking-wider text-[#4338CA]">
                LO1 · Independent Reading Assessment
              </p>
              <p className="text-base font-extrabold text-[#0E3558] tabular-nums">
                Score: {lo1Score} / 5
              </p>
              <p className="font-bold text-[#4338CA] inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {s8?.officialFirstAttemptSubmitted
                    ? lo1Achieved
                      ? 'Achieved (4/5 or higher)'
                      : 'Not Yet Achieved'
                    : 'Not Attempted Yet'}
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-teal-50/90 to-white border border-teal-200 p-3.5 space-y-1 shadow-xs">
              <p className="font-extrabold uppercase tracking-wider text-[#0F766E]">
                LO2 · Functional Advice Writing
              </p>
              <p className="text-base font-extrabold text-[#0E3558]">{lo2Label}</p>
              <p className="text-[11px] font-semibold text-[#334155]">
                {lo2?.comments
                  ? `Teacher Note: "${lo2.comments}"`
                  : 'Teacher reviews Screen 07 & Screen 09 advice writing.'}
              </p>
            </div>
          </div>

          {/* Promise Excerpt & Signatures */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-t-2 border-emerald-100 pt-4 text-xs">
            <div className="space-y-1 max-w-md">
              <p className="font-extrabold uppercase tracking-wider text-[#0369A1]">
                MY DIGITAL SAFETY PROMISE
              </p>
              <p className="italic font-semibold text-[#18466E]">
                &ldquo;
                {s9?.promiseFinal?.nextTimeOnline ||
                  'I promise to STOP, CHECK for red flags, and talk to a trusted adult before clicking.'}
                &rdquo;
              </p>
            </div>

            <div className="flex items-end gap-8">
              <div className="text-center">
                <p className="font-[var(--font-display)] text-sm font-extrabold text-[#0D9488]">
                  Teacher Chelsea
                </p>
                <div className="mt-1 w-36 border-t border-slate-400 pt-1 text-[10px] font-bold uppercase tracking-wider text-[#475569]">
                  Class Teacher Endorsement
                </div>
              </div>
              <div className="text-center">
                <p className="font-extrabold text-[#0E3558]">{formattedDate}</p>
                <div className="mt-1 w-32 border-t border-slate-400 pt-1 text-[10px] font-bold uppercase tracking-wider text-[#475569]">
                  Last Updated
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

