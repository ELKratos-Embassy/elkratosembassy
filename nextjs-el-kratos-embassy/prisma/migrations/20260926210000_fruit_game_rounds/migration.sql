ALTER TABLE "fruit_game_sessions" ADD COLUMN "defaultTimerSeconds" INTEGER NOT NULL DEFAULT 60;
ALTER TABLE "fruit_game_questions" ADD COLUMN "section" TEXT NOT NULL DEFAULT 'Round';
