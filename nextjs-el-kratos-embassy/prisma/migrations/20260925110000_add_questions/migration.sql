-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "batch" TEXT NOT NULL,
    "weekLabel" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answerIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questions_batch_order_idx" ON "questions"("batch", "order");

-- CreateIndex
CREATE UNIQUE INDEX "questions_batch_order_key" ON "questions"("batch", "order");
