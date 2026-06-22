-- AlterTable
ALTER TABLE "user" ADD COLUMN     "allowedCpus" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "allowedRam" INTEGER NOT NULL DEFAULT 8192,
ADD COLUMN     "allowedVms" INTEGER NOT NULL DEFAULT 5;

-- CreateTable
CREATE TABLE "Vm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "node" TEXT NOT NULL,
    "proxmoxId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "ram" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vm" ADD CONSTRAINT "Vm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
