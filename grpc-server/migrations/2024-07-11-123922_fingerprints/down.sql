-- This file should undo anything in `up.sql`
CREATE TABLE "posts"(
	"id" INT4 NOT NULL PRIMARY KEY,
	"title" VARCHAR NOT NULL,
	"body" TEXT NOT NULL,
	"published" BOOL NOT NULL
);


DROP TABLE IF EXISTS "fingerprints";
