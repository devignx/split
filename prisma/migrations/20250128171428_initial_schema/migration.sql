/*
  Warnings:

  - A unique constraint covering the columns `[symbol]` on the table `Currency` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Currency_symbol_key" ON "Currency"("symbol");
