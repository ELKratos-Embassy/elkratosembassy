ALTER TABLE "fruit_game_questions" ADD COLUMN "options" JSONB;
ALTER TABLE "fruit_game_questions" ADD COLUMN "answerIndex" INTEGER;
ALTER TABLE "fruit_game_buzz_events" ADD COLUMN "selectedIndex" INTEGER;
