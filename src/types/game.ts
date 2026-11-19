export type SkinToneId = 'fair' | 'light' | 'medium' | 'tan' | 'brown' | 'deep';
export type HairStyleId = 'short' | 'long' | 'curly' | 'bob' | 'spiky' | 'pigtails' | 'hijab';
export type HairColorId = 'black' | 'dark-brown' | 'chestnut' | 'blonde' | 'auburn' | 'midnight';
export type HijabColorId =
  | 'rose'
  | 'aqua'
  | 'lavender'
  | 'mint'
  | 'cream'
  | 'navy'
  | 'mocha'
  | 'black';
export type OutfitStyleId = 'hoodie' | 'jacket' | 'polo' | 'casual' | 'overalls';
export type OutfitColorId = 'aqua' | 'mint' | 'lavender' | 'gold' | 'coral' | 'navy';
export type AccessoryId = 'none' | 'glasses' | 'headband' | 'cap' | 'backpack' | 'magnifier-pin';
export type ShoeStyleId = 'trainers' | 'boots' | 'casual';
export type ShoeColorId = 'white' | 'sky' | 'charcoal' | 'berry';
export type BaseAppearanceId = 'cheerful' | 'curious' | 'friendly' | 'bold';

export interface AvatarConfig {
  baseStyle: BaseAppearanceId;
  skinTone: SkinToneId;
  hairStyle: HairStyleId;
  hairColor: HairColorId;
  hijabColor?: HijabColorId;
  outfitStyle: OutfitStyleId;
  outfitColor: OutfitColorId;
  accessory: AccessoryId;
  shoesStyle: ShoeStyleId;
  shoesColor: ShoeColorId;
}

export type BuildingId =
  | 'detective-hq'
  | 'red-flag-centre'
  | 'ainas-house'
  | 'cyber-cafe'
  | 'advice-centre'
  | 'game-arcade'
  | 'digital-safe-garden';

export interface BuildingDefinition {
  id: BuildingId;
  name: string;
  description: string;
  pusheenLine: string;
  order: number;
  x: number; // percentage (0-100) on town map
  y: number; // percentage (0-100) on town map
  entranceNodeId: string;
  accentColor: string;
  glassGradient: string;
}

export interface TutorialProgress {
  characterConfirmed: boolean;
  welcomeConversationDone: boolean;
  profileExplored: boolean;
  bagExplored: boolean;
  missionTrackerExplored: boolean;
  settingsExplored: boolean;
  buildingsDiscovered: BuildingId[];
  movementCompleted: boolean;
  hqSelected: boolean;
  tutorialCompleted: boolean;
}

export interface GameSettings {
  soundEffects: boolean;
  backgroundMusic: boolean;
  dialogueNarration: boolean;
  subtitles: boolean;
  textSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'badges' | 'collectibles' | 'mission-items' | 'special-rewards';
  description: string;
}

export interface InventoryState {
  badges: InventoryItem[];
  collectibles: InventoryItem[];
  missionItems: InventoryItem[];
  specialRewards: InventoryItem[];
}

export interface AvatarPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  nodeId: string;
}

export type Screen03StageId =
  | 'entrance'
  | 'welcome'
  | 'briefing'
  | 'video'
  | 'problem'
  | 'decision'
  | 'decision-feedback'
  | 'safety-intro'
  | 'safety-rules'
  | 'knowledge-check'
  | 'completion'
  | 'unlock-red-flag';

export interface Screen03Progress {
  hqEntered: boolean;
  missionBriefingCompleted: boolean;
  videoCompleted: boolean;
  problemIdentified: boolean;
  decisionChoice: 'yes' | 'no' | null;
  decisionCompleted: boolean;
  safetyIntroDone: boolean;
  rulesCompleted: {
    rule1: boolean;
    rule2: boolean;
    rule3: boolean;
  };
  knowledgeCheckCompleted: boolean;
  inductionCompleted: boolean;
  redFlagCentreUnlocked: boolean;
  currentStage: Screen03StageId;
}

export type Screen04StageId =
  | 'arrival'
  | 'welcome'
  | 'learning-corner'
  | 'computer-intro'
  | 'email-investigation'
  | 'knowledge-check'
  | 'completion'
  | 'unlock-aina';

export type Screen04ClueId =
  | 'unknown-sender'
  | 'unexpected-prize'
  | 'urgent-deadline'
  | 'suspicious-link'
  | 'personal-info';

export interface Screen04KnowledgeAttempt {
  firstChoiceIdx: number | null;
  firstCorrect: boolean;
  attempts: number;
  completed: boolean;
}

export interface Screen04Progress {
  enteredCentre: boolean;
  learningExamplesExplored: {
    example1: boolean;
    example2: boolean;
    example3: boolean;
  };
  discoveredClues: Screen04ClueId[];
  missedInspectionClicks: number;
  hintsUsed: number;
  knowledgeAttempts: Record<string, Screen04KnowledgeAttempt>;
  firstAttemptScore: number;
  masteryAchieved: boolean;
  activityCompleted: boolean;
  ainasHouseUnlocked: boolean;
  currentStage: Screen04StageId;
}

export type Screen05StageId =
  | 'arrival'
  | 'house-layout'
  | 'bedroom-entry'
  | 'meet-aina'
  | 'reading-investigation'
  | 'transition-writing'
  | 'writing-activity'
  | 'thank-you'
  | 'case-closed'
  | 'unlock-cafe';

export interface Screen05ReadingResponse {
  questionNumber: number;
  firstAnswer: string;
  finalCorrectAnswer: string;
  attemptCount: number;
  firstAttemptCorrect: boolean;
}

export interface Screen05WritingResponses {
  adviceSeekingQuestion: string;
  adviceGivingMessage: string;
  adviceResponseMessage: string;
  writingFeedback: string[];
  submitted: boolean;
}

export interface Screen05Progress {
  enteredAinasHouse: boolean;
  exploredHouseLayout: boolean;
  wrongRoomAttempts: string[];
  foundAinasRoom: boolean;
  enteredAinasRoom: boolean;
  readCaseFile: boolean;
  readingResponses: Screen05ReadingResponse[];
  firstAttemptScore: number;
  readingCompleted: boolean;
  writingResponses: Screen05WritingResponses;
  writingCompleted: boolean;
  activityCompleted: boolean;
  cyberCafeUnlocked: boolean;
  currentStage: Screen05StageId;
}

export type Screen06StageId =
  | 'exterior'
  | 'interior-explore'
  | 'meet-byte'
  | 'seat-select'
  | 'workstation-ready'
  | 'investigation'
  | 'part-c-action'
  | 'part-d-challenge'
  | 'completion'
  | 'unlock-advice';

export type Screen06Classification = 'safe' | 'suspicious' | 'need-more-info';

export interface Screen06CaseAttempt {
  caseId: number;
  firstChoice: Screen06Classification | null;
  firstCorrect: boolean;
  attempts: number;
  completed: boolean;
  inspectedFields: string[];
}

export interface Screen06ChallengeAttempt {
  challengeId: string;
  firstChoice: Screen06Classification | null;
  firstCorrect: boolean;
  attempts: number;
  completed: boolean;
}

export interface Screen06Progress {
  enteredCafe: boolean;
  selectedSeatId: string | null;
  casesCompleted: number[];
  caseAttempts: Record<string, Screen06CaseAttempt>;
  partCChoice: string | null;
  partCCompleted: boolean;
  miniChallengeCompleted: boolean;
  challengeAttempts: Record<string, Screen06ChallengeAttempt>;
  firstAttemptCasesScore: number;
  badgeAwarded: boolean;
  activityCompleted: boolean;
  adviceCentreUnlocked: boolean;
  currentStage: Screen06StageId;
}

export type Screen07StageId =
  | 'exterior'
  | 'interior-explore'
  | 'pusheen-intro'
  | 'learning-corner'
  | 'scenario-intro'
  | 'mission-1'
  | 'mission-2'
  | 'mission-3'
  | 'complete-chat'
  | 'self-check'
  | 'completion';

export interface Screen07WritingPortfolio {
  mission1Asking: string;
  mission2Giving: string;
  mission3Responding: string;
  feedbackNotes: string[];
  evaluatedByAi: boolean;
  submittedAt: number;
}

export interface Screen07Progress {
  enteredAdviceCentre: boolean;
  learningCardsExplored: {
    card1: boolean;
    card2: boolean;
    card3: boolean;
  };
  writingPortfolio: Screen07WritingPortfolio;
  selfCheck: {
    askAdvice: boolean;
    giveAdvice: boolean;
    respondAdvice: boolean;
  };
  activityCompleted: boolean;
  gameArcadeUnlocked: boolean;
  currentStage: Screen07StageId;
}

export type Screen08StageId =
  | 'exterior'
  | 'interior-explore'
  | 'welcome-dialogue'
  | 'find-daniel'
  | 'daniel-problem'
  | 'assessment-intro'
  | 'reading-assessment'
  | 'results'
  | 'completion';

export type Screen08AnswerKey = 'A' | 'B' | 'C' | 'D';

export interface Screen08QuestionResponse {
  questionNumber: number;
  firstAnswer: Screen08AnswerKey | null;
  firstAttemptCorrect: boolean;
  selectedAnswer: Screen08AnswerKey | null;
  isCorrect: boolean;
  attemptCount: number;
  explanation?: string;
  evidenceExcerpt?: string;
}

export interface Screen08Progress {
  enteredArcade: boolean;
  welcomeDialogueDone: boolean;
  findDanielWrongClicks: number;
  starsDeductedInSearch: number;
  danielFound: boolean;
  assessmentStarted: boolean;
  assessmentCompleted: boolean;
  officialFirstAttemptSubmitted: boolean;
  firstAttemptScore: number;
  bestScore: number;
  lo1ReadingAchieved: boolean;
  responses: Screen08QuestionResponse[];
  badgeAwarded: boolean;
  digitalSafeGardenUnlocked: boolean;
  currentStage: Screen08StageId;
}

export type Screen09StageId =
  | 'exterior'
  | 'welcome-dialogue'
  | 'scene-01-advice'
  | 'scene-02-traffic-light'
  | 'scene-03-reflection'
  | 'scene-04-promise-tree'
  | 'passport-complete';

export interface Screen09Progress {
  enteredGarden: boolean;
  welcomeDialogueDone: boolean;
  adviceOriginal: {
    task1Should: string;
    task2Shouldnt: string;
    task3Optional: string;
  };
  adviceFinal: {
    task1Should: string;
    task2Shouldnt: string;
    task3Optional: string;
  };
  adviceChecklist: {
    gaveGoodAdvice: boolean;
    usedShouldOrShouldnt: boolean;
    advisedAdult: boolean;
    warnedClickOrPassword: boolean;
  };
  adviceCompleted: boolean;
  trafficLightExplored: {
    redStop: boolean;
    yellowCheck: boolean;
    greenDecide: boolean;
  };
  trafficLightCompleted: boolean;
  reflectionSelected: string[];
  reflectionCompleted: boolean;
  promiseOriginal: {
    nextTimeOnline: string;
    redFlagRemember: string;
  };
  promiseFinal: {
    nextTimeOnline: string;
    redFlagRemember: string;
  };
  promiseMade: boolean;
  passportCompleted: boolean;
  badgeAwarded: boolean;
  finalCeremonyUnlocked: boolean;
  completedAt: number;
  currentStage: Screen09StageId;
}

export type Lo2AssessmentStatus = 'awaiting' | 'achieved' | 'not-yet-achieved';

export interface TeacherLo2Assessment {
  status: Lo2AssessmentStatus;
  comments: string;
  reviewedBy: string;
  reviewedAt: number;
}

export interface Screen10Progress {
  reunionDialogueDone: boolean;
  ceremonyCompleted: boolean;
  certificateViewed: boolean;
  completedAt: number;
}

export interface CertificateRecord {
  issued: boolean;
  lastUpdatedAt: number;
  activitiesCompletedCount: number;
  badgesCount: number;
  lo1Score: number;
  lo1Achieved: boolean;
  lo2Status: Lo2AssessmentStatus;
  uploadedFileDataUrl?: string;
  uploadedFileName?: string;
  uploadedAt?: number;
  hasUploadedFile?: boolean;
}

export interface StudentGameState {
  detectiveNickname: string;
  avatarConfig: AvatarConfig | null;
  tutorialProgress: TutorialProgress;
  screen03Progress?: Screen03Progress;
  screen04Progress?: Screen04Progress;
  screen05Progress?: Screen05Progress;
  screen06Progress?: Screen06Progress;
  screen07Progress?: Screen07Progress;
  screen08Progress?: Screen08Progress;
  screen09Progress?: Screen09Progress;
  screen10Progress?: Screen10Progress;
  teacherLo2Assessment?: TeacherLo2Assessment;
  certificateRecord?: CertificateRecord;
  settings: GameSettings;
  inventory: InventoryState;
  xp: number;
  stars: number;
  level: number;
  currentMission: string;
  completedMissions: string[];
  unlockedBuildings: BuildingId[];
  lastPosition: AvatarPosition;
  lastScene:
    | 'customisation'
    | 'cinematic'
    | 'town'
    | 'screen-03-handoff'
    | 'screen-04-handoff'
    | 'screen-05-handoff'
    | 'screen-06-handoff'
    | 'screen-07-handoff'
    | 'screen-08-handoff'
    | 'screen-09-handoff'
    | 'screen-10-handoff';
  updatedAt: number;
}

export type DialogueCharacterId =
  | 'pusheen'
  | 'player'
  | 'aina'
  | 'daniel'
  | 'byte'
  | 'teacher-chelsea'
  | 'ainas-mother';

export type DialogueExpression =
  | 'happy'
  | 'curious'
  | 'thinking'
  | 'surprised'
  | 'excited'
  | 'worried'
  | 'encouraging'
  | 'celebrating';

export interface DialogueChoice {
  id: string;
  label: string;
}

export interface DialogueStep {
  id: string;
  speaker: DialogueCharacterId;
  speakerName?: string;
  expression: DialogueExpression;
  text: string;
  choices?: DialogueChoice[];
}

export type SaveSyncStatus = 'idle' | 'saving' | 'saved' | 'offline';
