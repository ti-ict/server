/*
  Warnings:

  - You are about to drop the column `allowedVms` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "allowedVms",
ALTER COLUMN "allowedRam" SET DEFAULT 0;
