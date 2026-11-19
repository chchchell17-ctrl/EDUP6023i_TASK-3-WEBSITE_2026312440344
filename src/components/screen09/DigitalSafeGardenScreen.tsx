import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin, RotateCcw } from 'lucide-react';
import { createDefaultScreen09Progress } from '../../data/screen09Data.ts';
import type {
  GameSettings,
  InventoryItem,
  SaveSyncStatus,
  Screen09Progress,
  Screen09StageId,
  StudentGameState,
} from '../../types/game.ts';
import type { CustomMapMedia } from '../../utils/customMapStorage.ts';
import { playSoftSelect, setMusicMood } from '../../utils/soundEffects.ts';
import { GameHud, type HudModalType } from '../game/GameHud.tsx';
import { HudModals } from '../game/HudModals.tsx';
import { DetectiveReflectionCheck } from './DetectiveReflectionCheck.tsx';
import { DigitalSafetyPassport } from './DigitalSafetyPassport.tsx';
import { FinalAdviceTask } from './FinalAdviceTask.tsx';
import { GardenEnvironment } from './GardenEnvironment.tsx';
import { PromiseTreeActivity } from './PromiseTreeActivity.tsx';
import { TrafficLightActivity } from './TrafficLightActivity.tsx';

interface DigitalSafeGardenScreenProps {
  gameState: StudentGameState;
  saveStatus: SaveSyncStatus;
  customMapMedia?: CustomMapMedia | null;
  onUploadCustomMap?: (file: File) => Promise<void>;
  onResetCustomMap?: () => Promise<void>;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onPersistState: (nextState: StudentGameState) => Promise<void>;
  onReturnToTown: () => void;
  onContinueToFinalCeremony: (latestState: StudentGameState) => void;
  onEditCharacter: () => void;
  onReplayTutorial: () => void;
  onSignOut: () => void;
}

const DIGITAL_GUARDIAN_BADGE: InventoryItem = {
  id: 'badge-digital-guardian',
  name: 'DIGITAL GUARDIAN',
  category: 'badges',
  description:
    'Earned at the Digital Safe Garden after stamping the Digital Safety Passport and planting a leaf on the Promise Tree!',
};

const PASSPORT_ITEM: InventoryItem = {
  id: 'digital-safety-passport',
  name: 'Digital Safety Passport',
  category: 'special-rewards',
  description:
    'Your official stamped Digital Safety Passport containing your final advice, STOP-CHECK-DECIDE rule, reflection, and promise.',
};

const STAGE_LABELS: Record<Screen09StageId, string> = {
  exterior: 'EXTERIOR · GLASSHOUSE ENTRANCE',
  'welcome-dialogue': 'WELCOME · DIGITAL SAFE GARDEN',
  'scene-01-advice': 'SCENE 01 · MY FINAL ADVICE',
  'scene-02-traffic-light': 'SCENE 02 · STOP, CHECK, DECIDE',
  'scene-03-reflection': 'SCENE 03 · TODAY, I CAN...',
  'scene-04-promise-tree': 'SCENE 04 · PROMISE TREE',
  'passport-complete': 'STAMPED DIGITAL SAFETY PASSPORT',
};

export const DigitalSafeGardenScreen: React.FC<DigitalSafeGardenScreenProps> = ({
  gameState,
  saveStatus,
  customMapMedia = null,
  onUploadCustomMap,
  onResetCustomMap,
  onUpdateSettings,
  onPersistState,
  onReturnToTown,
  onContinueToFinalCeremony,
  onEditCharacter,
  onReplayTutorial,
  onSignOut,
}) => {
  const initialProgress = gameState.screen09Progress ?? createDefaultScreen09Progress();

  const [s9, setS9] = useState<Screen09Progress>(initialProgress);
  const s9Ref = useRef<Screen09Progress>(s9);
  s9Ref.current = s9;

  const gameStateRef = useRef<StudentGameState>(gameState);
  gameStateRef.current = gameState;

  const [stage, setStage] = useState<Screen09StageId>(() =>
    initialProgress.enteredGarden ? initialProgress.currentStage || 'exterior' : 'exterior'
  );
  const [replayNonce, setReplayNonce] = useState(0);
  const [activeModal, setActiveModal] = useState<HudModalType | null>(null);

  useEffect(() => {
    if (stage === 'passport-complete') {
      setMusicMood('celebration');
    } else if (stage === 'scene-01-advice' || stage === 'scene-02-traffic-light') {
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
      patch: Partial<Screen09Progress>,
      extraState?: Partial<StudentGameState>
    ): StudentGameState => {
      const nextS9: Screen09Progress = {
        ...s9Ref.current,
        ...patch,
      };
      setS9(nextS9);
      s9Ref.current = nextS9;

      const nextGameState: StudentGameState = {
        ...gameStateRef.current,
        ...extraState,
        screen09Progress: nextS9,
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

  const finalizePassportAndGuardianBadge = (): StudentGameState => {
    const existingBadges = gameStateRef.current.inventory.badges;
    const hasBadge = existingBadges.some(
      (b) => b.id === DIGITAL_GUARDIAN_BADGE.id || b.name.toUpperCase() === 'DIGITAL GUARDIAN'
    );
    const updatedBadges = hasBadge ? existingBadges : [...existingBadges, DIGITAL_GUARDIAN_BADGE];

    const existingRewards = gameStateRef.current.inventory.specialRewards;
    const hasPassport = existingRewards.some((r) => r.id === PASSPORT_ITEM.id);
    const updatedRewards = hasPassport ? existingRewards : [...existingRewards, PASSPORT_ITEM];

    const missionLabel = 'MISSION 06 · DIGITAL SAFE GARDEN';
    const nextMissions = gameStateRef.current.completedMissions.includes(missionLabel)
      ? gameStateRef.current.completedMissions
      : [...gameStateRef.current.completedMissions, missionLabel];

    const bonusXp = s9Ref.current.passportCompleted ? 0 : 120;
    const bonusStars = s9Ref.current.passportCompleted ? 0 : 3;
    const nextXp = gameStateRef.current.xp + bonusXp;
    const completedAt = s9Ref.current.completedAt || Date.now();

    return persistProgress(
      {
        promiseMade: true,
        passportCompleted: true,
        badgeAwarded: true,
        finalCeremonyUnlocked: true,
        completedAt,
        currentStage: 'passport-complete',
      },
      {
        xp: nextXp,
        stars: gameStateRef.current.stars + bonusStars,
        level: Math.max(1, Math.floor(nextXp / 100) + 1),
        inventory: {
          ...gameStateRef.current.inventory,
          badges: updatedBadges,
          specialRewards: updatedRewards,
        },
        completedMissions: nextMissions,
        currentMission: 'ALL 7 LOCATIONS COMPLETE · FINAL ACHIEVEMENT CEREMONY READY',
      }
    );
  };

  const handlePlayAgainLevel = () => {
    playSoftSelect();
    persistProgress({
      enteredGarden: false,
      welcomeDialogueDone: false,
      trafficLightExplored: { redStop: false, yellowCheck: false, greenDecide: false },
      trafficLightCompleted: false,
      reflectionSelected: [],
      reflectionCompleted: false,
      currentStage: 'exterior',
    });
    setStage('exterior');
    setReplayNonce((n) => n + 1);
  };

  return (
    <div
      className={`relative h-dvh w-full flex flex-col overflow-hidden bg-[#DCFCE7] ${
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
            className="min-h-[38px] rounded-full bg-white/92 hover:bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-extrabold text-[#15803D] shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Play Again</span>
          </button>
        </div>

        <div className="rounded-full bg-white/92 border border-white px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-[#15803D] shadow-xs inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#16A34A]" />
          <span>DIGITAL SAFE GARDEN · {STAGE_LABELS[stage]}</span>
        </div>
      </div>

      <main key={`s9-${replayNonce}`} className="relative z-20 flex-1 min-h-0 w-full overflow-y-auto flex flex-col">
        {(stage === 'exterior' || stage === 'welcome-dialogue') && (
          <GardenEnvironment
            mode={stage}
            avatarConfig={avatarConfig}
            nickname={nickname}
            settings={gameState.settings}
            onEnterGarden={() => {
              persistProgress({
                enteredGarden: true,
                currentStage: 'welcome-dialogue',
              });
              setStage('welcome-dialogue');
            }}
            onStartFinalActivity={() => {
              persistProgress({
                welcomeDialogueDone: true,
                currentStage: 'scene-01-advice',
              });
              setStage('scene-01-advice');
            }}
          />
        )}

        {stage === 'scene-01-advice' && (
          <div className="w-full my-auto pt-2">
            <FinalAdviceTask
              nickname={nickname}
              initialProgress={s9}
              onSaveFinalAdvice={({ task1Should, task2Shouldnt, task3Optional, checklist }) => {
                const orig = s9Ref.current.adviceOriginal;
                const keepOriginal =
                  orig.task1Should.trim().length > 0
                    ? orig
                    : { task1Should, task2Shouldnt, task3Optional };
                persistProgress({
                  adviceOriginal: keepOriginal,
                  adviceFinal: { task1Should, task2Shouldnt, task3Optional },
                  adviceChecklist: checklist,
                  adviceCompleted: true,
                });
              }}
              onProceedToTrafficLight={() => {
                persistProgress({
                  adviceCompleted: true,
                  currentStage: 'scene-02-traffic-light',
                });
                setStage('scene-02-traffic-light');
              }}
            />
          </div>
        )}

        {stage === 'scene-02-traffic-light' && (
          <div className="w-full my-auto pt-2">
            <TrafficLightActivity
              initialExplored={s9.trafficLightExplored}
              onUpdateExplored={(trafficLightExplored) => {
                persistProgress({ trafficLightExplored });
              }}
              onFinishTrafficLight={() => {
                persistProgress({
                  trafficLightCompleted: true,
                  currentStage: 'scene-03-reflection',
                });
                setStage('scene-03-reflection');
              }}
            />
          </div>
        )}

        {stage === 'scene-03-reflection' && (
          <div className="w-full my-auto pt-2">
            <DetectiveReflectionCheck
              selectedIds={s9.reflectionSelected}
              onToggleItem={(id) => {
                const prev = s9Ref.current.reflectionSelected;
                const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
                persistProgress({ reflectionSelected: next });
              }}
              onFinishReflection={() => {
                persistProgress({
                  reflectionCompleted: true,
                  currentStage: 'scene-04-promise-tree',
                });
                setStage('scene-04-promise-tree');
              }}
            />
          </div>
        )}

        {stage === 'scene-04-promise-tree' && (
          <div className="w-full my-auto pt-2">
            <PromiseTreeActivity
              avatarConfig={avatarConfig}
              nickname={nickname}
              settings={gameState.settings}
              initialProgress={s9}
              onPromiseLeafPlaced={({ nextTimeOnline, redFlagRemember }) => {
                const orig = s9Ref.current.promiseOriginal;
                const keepOrig =
                  orig.nextTimeOnline.trim().length > 0
                    ? orig
                    : { nextTimeOnline, redFlagRemember };
                persistProgress({
                  promiseOriginal: keepOrig,
                  promiseFinal: { nextTimeOnline, redFlagRemember },
                  promiseMade: true,
                });
              }}
              onCompletePromiseCeremony={() => {
                finalizePassportAndGuardianBadge();
                setStage('passport-complete');
              }}
            />
          </div>
        )}

        {stage === 'passport-complete' && (
          <div className="w-full my-auto pt-2">
            <DigitalSafetyPassport
              avatarConfig={avatarConfig}
              nickname={nickname}
              progress={s9}
              onReturnToTown={onReturnToTown}
              onViewFinalAchievement={() => {
                const latest = finalizePassportAndGuardianBadge();
                onContinueToFinalCeremony(latest);
              }}
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
