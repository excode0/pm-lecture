-- DropForeignKey
ALTER TABLE "Penilaian" DROP CONSTRAINT "Penilaian_dosenId_fkey";

-- DropForeignKey
ALTER TABLE "Penilaian" DROP CONSTRAINT "Penilaian_subKriteriaId_fkey";

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "Dosen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_subKriteriaId_fkey" FOREIGN KEY ("subKriteriaId") REFERENCES "SubKriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
