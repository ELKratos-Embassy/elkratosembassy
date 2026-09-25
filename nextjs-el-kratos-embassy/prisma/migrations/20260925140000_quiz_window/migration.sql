-- AlterTable
ALTER TABLE "quiz_settings" ADD COLUMN "opensAt" TIMESTAMP(3),
ADD COLUMN "closesAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "quiz_progress" (
    "id" SERIAL NOT NULL,
    "membershipId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answers" JSONB NOT NULL,
    "questionIndex" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quiz_progress_batch_idx" ON "quiz_progress"("batch");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_progress_membershipId_batch_key" ON "quiz_progress"("membershipId", "batch");
