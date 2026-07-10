/*
  Warnings:

  - A unique constraint covering the columns `[comparisonId,userId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "comparisonId" TEXT,
ALTER COLUMN "blogPostId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "comparisonId" TEXT,
ALTER COLUMN "blogPostId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Comment_comparisonId_idx" ON "Comment"("comparisonId");

-- CreateIndex
CREATE INDEX "Reaction_comparisonId_idx" ON "Reaction"("comparisonId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_comparisonId_userId_key" ON "Reaction"("comparisonId", "userId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison"("id") ON DELETE CASCADE ON UPDATE CASCADE;
