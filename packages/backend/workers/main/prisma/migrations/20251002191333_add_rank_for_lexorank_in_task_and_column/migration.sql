/*
  Warnings:

  - You are about to drop the column `order` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Column" DROP COLUMN "order",
ADD COLUMN     "rank" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "order",
ADD COLUMN     "rank" TEXT NOT NULL DEFAULT '';
