-- CreateEnum
CREATE TYPE "PermitStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "PermitApplication" (
    "id" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "permitType" TEXT NOT NULL,
    "status" "PermitStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermitApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PermitApplication_status_idx" ON "PermitApplication"("status");

-- CreateIndex
CREATE INDEX "PermitApplication_citizenId_idx" ON "PermitApplication"("citizenId");
