-- Your SQL goes here

DROP TABLE IF EXISTS "usernames";
CREATE TABLE "users"(
	"user_addr" VARCHAR NOT NULL PRIMARY KEY,
	"user_name" VARCHAR NOT NULL,
	"password_pubkey" VARCHAR NOT NULL,
	"password_salt" VARCHAR NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"updated_at" TIMESTAMPTZ NOT NULL
);

