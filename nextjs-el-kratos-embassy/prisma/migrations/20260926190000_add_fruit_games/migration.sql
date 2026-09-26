-- Fruit Games arena. Local-first; applied to the church database only when asked.

CREATE TABLE "fruit_game_sessions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "revealMode" BOOLEAN NOT NULL DEFAULT false,
    "prize1" TEXT NOT NULL DEFAULT '🏆 Fruit Games 2026 Champions — The Living Epistles',
    "prize2" TEXT NOT NULL DEFAULT '🥈 Walking in the Spirit — Well Done',
    "prize3" TEXT NOT NULL DEFAULT '🥉 The Comeback is Coming 💪',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fruit_game_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "fruit_game_sessions_code_key" ON "fruit_game_sessions"("code");

CREATE TABLE "fruit_game_scores" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "alliance" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fruit_game_scores_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "fruit_game_scores_sessionId_alliance_key" ON "fruit_game_scores"("sessionId", "alliance");

ALTER TABLE "fruit_game_scores"
ADD CONSTRAINT "fruit_game_scores_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "fruit_game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "fruit_game_questions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'buzzer',
    "points" INTEGER NOT NULL DEFAULT 10,
    "doublePoints" BOOLEAN NOT NULL DEFAULT false,
    "timerSeconds" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "openedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fruit_game_questions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "fruit_game_questions_sessionId_order_idx" ON "fruit_game_questions"("sessionId", "order");

ALTER TABLE "fruit_game_questions"
ADD CONSTRAINT "fruit_game_questions_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "fruit_game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "fruit_game_buzz_events" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "alliance" TEXT NOT NULL,
    "memberName" TEXT NOT NULL,
    "buzzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fruit_game_buzz_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "fruit_game_buzz_events_questionId_key" ON "fruit_game_buzz_events"("questionId");

ALTER TABLE "fruit_game_buzz_events"
ADD CONSTRAINT "fruit_game_buzz_events_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "fruit_game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "fruit_game_buzz_events"
ADD CONSTRAINT "fruit_game_buzz_events_questionId_fkey"
FOREIGN KEY ("questionId") REFERENCES "fruit_game_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "fruit_game_know_yourself" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "memberName" TEXT NOT NULL,
    "alliance" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fruit_game_know_yourself_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "fruit_game_know_yourself"
ADD CONSTRAINT "fruit_game_know_yourself_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "fruit_game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "fruit_game_attestations" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "memberName" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fruit_game_attestations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "fruit_game_attestations_sessionId_subjectName_memberName_key"
ON "fruit_game_attestations"("sessionId", "subjectName", "memberName");

ALTER TABLE "fruit_game_attestations"
ADD CONSTRAINT "fruit_game_attestations_sessionId_fkey"
FOREIGN KEY ("sessionId") REFERENCES "fruit_game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
