/*
  Warnings:

  - You are about to drop the column `userId` on the `Settles` table. All the data in the column will be lost.
  - Added the required column `owedBy` to the `Settles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owedTo` to the `Settles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Settles" DROP CONSTRAINT "Settles_userId_fkey";

-- AlterTable
ALTER TABLE "Settles" DROP COLUMN "userId",
ADD COLUMN     "owedBy" INTEGER NOT NULL,
ADD COLUMN     "owedTo" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Settles" ADD CONSTRAINT "Settles_owedTo_fkey" FOREIGN KEY ("owedTo") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settles" ADD CONSTRAINT "Settles_owedBy_fkey" FOREIGN KEY ("owedBy") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
