export const SESSION_CODE = "SUNDAY-SEP-27";
export const SESSION_LABEL = "Sunday Fun Day — 27 Sept 2026";

export const ALLIANCES = {
  gold: {
    id: "gold",
    name: "Gold Alliance",
    short: "Gold",
    emoji: "🟡",
    color: "#B8860B",
    colorL: "#FFF8E7",
    colorD: "#7A5C00",
    glow: "rgba(184,134,11,0.45)",
    textColor: "#FFD700",
    bg: "linear-gradient(160deg, #2A1F00 0%, #120C00 100%)",
    members: ["Elizabeth", "Ayomide", "Yunus"],
  },
  crimson: {
    id: "crimson",
    name: "Crimson Alliance",
    short: "Crimson",
    emoji: "🔴",
    color: "#DB154C",
    colorL: "#FFF0F3",
    colorD: "#8E0D32",
    glow: "rgba(219,21,76,0.45)",
    textColor: "#FF6090",
    bg: "linear-gradient(160deg, #2A0010 0%, #120008 100%)",
    members: ["Ezekiel", "Esther", "Perfection", "Alice"],
  },
  white: {
    id: "white",
    name: "White Alliance",
    short: "White",
    emoji: "⚪",
    color: "#C5CAD1",
    colorL: "#F5F5F5",
    colorD: "#3C3C3E",
    glow: "rgba(197,202,209,0.4)",
    textColor: "#F2F2F2",
    bg: "linear-gradient(160deg, #2A2A2A 0%, #101010 100%)",
    members: ["Emmanuel", "John", "Matthew"],
  },
} as const;

export type AllianceId = keyof typeof ALLIANCES;
export type QuestionMode = "buzzer" | "open" | "food";

export const ALLIANCE_IDS = Object.keys(ALLIANCES) as AllianceId[];

export const ALL_MEMBERS: { name: string; alliance: AllianceId }[] = [
  { name: "Yunus", alliance: "gold" },
  { name: "Elizabeth", alliance: "gold" },
  { name: "Ayomide", alliance: "gold" },
  { name: "Ezekiel", alliance: "crimson" },
  { name: "Esther", alliance: "crimson" },
  { name: "Perfection", alliance: "crimson" },
  { name: "Alice", alliance: "crimson" },
  { name: "Emmanuel", alliance: "white" },
  { name: "John", alliance: "white" },
  { name: "Matthew", alliance: "white" },
];

export const QUESTION_MODES: QuestionMode[] = ["buzzer", "open", "food"];

export function getAlliance(id: string) {
  return ALLIANCES[id as AllianceId] ?? null;
}

export function isAllianceId(id: string): id is AllianceId {
  return id in ALLIANCES;
}

export function playNameFor(fullName: string, alliance: AllianceId) {
  const members = [...ALLIANCES[alliance].members].sort((a, b) => b.length - a.length);
  const haystack = fullName.toLowerCase();
  return members.find((member) => haystack.includes(member.toLowerCase())) ?? null;
}

export function isAllianceMember(alliance: string, name: string) {
  const group = getAlliance(alliance);
  if (!group) return false;
  return (group.members as readonly string[]).includes(name.trim());
}

export function stake(points: number, doublePoints: boolean) {
  return points * (doublePoints ? 2 : 1);
}

export interface ActiveQuestion {
  id: string;
  text: string;
  section: string;
  mode: string;
  points: number;
  doublePoints: boolean;
  timerSeconds: number;
  openedAt: string | null;
  options: string[];
  answerIndex: number | null;
}

export interface LockedAnswer {
  alliance: string;
  memberName: string;
  selectedIndex: number;
  answerIndex: number;
  correct: boolean;
  points: number;
}

export interface GameState {
  type: "GAME_STATE" | "NO_SESSION" | "LOADING";
  sessionCode?: string;
  label?: string;
  isLocked?: boolean;
  revealMode?: boolean;
  prize1?: string;
  prize2?: string;
  prize3?: string;
  scores?: Record<string, number>;
  activeQuestion?: ActiveQuestion | null;
  serverNow?: string;
  firstBuzz?: { alliance: string; memberName: string } | null;
  lockedAnswer?: LockedAnswer | null;
  buzzerOpen?: boolean;
  knowYourselfMode?: boolean;
  knowYourselfSubject?: { memberName: string; alliance: string } | null;
  attestationCounts?: { strongly_agree: number; agree: number; not_sure: number } | null;
}
