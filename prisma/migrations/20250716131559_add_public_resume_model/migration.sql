-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PublicResume" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicResume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicResume_resumeId_key" ON "PublicResume"("resumeId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicResume_slug_key" ON "PublicResume"("slug");

-- AddForeignKey
ALTER TABLE "PublicResume" ADD CONSTRAINT "PublicResume_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
