ALTER TABLE "fruit_game_sessions" ALTER COLUMN "prize1" SET DEFAULT 'Fruit Games 2026 Champions — ₦10,000 🎉';
ALTER TABLE "fruit_game_sessions" ALTER COLUMN "prize2" SET DEFAULT 'Walking in the Spirit — ₦6,000 💪';
ALTER TABLE "fruit_game_sessions" ALTER COLUMN "prize3" SET DEFAULT 'The Comeback is Coming — ₦4,000 😊';

UPDATE "fruit_game_sessions"
SET
  "prize1" = 'Fruit Games 2026 Champions — ₦10,000 🎉',
  "prize2" = 'Walking in the Spirit — ₦6,000 💪',
  "prize3" = 'The Comeback is Coming — ₦4,000 😊'
WHERE "prize1" = '🏆 Fruit Games 2026 Champions — The Living Epistles'
  AND "prize2" = '🥈 Walking in the Spirit — Well Done'
  AND "prize3" = '🥉 The Comeback is Coming 💪';
