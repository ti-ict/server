/*
  Warnings:

  - Changed the type of `proxmoxId` on the `Vm` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Vm" DROP COLUMN "proxmoxId",
ADD COLUMN     "proxmoxId" INTEGER NOT NULL;
