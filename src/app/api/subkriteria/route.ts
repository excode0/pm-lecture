import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Ambil semua subkriteria
export async function GET() {
  try {
    const subkriteria = await prisma.subKriteria.findMany({
      include: {
        kriteria: true, // Mengambil data kriteria terkait
      },
    });
    return NextResponse.json(subkriteria);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data subkriteria' },
      { status: 500 },
    );
  }
}

// POST: Tambah subkriteria baru
export async function POST(req: Request) {
  try {
    const { nama, keterangan, nilai, target, tipe, kriteriaId } =
      await req.json();
    const kriteriaIdINT = parseInt(kriteriaId);
    // Debug: Log data yang diterima
    console.log('Data diterima:', {
      nama,
      keterangan,
      nilai,
      target,
      tipe,
      kriteriaId,
    });

    // Cek apakah kriteriaId valid
    const existingKriteria = await prisma.kriteria.findUnique({
      where: { id: kriteriaIdINT },
    });

    if (!existingKriteria) {
      return NextResponse.json(
        { error: 'Kriteria tidak ditemukan' },
        { status: 400 },
      );
    }

    // Simpan subkriteria baru
    const newSubKriteria = await prisma.subKriteria.create({
      data: {
        nama,
        keterangan,
        nilai,
        target,
        tipe,
        kriteriaId: kriteriaIdINT,
      },
    });

    return NextResponse.json({
      message: 'Subkriteria berhasil ditambahkan',
      subkriteria: newSubKriteria,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menambahkan subkriteria' },
      { status: 500 },
    );
  }
}

// DELETE: Hapus subkriteria berdasarkan ID
// export async function DELETE(req: Request) {
//   try {
//     const { id } = await req.json();

//     // Cek apakah subkriteria ada
//     const existingSubKriteria = await prisma.subKriteria.findUnique({
//       where: { id },
//     });

//     if (!existingSubKriteria) {
//       return NextResponse.json(
//         { error: 'Subkriteria tidak ditemukan' },
//         { status: 404 },
//       );
//     }

//     // Hapus subkriteria
//     await prisma.subKriteria.delete({
//       where: { id },
//     });

//     return NextResponse.json({ message: 'Subkriteria berhasil dihapus' });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Gagal menghapus subkriteria' },
//       { status: 500 },
//     );
//   }
// }
