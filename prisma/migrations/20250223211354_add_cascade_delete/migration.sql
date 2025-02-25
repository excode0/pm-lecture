-- DropForeignKey
ALTER TABLE "SubKriteria" DROP CONSTRAINT "SubKriteria_kriteriaId_fkey";

-- AddForeignKey
ALTER TABLE "SubKriteria" ADD CONSTRAINT "SubKriteria_kriteriaId_fkey" FOREIGN KEY ("kriteriaId") REFERENCES "Kriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
