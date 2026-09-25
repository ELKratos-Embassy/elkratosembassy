// ═════════════════════════════════════════════════════════════════════════════
// EKE BFC QUIZ — CENTRAL CONFIGURATION
// ═════════════════════════════════════════════════════════════════════════════
// Single source of truth for:
//   1. Starting roster, seeded into quiz_participants → ALLOWED_MEMBERS
//   2. Who can access the results dashboard  → RESULTS_ACCESSORS
//   3. Batch and scoring settings            → CURRENT_BATCH, PASS_MARK, etc.
//
// Server-only. Do not import this file from client components — it contains
// the facilitator passcode. The quiz UI imports questions from quiz-questions.ts.
//
// Cornerstone migration path:
//   - Replace validateMember()   with prisma.member.findUnique({ where: { membershipId } })
//   - Replace validateAccessor() with a session/JWT check against Cornerstone users
//   - The `id` in RESULTS_ACCESSORS maps directly to a Cornerstone userId
//   - No other file needs to change
// ═════════════════════════════════════════════════════════════════════════════

import "server-only";
import { prisma } from "./prisma";
import { CURRENT_BATCH, MARKS_PER_Q, PASS_MARK, TOTAL_MARKS } from "./quiz-public";

export { CURRENT_BATCH, PASS_MARK, MARKS_PER_Q, TOTAL_MARKS };

// ── Allowed participants (Batch 2026A) ────────────────────────────────────────
// Key   = Membership ID (matched case-insensitively, trimmed)
// Value = Canonical display name
export const ALLOWED_MEMBERS: Record<string, string> = {
  "ELKE-2018-4HKY": "Kuranga Elizabeth Adetobi",
  "ELKE-2018-F6VQ": "Atanda Oluwasegun Ezekiel",
  "ELKE-2018-11AS": "Folorunsho Emmanuel Ayomide",
  "ELKE-2018-C7BR": "Kuraga Esther Adepelumi",
  "ELKE-2024-39BZ": "Bamidele Alice Ifedolapo",
  "ELKE-2026-2W9S": "Oluwadamilare Ayomide Augustine",
  "ELKE-2026-0399": "Majolagbe Perfection Ayomipo",
  "ELKE-2026-G9YP": "Popoola John Kenny",
  "ELKE-2026-NHJY": "Popoola Matthew Taiwo",
};

// ── Results dashboard access ──────────────────────────────────────────────────
// id       = stable identifier — maps to Cornerstone userId on migration
// label    = shown in the dashboard header
// passcode = what they type to log in
//
// Set FACILITATOR_PASSCODE in the server environment. There is no fallback.
export const RESULTS_ACCESSORS: ResultsAccessor[] = [
  {
    id: "EKE-USR-0001",
    label: "Pastor Yunus",
    passcode: "",
  },
];

export type ResultsAccessor = {
  id: string;
  label: string;
  passcode: string;
};

export type AllowedMember = {
  membershipId: string;
  name: string;
};

export function normalizeMembershipId(raw: string): string {
  return raw.trim().toUpperCase();
}

export async function validateMember(raw: string): Promise<AllowedMember | null> {
  const key = normalizeMembershipId(raw);
  if (!key) return null;
  const participant = await prisma.quizParticipant.findUnique({
    where: { membershipId_batch: { membershipId: key, batch: CURRENT_BATCH } },
  });
  if (!participant) return null;
  return { membershipId: participant.membershipId, name: participant.name };
}

export function validateAccessor(passcode: unknown): ResultsAccessor | null {
  const expected = process.env.FACILITATOR_PASSCODE?.trim();
  if (!expected || typeof passcode !== "string" || passcode.trim() !== expected) return null;
  const accessor = RESULTS_ACCESSORS.find((item) => item.id === "EKE-USR-0001");
  return accessor ? { ...accessor, passcode: expected } : null;
}
