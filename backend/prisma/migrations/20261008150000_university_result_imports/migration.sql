CREATE TABLE "ResultImport" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileHash" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordCount" INTEGER NOT NULL,
    "studentCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IMPORTED',
    CONSTRAINT "ResultImport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UniversityResult" (
    "id" TEXT NOT NULL,
    "resultImportId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentIdNormalized" TEXT NOT NULL,
    "studentName" TEXT,
    "courseCode" TEXT,
    "courseTitle" TEXT,
    "credits" DOUBLE PRECISION NOT NULL,
    "marks" DOUBLE PRECISION,
    "grade" TEXT NOT NULL,
    "gradePoint" DOUBLE PRECISION NOT NULL,
    "semester" TEXT,
    "academicYear" TEXT,
    "gpa" DOUBLE PRECISION,
    "cgpa" DOUBLE PRECISION,
    CONSTRAINT "UniversityResult_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ResultImport_fileHash_key" ON "ResultImport"("fileHash");
CREATE INDEX "ResultImport_uploadedAt_idx" ON "ResultImport"("uploadedAt");
CREATE INDEX "UniversityResult_resultImportId_studentIdNormalized_idx" ON "UniversityResult"("resultImportId", "studentIdNormalized");

ALTER TABLE "ResultImport" ADD CONSTRAINT "ResultImport_uploadedById_fkey"
    FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UniversityResult" ADD CONSTRAINT "UniversityResult_resultImportId_fkey"
    FOREIGN KEY ("resultImportId") REFERENCES "ResultImport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
