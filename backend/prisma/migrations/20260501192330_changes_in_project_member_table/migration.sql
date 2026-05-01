/*
  Warnings:

  - You are about to drop the column `role` on the `ProjectMember` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProjectMember_userId_projectId_key";

-- AlterTable
ALTER TABLE "ProjectMember" DROP COLUMN "role";
