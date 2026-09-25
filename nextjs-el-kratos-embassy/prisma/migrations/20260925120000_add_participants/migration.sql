-- CreateTable
CREATE TABLE "quiz_participants" (
    "id" SERIAL NOT NULL,
    "membershipId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quiz_participants_batch_idx" ON "quiz_participants"("batch");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_participants_membershipId_batch_key" ON "quiz_participants"("membershipId", "batch");
