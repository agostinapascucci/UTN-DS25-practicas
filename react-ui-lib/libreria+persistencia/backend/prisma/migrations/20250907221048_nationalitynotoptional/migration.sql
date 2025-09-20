/*
  Warnings:

  - Made the column `nationality` on table `Author` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Author" ALTER COLUMN "nationality" SET NOT NULL;
