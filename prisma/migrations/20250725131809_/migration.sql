/*
  Warnings:

  - You are about to drop the column `expectedGradDate` on the `Education` table. All the data in the column will be lost.
  - The `achievements` column on the `Experience` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `achievements` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `startDate` on table `Education` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `Education` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Experience` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `profileName` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserProfile_userId_key";

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "expectedGradDate",
ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "Experience" ALTER COLUMN "location" SET NOT NULL,
DROP COLUMN "achievements",
ADD COLUMN     "achievements" TEXT[];

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "achievements",
ADD COLUMN     "achievements" TEXT[];

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profileName" TEXT NOT NULL;
