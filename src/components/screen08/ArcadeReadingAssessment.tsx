import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Loader2,
  Map,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  getScreen08ResultBand,
  SCREEN08_ASSESSMENT_RULES,
  SCREEN08_FINALE_SCRIPT,
  SCREEN08_QUESTIONS,
  SCREEN08_READING_PASSAGE,
} from '../../data/screen08Data.ts';
import { gradeScreen08ReadingAnswer } from '../../services/studentProgressApi.ts';
import type {
  AvatarConfig,
  GameSettings,
  Screen08AnswerKey,
  Screen08QuestionResponse,
} from '../../types/game.ts';
import {
  playErrorTone,
  playPortalOpen,
  playSoftSelect,
  playVictorySound,
} from '../../utils/soundEffects.ts';
import { DanielIllustration } from '../game/DanielIllustration.tsx';
import { DialogueBox } from '../game/DialogueBox.tsx';
import { PusheenIllustration } from '../game/PusheenIllustration.tsx';
import { TeacherChelseaIllustration } from '../game/TeacherChelseaIllustration.tsx';

interface ArcadeReadingAssessmentProps {
  mode: 'assessment-intro' | 'reading-assessment' | 'results' | 'completion';
  avatarConfig: AvatarConfig;
  nickname: string;
  settings: GameSettings;
  officialSubmitted: boolean;
  officialScore: number;
  officialResponses: Screen08QuestionResponse[];
  onStartAssessment: () => void;
  onCompleteAssessmentRun: (
    responses: Screen08QuestionResponse[],
    score: number
  ) => void;
  onRetryPractice: () => void;
  onProceedToFinale: () => void;
  onVisitGarden: () => void;
  onReturnToTown: () => void;
  onPlayAgainLevel?: () => void;
}

const OPTION_KEYS: Screen08AnswerKey[] = ['A', 'B', 'C', 'D'];

export const ArcadeReadingAssessment: React.FC<ArcadeReadingAssessmentProps> = ({
  mode,
  avatarConfig,
  nickname,
  settings,
  officialSubmitted,
  officialScore,
  officialResponses,
  onStartAssessment,
  onCompleteAssessmentRun,
  onRetryPractice,
  onProceedToFinale,
  onVisitGarden,
  onReturnToTown,
  onPlayAgainLevel,
}) => {
  const [largePassageText, setLargePassageText] = useState(false);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Screen08AnswerKey | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [questionFeedback, setQuestionFeedback] = useState<{
    correct: boolean;
    message: string;
    explanation: string;
    evidenceExcerpt: string;
  } | null>(null);
  const [runResponses, setRunResponses] = useState<Screen08QuestionResponse[]>([]);
  const [finaleIdx, setFinaleIdx] = useState(0);

  if (mode === 'assessment-intro') {
    return (
      <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div className="rounded-[32px] border-2 border-white bg-white/95 p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(76,29,149,0.36)] space-y-5 text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-100 pb-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C3AED]">
                INDEPENDENT READING ASSESSMENT · LO1 READING
              </p>
              <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
                FINAL DETECTIVE MISSION — DANIEL&apos;S GAME REWARD
              </h2>
            </div>
            <div className="w-20 h-20 shrink-0">
              <TeacherChelseaIllustration expression="encouraging" />
            </div>
          </div>

          <div className="rounded-2xl bg-teal-50 border border-teal-200 p-4 text-xs sm:text-sm font-bold text-[#0F766E]">
            Teacher Chelsea: &ldquo;You are ready, Detective {nickname}! Read the unseen story
            independently and find at least 4 out of 5 key details. Take your time — you can do
            this on your own!&rdquo;
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7]">
              MISSION RULES (READ BEFORE STARTING):
            </p>
            <ul className="space-y-2">
              {SCREEN08_ASSESSMENT_RULES.map((rule, idx) => (
                <li
                  key={idx}
                  className="rounded-xl bg-sky-50/80 border border-sky-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0E3558] flex items-start gap-2.5"
                >
                  <span className="h-5 w-5 rounded-full bg-[#0284C7] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                playPortalOpen();
                setQuestionIdx(0);
                setSelectedChoice(null);
                setQuestionFeedback(null);
                setRunResponses([]);
                onStartAssessment();
              }}
              className="aero-glossy-btn min-h-[52px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] border border-white px-9 py-3 text-sm sm:text-base font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>START</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'reading-assessment') {
    const q = SCREEN08_QUESTIONS[questionIdx];
    const hasCheckedCurrent = questionFeedback !== null;

    const handleCheckAnswer = async () => {
      if (!selectedChoice || isChecking || hasCheckedCurrent) return;
      setIsChecking(true);

      const graded = await gradeScreen08ReadingAnswer(q.questionNumber, selectedChoice);
      setIsChecking(false);

      if (graded.correct) {
        playVictorySound();
      } else {
        playErrorTone();
      }

      const entry: Screen08QuestionResponse = {
        questionNumber: q.questionNumber,
        firstAnswer: selectedChoice,
        firstAttemptCorrect: graded.correct,
        selectedAnswer: selectedChoice,
        isCorrect: graded.correct,
        attemptCount: 1,
        explanation: graded.explanation,
        evidenceExcerpt: graded.evidenceExcerpt,
      };

      const nextResponses = [...runResponses.filter((r) => r.questionNumber !== q.questionNumber), entry]
        .sort((a, b) => a.questionNumber - b.questionNumber);
      setRunResponses(nextResponses);

      setQuestionFeedback({
        correct: graded.correct,
        message: graded.correct
          ? 'Excellent! You found the information in the text.'
          : "Not quite! Let's look at the passage again.",
        explanation: graded.explanation,
        evidenceExcerpt: graded.evidenceExcerpt,
      });
    };

    const handleNextQuestion = () => {
      playSoftSelect();
      if (questionIdx + 1 < SCREEN08_QUESTIONS.length) {
        setQuestionIdx((p) => p + 1);
        setSelectedChoice(null);
        setQuestionFeedback(null);
      } else {
        const score = runResponses.filter((r) => r.isCorrect).length;
        onCompleteAssessmentRun(runResponses, score);
      }
    };

    return (
      <div className="relative z-20 w-full max-w-6xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div className="rounded-[32px] border-2 border-white bg-white/95 p-4 sm:p-6 shadow-[0_24px_60px_-10px_rgba(76,29,149,0.34)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3">
            <div className="text-left">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C3AED]">
                FINAL DETECTIVE MISSION — DANIEL&apos;S GAME REWARD
              </p>
              <h2 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0E3558]">
                {officialSubmitted
                  ? 'Practice Mode (Your official first-attempt mark stays locked!)'
                  : 'Independent Reading Comprehension (5 Marks)'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {SCREEN08_QUESTIONS.map((item, idx) => {
                const answered = runResponses.find((r) => r.questionNumber === item.questionNumber);
                return (
                  <span
                    key={item.questionNumber}
                    className={`h-8 w-8 rounded-full text-xs font-extrabold flex items-center justify-center border-2 ${
                      idx === questionIdx
                        ? 'bg-[#7C3AED] text-white border-[#5B21B6]'
                        : answered?.isCorrect
                          ? 'bg-emerald-100 text-[#15803D] border-emerald-400'
                          : answered
                            ? 'bg-rose-100 text-[#BE123C] border-rose-400'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {item.questionNumber}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Split-screen Passage + Single Question */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Scrollable Unseen Reading Passage */}
            <div className="lg:col-span-6 rounded-[26px] border-2 border-sky-200 bg-gradient-to-b from-sky-50/90 to-white p-5 text-left space-y-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#0284C7]">
                  <BookOpen className="h-5 w-5" />
                  <h3 className="font-[var(--font-display)] text-base sm:text-lg font-bold text-[#0E3558]">
                    {SCREEN08_READING_PASSAGE.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setLargePassageText((p) => !p);
                  }}
                  aria-label="Toggle larger reading text"
                  className="rounded-full bg-white hover:bg-sky-100 border border-sky-300 px-3 py-1 text-xs font-extrabold text-[#0369A1] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {largePassageText ? <ZoomOut className="h-3.5 w-3.5" /> : <ZoomIn className="h-3.5 w-3.5" />}
                  <span>{largePassageText ? 'Normal Text' : 'Enlarge Text'}</span>
                </button>
              </div>

              <div className="max-h-[370px] overflow-y-auto pr-2 space-y-4">
                {SCREEN08_READING_PASSAGE.paragraphs.map((para, pIdx) => (
                  <div key={pIdx} className="rounded-2xl bg-white border border-sky-100 p-4 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                      PARAGRAPH {pIdx + 1}
                    </span>
                    <p
                      className={`font-semibold text-[#1E293B] leading-relaxed ${
                        largePassageText ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                      }`}
                    >
                      {para}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: One Question at a Time */}
            <div className="lg:col-span-6 rounded-[26px] border-2 border-purple-200 bg-white p-5 text-left space-y-4 shadow-sm">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C3AED]">
                  QUESTION {q.questionNumber} OF {SCREEN08_QUESTIONS.length} · 1 MARK
                </p>
                <h3 className="font-[var(--font-display)] text-base sm:text-lg font-bold text-[#0E3558] mt-1">
                  {q.prompt}
                </h3>
              </div>

              <div className="space-y-2.5">
                {OPTION_KEYS.map((key) => {
                  const chosen = selectedChoice === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={hasCheckedCurrent}
                      onClick={() => {
                        playSoftSelect();
                        setSelectedChoice(key);
                      }}
                      className={`w-full min-h-[52px] rounded-2xl border-2 px-4 py-3 text-left text-xs sm:text-sm font-bold flex items-start gap-3 transition-all cursor-pointer disabled:cursor-default ${
                        chosen
                          ? 'bg-purple-50 border-purple-500 text-[#4C1D95] shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:border-purple-300 text-[#0E3558]'
                      }`}
                    >
                      <span
                        className={`h-6 w-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 ${
                          chosen ? 'bg-[#7C3AED] text-white' : 'bg-white border border-slate-300 text-slate-600'
                        }`}
                      >
                        {key}
                      </span>
                      <span className="leading-snug">{q.options[key]}</span>
                    </button>
                  );
                })}
              </div>

              {questionFeedback && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-2xl border-2 p-4 space-y-1.5 ${
                    questionFeedback.correct
                      ? 'bg-emerald-50 border-emerald-400 text-[#14532D]'
                      : 'bg-amber-50 border-amber-300 text-[#92400E]'
                  }`}
                >
                  <p className="text-sm font-extrabold">{questionFeedback.message}</p>
                  {questionFeedback.correct && questionFeedback.evidenceExcerpt && (
                    <p className="text-xs font-semibold opacity-90">{questionFeedback.explanation}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-1">
                {!hasCheckedCurrent ? (
                  <button
                    type="button"
                    disabled={!selectedChoice || isChecking}
                    onClick={() => void handleCheckAnswer()}
                    className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] disabled:opacity-50 px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow cursor-pointer"
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Checking...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>SUBMIT ANSWER</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow cursor-pointer"
                  >
                    <span>
                      {questionIdx + 1 < SCREEN08_QUESTIONS.length
                        ? `NEXT QUESTION (${questionIdx + 2}/5)`
                        : 'VIEW ASSESSMENT RESULTS'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'results') {
    const displayedResponses = runResponses.length === 5 ? runResponses : officialResponses;
    const latestRunScore =
      runResponses.length === 5
        ? runResponses.filter((r) => r.isCorrect).length
        : officialScore;
    const band = getScreen08ResultBand(officialScore);
    const missedQuestions = displayedResponses.filter((r) => !r.isCorrect);

    return (
      <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
        <div className="rounded-[32px] border-2 border-white bg-white/95 p-6 sm:p-8 shadow-[0_24px_60px_-10px_rgba(76,29,149,0.36)] space-y-5 text-center">
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider ${band.badgeColor}`}>
            <ShieldCheck className="h-4 w-4" />
            <span>{band.bandLabel}</span>
          </div>

          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
            Official LO1 Reading Score: {officialScore} / 5
          </h2>

          {officialSubmitted && latestRunScore !== officialScore && (
            <p className="text-xs font-bold text-[#0369A1]">
              Latest practice round: {latestRunScore}/5 (Your first official submission of{' '}
              {officialScore}/5 remains permanently recorded!)
            </p>
          )}

          <p className="text-sm sm:text-base font-semibold text-[#334155] max-w-xl mx-auto">
            {band.summaryText}
          </p>

          {missedQuestions.length > 0 && (
            <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-4 text-left space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#B45309]">
                PASSAGE EVIDENCE FOR MISSED QUESTIONS:
              </p>
              {missedQuestions.map((m) => {
                const qObj = SCREEN08_QUESTIONS.find((item) => item.questionNumber === m.questionNumber);
                return (
                  <div key={m.questionNumber} className="rounded-xl bg-white border border-amber-200 p-3 space-y-1">
                    <p className="text-xs font-extrabold text-[#0E3558]">
                      Q{m.questionNumber}: {qObj?.prompt}
                    </p>
                    <p className="text-xs font-semibold text-[#92400E]">{m.explanation}</p>
                    {m.evidenceExcerpt && (
                      <p className="text-[11px] italic font-semibold text-[#475569]">
                        Evidence: {m.evidenceExcerpt}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                playSoftSelect();
                setQuestionIdx(0);
                setSelectedChoice(null);
                setQuestionFeedback(null);
                setRunResponses([]);
                onRetryPractice();
              }}
              className="min-h-[48px] rounded-full bg-white hover:bg-purple-50 border-2 border-purple-200 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-[#6D28D9] inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>PRACTICE PASSAGE AGAIN</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playVictorySound();
                onProceedToFinale();
              }}
              className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] border border-white px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>CLAIM SAFE CLICKER BADGE</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 'completion'
  const step = SCREEN08_FINALE_SCRIPT[finaleIdx];
  return (
    <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 pb-44 sm:pb-48">
      <div className="w-full max-w-2xl rounded-[32px] border-2 border-white bg-white/95 p-6 sm:p-8 shadow-2xl text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="w-20 h-22">
            <DanielIllustration expression="celebrating" />
          </div>
          <div className="w-20 h-22">
            <TeacherChelseaIllustration expression="celebrating" />
          </div>
          <div className="w-20 h-18">
            <PusheenIllustration expression="celebrating" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 border border-indigo-300 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#4338CA]">
          <Award className="h-4 w-4" />
          <span>BADGE EARNED: SAFE CLICKER</span>
        </div>

        <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
          GAME ARCADE MISSION COMPLETE!
        </h2>

        <p className="text-sm font-semibold text-[#334155]">
          Detective {nickname}, you helped Daniel and recorded an official reading score of{' '}
          <span className="font-extrabold text-[#15803D]">{officialScore} / 5</span>. The Digital
          Safe Garden is now unlocked!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              playPortalOpen();
              onVisitGarden();
            }}
            className="aero-glossy-btn min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] border border-white px-7 py-2.5 text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>ENTER DIGITAL SAFE GARDEN</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              playSoftSelect();
              onReturnToTown();
            }}
            className="min-h-[48px] rounded-full bg-white hover:bg-sky-50 border-2 border-sky-200 px-6 py-2.5 text-sm font-extrabold text-[#0369A1] inline-flex items-center gap-2 cursor-pointer"
          >
            <Map className="h-4 w-4" />
            <span>BACK TO TOWN MAP</span>
          </button>

          {onPlayAgainLevel && (
            <button
              type="button"
              onClick={onPlayAgainLevel}
              className="min-h-[48px] rounded-full bg-white hover:bg-purple-50 border-2 border-purple-200 px-6 py-2.5 text-sm font-extrabold text-[#6D28D9] inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>PLAY AGAIN</span>
            </button>
          )}
        </div>
      </div>

      {step && (
        <div className="fixed inset-x-0 bottom-3 z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <DialogueBox
              speaker={step.speaker}
              speakerName={step.speakerName}
              playerNickname={nickname}
              playerAvatar={avatarConfig}
              expression={step.expression}
              text={step.text}
              settings={settings}
              nextLabel={finaleIdx + 1 < SCREEN08_FINALE_SCRIPT.length ? 'NEXT' : 'ENTER DIGITAL SAFE GARDEN'}
              onNext={() => {
                if (finaleIdx + 1 < SCREEN08_FINALE_SCRIPT.length) {
                  setFinaleIdx((p) => p + 1);
                } else {
                  onVisitGarden();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
