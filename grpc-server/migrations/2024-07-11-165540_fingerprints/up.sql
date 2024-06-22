-- Your SQL goes here
ALTER TABLE "fingerprints" DROP COLUMN "user_categories";
ALTER TABLE "fingerprints" ADD COLUMN "user_categories" VARCHAR NOT NULL;


