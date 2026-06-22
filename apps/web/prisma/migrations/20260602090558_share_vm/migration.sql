-- CreateTable
CREATE TABLE "shared_vms" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vmId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shared_vms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shared_vms_userId_idx" ON "shared_vms"("userId");

-- CreateIndex
CREATE INDEX "shared_vms_vmId_idx" ON "shared_vms"("vmId");

-- CreateIndex
CREATE UNIQUE INDEX "shared_vms_userId_vmId_key" ON "shared_vms"("userId", "vmId");

-- AddForeignKey
ALTER TABLE "shared_vms" ADD CONSTRAINT "shared_vms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_vms" ADD CONSTRAINT "shared_vms_vmId_fkey" FOREIGN KEY ("vmId") REFERENCES "Vm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
