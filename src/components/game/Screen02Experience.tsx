import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Coffee,
  Compass,
  DoorOpen,
  Edit3,
  FileBadge,
  Flag,
  Flower2,
  Gamepad2,
  HeartHandshake,
  Home,
  RotateCcw,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  ALL_TOWN_BUILDING_IDS,
  createDefaultStudentGameState,
  DEFAULT_AVATAR_CONFIG,
  TOWN_BUILDINGS,
  TOWN_PATH_NODES,
  WELCOME_DIALOGUE_SCRIPT,
} from '../../data/townData.ts';
import { createDefaultScreen03Progress } from '../../data/screen03Data.ts';
import { createDefaultScreen04Progress } from '../../data/screen04Data.ts';
import { createDefaultScreen05Progress } from '../../data/screen05Data.ts';
import { createDefaultScreen06Progress } from '../../data/screen06Data.ts';
import { createDefaultScreen07Progress } from '../../data/screen07Data.ts';
import { createDefaultScreen08Progress } from '../../data/screen08Data.ts';
import { createDefaultScreen09Progress } from '../../data/screen09Data.ts';
import { createDefaultScreen10Progress } from '../../data/screen10Data.ts';
import {
  buildInitialStudentStateFromSession,
  fetchStudentStateFromServer,
  saveStudentStateToServer,
} from '../../services/studentProgressApi.ts';
import { TeacherPlayProvider } from '../../contexts/TeacherPlayContext.tsx';
import type { StudentSession, TeacherSession } from '../../types/auth.ts';
import type {
  AvatarConfig,
  AvatarPosition,
  BuildingDefinition,
  BuildingId,
  DialogueChoice,
  DialogueStep,
  GameSettings,
  SaveSyncStatus,
  StudentGameState,
} from '../../types/game.ts';
import {
  playLoginSuccess,
  playPortalOpen,
  playSoftSelect,
  setBackgroundMusicEnabled,
  setSoundEnabled,
  stopNarration,
  unlockAudioOnFirstGesture,
} from '../../utils/soundEffects.ts';
import {
  computeCertificateRecord,
  readAndCompressCertificateFile,
} from '../../utils/certificateExport.ts';
import {
  type CustomMapMedia,
  clearCustomMapMedia,
  loadCustomMapMedia,
  saveCustomMapFile,
} from '../../utils/customMapStorage.ts';
import { CharacterCustomisation } from './CharacterCustomisation.tsx';
import { DetectiveAvatar } from './DetectiveAvatar.tsx';
import { DialogueBox } from './DialogueBox.tsx';
import { GameHud, type HudModalType, type SpotlightTarget } from './GameHud.tsx';
import { HudModals } from './HudModals.tsx';
import {
  type LoadingAccent,
  LocationLoadingScreen,
} from './LocationLoadingScreen.tsx';
import { PusheenIllustration } from './PusheenIllustration.tsx';
import { DetectiveHQScreen } from '../screen03/DetectiveHQScreen.tsx';
import { RedFlagCentreScreen } from '../screen04/RedFlagCentreScreen.tsx';
import { AinasHouseScreen } from '../screen05/AinasHouseScreen.tsx';
import { CyberCafeScreen } from '../screen06/CyberCafeScreen.tsx';
import { AdviceCentreScreen } from '../screen07/AdviceCentreScreen.tsx';
import { GameArcadeScreen } from '../screen08/GameArcadeScreen.tsx';
import { DigitalSafeGardenScreen } from '../screen09/DigitalSafeGardenScreen.tsx';
import { DigitalSafetyPassport } from '../screen09/DigitalSafetyPassport.tsx';
import { FinalCeremonyScreen } from '../screen10/FinalCeremonyScreen.tsx';
import { PrintableCertificate } from '../screen10/PrintableCertificate.tsx';
import { INVESTIGATION_VIDEO_SRC } from '../../data/screen03Data.ts';
import hqInteriorBg from '../../assets/images/detective_hq_interior_1795078104682.jpg';
import redFlagLabBg from '../../assets/images/red_flag_centre_lab_1795080504192.jpg';
import ainaHouseExtBg from '../../assets/images/aina_house_exterior_1795080504183.jpg';
import ainaBedroomBg from '../../assets/images/aina_bedroom_interior_1795080505554.jpg';
import cyberCafeInteriorBg from '../../assets/images/cyber_cafe_interior_1795083706722.jpg';
import adviceCentreExtBg from '../../assets/images/advice_centre_exterior_1795083708291.jpg';
import adviceCentreIntBg from '../../assets/images/advice_centre_interior_1795083708166.jpg';
import {
  type CameraFocus,
  TownEnvironment,
  type TownPusheenState,
} from './TownEnvironment.tsx';

interface Screen02ExperienceProps {
  session?: StudentSession;
  teacherSession?: TeacherSession;
  teacherUnlockAll?: boolean;
  teacherInitialLocation?: BuildingId;
  onReturnToTeacherPortal?: () => void;
  onSignOut: () => void;
}

type Screen02Stage =
  | 'customisation'
  | 'returning-welcome'
  | 'cinematic'
  | 'welcome-dialogue'
  | 'hud-intro'
  | 'tut-profile'
  | 'tut-bag'
  | 'tut-mission'
  | 'tut-settings'
  | 'explore-intro'
  | 'explore-buildings'
  | 'tut-movement'
  | 'tut-hq'
  | 'tut-complete'
  | 'hq-entrance'
  | 'red-flag-walk'
  | 'aina-walk'
  | 'cafe-walk'
  | 'advice-walk'
  | 'arcade-walk'
  | 'garden-walk'
  | 'town-free'
  | 'screen-03-handoff'
  | 'screen-04-handoff'
  | 'screen-05-handoff'
  | 'screen-06-handoff'
  | 'screen-07-handoff'
  | 'screen-08-handoff'
  | 'screen-09-handoff'
  | 'screen-10-handoff';

const CINEMATIC_SHOTS: Array<{
  focus: CameraFocus;
  caption: string;
  durationMs: number;
}> = [
  {
    focus: 'sky',
    caption: 'Look up at the bright blue sky and drifting white clouds...',
    durationMs: 2100,
  },
  {
    focus: 'hills',
    caption: 'Across the soft green rolling hills...',
    durationMs: 2000,
  },
  {
    focus: 'stream',
    caption: 'Past a crystal-clear stream full of colourful fish...',
    durationMs: 2100,
  },
  {
    focus: 'nature',
    caption: 'Through blooming flowers, butterflies and shady trees...',
    durationMs: 2100,
  },
  {
    focus: 'town',
    caption: 'Welcome to Detective Town, home to seven special locations!',
    durationMs: 2300,
  },
  {
    focus: 'plaza',
    caption: 'Right in front of Detective HQ, a brand-new detective arrives...',
    durationMs: 2200,
  },
];

const EXPLORE_INTRO_SCRIPT: DialogueStep[] = [
  {
    id: 'ex1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: "Wonderful! Now that you know how to use your detective tools, let's explore our town!",
  },
  {
    id: 'ex2',
    speaker: 'player',
    expression: 'curious',
    text: 'How many places are there?',
  },
  {
    id: 'ex3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: 'There are SEVEN special locations! Each one has a different mission waiting for you.',
  },
  {
    id: 'ex4',
    speaker: 'player',
    expression: 'curious',
    text: 'Can we visit all of them?',
  },
  {
    id: 'ex5',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'Absolutely! But we need to complete our missions one by one. Click all seven buildings to learn what each one is for!',
  },
];

const TUT_BAG_INTRO_SCRIPT: DialogueStep[] = [
  {
    id: 'bag1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: 'Every detective needs a bag!',
  },
  {
    id: 'bag2',
    speaker: 'player',
    expression: 'curious',
    text: 'What do I keep inside?',
  },
  {
    id: 'bag3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'Your special items, badges and collectibles! You can check them whenever you want. Click your Detective Bag to open it!',
  },
];

const TUT_MOVEMENT_INTRO_SCRIPT: DialogueStep[] = [
  {
    id: 'mv1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: "Now, let's practise moving around!",
  },
  {
    id: 'mv2',
    speaker: 'player',
    expression: 'curious',
    text: 'How do I move?',
  },
  {
    id: 'mv3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'encouraging',
    text: 'Click or tap any pathway, or use WASD / Arrow keys to walk smoothly around Detective Town!',
  },
];

const TUT_COMPLETE_SCRIPT: DialogueStep[] = [
  {
    id: 'tc1',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'celebrating',
    text: 'Excellent work, Detective! You have created your character, discovered your detective tools and learned how to explore our town.',
  },
  {
    id: 'tc2',
    speaker: 'player',
    expression: 'curious',
    text: 'So, what happens now?',
  },
  {
    id: 'tc3',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'excited',
    text: "Now, our real adventure begins! There's a mystery waiting inside Detective HQ. And I think you're just the detective we need!",
  },
  {
    id: 'tc4',
    speaker: 'player',
    expression: 'excited',
    text: "Let's go!",
  },
  {
    id: 'tc5',
    speaker: 'pusheen',
    speakerName: 'Detective Pusheen',
    expression: 'happy',
    text: 'Follow me!',
  },
];

function getTeacherStorageKey(teacher: TeacherSession): string {
  return `ddw_teacher_play_${teacher.id}`;
}

function buildInitialTeacherPlayState(
  teacher: TeacherSession,
  unlockAll: boolean
): StudentGameState {
  const base = createDefaultStudentGameState();
  const initialUnlocked: BuildingId[] = unlockAll ? [...ALL_TOWN_BUILDING_IDS] : ['detective-hq'];

  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(getTeacherStorageKey(teacher));
      if (raw) {
        const parsed = JSON.parse(raw) as StudentGameState;
        const mergedUnlocked = unlockAll
          ? Array.from(new Set([...(parsed.unlockedBuildings ?? []), ...ALL_TOWN_BUILDING_IDS]))
          : (parsed.unlockedBuildings ?? initialUnlocked);
        return {
          ...base,
          ...parsed,
          avatarConfig: parsed.avatarConfig ?? { ...DEFAULT_AVATAR_CONFIG },
          detectiveNickname: parsed.detectiveNickname || teacher.displayName || 'Teacher Detective',
          unlockedBuildings: mergedUnlocked,
        };
      }
    } catch {
      // Ignore corrupt localStorage
    }
  }

  return {
    ...base,
    detectiveNickname: teacher.displayName || 'Teacher Detective',
    avatarConfig: { ...DEFAULT_AVATAR_CONFIG },
    tutorialProgress: {
      characterConfirmed: true,
      welcomeConversationDone: true,
      profileExplored: true,
      bagExplored: true,
      missionTrackerExplored: true,
      settingsExplored: true,
      buildingsDiscovered: [...ALL_TOWN_BUILDING_IDS],
      movementCompleted: true,
      hqSelected: true,
      tutorialCompleted: true,
    },
    screen03Progress: createDefaultScreen03Progress(),
    screen04Progress: createDefaultScreen04Progress(),
    screen05Progress: createDefaultScreen05Progress(),
    screen06Progress: createDefaultScreen06Progress(),
    screen07Progress: createDefaultScreen07Progress(),
    screen08Progress: createDefaultScreen08Progress(),
    screen09Progress: createDefaultScreen09Progress(),
    screen10Progress: createDefaultScreen10Progress(),
    unlockedBuildings: initialUnlocked,
    currentMission: 'TEACHER EXPLORER · ALL LOCATIONS UNLOCKED',
    lastScene: 'town',
    updatedAt: Date.now(),
  };
}

function resolveTeacherInitialStage(location?: BuildingId): Screen02Stage {
  if (location === 'detective-hq') return 'screen-03-handoff';
  if (location === 'red-flag-centre') return 'screen-04-handoff';
  if (location === 'ainas-house') return 'screen-05-handoff';
  if (location === 'cyber-cafe') return 'screen-06-handoff';
  if (location === 'advice-centre') return 'screen-07-handoff';
  if (location === 'game-arcade') return 'screen-08-handoff';
  if (location === 'digital-safe-garden') return 'screen-09-handoff';
  return 'town-free';
}

export const Screen02Experience: React.FC<Screen02ExperienceProps> = ({
  session,
  teacherSession,
  teacherUnlockAll = true,
  teacherInitialLocation,
  onReturnToTeacherPortal,
  onSignOut,
}) => {
  const isTeacherMode = Boolean(teacherSession);

  const [gameState, setGameState] = useState<StudentGameState>(() => {
    if (teacherSession) {
      return buildInitialTeacherPlayState(teacherSession, teacherUnlockAll);
    }
    if (session) {
      return buildInitialStudentStateFromSession(session);
    }
    return createDefaultStudentGameState();
  });
  const gameStateRef = useRef<StudentGameState>(gameState);
  gameStateRef.current = gameState;

  const [saveStatus, setSaveStatus] = useState<SaveSyncStatus>(isTeacherMode ? 'saved' : 'idle');

  const isReturningOnStart = Boolean(
    !isTeacherMode && session?.progress.hasAvatar && gameState.avatarConfig
  );

  const [stage, setStage] = useState<Screen02Stage>(() => {
    if (teacherSession) {
      return resolveTeacherInitialStage(teacherInitialLocation);
    }
    return isReturningOnStart ? 'returning-welcome' : 'customisation';
  });
  const [isEditingExistingCharacter, setIsEditingExistingCharacter] = useState(false);

  // Cinematic Scene 02 state
  const [cinematicShotIdx, setCinematicShotIdx] = useState(0);
  const [arrivalLineIdx, setArrivalLineIdx] = useState<0 | 1 | 2>(0);

  // Welcome Conversation Scene 03 state
  const [welcomeSubStep, setWelcomeSubStep] = useState<'peeking' | 'dialogue'>('peeking');
  const [welcomeDialogueIdx, setWelcomeDialogueIdx] = useState(0);

  // Tutorial Spotlight Sub-phase
  const [tutPhase, setTutPhase] = useState<'intro' | 'await-click' | 'feedback'>('await-click');
  const [tutSubIdx, setTutSubIdx] = useState(0);
  const [activeModal, setActiveModal] = useState<HudModalType | null>(null);
  const [spotlightHintToast, setSpotlightHintToast] = useState(false);

  // Explore 7 Buildings & Movement & HQ state
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingDefinition | null>(null);
  const [lockedFeedbackBuildingId, setLockedFeedbackBuildingId] = useState<BuildingId | null>(null);
  const [allBuildingsCheered, setAllBuildingsCheered] = useState(false);
  const [offPathWarning, setOffPathWarning] = useState(false);
  const [movementSucceeded, setMovementSucceeded] = useState(false);
  const [hqDialogueStep, setHqDialogueStep] = useState<'prompt' | 'ready-confirm'>('prompt');
  const [tutCompleteCardShown, setTutCompleteCardShown] = useState(false);

  // Scene 14 HQ Entrance animation state
  const [hqIlluminated, setHqIlluminated] = useState(false);
  const [hqDoorOpen, setHqDoorOpen] = useState(false);
  const [entranceFading, setEntranceFading] = useState(false);

  // Building Walk & Entrance animation states (Red Flag Centre, Aina's House, Cyber Café)
  const [redFlagIlluminated, setRedFlagIlluminated] = useState(false);
  const [redFlagDoorOpen, setRedFlagDoorOpen] = useState(false);
  const [ainaIlluminated, setAinaIlluminated] = useState(false);
  const [ainaDoorOpen, setAinaDoorOpen] = useState(false);
  const [cafeIlluminated, setCafeIlluminated] = useState(false);
  const [cafeDoorOpen, setCafeDoorOpen] = useState(false);
  const [adviceIlluminated, setAdviceIlluminated] = useState(false);
  const [adviceDoorOpen, setAdviceDoorOpen] = useState(false);
  const [arcadeIlluminated, setArcadeIlluminated] = useState(false);
  const [arcadeDoorOpen, setArcadeDoorOpen] = useState(false);
  const [gardenIlluminated, setGardenIlluminated] = useState(false);
  const [gardenDoorOpen, setGardenDoorOpen] = useState(false);
  const [showQuickPassport, setShowQuickPassport] = useState(false);
  const [showQuickCertificate, setShowQuickCertificate] = useState(false);
  const [scriptedWalkToNode, setScriptedWalkToNode] = useState<{
    nodeId: string;
    key: number;
  } | null>(null);
  const walkTimersRef = useRef<number[]>([]);

  // Location Transition Loading Overlay (buffering circle + 0%-100%)
  const [pendingPlaceLoad, setPendingPlaceLoad] = useState<{
    destinationName: string;
    subtitle: string;
    accent: LoadingAccent;
    targetStage: Screen02Stage;
    preloadImages?: string[];
    preloadVideo?: string;
  } | null>(null);

  const navigateWithLoading = useCallback(
    (targetStage: Screen02Stage) => {
      if (targetStage === 'screen-03-handoff') {
        setPendingPlaceLoad({
          destinationName: 'DETECTIVE HQ',
          subtitle: 'Opening HQ briefing room & case evidence monitor...',
          accent: 'purple',
          targetStage,
          preloadImages: [hqInteriorBg],
          preloadVideo: INVESTIGATION_VIDEO_SRC,
        });
        return;
      }
      if (targetStage === 'screen-04-handoff') {
        setPendingPlaceLoad({
          destinationName: 'RED FLAG CENTRE',
          subtitle: 'Opening bright Red Flag investigation laboratory...',
          accent: 'rose',
          targetStage,
          preloadImages: [redFlagLabBg],
        });
        return;
      }
      if (targetStage === 'screen-05-handoff') {
        setPendingPlaceLoad({
          destinationName: "AINA'S HOUSE",
          subtitle: 'Stepping up to Aina’s cozy purple storybook home...',
          accent: 'pink',
          targetStage,
          preloadImages: [ainaHouseExtBg, ainaBedroomBg],
        });
        return;
      }
      if (targetStage === 'screen-06-handoff') {
        setPendingPlaceLoad({
          destinationName: 'CYBER CAFÉ',
          subtitle: 'Stepping into the neon pastel Cyber Café...',
          accent: 'amber',
          targetStage,
          preloadImages: [cyberCafeInteriorBg],
        });
        return;
      }
      if (targetStage === 'screen-07-handoff') {
        setPendingPlaceLoad({
          destinationName: 'ADVICE CENTRE',
          subtitle: 'Opening Advice Centre · Words That Help...',
          accent: 'teal',
          targetStage,
          preloadImages: [adviceCentreExtBg, adviceCentreIntBg],
        });
        return;
      }
      if (targetStage === 'screen-08-handoff') {
        setPendingPlaceLoad({
          destinationName: 'GAME ARCADE',
          subtitle: "Stepping into the neon Game Arcade · Daniel's Final Mission...",
          accent: 'purple',
          targetStage,
        });
        return;
      }
      if (targetStage === 'screen-09-handoff') {
        setPendingPlaceLoad({
          destinationName: 'DIGITAL SAFE GARDEN',
          subtitle: 'Opening sunlit crystal glasshouse & Promise Tree...',
          accent: 'emerald',
          targetStage,
        });
        return;
      }
      if (targetStage === 'screen-10-handoff') {
        setPendingPlaceLoad({
          destinationName: 'FINAL ACHIEVEMENT CEREMONY',
          subtitle: 'Gathering everyone in Detective Town to celebrate your success!',
          accent: 'emerald',
          targetStage,
        });
        return;
      }
      setPendingPlaceLoad({
        destinationName: 'DETECTIVE TOWN',
        subtitle: 'Loading Detective Town pathways & landmarks...',
        accent: 'sky',
        targetStage,
      });
    },
    []
  );

  // Optional browser-saved custom animated map (.gif / .mp4)
  const [customMapMedia, setCustomMapMedia] = useState<CustomMapMedia | null>(null);
  const customMapUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadCustomMapMedia().then((media) => {
      if (!mounted) {
        if (media?.url) URL.revokeObjectURL(media.url);
        return;
      }
      if (media) {
        customMapUrlRef.current = media.url;
        setCustomMapMedia(media);
      }
    });
    return () => {
      mounted = false;
      if (customMapUrlRef.current) {
        URL.revokeObjectURL(customMapUrlRef.current);
        customMapUrlRef.current = null;
      }
    };
  }, []);

  const handleUploadCustomMap = useCallback(async (file: File) => {
    const saved = await saveCustomMapFile(file);
    if (customMapUrlRef.current) {
      URL.revokeObjectURL(customMapUrlRef.current);
    }
    customMapUrlRef.current = saved.url;
    setCustomMapMedia(saved);
  }, []);

  const handleResetCustomMap = useCallback(async () => {
    await clearCustomMapMedia();
    if (customMapUrlRef.current) {
      URL.revokeObjectURL(customMapUrlRef.current);
      customMapUrlRef.current = null;
    }
    setCustomMapMedia(null);
  }, []);

  // Persist helper
  const persistState = useCallback(
    async (nextState: StudentGameState) => {
      const nowTs = Date.now();
      const stamped: StudentGameState = {
        ...nextState,
        certificateRecord: computeCertificateRecord(nextState, { nowTs }),
        updatedAt: nowTs,
      };
      setGameState(stamped);
      gameStateRef.current = stamped;

      if (teacherSession) {
        try {
          window.localStorage.setItem(
            getTeacherStorageKey(teacherSession),
            JSON.stringify(stamped)
          );
        } catch {
          // Ignore storage quota issues
        }
        setSaveStatus('saved');
        return;
      }

      if (!session) {
        setSaveStatus('saved');
        return;
      }

      setSaveStatus('saving');
      const res = await saveStudentStateToServer(session, stamped);
      if (res.ok) {
        setGameState(res.state);
        gameStateRef.current = res.state;
        setSaveStatus('saved');
      } else {
        setSaveStatus('offline');
      }
    },
    [session, teacherSession]
  );

  const handleUploadQuickCertificate = useCallback(
    async (file: File) => {
      const { dataUrl, fileName } = await readAndCompressCertificateFile(file);
      const nowTs = Date.now();
      const base = gameStateRef.current;
      await persistState({
        ...base,
        certificateRecord: {
          ...computeCertificateRecord(base, { nowTs }),
          issued: true,
          uploadedFileDataUrl: dataUrl,
          uploadedFileName: fileName,
          uploadedAt: nowTs,
          hasUploadedFile: true,
        },
        updatedAt: nowTs,
      });
    },
    [persistState]
  );

  const handleRemoveQuickCertificate = useCallback(async () => {
    const nowTs = Date.now();
    const base = gameStateRef.current;
    await persistState({
      ...base,
      certificateRecord: computeCertificateRecord(
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
      ),
      updatedAt: nowTs,
    });
  }, [persistState]);

  // Sync fresher server state once on mount if available (students only)
  const stageRef = useRef<Screen02Stage>(stage);
  stageRef.current = stage;

  useEffect(() => {
    if (teacherSession || !session) return;
    let mounted = true;
    fetchStudentStateFromServer().then((res) => {
      if (!mounted || !res.ok || !res.state) return;
      if (res.state.updatedAt > gameStateRef.current.updatedAt) {
        setGameState(res.state);
        gameStateRef.current = res.state;
        if (
          res.state.avatarConfig &&
          stageRef.current === 'customisation' &&
          !isEditingExistingCharacter &&
          !gameStateRef.current.tutorialProgress.characterConfirmed
        ) {
          setStage('returning-welcome');
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, [isEditingExistingCharacter, session, teacherSession]);

  // Re-sync offline saved changes automatically when connectivity returns
  useEffect(() => {
    const handleOnline = () => {
      if (saveStatus === 'offline') {
        persistState(gameStateRef.current);
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [saveStatus, persistState]);

  // Apply sound & music settings live and unlock audio cleanly on first gesture
  useEffect(() => {
    unlockAudioOnFirstGesture();
    setSoundEnabled(gameState.settings.soundEffects);
    setBackgroundMusicEnabled(gameState.settings.backgroundMusic);
  }, [gameState.settings.soundEffects, gameState.settings.backgroundMusic]);

  useEffect(() => {
    return () => {
      setBackgroundMusicEnabled(false);
      stopNarration();
    };
  }, []);

  // Cinematic auto-advance timer for Shots 1..6 -> Shot 7 Arrival
  useEffect(() => {
    if (stage !== 'cinematic' || arrivalLineIdx > 0) return;

    if (cinematicShotIdx < CINEMATIC_SHOTS.length) {
      const duration = gameState.settings.reducedMotion
        ? 900
        : CINEMATIC_SHOTS[cinematicShotIdx].durationMs;
      const timer = window.setTimeout(() => {
        if (cinematicShotIdx + 1 < CINEMATIC_SHOTS.length) {
          setCinematicShotIdx((prev) => prev + 1);
        } else {
          setCinematicShotIdx(CINEMATIC_SHOTS.length);
          setArrivalLineIdx(1);
        }
      }, duration);
      return () => window.clearTimeout(timer);
    }
  }, [stage, cinematicShotIdx, arrivalLineIdx, gameState.settings.reducedMotion]);

  // Welcome Conversation Scene 03 entrance transition (peeking -> beside-player)
  useEffect(() => {
    if (stage !== 'welcome-dialogue' || welcomeSubStep !== 'peeking') return;
    const t = window.setTimeout(() => {
      setWelcomeSubStep('dialogue');
    }, gameState.settings.reducedMotion ? 350 : 1200);
    return () => window.clearTimeout(t);
  }, [stage, welcomeSubStep, gameState.settings.reducedMotion]);

  // Scene 14 HQ Entrance Sequence
  useEffect(() => {
    if (stage !== 'hq-entrance') return;
    setHqIlluminated(false);
    setHqDoorOpen(false);
    setEntranceFading(false);

    const hqDoor = TOWN_PATH_NODES['hq-door'];
    setGameState((prev) => ({
      ...prev,
      lastPosition: { x: hqDoor.x, y: hqDoor.y, nodeId: 'hq-door' },
    }));

    const t1 = window.setTimeout(() => {
      playSoftSelect();
      setHqIlluminated(true);
    }, 600);
    const t2 = window.setTimeout(() => {
      playPortalOpen();
      setHqDoorOpen(true);
    }, 1350);
    const t3 = window.setTimeout(() => {
      setEntranceFading(true);
    }, 2250);
    const t4 = window.setTimeout(() => {
      const next: StudentGameState = {
        ...gameStateRef.current,
        lastPosition: { x: hqDoor.x, y: hqDoor.y, nodeId: 'hq-door' },
        lastScene: 'screen-03-handoff',
      };
      persistState(next);
      setEntranceFading(false);
      navigateWithLoading('screen-03-handoff');
    }, 2950);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [stage, persistState, navigateWithLoading]);

  const handleConfirmCharacter = async (config: AvatarConfig, nickname: string) => {
    const nextState: StudentGameState = {
      ...gameStateRef.current,
      avatarConfig: config,
      detectiveNickname: nickname,
      tutorialProgress: {
        ...gameStateRef.current.tutorialProgress,
        characterConfirmed: true,
      },
      lastScene: isEditingExistingCharacter ? 'town' : 'cinematic',
      updatedAt: Date.now(),
    };
    setGameState(nextState);
    gameStateRef.current = nextState;
    void persistState(nextState);

    if (isEditingExistingCharacter) {
      setIsEditingExistingCharacter(false);
      navigateWithLoading('town-free');
      return;
    }

    setCinematicShotIdx(0);
    setArrivalLineIdx(0);
    navigateWithLoading('cinematic');
  };

  const handleUpdateSettings = (patch: Partial<GameSettings>) => {
    const next: StudentGameState = {
      ...gameStateRef.current,
      settings: {
        ...gameStateRef.current.settings,
        ...patch,
      },
    };
    persistState(next);
  };

  const handleReplayTutorial = () => {
    setActiveModal(null);
    setSelectedBuilding(null);
    setAllBuildingsCheered(false);
    setMovementSucceeded(false);
    setOffPathWarning(false);
    setHqDialogueStep('prompt');
    setTutCompleteCardShown(false);
    setTutPhase('await-click');
    setTutSubIdx(0);
    setStage('hud-intro');
  };

  const handleOpenHudModal = (modal: HudModalType) => {
    setActiveModal(modal);
  };

  const handleCloseHudModal = (modal: HudModalType) => {
    setActiveModal(null);

    if (stage === 'tut-profile' && modal === 'profile') {
      const next: StudentGameState = {
        ...gameStateRef.current,
        tutorialProgress: {
          ...gameStateRef.current.tutorialProgress,
          profileExplored: true,
        },
      };
      persistState(next);
      setTutPhase('feedback');
      return;
    }

    if (stage === 'tut-bag' && modal === 'bag') {
      const next: StudentGameState = {
        ...gameStateRef.current,
        tutorialProgress: {
          ...gameStateRef.current.tutorialProgress,
          bagExplored: true,
        },
      };
      persistState(next);
      setTutPhase('feedback');
      return;
    }

    if (stage === 'tut-mission' && modal === 'mission-tracker') {
      const next: StudentGameState = {
        ...gameStateRef.current,
        tutorialProgress: {
          ...gameStateRef.current.tutorialProgress,
          missionTrackerExplored: true,
        },
      };
      persistState(next);
      setTutPhase('feedback');
      return;
    }

    if (stage === 'tut-settings' && modal === 'settings') {
      const next: StudentGameState = {
        ...gameStateRef.current,
        tutorialProgress: {
          ...gameStateRef.current.tutorialProgress,
          settingsExplored: true,
        },
      };
      persistState(next);
      setTutPhase('feedback');
    }
  };

  const handleSelectBuilding = (building: BuildingDefinition) => {
    const isUnlocked = gameState.unlockedBuildings.includes(building.id);
    if (!isUnlocked) {
      setLockedFeedbackBuildingId(building.id);
      window.setTimeout(() => setLockedFeedbackBuildingId(null), 600);
    }

    setSelectedBuilding(building);

    if (stage === 'explore-buildings') {
      const prev = gameStateRef.current.tutorialProgress.buildingsDiscovered;
      if (!prev.includes(building.id)) {
        const updated = [...prev, building.id];
        const next: StudentGameState = {
          ...gameStateRef.current,
          tutorialProgress: {
            ...gameStateRef.current.tutorialProgress,
            buildingsDiscovered: updated,
          },
        };
        persistState(next);
      }
    }
  };

  const handleCloseBuildingModal = () => {
    const closed = selectedBuilding;
    setSelectedBuilding(null);

    if (
      stage === 'explore-buildings' &&
      gameStateRef.current.tutorialProgress.buildingsDiscovered.length >= TOWN_BUILDINGS.length
    ) {
      setAllBuildingsCheered(true);
      playLoginSuccess();
    }

    if (stage === 'tut-hq' && closed?.id === 'detective-hq') {
      const next: StudentGameState = {
        ...gameStateRef.current,
        tutorialProgress: {
          ...gameStateRef.current.tutorialProgress,
          hqSelected: true,
        },
      };
      persistState(next);
      setHqDialogueStep('ready-confirm');
    }
  };

  const clearWalkTimers = useCallback(() => {
    walkTimersRef.current.forEach((id) => window.clearTimeout(id));
    walkTimersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearWalkTimers();
  }, [clearWalkTimers]);

  const startWalkTransition = useCallback(
    (
      target: 'red-flag' | 'aina' | 'cafe' | 'advice' | 'arcade' | 'garden',
      sourceState: StudentGameState,
      startNodeId?: string
    ) => {
      clearWalkTimers();
      setActiveModal(null);
      setSelectedBuilding(null);
      setRedFlagIlluminated(target === 'red-flag');
      setRedFlagDoorOpen(false);
      setAinaIlluminated(target === 'aina');
      setAinaDoorOpen(false);
      setCafeIlluminated(target === 'cafe');
      setCafeDoorOpen(false);
      setAdviceIlluminated(target === 'advice');
      setAdviceDoorOpen(false);
      setArcadeIlluminated(target === 'arcade');
      setArcadeDoorOpen(false);
      setGardenIlluminated(target === 'garden');
      setGardenDoorOpen(false);
      setEntranceFading(false);

      const originNode = startNodeId ? TOWN_PATH_NODES[startNodeId] : undefined;
      const positionedState: StudentGameState = originNode
        ? {
            ...sourceState,
            lastPosition: { x: originNode.x, y: originNode.y, nodeId: originNode.id },
          }
        : sourceState;

      setGameState(positionedState);
      gameStateRef.current = positionedState;
      void persistState(positionedState);

      if (target === 'red-flag') {
        setStage('red-flag-walk');
        setScriptedWalkToNode({ nodeId: 'red-flag-door', key: Date.now() });
      } else if (target === 'aina') {
        setStage('aina-walk');
        setScriptedWalkToNode({ nodeId: 'aina-door', key: Date.now() });
      } else if (target === 'cafe') {
        setStage('cafe-walk');
        setScriptedWalkToNode({ nodeId: 'cafe-door', key: Date.now() });
      } else if (target === 'advice') {
        setStage('advice-walk');
        setScriptedWalkToNode({ nodeId: 'advice-door', key: Date.now() });
      } else if (target === 'arcade') {
        setStage('arcade-walk');
        setScriptedWalkToNode({ nodeId: 'arcade-door', key: Date.now() });
      } else {
        setStage('garden-walk');
        setScriptedWalkToNode({ nodeId: 'garden-door', key: Date.now() });
      }
    },
    [clearWalkTimers, persistState]
  );

  const handleScriptedWalkArrived = useCallback(() => {
    if (
      stage !== 'red-flag-walk' &&
      stage !== 'aina-walk' &&
      stage !== 'cafe-walk' &&
      stage !== 'advice-walk' &&
      stage !== 'arcade-walk' &&
      stage !== 'garden-walk'
    ) {
      return;
    }
    clearWalkTimers();
    setScriptedWalkToNode(null);
    playPortalOpen();

    if (stage === 'red-flag-walk') setRedFlagDoorOpen(true);
    if (stage === 'aina-walk') setAinaDoorOpen(true);
    if (stage === 'cafe-walk') setCafeDoorOpen(true);
    if (stage === 'advice-walk') setAdviceDoorOpen(true);
    if (stage === 'arcade-walk') setArcadeDoorOpen(true);
    if (stage === 'garden-walk') setGardenDoorOpen(true);

    const fast = gameStateRef.current.settings.reducedMotion;
    const t1 = window.setTimeout(() => {
      setEntranceFading(true);
    }, fast ? 220 : 800);

    const doorNodeId =
      stage === 'red-flag-walk'
        ? 'red-flag-door'
        : stage === 'aina-walk'
          ? 'aina-door'
          : stage === 'cafe-walk'
            ? 'cafe-door'
            : stage === 'advice-walk'
              ? 'advice-door'
              : stage === 'arcade-walk'
                ? 'arcade-door'
                : 'garden-door';

    const targetScreen: Screen02Stage =
      stage === 'red-flag-walk'
        ? 'screen-04-handoff'
        : stage === 'aina-walk'
          ? 'screen-05-handoff'
          : stage === 'cafe-walk'
            ? 'screen-06-handoff'
            : stage === 'advice-walk'
              ? 'screen-07-handoff'
              : stage === 'arcade-walk'
                ? 'screen-08-handoff'
                : 'screen-09-handoff';

    const t2 = window.setTimeout(() => {
      const doorNode = TOWN_PATH_NODES[doorNodeId];
      const next: StudentGameState = {
        ...gameStateRef.current,
        lastPosition: { x: doorNode.x, y: doorNode.y, nodeId: doorNodeId },
        lastScene: targetScreen,
      };
      void persistState(next);
      setEntranceFading(false);
      setRedFlagIlluminated(false);
      setRedFlagDoorOpen(false);
      setAinaIlluminated(false);
      setAinaDoorOpen(false);
      setCafeIlluminated(false);
      setCafeDoorOpen(false);
      setAdviceIlluminated(false);
      setAdviceDoorOpen(false);
      setArcadeIlluminated(false);
      setArcadeDoorOpen(false);
      setGardenIlluminated(false);
      setGardenDoorOpen(false);
      navigateWithLoading(targetScreen);
    }, fast ? 450 : 1450);

    walkTimersRef.current = [t1, t2];
  }, [stage, clearWalkTimers, persistState, navigateWithLoading]);

  const handleEnterBuilding = (building: BuildingDefinition) => {
    setSelectedBuilding(null);
    if (building.id === 'red-flag-centre') {
      if (gameStateRef.current.unlockedBuildings.includes('red-flag-centre')) {
        startWalkTransition('red-flag', gameStateRef.current);
      }
      return;
    }

    if (building.id === 'ainas-house') {
      if (gameStateRef.current.unlockedBuildings.includes('ainas-house')) {
        startWalkTransition('aina', gameStateRef.current);
      }
      return;
    }

    if (building.id === 'cyber-cafe') {
      if (gameStateRef.current.unlockedBuildings.includes('cyber-cafe')) {
        startWalkTransition('cafe', gameStateRef.current);
      }
      return;
    }

    if (building.id === 'advice-centre') {
      if (gameStateRef.current.unlockedBuildings.includes('advice-centre')) {
        startWalkTransition('advice', gameStateRef.current);
      }
      return;
    }

    if (building.id === 'game-arcade') {
      if (gameStateRef.current.unlockedBuildings.includes('game-arcade')) {
        startWalkTransition('arcade', gameStateRef.current);
      }
      return;
    }

    if (building.id === 'digital-safe-garden') {
      if (gameStateRef.current.unlockedBuildings.includes('digital-safe-garden')) {
        startWalkTransition('garden', gameStateRef.current);
      }
      return;
    }

    if (building.id !== 'detective-hq') return;

    if (stage === 'tut-hq') {
      const next: StudentGameState = {
        ...gameStateRef.current,
        tutorialProgress: {
          ...gameStateRef.current.tutorialProgress,
          hqSelected: true,
        },
      };
      persistState(next);
      setHqDialogueStep('ready-confirm');
      return;
    }

    if (stage === 'explore-buildings') {
      if (gameStateRef.current.tutorialProgress.buildingsDiscovered.length >= TOWN_BUILDINGS.length) {
        setAllBuildingsCheered(true);
      }
      return;
    }

    setStage('hq-entrance');
  };

  const replayableBuildings: BuildingId[] = [];
  if (gameState.screen03Progress?.hqEntered || gameState.screen03Progress?.inductionCompleted) {
    replayableBuildings.push('detective-hq');
  }
  if (gameState.screen04Progress?.enteredCentre || gameState.screen04Progress?.activityCompleted) {
    replayableBuildings.push('red-flag-centre');
  }
  if (gameState.screen05Progress?.enteredAinasHouse || gameState.screen05Progress?.activityCompleted) {
    replayableBuildings.push('ainas-house');
  }
  if (gameState.screen06Progress?.enteredCafe || gameState.screen06Progress?.activityCompleted) {
    replayableBuildings.push('cyber-cafe');
  }
  if (
    gameState.screen07Progress?.enteredAdviceCentre ||
    gameState.screen07Progress?.activityCompleted
  ) {
    replayableBuildings.push('advice-centre');
  }
  if (gameState.screen08Progress?.enteredArcade || gameState.screen08Progress?.assessmentCompleted) {
    replayableBuildings.push('game-arcade');
  }
  if (gameState.screen09Progress?.enteredGarden || gameState.screen09Progress?.passportCompleted) {
    replayableBuildings.push('digital-safe-garden');
  }

  const handlePlayAgainBuilding = (building: BuildingDefinition) => {
    setSelectedBuilding(null);
    const current = gameStateRef.current;

    if (building.id === 'detective-hq') {
      const s3 = current.screen03Progress ?? createDefaultScreen03Progress();
      const next: StudentGameState = {
        ...current,
        screen03Progress: {
          ...s3,
          hqEntered: false,
          missionBriefingCompleted: false,
          videoCompleted: false,
          problemIdentified: false,
          decisionChoice: null,
          decisionCompleted: false,
          safetyIntroDone: false,
          rulesCompleted: { rule1: false, rule2: false, rule3: false },
          knowledgeCheckCompleted: false,
          currentStage: 'entrance',
        },
      };
      persistState(next);
      setStage('hq-entrance');
      return;
    }

    if (building.id === 'red-flag-centre') {
      const s4 = current.screen04Progress ?? createDefaultScreen04Progress();
      const next: StudentGameState = {
        ...current,
        screen04Progress: {
          ...s4,
          enteredCentre: false,
          learningExamplesExplored: {
            example1: false,
            example2: false,
            example3: false,
          },
          discoveredClues: [],
          knowledgeAttempts: {},
          missedInspectionClicks: 0,
          hintsUsed: 0,
          currentStage: 'arrival',
        },
      };
      persistState(next);
      startWalkTransition('red-flag', next);
      return;
    }

    if (building.id === 'ainas-house') {
      const s5 = current.screen05Progress ?? createDefaultScreen05Progress();
      const next: StudentGameState = {
        ...current,
        screen05Progress: {
          ...s5,
          enteredAinasHouse: false,
          exploredHouseLayout: false,
          foundAinasRoom: false,
          enteredAinasRoom: false,
          wrongRoomAttempts: [],
          readCaseFile: false,
          readingResponses: [],
          readingCompleted: false,
          currentStage: 'arrival',
        },
      };
      persistState(next);
      startWalkTransition('aina', next);
      return;
    }

    if (building.id === 'cyber-cafe') {
      const s6 = current.screen06Progress ?? createDefaultScreen06Progress();
      const next: StudentGameState = {
        ...current,
        screen06Progress: {
          ...s6,
          enteredCafe: false,
          selectedSeatId: null,
          casesCompleted: [],
          caseAttempts: {},
          partCChoice: null,
          partCCompleted: false,
          challengeAttempts: {},
          miniChallengeCompleted: false,
          currentStage: 'exterior',
        },
      };
      persistState(next);
      startWalkTransition('cafe', next);
      return;
    }

    if (building.id === 'advice-centre') {
      const s7 = current.screen07Progress ?? createDefaultScreen07Progress();
      const next: StudentGameState = {
        ...current,
        screen07Progress: {
          ...s7,
          enteredAdviceCentre: false,
          learningCardsExplored: { card1: false, card2: false, card3: false },
          selfCheck: { askAdvice: false, giveAdvice: false, respondAdvice: false },
          currentStage: 'exterior',
        },
      };
      persistState(next);
      startWalkTransition('advice', next);
      return;
    }

    if (building.id === 'game-arcade') {
      const s8 = current.screen08Progress ?? createDefaultScreen08Progress();
      const next: StudentGameState = {
        ...current,
        screen08Progress: {
          ...s8,
          enteredArcade: false,
          welcomeDialogueDone: false,
          danielFound: false,
          assessmentStarted: false,
          currentStage: 'exterior',
        },
      };
      persistState(next);
      startWalkTransition('arcade', next);
      return;
    }

    if (building.id === 'digital-safe-garden') {
      const s9 = current.screen09Progress ?? createDefaultScreen09Progress();
      const next: StudentGameState = {
        ...current,
        screen09Progress: {
          ...s9,
          enteredGarden: false,
          welcomeDialogueDone: false,
          trafficLightExplored: { redStop: false, yellowCheck: false, greenDecide: false },
          trafficLightCompleted: false,
          reflectionSelected: [],
          reflectionCompleted: false,
          currentStage: 'exterior',
        },
      };
      persistState(next);
      startWalkTransition('garden', next);
    }
  };

  const movePersistTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (movePersistTimerRef.current !== null) {
        window.clearTimeout(movePersistTimerRef.current);
      }
    };
  }, []);

  const handlePositionChange = (nextPos: AvatarPosition) => {
    setGameState((prev) => {
      const next = {
        ...prev,
        lastPosition: nextPos,
      };
      gameStateRef.current = next;
      return next;
    });
  };

  const handleMovementCompleted = () => {
    setOffPathWarning(false);
    const next: StudentGameState = {
      ...gameStateRef.current,
      tutorialProgress: {
        ...gameStateRef.current.tutorialProgress,
        movementCompleted: true,
      },
    };
    setGameState(next);
    gameStateRef.current = next;
    if (stage === 'tut-movement') {
      setMovementSucceeded(true);
    }
    if (movePersistTimerRef.current !== null) {
      window.clearTimeout(movePersistTimerRef.current);
    }
    movePersistTimerRef.current = window.setTimeout(() => {
      movePersistTimerRef.current = null;
      persistState(gameStateRef.current);
    }, 350);
  };

  const spotlightTarget: SpotlightTarget =
    stage === 'tut-profile' && tutPhase === 'await-click'
      ? 'profile'
      : stage === 'tut-bag' && tutPhase === 'await-click'
        ? 'bag'
        : stage === 'tut-mission' && tutPhase === 'await-click'
          ? 'mission-tracker'
          : stage === 'tut-settings' && tutPhase === 'await-click'
            ? 'settings'
            : null;

  const avatarConfig = gameState.avatarConfig;
  const nickname = gameState.detectiveNickname || 'Junior Detective';
  const showHud =
    stage !== 'customisation' &&
    stage !== 'cinematic' &&
    stage !== 'welcome-dialogue' &&
    stage !== 'screen-03-handoff' &&
    stage !== 'screen-04-handoff' &&
    stage !== 'screen-05-handoff' &&
    stage !== 'screen-06-handoff' &&
    stage !== 'screen-07-handoff' &&
    stage !== 'screen-08-handoff' &&
    stage !== 'screen-09-handoff' &&
    stage !== 'screen-10-handoff';

  const cameraFocus: CameraFocus =
    stage === 'cinematic'
      ? cinematicShotIdx < CINEMATIC_SHOTS.length
        ? CINEMATIC_SHOTS[cinematicShotIdx].focus
        : 'plaza'
      : stage === 'welcome-dialogue'
        ? 'plaza'
        : stage === 'tut-hq' || stage === 'hq-entrance'
          ? 'hq'
          : stage === 'red-flag-walk'
            ? 'red-flag'
            : stage === 'aina-walk'
              ? 'aina'
              : stage === 'cafe-walk'
                ? 'cafe'
                : stage === 'advice-walk'
                  ? 'advice'
                  : stage === 'arcade-walk'
                    ? 'arcade'
                    : stage === 'garden-walk'
                      ? 'garden'
                      : 'town';

  const townPusheenState: TownPusheenState =
    stage === 'cinematic' || stage === 'customisation'
      ? 'hidden'
      : stage === 'welcome-dialogue' && welcomeSubStep === 'peeking'
        ? 'peeking'
        : stage === 'hq-entrance'
          ? 'following-hq'
          : 'beside-player';

  const currentWelcomeStep = WELCOME_DIALOGUE_SCRIPT[welcomeDialogueIdx];
  const currentExploreStep = EXPLORE_INTRO_SCRIPT[tutSubIdx];
  const currentBagStep = TUT_BAG_INTRO_SCRIPT[tutSubIdx];
  const currentMovementStep = TUT_MOVEMENT_INTRO_SCRIPT[tutSubIdx];
  const currentCompleteStep = TUT_COMPLETE_SCRIPT[tutSubIdx];

  const allMapUnlocked = ALL_TOWN_BUILDING_IDS.every((id) =>
    gameState.unlockedBuildings.includes(id)
  );

  const handleUnlockAllMap = () => {
    const next: StudentGameState = {
      ...gameStateRef.current,
      unlockedBuildings: [...ALL_TOWN_BUILDING_IDS],
      tutorialProgress: {
        ...gameStateRef.current.tutorialProgress,
        buildingsDiscovered: [...ALL_TOWN_BUILDING_IDS],
        tutorialCompleted: true,
      },
    };
    void persistState(next);
  };

  const teacherContextValue = {
    isTeacherMode,
    teacherName: teacherSession?.displayName || '',
    allMapUnlocked,
    onUnlockAllMap: handleUnlockAllMap,
    onReturnToTeacherPortal: () => {
      stopNarration();
      onReturnToTeacherPortal?.();
    },
  };

  const renderContent = () => {
  // LOCATION LOADING OVERLAY (Must precede all stage renders including customisation)
  if (pendingPlaceLoad) {
    return (
      <LocationLoadingScreen
        destinationName={pendingPlaceLoad.destinationName}
        subtitle={pendingPlaceLoad.subtitle}
        accent={pendingPlaceLoad.accent}
        reducedMotion={gameState.settings.reducedMotion}
        preloadImages={pendingPlaceLoad.preloadImages}
        preloadVideo={pendingPlaceLoad.preloadVideo}
        onComplete={() => {
          setStage(pendingPlaceLoad.targetStage);
          setPendingPlaceLoad(null);
        }}
      />
    );
  }

  // SCENE 01: Character Customisation
  if (stage === 'customisation' || !avatarConfig) {
    return (
      <div
        className={`relative min-h-dvh w-full overflow-x-hidden ${
          gameState.settings.reducedMotion ? 'reduced-motion' : ''
        }`}
      >
        {/* Blurred uploaded Frutiger Metro wallpaper background */}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0 overflow-hidden bg-[#5BBBE9]"
        >
          <img
            src="/assets/aistudio/Fruigtar_Metro_0c77f8a2.jpg"
            alt=""
            className="w-full h-full object-cover blur-[7px] scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(220,245,255,0.28) 0%, rgba(186,230,253,0.22) 55%, rgba(232,248,255,0.34) 100%)',
            }}
          />
        </div>

        <div className="relative z-10">
          <CharacterCustomisation
            initialConfig={avatarConfig}
            initialNickname={gameState.detectiveNickname}
            isEditingExisting={isEditingExistingCharacter}
            onConfirmAndContinue={handleConfirmCharacter}
            onCancelEdit={
              isEditingExistingCharacter
                ? () => {
                    setIsEditingExistingCharacter(false);
                    setStage('town-free');
                  }
                : undefined
            }
          />
        </div>
      </div>
    );
  }

  // SCREEN 03: DETECTIVE HQ – SEGMENT 1, ACTIVITY 1, INDUCTION SET
  if (stage === 'screen-03-handoff') {
    return (
      <DetectiveHQScreen
        gameState={gameState}
        saveStatus={saveStatus}
        customMapMedia={customMapMedia}
        onUploadCustomMap={handleUploadCustomMap}
        onResetCustomMap={handleResetCustomMap}
        onUpdateSettings={handleUpdateSettings}
        onPersistState={persistState}
        onReturnToTown={() => {
          void persistState({ ...gameStateRef.current, lastScene: 'town' });
          navigateWithLoading('town-free');
        }}
        onContinueToRedFlagCentre={(latestState) => {
          startWalkTransition('red-flag', latestState, 'hq-door');
        }}
        onEditCharacter={() => {
          setIsEditingExistingCharacter(true);
          setStage('customisation');
        }}
        onReplayTutorial={handleReplayTutorial}
        onSignOut={onSignOut}
      />
    );
  }

  // SCREEN 04: RED FLAG CENTRE – SPOT THE WARNING SIGNS! (SEGMENT 2, ACTIVITY 1)
  if (stage === 'screen-04-handoff') {
    return (
      <RedFlagCentreScreen
        gameState={gameState}
        saveStatus={saveStatus}
        customMapMedia={customMapMedia}
        onUploadCustomMap={handleUploadCustomMap}
        onResetCustomMap={handleResetCustomMap}
        onUpdateSettings={handleUpdateSettings}
        onPersistState={persistState}
        onReturnToTown={() => {
          void persistState({ ...gameStateRef.current, lastScene: 'town' });
          navigateWithLoading('town-free');
        }}
        onContinueToAinasHouse={(latestState) => {
          startWalkTransition('aina', latestState, 'red-flag-door');
        }}
        onEditCharacter={() => {
          setIsEditingExistingCharacter(true);
          setStage('customisation');
        }}
        onReplayTutorial={handleReplayTutorial}
        onSignOut={onSignOut}
      />
    );
  }

  // SCREEN 05: AINA'S HOUSE – THE MYSTERY OF THE LUCKY MESSAGE (SEGMENT 2, ACTIVITY 2)
  if (stage === 'screen-05-handoff') {
    return (
      <AinasHouseScreen
        gameState={gameState}
        saveStatus={saveStatus}
        customMapMedia={customMapMedia}
        onUploadCustomMap={handleUploadCustomMap}
        onResetCustomMap={handleResetCustomMap}
        onUpdateSettings={handleUpdateSettings}
        onPersistState={persistState}
        onReturnToTown={() => {
          void persistState({ ...gameStateRef.current, lastScene: 'town' });
          navigateWithLoading('town-free');
        }}
        onContinueToCyberCafe={(latestState) => {
          startWalkTransition('cafe', latestState, 'aina-door');
        }}
        onEditCharacter={() => {
          setIsEditingExistingCharacter(true);
          setStage('customisation');
        }}
        onReplayTutorial={handleReplayTutorial}
        onSignOut={onSignOut}
      />
    );
  }

  // SCREEN 06: CYBER CAFÉ – HELP BYTE INVESTIGATE! (SEGMENT 2, ACTIVITY 3)
  if (stage === 'screen-06-handoff') {
    return (
      <CyberCafeScreen
        gameState={gameState}
        saveStatus={saveStatus}
        customMapMedia={customMapMedia}
        onUploadCustomMap={handleUploadCustomMap}
        onResetCustomMap={handleResetCustomMap}
        onUpdateSettings={handleUpdateSettings}
        onPersistState={persistState}
        onReturnToTown={() => {
          void persistState({ ...gameStateRef.current, lastScene: 'town' });
          navigateWithLoading('town-free');
        }}
        onContinueToAdviceCentre={(latestState) => {
          startWalkTransition('advice', latestState, 'cafe-door');
        }}
        onEditCharacter={() => {
          setIsEditingExistingCharacter(true);
          setStage('customisation');
        }}
        onReplayTutorial={handleReplayTutorial}
        onSignOut={onSignOut}
      />
    );
  }

  // SCREEN 07: ADVICE CENTRE – WORDS THAT HELP (SEGMENT 2, ACTIVITY 4)
  if (stage === 'screen-07-handoff') {
    return (
      <AdviceCentreScreen
        gameState={gameState}
        saveStatus={saveStatus}
        customMapMedia={customMapMedia}
        onUploadCustomMap={handleUploadCustomMap}
        onResetCustomMap={handleResetCustomMap}
        onUpdateSettings={handleUpdateSettings}
        onPersistState={persistState}
        onReturnToTown={() => {
          void persistState({ ...gameStateRef.current, lastScene: 'town' });
          navigateWithLoading('town-free');
        }}
        onContinueToGameArcade={(latestState) => {
          startWalkTransition('arcade', latestState, 'advice-door');
        }}
        onEditCharacter={() => {
          setIsEditingExistingCharacter(true);
          setStage('customisation');
        }}
        onReplayTutorial={handleReplayTutorial}
        onSignOut={onSignOut}
      />
    );
  }

  // SCREEN 08: GAME ARCADE – DANIEL'S FINAL DETECTIVE MISSION (LOCATION 6 · LO1 READING)
  if (stage === 'screen-08-handoff') {
    return (
      <GameArcadeScreen
        gameState={gameState}
        saveStatus={saveStatus}
        customMapMedia={customMapMedia}
        onUploadCustomMap={handleUploadCustomMap}
        onResetCustomMap={handleResetCustomMap}
        onUpdateSettings={handleUpdateSettings}
        onPersistState={persistState}
        onReturnToTown={() => {
          void persistState({ ...gameStateRef.current, lastScene: 'town' });
          navigateWithLoading('town-free');
        }}
        onContinueToDigitalSafeGarden={(latestState) => {
          startWalkTransition('garden', latestState, 'arcade-door');
        }}
        onEditCharacter={() => {
          setIsEditingExistingCharacter(true);
          setStage('customisation');
        }}
        onReplayTutorial={handleReplayTutorial}
        onSignOut={onSignOut}
      />
    );
  }

  // SCREEN 09: DIGITAL SAFE GARDEN – APPLICATION, PROMISE TREE & PASSPORT (LOCATION 7)
  if (stage === 'screen-09-handoff') {
    return (
      <DigitalSafeGardenScreen
        gameState={gameState}
        saveStatus={saveStatus}
        customMapMedia={customMapMedia}
        onUploadCustomMap={handleUploadCustomMap}
        onResetCustomMap={handleResetCustomMap}
        onUpdateSettings={handleUpdateSettings}
        onPersistState={persistState}
        onReturnToTown={() => {
          void persistState({ ...gameStateRef.current, lastScene: 'town' });
          navigateWithLoading('town-free');
        }}
        onContinueToFinalCeremony={(latestState) => {
          const nextState: StudentGameState = {
            ...latestState,
            lastScene: 'screen-10-handoff',
          };
          void persistState(nextState);
          navigateWithLoading('screen-10-handoff');
        }}
        onEditCharacter={() => {
          setIsEditingExistingCharacter(true);
          setStage('customisation');
        }}
        onReplayTutorial={handleReplayTutorial}
        onSignOut={onSignOut}
      />
    );
  }

  // SCREEN 10: FINAL ACHIEVEMENT CEREMONY & PRINTABLE CERTIFICATE
  if (stage === 'screen-10-handoff') {
    return (
      <FinalCeremonyScreen
        gameState={gameState}
        saveStatus={saveStatus}
        customMapMedia={customMapMedia}
        onUploadCustomMap={handleUploadCustomMap}
        onResetCustomMap={handleResetCustomMap}
        onUpdateSettings={handleUpdateSettings}
        onPersistState={persistState}
        onReturnToTown={() => {
          void persistState({ ...gameStateRef.current, lastScene: 'town' });
          navigateWithLoading('town-free');
        }}
        onEditCharacter={() => {
          setIsEditingExistingCharacter(true);
          setStage('customisation');
        }}
        onReplayTutorial={handleReplayTutorial}
        onSignOut={onSignOut}
      />
    );
  }

  return (
    <div
      className={`relative h-dvh w-full flex flex-col overflow-hidden bg-[#53C4F7] ${
        gameState.settings.reducedMotion ? 'reduced-motion' : ''
      }`}
    >
      {/* Persistent Top Game HUD */}
      {showHud && (
        <GameHud
          gameState={gameState}
          saveStatus={saveStatus}
          spotlightTarget={spotlightTarget}
          onOpenModal={handleOpenHudModal}
          onSpotlightBackdropClick={() => setSpotlightHintToast(true)}
          onSignOut={onSignOut}
        />
      )}

      {/* Scene 10 Building Discovery Progress Bar */}
      {stage === 'explore-buildings' && (
        <div className="relative z-20 mx-auto mt-1.5 px-3">
          <div className="rounded-full bg-white/90 backdrop-blur-md border border-white px-4 py-1.5 shadow-md flex items-center gap-2 text-xs font-extrabold text-[#0369A1]">
            <Compass className="h-4 w-4 text-[#7C3AED]" aria-hidden="true" />
            <span>
              DISCOVERED BUILDINGS:{' '}
              {gameState.tutorialProgress.buildingsDiscovered.length} / {TOWN_BUILDINGS.length}
            </span>
          </div>
        </div>
      )}

      {/* Interactive Layered Town World */}
      <TownEnvironment
        avatarConfig={avatarConfig}
        nickname={nickname}
        position={gameState.lastPosition}
        unlockedBuildings={gameState.unlockedBuildings}
        discoveredBuildings={gameState.tutorialProgress.buildingsDiscovered}
        showDiscoveryBadges={stage === 'explore-buildings'}
        cameraFocus={cameraFocus}
        reducedMotion={gameState.settings.reducedMotion}
        allowMovement={
          stage === 'tut-movement' ||
          stage === 'tut-hq' ||
          stage === 'town-free' ||
          stage === 'explore-buildings'
        }
        allowBuildingClicks={
          stage === 'explore-buildings' ||
          stage === 'tut-hq' ||
          stage === 'town-free'
        }
        highlightPathway={stage === 'tut-movement' && tutPhase === 'await-click' && !movementSucceeded}
        highlightHq={stage === 'tut-hq' && hqDialogueStep === 'prompt'}
        hqIlluminated={hqIlluminated}
        hqDoorOpen={hqDoorOpen}
        redFlagIlluminated={redFlagIlluminated}
        redFlagDoorOpen={redFlagDoorOpen}
        ainaIlluminated={ainaIlluminated}
        ainaDoorOpen={ainaDoorOpen}
        cafeIlluminated={cafeIlluminated}
        cafeDoorOpen={cafeDoorOpen}
        adviceIlluminated={adviceIlluminated}
        adviceDoorOpen={adviceDoorOpen}
        arcadeIlluminated={arcadeIlluminated}
        arcadeDoorOpen={arcadeDoorOpen}
        gardenIlluminated={gardenIlluminated}
        gardenDoorOpen={gardenDoorOpen}
        scriptedWalkToNode={scriptedWalkToNode}
        onScriptedWalkCompleted={handleScriptedWalkArrived}
        showRustleBehindTree={stage === 'cinematic' && arrivalLineIdx === 2}
        customMapMedia={customMapMedia}
        pusheenState={townPusheenState}
        pusheenExpression={
          stage === 'welcome-dialogue' && currentWelcomeStep
            ? currentWelcomeStep.expression
            : stage === 'hq-entrance' ||
                stage === 'red-flag-walk' ||
                stage === 'aina-walk' ||
                stage === 'cafe-walk' ||
                stage === 'advice-walk' ||
                stage === 'arcade-walk' ||
                stage === 'garden-walk'
              ? 'excited'
              : 'happy'
        }
        pusheenPose={
          stage === 'welcome-dialogue' && welcomeSubStep === 'peeking'
            ? 'peeking'
            : stage === 'welcome-dialogue'
              ? 'waving'
              : 'normal'
        }
        avatarOverridePose={stage === 'cinematic' && arrivalLineIdx >= 1 ? 'wave' : undefined}
        selectedBuilding={selectedBuilding}
        lockedFeedbackBuildingId={lockedFeedbackBuildingId}
        onPositionChange={handlePositionChange}
        onMovementCompleted={handleMovementCompleted}
        onOffPathClick={() => setOffPathWarning(true)}
        onSelectBuilding={handleSelectBuilding}
        onCloseBuildingModal={handleCloseBuildingModal}
        onEnterBuilding={handleEnterBuilding}
        replayableBuildings={replayableBuildings}
        onPlayAgainBuilding={handlePlayAgainBuilding}
      />

      {/* PATH B: Returning Student Welcome Card */}
      {stage === 'returning-welcome' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Welcome back Junior Detective"
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#0B2945]/45 backdrop-blur-xs"
        >
          <div
            style={{
              background:
                'linear-gradient(155deg, rgba(255,255,255,0.95) 0%, rgba(226,248,255,0.93) 100%)',
            }}
            className="aero-glass-card w-full max-w-lg rounded-[30px] border border-white p-6 text-center space-y-4 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.4)]"
          >
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 border border-sky-200 px-3.5 py-1 text-[11px] font-extrabold tracking-widest uppercase text-[#0369A1]">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span>WELCOME BACK, DETECTIVE!</span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="w-24 h-32">
                  <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />
                </div>
                <div className="w-20 h-18">
                  <PusheenIllustration expression="happy" pose="waving" />
                </div>
              </div>

              <div>
                <h2 className="font-[var(--font-display)] text-2xl font-bold text-[#6D28D9]">
                  {nickname}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-[#18466E] mt-0.5">
                  LEVEL {gameState.level} · {gameState.xp} XP ·{' '}
                  <Star className="inline h-3.5 w-3.5 text-amber-500 fill-amber-400" />{' '}
                  {gameState.stars} STARS
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50/90 border border-sky-200 p-3 text-xs sm:text-sm font-semibold text-[#0E3558]">
                <strong>Detective Pusheen:</strong> &ldquo;Welcome back, {nickname}! Detective Town is
                ready whenever you are!&rdquo;
              </div>

              <button
                type="button"
                onClick={() => {
                  playPortalOpen();
                  if (gameState.lastScene === 'screen-10-handoff') {
                    navigateWithLoading('screen-10-handoff');
                  } else if (gameState.lastScene === 'screen-09-handoff') {
                    navigateWithLoading('screen-09-handoff');
                  } else if (gameState.lastScene === 'screen-08-handoff') {
                    navigateWithLoading('screen-08-handoff');
                  } else if (gameState.lastScene === 'screen-07-handoff') {
                    navigateWithLoading('screen-07-handoff');
                  } else if (gameState.lastScene === 'screen-06-handoff') {
                    navigateWithLoading('screen-06-handoff');
                  } else if (gameState.lastScene === 'screen-05-handoff') {
                    navigateWithLoading('screen-05-handoff');
                  } else if (gameState.lastScene === 'screen-04-handoff') {
                    navigateWithLoading('screen-04-handoff');
                  } else if (gameState.lastScene === 'screen-03-handoff') {
                    navigateWithLoading('screen-03-handoff');
                  } else {
                    navigateWithLoading('town-free');
                  }
                }}
                className="aero-glossy-btn w-full min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-6 py-2.5 text-sm sm:text-base font-bold text-white cursor-pointer"
              >
                CONTINUE MY ADVENTURE
              </button>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setIsEditingExistingCharacter(true);
                    setStage('customisation');
                  }}
                  className="min-h-[38px] rounded-full bg-white hover:bg-purple-50 border border-purple-200 px-4 py-1.5 text-xs font-bold text-[#6D28D9] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Edit Character</span>
                </button>
                <button
                  type="button"
                  onClick={handleReplayTutorial}
                  className="min-h-[38px] rounded-full bg-white hover:bg-sky-50 border border-sky-200 px-4 py-1.5 text-xs font-bold text-[#0369A1] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Replay Tutorial</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCENE 02: Cinematic Camera Narration & Player Arrival */}
      {stage === 'cinematic' && (
        <div className="fixed inset-x-0 bottom-4 z-30 px-3 pointer-events-auto">
          {arrivalLineIdx === 0 ? (
            <div className="max-w-2xl mx-auto aero-glass-card rounded-[24px] border border-white/95 bg-white/90 px-5 py-4 flex items-center justify-between gap-3 shadow-lg">
              <div className="relative z-10">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0284C7]">
                  SCENE 02 · WELCOME TO DETECTIVE TOWN (SHOT {cinematicShotIdx + 1}/7)
                </p>
                <p className="text-sm sm:text-base font-bold text-[#0E3558] mt-0.5">
                  {CINEMATIC_SHOTS[cinematicShotIdx]?.caption}
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    if (cinematicShotIdx + 1 < CINEMATIC_SHOTS.length) {
                      setCinematicShotIdx((prev) => prev + 1);
                    } else {
                      setCinematicShotIdx(CINEMATIC_SHOTS.length);
                      setArrivalLineIdx(1);
                    }
                  }}
                  className="min-h-[38px] rounded-full bg-sky-100 hover:bg-sky-200 px-3.5 py-1.5 text-xs font-bold text-[#0369A1] cursor-pointer"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setCinematicShotIdx(CINEMATIC_SHOTS.length);
                    setArrivalLineIdx(1);
                  }}
                  className="min-h-[38px] rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#475569] cursor-pointer"
                >
                  Skip Intro
                </button>
              </div>
            </div>
          ) : (
            <DialogueBox
              speaker="player"
              playerNickname={nickname}
              playerAvatar={avatarConfig}
              expression={arrivalLineIdx === 1 ? 'excited' : 'curious'}
              text={
                arrivalLineIdx === 1
                  ? 'WOW! What a beautiful place!'
                  : 'Where am I? Wait... did something just move behind that tree?'
              }
              settings={gameState.settings}
              onSkipAll={() => {
                setWelcomeSubStep('peeking');
                setWelcomeDialogueIdx(0);
                setStage('welcome-dialogue');
              }}
              onNext={() => {
                if (arrivalLineIdx === 1) {
                  setArrivalLineIdx(2);
                } else {
                  setWelcomeSubStep('peeking');
                  setWelcomeDialogueIdx(0);
                  setStage('welcome-dialogue');
                }
              }}
            />
          )}
        </div>
      )}

      {/* SCENE 03: Welcome Conversation with Detective Pusheen */}
      {stage === 'welcome-dialogue' && (
        <div className="fixed inset-x-0 bottom-4 z-30 pointer-events-auto">
          {welcomeSubStep === 'peeking' ? (
            <DialogueBox
              speaker="pusheen"
              expression="curious"
              text="A friendly grey cat wearing a detective hat peeks out from behind the tree with a magnifying glass..."
              settings={gameState.settings}
              nextLabel="MEET PUSHEEN"
              onNext={() => setWelcomeSubStep('dialogue')}
            />
          ) : (
            currentWelcomeStep && (
              <DialogueBox
                speaker={currentWelcomeStep.speaker}
                speakerName={currentWelcomeStep.speakerName}
                playerNickname={nickname}
                playerAvatar={avatarConfig}
                expression={currentWelcomeStep.expression}
                text={currentWelcomeStep.text}
                choices={currentWelcomeStep.choices}
                settings={gameState.settings}
                onReplay={() => setWelcomeDialogueIdx(0)}
                onSkipAll={() => {
                  persistState({
                    ...gameStateRef.current,
                    tutorialProgress: {
                      ...gameStateRef.current.tutorialProgress,
                      welcomeConversationDone: true,
                    },
                  });
                  setStage('hud-intro');
                }}
                onChoiceSelect={(_choice: DialogueChoice) => {
                  setWelcomeDialogueIdx((prev) => prev + 1);
                }}
                onNext={() => {
                  if (welcomeDialogueIdx + 1 < WELCOME_DIALOGUE_SCRIPT.length) {
                    setWelcomeDialogueIdx((prev) => prev + 1);
                  } else {
                    persistState({
                      ...gameStateRef.current,
                      tutorialProgress: {
                        ...gameStateRef.current.tutorialProgress,
                        welcomeConversationDone: true,
                      },
                    });
                    setStage('hud-intro');
                  }
                }}
              />
            )
          )}
        </div>
      )}

      {/* SCENE 04: Introducing the Game Interface */}
      {stage === 'hud-intro' && !activeModal && (
        <div className="fixed inset-x-0 bottom-4 z-30 pointer-events-auto">
          <DialogueBox
            speaker="pusheen"
            expression="happy"
            text="Look around Detective Town! You can click any of your Detective Tools at the top corners right now, or press NEXT so I can guide you through each one!"
            settings={gameState.settings}
            onNext={() => {
              setTutPhase('await-click');
              setStage('tut-profile');
            }}
          />
        </div>
      )}

      {/* SCENE 05: Tutorial 1 – Player Profile */}
      {stage === 'tut-profile' && !activeModal && (
        <div className="fixed inset-x-0 bottom-4 z-40 pointer-events-auto">
          {tutPhase === 'await-click' ? (
            <DialogueBox
              speaker="pusheen"
              expression="encouraging"
              text={
                spotlightHintToast
                  ? 'Click the glowing avatar badge in the top-left corner to open your Player Profile!'
                  : "First, let's take a look at your detective profile! Click your little avatar picture!"
              }
              settings={gameState.settings}
              showNextButton={false}
              onReplay={() => setSpotlightHintToast(false)}
            />
          ) : (
            <DialogueBox
              speaker="pusheen"
              expression="celebrating"
              text="Great! You know where to find your detective information!"
              settings={gameState.settings}
              onNext={() => {
                setSpotlightHintToast(false);
                setTutPhase('intro');
                setTutSubIdx(0);
                setStage('tut-bag');
              }}
            />
          )}
        </div>
      )}

      {/* SCENE 06: Tutorial 2 – Detective Bag */}
      {stage === 'tut-bag' && !activeModal && (
        <div className="fixed inset-x-0 bottom-4 z-40 pointer-events-auto">
          {tutPhase === 'intro' && currentBagStep ? (
            <DialogueBox
              speaker={currentBagStep.speaker}
              playerNickname={nickname}
              playerAvatar={avatarConfig}
              expression={currentBagStep.expression}
              text={currentBagStep.text}
              settings={gameState.settings}
              onSkipAll={() => setTutPhase('await-click')}
              onNext={() => {
                if (tutSubIdx + 1 < TUT_BAG_INTRO_SCRIPT.length) {
                  setTutSubIdx((prev) => prev + 1);
                } else {
                  setTutPhase('await-click');
                }
              }}
            />
          ) : tutPhase === 'await-click' ? (
            <DialogueBox
              speaker="pusheen"
              expression="encouraging"
              text="Click your glowing Detective Bag icon at the top right to open it!"
              settings={gameState.settings}
              showNextButton={false}
              onReplay={() => {
                setTutPhase('intro');
                setTutSubIdx(0);
              }}
            />
          ) : (
            <DialogueBox
              speaker="pusheen"
              expression="celebrating"
              text="Well done! You know where to keep your detective treasures!"
              settings={gameState.settings}
              onNext={() => {
                setSpotlightHintToast(false);
                setTutPhase('await-click');
                setStage('tut-mission');
              }}
            />
          )}
        </div>
      )}

      {/* SCENE 07: Tutorial 3 – Mission Tracker */}
      {stage === 'tut-mission' && !activeModal && (
        <div className="fixed inset-x-0 bottom-4 z-40 pointer-events-auto">
          {tutPhase === 'await-click' ? (
            <DialogueBox
              speaker="pusheen"
              expression="excited"
              text="Now, this is one of the most important tools! Your Mission Tracker tells you what you need to do next. Click the glowing Mission Tracker!"
              settings={gameState.settings}
              showNextButton={false}
              onReplay={() => setSpotlightHintToast(false)}
            />
          ) : (
            <DialogueBox
              speaker="pusheen"
              expression="celebrating"
              text="Excellent! You have discovered your Mission Tracker!"
              settings={gameState.settings}
              onNext={() => {
                setSpotlightHintToast(false);
                setTutPhase('await-click');
                setStage('tut-settings');
              }}
            />
          )}
        </div>
      )}

      {/* SCENE 08: Tutorial 4 – Settings & Help */}
      {stage === 'tut-settings' && !activeModal && (
        <div className="fixed inset-x-0 bottom-4 z-40 pointer-events-auto">
          {tutPhase === 'await-click' ? (
            <DialogueBox
              speaker="pusheen"
              expression="happy"
              text="One last thing before we explore! Let's check your settings. Click the glowing Settings icon at the top right!"
              settings={gameState.settings}
              showNextButton={false}
              onReplay={() => setSpotlightHintToast(false)}
            />
          ) : (
            <DialogueBox
              speaker="pusheen"
              expression="celebrating"
              text="Fantastic! Now you know where to find help if you need it."
              settings={gameState.settings}
              onNext={() => {
                setSpotlightHintToast(false);
                setTutSubIdx(0);
                setStage('explore-intro');
              }}
            />
          )}
        </div>
      )}

      {/* SCENE 09: Introducing the Seven Buildings */}
      {stage === 'explore-intro' && currentExploreStep && (
        <div className="fixed inset-x-0 bottom-4 z-30 pointer-events-auto">
          <DialogueBox
            speaker={currentExploreStep.speaker}
            playerNickname={nickname}
            playerAvatar={avatarConfig}
            expression={currentExploreStep.expression}
            text={currentExploreStep.text}
            settings={gameState.settings}
            onReplay={() => setTutSubIdx(0)}
            onSkipAll={() => setStage('explore-buildings')}
            onNext={() => {
              if (tutSubIdx + 1 < EXPLORE_INTRO_SCRIPT.length) {
                setTutSubIdx((prev) => prev + 1);
              } else {
                setStage('explore-buildings');
              }
            }}
          />
        </div>
      )}

      {/* SCENE 10: Click and Discover All Seven Buildings */}
      {stage === 'explore-buildings' && !selectedBuilding && (
        <div className="fixed inset-x-0 bottom-4 z-30 pointer-events-auto">
          {allBuildingsCheered ? (
            <DialogueBox
              speaker="pusheen"
              expression="celebrating"
              text="Purr-fect! You discovered all seven buildings in Detective Town! Now let's learn how to walk around."
              settings={gameState.settings}
              onNext={() => {
                setTutPhase('intro');
                setTutSubIdx(0);
                setMovementSucceeded(false);
                setOffPathWarning(false);
                setStage('tut-movement');
              }}
            />
          ) : (
            <DialogueBox
              speaker="pusheen"
              expression="curious"
              text={`Click each building in town to read its card! (${gameState.tutorialProgress.buildingsDiscovered.length} of 7 discovered)`}
              settings={gameState.settings}
              showNextButton={
                gameState.tutorialProgress.buildingsDiscovered.length >= TOWN_BUILDINGS.length
              }
              onNext={() => setAllBuildingsCheered(true)}
            />
          )}
        </div>
      )}

      {/* SCENE 11: Avatar Movement Tutorial */}
      {stage === 'tut-movement' && (
        <div className="fixed inset-x-0 bottom-4 z-30 pointer-events-auto">
          {tutPhase === 'intro' && currentMovementStep ? (
            <DialogueBox
              speaker={currentMovementStep.speaker}
              playerNickname={nickname}
              playerAvatar={avatarConfig}
              expression={currentMovementStep.expression}
              text={currentMovementStep.text}
              settings={gameState.settings}
              onSkipAll={() => setTutPhase('await-click')}
              onNext={() => {
                if (tutSubIdx + 1 < TUT_MOVEMENT_INTRO_SCRIPT.length) {
                  setTutSubIdx((prev) => prev + 1);
                } else {
                  setTutPhase('await-click');
                }
              }}
            />
          ) : movementSucceeded ? (
            <DialogueBox
              speaker="pusheen"
              expression="celebrating"
              text="That's it! You're moving!"
              settings={gameState.settings}
              onNext={() => {
                setOffPathWarning(false);
                setHqDialogueStep('prompt');
                setStage('tut-hq');
              }}
            />
          ) : (
            <DialogueBox
              speaker="pusheen"
              expression={offPathWarning ? 'thinking' : 'encouraging'}
              text={
                offPathWarning
                  ? "Hmm, that isn't a pathway! Try clicking the stone path instead."
                  : 'Click or tap any section of the glowing stone pathway (or use WASD / Arrow keys) to walk!'
              }
              settings={gameState.settings}
              showNextButton={false}
              onReplay={() => setOffPathWarning(false)}
            />
          )}
        </div>
      )}

      {/* SCENE 12: Building Selection Tutorial (Find Detective HQ) */}
      {stage === 'tut-hq' && !selectedBuilding && (
        <div className="fixed inset-x-0 bottom-4 z-30 pointer-events-auto">
          {hqDialogueStep === 'prompt' ? (
            <DialogueBox
              speaker="pusheen"
              expression="excited"
              text="Great! Now let's practise choosing a building. Can you find our first mission location? Click DETECTIVE HQ!"
              settings={gameState.settings}
              showNextButton={false}
            />
          ) : (
            <DialogueBox
              speaker="pusheen"
              expression="celebrating"
              text="Wonderful! You've found it! Are you ready for your first mystery?"
              choices={[{ id: 'solve-it', label: "Yes! Let's solve it!" }]}
              settings={gameState.settings}
              onChoiceSelect={() => {
                setTutSubIdx(0);
                setTutCompleteCardShown(false);
                setStage('tut-complete');
              }}
            />
          )}
        </div>
      )}

      {/* SCENE 13: Tutorial Completion */}
      {stage === 'tut-complete' && (
        <>
          {!tutCompleteCardShown && currentCompleteStep ? (
            <div className="fixed inset-x-0 bottom-4 z-30 pointer-events-auto">
              <DialogueBox
                speaker={currentCompleteStep.speaker}
                playerNickname={nickname}
                playerAvatar={avatarConfig}
                expression={currentCompleteStep.expression}
                text={currentCompleteStep.text}
                settings={gameState.settings}
                onSkipAll={() => {
                  playLoginSuccess();
                  persistState({
                    ...gameStateRef.current,
                    tutorialProgress: {
                      ...gameStateRef.current.tutorialProgress,
                      tutorialCompleted: true,
                    },
                  });
                  setTutCompleteCardShown(true);
                }}
                onNext={() => {
                  if (tutSubIdx + 1 < TUT_COMPLETE_SCRIPT.length) {
                    setTutSubIdx((prev) => prev + 1);
                  } else {
                    playLoginSuccess();
                    persistState({
                      ...gameStateRef.current,
                      tutorialProgress: {
                        ...gameStateRef.current.tutorialProgress,
                        tutorialCompleted: true,
                      },
                    });
                    setTutCompleteCardShown(true);
                  }
                }}
              />
            </div>
          ) : (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Tutorial Completed"
              className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#0B2945]/45 backdrop-blur-xs"
            >
              <div
                style={{
                  background:
                    'linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(226,248,255,0.94) 55%, rgba(237,233,254,0.94) 100%)',
                }}
                className="aero-glass-card w-full max-w-lg rounded-[32px] border border-white p-6 sm:p-7 text-center space-y-4 shadow-[0_24px_60px_-10px_rgba(16,55,92,0.42)]"
              >
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#15803D]">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>TUTORIAL COMPLETED!</span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-[#18466E]">
                    You are officially ready to begin your adventure.
                  </p>

                  <div className="mx-auto w-32 h-42">
                    <DetectiveAvatar config={avatarConfig} view="front" pose="wave" />
                  </div>

                  <p className="font-[var(--font-display)] text-xl font-bold text-[#6D28D9]">
                    {nickname}
                  </p>

                  <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3 text-left space-y-1">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                      FIRST MISSION
                    </p>
                    <p className="text-sm font-bold text-[#0E3558]">
                      MISSION 01: THE MYSTERY OF THE UNEXPECTED PRIZE
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playPortalOpen();
                      setStage('hq-entrance');
                    }}
                    className="aero-glossy-btn w-full min-h-[48px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] px-6 py-2.5 text-sm sm:text-base font-bold text-white inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <DoorOpen className="h-5 w-5" aria-hidden="true" />
                    <span>ENTER DETECTIVE HQ</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* SCENE 14: Entering Detective HQ Animation + Fade */}
      {stage === 'hq-entrance' && (
        <>
          <div className="fixed inset-x-0 bottom-4 z-30 pointer-events-none">
            <DialogueBox
              speaker="pusheen"
              expression="excited"
              text="Our first mystery is waiting inside Detective HQ!"
              settings={gameState.settings}
              showNextButton={false}
            />
          </div>
          {entranceFading && (
            <div
              aria-hidden="true"
              className="fixed inset-0 z-50 bg-sky-50 transition-opacity duration-700 opacity-100"
            />
          )}
        </>
      )}

      {/* Walking Along Stone Path to Red Flag Centre / Aina's House / Cyber Café / Advice Centre / Game Arcade / Digital Safe Garden */}
      {(stage === 'red-flag-walk' ||
        stage === 'aina-walk' ||
        stage === 'cafe-walk' ||
        stage === 'advice-walk' ||
        stage === 'arcade-walk' ||
        stage === 'garden-walk') && (
        <>
          <div className="fixed inset-x-0 bottom-4 z-30 pointer-events-none">
            <DialogueBox
              speaker="pusheen"
              expression="excited"
              text={
                stage === 'aina-walk'
                  ? "Follow the cobblestone path to Aina's House! She's waiting for our help!"
                  : stage === 'cafe-walk'
                    ? 'Follow the path across town to the Cyber Café! Byte needs your help!'
                    : stage === 'advice-walk'
                      ? 'Follow the path to the Advice Centre! Words that help await!'
                      : stage === 'arcade-walk'
                        ? 'Head down the cobblestone path to the Game Arcade! Daniel needs our help!'
                        : stage === 'garden-walk'
                          ? 'Cross the bridge to the Digital Safe Garden to complete your Digital Safety Passport!'
                          : 'Follow the cobblestone path to the Red Flag Centre! Our next investigation awaits!'
              }
              settings={gameState.settings}
              showNextButton={false}
            />
          </div>
          {entranceFading && (
            <div
              aria-hidden="true"
              className={`fixed inset-0 z-50 transition-opacity duration-600 opacity-100 ${
                stage === 'aina-walk'
                  ? 'bg-fuchsia-50'
                  : stage === 'cafe-walk'
                    ? 'bg-amber-50'
                    : stage === 'advice-walk'
                      ? 'bg-teal-50'
                      : stage === 'arcade-walk'
                        ? 'bg-purple-50'
                        : stage === 'garden-walk'
                          ? 'bg-emerald-50'
                          : 'bg-rose-50'
              }`}
            />
          )}
        </>
      )}

      {/* FREE TOWN EXPLORATION */}
      {stage === 'town-free' && !selectedBuilding && (
        <div className="fixed inset-x-0 bottom-3 z-20 px-3 pointer-events-none">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 aero-glass-card rounded-2xl border border-white/95 bg-white/88 px-4 py-2.5 shadow-md pointer-events-auto">
            <p className="relative z-10 text-xs sm:text-sm font-semibold text-[#0E3558]">
              {offPathWarning ? (
                <span className="text-[#6D28D9]">
                  <strong>Pusheen:</strong> &ldquo;Hmm, that isn&apos;t a pathway! Try clicking the
                  stone path instead.&rdquo;
                </span>
              ) : isTeacherMode && allMapUnlocked ? (
                <span>
                  <strong>Teacher Mode:</strong> All 7 Town Map locations are unlocked! Walk with
                  WASD/Arrows or click any building to play along.
                </span>
              ) : gameState.screen09Progress?.finalCeremonyUnlocked ? (
                <span>
                  <strong>Digital Safety Guardian:</strong> All 7 missions complete! Revisit any
                  building, open your <strong>Passport</strong>, or celebrate at the{' '}
                  <strong>Final Ceremony</strong>!
                </span>
              ) : gameState.unlockedBuildings.includes('digital-safe-garden') ? (
                <span>
                  Click the <strong>stone pathway</strong> (or WASD/Arrows) to walk, or cross the
                  bridge to the <strong>Digital Safe Garden</strong>!
                </span>
              ) : gameState.unlockedBuildings.includes('game-arcade') ? (
                <span>
                  Click the <strong>stone pathway</strong> (or WASD/Arrows) to walk, or visit the{' '}
                  <strong>Game Arcade</strong> to help Daniel!
                </span>
              ) : gameState.unlockedBuildings.includes('advice-centre') ? (
                <span>
                  Click the <strong>stone pathway</strong> (or WASD/Arrows) to walk, or visit any
                  unlocked location — <strong>Advice Centre</strong> is now open!
                </span>
              ) : gameState.unlockedBuildings.includes('cyber-cafe') ? (
                <span>
                  Click the <strong>stone pathway</strong> (or WASD/Arrows) to walk, or visit any
                  unlocked location — <strong>Cyber Café</strong> is now open!
                </span>
              ) : gameState.unlockedBuildings.includes('ainas-house') ? (
                <span>
                  Click the <strong>stone pathway</strong> (or WASD/Arrows) to walk, revisit{' '}
                  <strong>Red Flag Centre</strong>, or visit <strong>Aina&apos;s House</strong>!
                </span>
              ) : gameState.unlockedBuildings.includes('red-flag-centre') ? (
                <span>
                  Click the <strong>stone pathway</strong> (or WASD/Arrows) to walk, revisit{' '}
                  <strong>Detective HQ</strong>, or enter the <strong>Red Flag Centre</strong>!
                </span>
              ) : (
                <span>
                  Click the <strong>stone pathway</strong> (or WASD/Arrows) to walk, or click{' '}
                  <strong>Detective HQ</strong> to begin Mission 01!
                </span>
              )}
            </p>
            <div className="relative z-10 flex flex-wrap items-center gap-2">
              {(gameState.screen09Progress?.finalCeremonyUnlocked || (isTeacherMode && allMapUnlocked)) && (
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    void persistState({
                      ...gameStateRef.current,
                      lastScene: 'screen-10-handoff',
                    });
                    navigateWithLoading('screen-10-handoff');
                  }}
                  className="aero-glossy-btn min-h-[38px] rounded-full bg-gradient-to-b from-[#FBBF24] to-[#16A34A] px-4 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>FINAL CEREMONY</span>
                </button>
              )}
              {gameState.screen09Progress?.passportCompleted && (
                <button
                  type="button"
                  onClick={() => {
                    playSoftSelect();
                    setShowQuickPassport(true);
                  }}
                  className="min-h-[38px] rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3.5 py-1.5 text-xs font-bold text-[#92400E] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <FileBadge className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>PASSPORT</span>
                </button>
              )}
              {gameState.unlockedBuildings.includes('digital-safe-garden') && (
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    startWalkTransition('garden', gameStateRef.current);
                  }}
                  className="aero-glossy-btn min-h-[38px] rounded-full bg-gradient-to-b from-[#4ADE80] to-[#15803D] px-4 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Flower2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>SAFE GARDEN</span>
                </button>
              )}
              {gameState.unlockedBuildings.includes('game-arcade') && (
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    startWalkTransition('arcade', gameStateRef.current);
                  }}
                  className="aero-glossy-btn min-h-[38px] rounded-full bg-gradient-to-b from-[#A78BFA] to-[#7C3AED] px-4 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>GAME ARCADE</span>
                </button>
              )}
              {gameState.unlockedBuildings.includes('advice-centre') && (
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    startWalkTransition('advice', gameStateRef.current);
                  }}
                  className="aero-glossy-btn min-h-[38px] rounded-full bg-gradient-to-b from-[#2DD4BF] to-[#0D9488] px-4 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <HeartHandshake className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>ADVICE CENTRE</span>
                </button>
              )}
              {gameState.unlockedBuildings.includes('cyber-cafe') && (
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    startWalkTransition('cafe', gameStateRef.current);
                  }}
                  className="aero-glossy-btn min-h-[38px] rounded-full bg-gradient-to-b from-[#FBBF24] to-[#D97706] px-4 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Coffee className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>CYBER CAFÉ</span>
                </button>
              )}
              {gameState.unlockedBuildings.includes('ainas-house') && (
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    startWalkTransition('aina', gameStateRef.current);
                  }}
                  className="aero-glossy-btn min-h-[38px] rounded-full bg-gradient-to-b from-[#E879F9] to-[#9333EA] px-4 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Home className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>AINA&apos;S HOUSE</span>
                </button>
              )}
              {gameState.unlockedBuildings.includes('red-flag-centre') && (
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    startWalkTransition('red-flag', gameStateRef.current);
                  }}
                  className="aero-glossy-btn min-h-[38px] rounded-full bg-gradient-to-b from-[#FB7185] to-[#E11D48] px-4 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>RED FLAG CENTRE</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  playPortalOpen();
                  setStage('hq-entrance');
                }}
                className="aero-glossy-btn min-h-[38px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-4 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
              >
                <DoorOpen className="h-3.5 w-3.5" aria-hidden="true" />
                <span>ENTER DETECTIVE HQ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HUD MODALS */}
      <HudModals
        activeModal={activeModal}
        gameState={gameState}
        canEditCharacter={gameState.tutorialProgress.tutorialCompleted || isReturningOnStart}
        requireSettingChangeBeforeClose={stage === 'tut-settings'}
        customMapMedia={customMapMedia}
        onUploadCustomMap={handleUploadCustomMap}
        onResetCustomMap={handleResetCustomMap}
        onUpdateSettings={handleUpdateSettings}
        onCloseModal={handleCloseHudModal}
        onEditCharacter={() => {
          setActiveModal(null);
          setIsEditingExistingCharacter(true);
          setStage('customisation');
        }}
        onReplayTutorial={handleReplayTutorial}
        onOpenPassport={() => {
          setActiveModal(null);
          setShowQuickPassport(true);
        }}
        onOpenCertificate={() => {
          setActiveModal(null);
          setShowQuickCertificate(true);
        }}
      />

      {showQuickPassport && gameState.screen09Progress && avatarConfig && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Digital Safety Passport Viewer"
          className="fixed inset-0 z-[65] overflow-y-auto bg-[#0B2945]/55 backdrop-blur-xs pt-6 pb-10"
        >
          <DigitalSafetyPassport
            avatarConfig={avatarConfig}
            nickname={nickname}
            progress={gameState.screen09Progress}
            onViewFinalAchievement={() => {
              setShowQuickPassport(false);
              navigateWithLoading('screen-10-handoff');
            }}
            onCloseModal={() => setShowQuickPassport(false)}
          />
        </div>
      )}

      {showQuickCertificate && (
        <PrintableCertificate
          gameState={gameState}
          readOnly={Boolean(teacherSession)}
          onUploadCertificate={teacherSession ? undefined : handleUploadQuickCertificate}
          onRemoveUploadedCertificate={teacherSession ? undefined : handleRemoveQuickCertificate}
          onClose={() => setShowQuickCertificate(false)}
        />
      )}
    </div>
  );
  };

  return (
    <TeacherPlayProvider value={teacherContextValue}>
      {renderContent()}
    </TeacherPlayProvider>
  );
};
