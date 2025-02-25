/*
  Warnings:

  - You are about to drop the column `fakultas` on the `Dosen` table. All the data in the column will be lost.
  - You are about to drop the column `nip` on the `Dosen` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nidn]` on the table `Dosen` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nidn` to the `Dosen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prodi` to the `Dosen` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Dosen_nip_key";

-- AlterTable
ALTER TABLE "Dosen" DROP COLUMN "fakultas",
DROP COLUMN "nip",
ADD COLUMN     "nidn" TEXT NOT NULL,
ADD COLUMN     "prodi" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dosen_nidn_key" ON "Dosen"("nidn");
