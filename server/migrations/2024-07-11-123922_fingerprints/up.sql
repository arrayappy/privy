-- Your SQL goes here
DROP TABLE IF EXISTS "posts";

CREATE TABLE "fingerprints"(
	"id" VARCHAR NOT NULL PRIMARY KEY,
	"user_categories" TEXT[] NOT NULL
);

