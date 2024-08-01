-- This file should undo anything in `up.sql`
ALTER TABLE "fingerprints" DROP COLUMN "user_categories";
ALTER TABLE "fingerprints" ADD COLUMN "user_categories" TEXT NOT NULL[];


