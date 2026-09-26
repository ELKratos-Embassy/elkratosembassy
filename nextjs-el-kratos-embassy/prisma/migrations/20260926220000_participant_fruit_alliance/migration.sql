ALTER TABLE "quiz_participants" ADD COLUMN "fruitAlliance" TEXT;

-- White first, so Emmanuel Ayomide is not later read as gold Ayomide.
UPDATE "quiz_participants"
SET "fruitAlliance" = 'white'
WHERE name ILIKE '%Emmanuel%' OR name ILIKE '%John%' OR name ILIKE '%Matthew%';

UPDATE "quiz_participants"
SET "fruitAlliance" = 'crimson'
WHERE name ILIKE '%Ezekiel%' OR name ILIKE '%Esther%' OR name ILIKE '%Perfection%' OR name ILIKE '%Alice%';

UPDATE "quiz_participants"
SET "fruitAlliance" = 'gold'
WHERE "fruitAlliance" IS NULL
  AND (name ILIKE '%Elizabeth%' OR name ILIKE '%Ayomide%');
