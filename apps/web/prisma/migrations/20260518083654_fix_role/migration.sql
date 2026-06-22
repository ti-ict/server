/*
  Warnings:

  - You are about to drop the column `role` on the `account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "account" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
