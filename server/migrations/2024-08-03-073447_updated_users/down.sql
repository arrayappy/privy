-- This file should undo anything in `up.sql`

CREATE TABLE "usernames"(
	"user_addr" VARCHAR NOT NULL PRIMARY KEY,
	"user_name" VARCHAR NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL,
	"secret" VARCHAR NOT NULL
);

DROP TABLE IF EXISTS "users";
