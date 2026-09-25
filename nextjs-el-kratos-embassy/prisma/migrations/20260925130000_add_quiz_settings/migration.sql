-- CreateTable
CREATE TABLE "quiz_settings" (
    "id" SERIAL NOT NULL,
    "batch" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 45,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quiz_settings_batch_key" ON "quiz_settings"("batch");
