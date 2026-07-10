-- DropForeignKey
ALTER TABLE "Comparison" DROP CONSTRAINT "Comparison_brandAId_fkey";

-- DropForeignKey
ALTER TABLE "Comparison" DROP CONSTRAINT "Comparison_brandBId_fkey";

-- AlterTable
ALTER TABLE "Comparison" ADD COLUMN     "itemAName" TEXT,
ADD COLUMN     "itemBName" TEXT,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Comparison',
ALTER COLUMN "brandAId" DROP NOT NULL,
ALTER COLUMN "brandBId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comparison" ADD CONSTRAINT "Comparison_brandAId_fkey" FOREIGN KEY ("brandAId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comparison" ADD CONSTRAINT "Comparison_brandBId_fkey" FOREIGN KEY ("brandBId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
