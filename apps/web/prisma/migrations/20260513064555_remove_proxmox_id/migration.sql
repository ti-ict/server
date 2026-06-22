/*
  Warnings:

  - The primary key for the `Vm` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `proxmoxId` on the `Vm` table. All the data in the column will be lost.
  - Changed the type of `id` on the `Vm` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Vm" DROP CONSTRAINT "Vm_pkey",
DROP COLUMN "proxmoxId",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Vm_pkey" PRIMARY KEY ("id");
