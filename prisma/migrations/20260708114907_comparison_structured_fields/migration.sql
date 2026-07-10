-- AlterTable
ALTER TABLE "Comparison" ADD COLUMN     "bestForA" TEXT,
ADD COLUMN     "bestForB" TEXT,
ADD COLUMN     "consA" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "consB" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "prosA" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "prosB" TEXT[] DEFAULT ARRAY[]::TEXT[];
