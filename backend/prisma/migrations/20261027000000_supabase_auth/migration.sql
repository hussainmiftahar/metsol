-- Supabase Auth now owns passwords. Link each portal user to its Supabase auth user.
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN "authId" TEXT;
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");
