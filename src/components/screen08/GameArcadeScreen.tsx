import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin, RotateCcw } from 'lucide-react';
import { createDefaultScreen08Progress } from '../../data/screen08Data.ts';
import type {
  GameSettings,
  InventoryItem,
  SaveSyncStatus,
  Screen08Progress,
  Screen08StageId,
  StudentGameState,
} from '../../types/game.ts';
import type { CustomMapMedia } from '../../utils/customMapStorage.ts';
import { playSoftSelect, setMusicMood } from '../../utils/soundEffects.ts';
import { GameHud, type HudModalType } from '../game/GameHud.tsx';
import { HudModals } from '../game/HudModals.tsx';
import { ArcadeEnvironment } from './ArcadeEnvironment.tsx';
import { ArcadeFindDaniel } from './ArcadeFindDaniel.tsx';
import { ArcadeReadingAssessment } from './ArcadeReadingAssessment.tsx';

interface GameArcadeScreenProps {
  gameState: StudentGameState;
  saveStatus: SaveSyncStatus;
  customMapMedia?: CustomMapMedia | null;
  onUploadCustomMap?: (file: File) => Promise<void>;
  onResetCustomMap?: () => Promise<void>;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onPersistState: (nextState: StudentGameState) => Promise<void>;
  onReturnToTown: () => void;
  onContinueToDigitalSafeGarden: (latestState: StudentGameState) => void;
  onEditCharacter: () => void;
  onReplayTutorial: () => void;
  onSignOut: () => void;
}

const SAFE_CLICKER_BADGE: InventoryItem = {
  id: 'badge-safe-clicker',
  name: 'SAFE CLICKER',
  category: 'badges',
  description:
    'Earned at the Game Arcade for finding Daniel and completing the independent reading detective mission!',
};

const STAGE_LABELS: Record<Screen08StageId, string> = {
  exterior: 'PART 1 · GAME ARCADE EXTERIOR',
  'interior-explore': 'PART 2 · GAME ARCADE INTERIOR',
  'welcome-dialogue': 'PART 3 · TEACHER CHELSEA WELCOMES YOU',
  'find-daniel': 'PART 4 · FIND DANIEL IN THE ARCADE',
  'daniel-problem': "PART 5 · DANIEL'S GAME REWARD POP-UP",
  'assessment-intro': 'PART 6 · FINAL DETECTIVE MISSION BRIEFING',
  'reading-assessment': 'PART 7 · INDEPENDENT READING ASSESSMENT',
  results: 'PART 8 · LO1 READING RESULTS',
  completion: 'PART 9 · SAFE CLICKER BADGE & GARDEN UNLOCK',
};

export const GameArcadeScreen: React.FC<GameArcadeScreenProps> = ({
  gameState,
  saveStatus,
  customMapMedia = null,
  onUploadCustomMap,
  onResetCustomMap,
  onUpdateSettings,
  onPersistState,
  onReturnToTown,
  onContinueToDigitalSafeGarden,
  onEditCharacter,
  onReplayTutorial,
  onSignOut,
}) => {
  const initialProgress = gameState.screen08Progress ?? createDefaultScreen08Progress();

  const [s8, setS8] = useState<Screen08Progress>(initialProgress);
  const s8Ref = useRef<Screen08Progress>(s8);
  s8Ref.current = s8;

  const gameStateRef = useRef<StudentGameState>(gameState);
  gameStateRef.current = gameState;

  const [stage, setStage] = useState<Screen08StageId>(() =>
    initialProgress.enteredArcade ? initialProgress.currentStage || 'exterior' : 'exterior'
  );
  const [replayNonce, setReplayNonce] = useState(0);
  const [activeModal, setActiveModal] = useState<HudModalType | null>(null);

  useEffect(() => {
    if (stage === 'completion') {
      setMusicMood('celebration');
    } else if (stage === 'find-daniel' || stage === 'daniel-problem') {
      setMusicMood('tense');
    } else if (stage === 'reading-assessment' || stage === 'assessment-intro') {
      setMusicMood('investigate');
    } else {
      setMusicMood('peaceful');
    }
  }, [stage]);

  useEffect(() => {
    return () => {
      setMusicMood('peaceful');
    };
  }, []);

  const persistProgress = useCallback(
    (
      patch: Partial<Screen08Progress>,
      extraState?: Partial<StudentGameState>
    ): StudentGameState => {
      const nextS8: Screen08Progress = {
        ...s8Ref.current,
        ...patch,
      };
      setS8(nextS8);
      s8Ref.current = nextS8;

      const nextGameState: StudentGameState = {
        ...gameStateRef.current,
        ...extraState,
        screen08Progress: nextS8,
      };
      gameStateRef.current = nextGameState;
      void onPersistState(nextGameState);
      return nextGameState;
    },
    [onPersistState]
  );

  const avatarConfig = gameState.avatarConfig;
  const nickname = gameState.detectiveNickname || 'Junior Detective';
  if (!avatarConfig) return null;

  const unlockSafeGardenAndAwardBadge = (): StudentGameState => {
    const existingBadges = gameStateRef.current.inventory.badges;
    const hasBadge = existingBadges.some(
      (b) => b.id === SAFE_CLICKER_BADGE.id || b.name.toUpperCase() === 'SAFE CLICKER'
    );
    const updatedBadges = hasBadge ? existingBadges : [...existingBadges, SAFE_CLICKER_BADGE];

    const existingBuildings = gameStateRef.current.unlockedBuildings;
    const updatedBuildings = existingBuildings.includes('digital-safe-garden')
      ? existingBuildings
      : ([...existingBuildings, 'digital-safe-garden'] as StudentGameState['unlockedBuildings']);

    const missionLabel = 'MISSION 05 · GAME ARCADE (LO1 READING)';
    const nextMissions = gameStateRef.current.completedMissions.includes(missionLabel)
      ? gameStateRef.current.completedMissions
      : [...gameStateRef.current.completedMissions, missionLabel];

    const bonusXp = s8Ref.current.badgeAwarded ? 0 : 120;
    const bonusStars = s8Ref.current.badgeAwarded ? 0 : 3;
    const nextXp = gameStateRef.current.xp + bonusXp;

    return persistProgress(
      {
        badgeAwarded: true,
        digitalSafeGardenUnlocked: true,
        currentStage: 'completion',
      },
      {
        xp: nextXp,
        stars: gameStateRef.current.stars + bonusStars,
        level: Math.max(1, Math.floor(nextXp / 100) + 1),
        inventory: {
          ...gameStateRef.current.inventory,
          badges: updatedBadges,
        },
        unlockedBuildings: updatedBuildings,
        completedMissions: nextMissions,
        currentMission: 'DIGITAL SAFE GARDEN: FINAL ADVICE + PROMISE',
      }
    );
  };

  const handlePlayAgainLevel = () => {
    playSoftSelect();
    persistProgress({
      enteredArcade: false,
      welcomeDialogueDone: false,
      danielFound: false,
      assessmentStarted: false,
      currentStage: 'exterior',
    });
    setStage('exterior');
    setReplayNonce((n) => n + 1);
  };

  return (
    <div
      className={`relative h-dvh w-full flex flex-col overflow-hidden bg-[#EDE9FE] ${
        gameState.settings.reducedMotion ? 'reduced-motion' : ''
      }`}
    >
      <GameHud
        gameState={gameState}
        saveStatus={saveStatus}
        spotlightTarget={null}
        onOpenModal={(modal) => setActiveModal(modal)}
        onSignOut={onSignOut}
      />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-5 pt-1.5 pb-1 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSoftSelect();
              onReturnToTown();
            }}
            className="min-h-[38px] rounded-full bg-white/92 hover:bg-white border border-white px-4 py-1 text-xs font-extrabold text-[#0369A1] shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Detective Town</span>
          </button>

          <button
            type="button"
            onClick={handlePlayAgainLevel}
            className="min-h-[38px] rounded-full bg-white/92 hover:bg-purple-50 border border-purple-200 px-3.5 py-1 text-xs font-extrabold text-[#6D28D9] shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Play Again</span>
          </button>
        </div>

        <div className="rounded-full bg-white/92 border border-white px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-[#6D28D9] shadow-xs inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#06B6D4]" />
          <span>GAME ARCADE · {STAGE_LABELS[stage]}</span>
        </div>
      </div>

      <main key={`s8-${replayNonce}`} className="relative z-20 flex-1 min-h-0 w-full overflow-y-auto flex flex-col">
        {(stage === 'exterior' ||
          stage === 'interior-explore' ||
          stage === 'welcome-dialogue' ||
          stage === 'daniel-problem') && (
          <ArcadeEnvironment
            mode={stage}
            avatarConfig={avatarConfig}
            nickname={nickname}
            settings={gameState.settings}
            onEnterInterior={() => {
              persistProgress({
                enteredArcade: true,
                currentStage: 'interior-explore',
              });
              setStage('interior-explore');
            }}
            onStartWelcomeDialogue={() => {
              persistProgress({ currentStage: 'welcome-dialogue' });
              setStage('welcome-dialogue');
            }}
            onFinishWelcomeDialogue={() => {
              persistProgress({
                welcomeDialogueDone: true,
                currentStage: 'find-daniel',
              });
              setStage('find-daniel');
            }}
            onFinishDanielProblem={() => {
              persistProgress({ currentStage: 'assessment-intro' });
              setStage('assessment-intro');
            }}
          />
        )}

        {stage === 'find-daniel' && (
          <div className="w-full my-auto pt-2">
            <ArcadeFindDaniel
              avatarConfig={avatarConfig}
              nickname={nickname}
              currentStars={gameStateRef.current.stars}
              initiallyFound={s8.danielFound}
              onWrongNpcClick={() => {
                // Deduct 1 game star (min 0), never XP or reading marks
                const nextStars = Math.max(0, gameStateRef.current.stars - 1);
                persistProgress(
                  {
                    findDanielWrongClicks: s8Ref.current.findDanielWrongClicks + 1,
                    starsDeductedInSearch: s8Ref.current.starsDeductedInSearch + 1,
                  },
                  { stars: nextStars }
                );
              }}
              onDanielFound={() => {
                persistProgress({ danielFound: true });
              }}
              onProceedToProblem={() => {
                persistProgress({
                  danielFound: true,
                  currentStage: 'daniel-problem',
                });
                setStage('daniel-problem');
              }}
            />
          </div>
        )}

        {(stage === 'assessment-intro' ||
          stage === 'reading-assessment' ||
          stage === 'results' ||
          stage === 'completion') && (
          <div className="w-full my-auto pt-2">
            <ArcadeReadingAssessment
              mode={stage}
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              officialSubmitted={s8.officialFirstAttemptSubmitted}
              officialScore={s8.firstAttemptScore}
              officialResponses={s8.responses}
              onStartAssessment={() => {
                persistProgress({
                  assessmentStarted: true,
                  currentStage: 'reading-assessment',
                });
                setStage('reading-assessment');
              }}
              onCompleteAssessmentRun={(responses, runScore) => {
                const alreadySubmitted = s8Ref.current.officialFirstAttemptSubmitted;
                const lockedScore = alreadySubmitted ? s8Ref.current.firstAttemptScore : runScore;
                const nextBest = Math.max(s8Ref.current.bestScore, runScore);

                persistProgress({
                  assessmentCompleted: true,
                  officialFirstAttemptSubmitted: true,
                  firstAttemptScore: lockedScore,
                  bestScore: nextBest,
                  lo1ReadingAchieved: lockedScore >= 4,
                  responses: alreadySubmitted ? s8Ref.current.responses : responses,
                  currentStage: 'results',
                });
                setStage('results');
              }}
              onRetryPractice={() => {
                persistProgress({ currentStage: 'reading-assessment' });
                setStage('reading-assessment');
              }}
              onProceedToFinale={() => {
                unlockSafeGardenAndAwardBadge();
                setStage('completion');
              }}
              onVisitGarden={() => {
                const latest = unlockSafeGardenAndAwardBadge();
                onContinueToDigitalSafeGarden(latest);
              }}
              onReturnToTown={onReturnToTown}
              onPlayAgainLevel={handlePlayAgainLevel}
            />
          </div>
        )}
      </main>

      <HudModals
        activeModal={activeModal}
        gameState={gameState}
        canEditCharacter={true}
        customMapMedia={customMapMedia}
        onUploadCustomMap={onUploadCustomMap}
        onResetCustomMap={onResetCustomMap}
        onUpdateSettings={onUpdateSettings}
        onCloseModal={() => setActiveModal(null)}
        onEditCharacter={() => {
          setActiveModal(null);
          onEditCharacter();
        }}
        onReplayTutorial={() => {
          setActiveModal(null);
          onReplayTutorial();
        }}
      />
    </div>
  );
};
