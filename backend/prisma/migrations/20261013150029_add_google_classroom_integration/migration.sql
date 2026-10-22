-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "googleClassroomAssignmentId" TEXT,
ADD COLUMN     "googleClassroomCourseId" TEXT,
ADD COLUMN     "googleClassroomUrl" TEXT,
ADD COLUMN     "materials" JSONB,
ADD COLUMN     "source" TEXT DEFAULT 'PORTAL',
ADD COLUMN     "submissionStatus" TEXT;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "googleClassroomCourseId" TEXT;

-- CreateTable
CREATE TABLE "GoogleAccountConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "googleUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accessTokenEncrypted" TEXT NOT NULL,
    "refreshTokenEncrypted" TEXT,
    "tokenType" TEXT NOT NULL DEFAULT 'Bearer',
    "scope" TEXT,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleAccountConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleAccountConnection_userId_key" ON "GoogleAccountConnection"("userId");

-- AddForeignKey
ALTER TABLE "GoogleAccountConnection" ADD CONSTRAINT "GoogleAccountConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
