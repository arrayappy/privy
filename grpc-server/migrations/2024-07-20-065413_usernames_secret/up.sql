-- Your SQL goes here

-- Step 1: Add the column with a default value
ALTER TABLE "usernames" ADD COLUMN "secret" VARCHAR DEFAULT 'default_value';

-- Step 2: Update existing rows to set non-null values
UPDATE "usernames" SET "secret" = 'default_value' WHERE "secret" IS NULL;

-- Step 3: Alter the column to be non-null
ALTER TABLE "usernames" ALTER COLUMN "secret" SET NOT NULL;
