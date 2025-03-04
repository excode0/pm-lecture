import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// GET: Ambil semua user
export async function GET() {
  try {
    const penilaian = await prisma.penilaian.findMany({
      include: {
        subKriteria: true,
        dosen: true,
      },
    });
    console.log(penilaian);
    return NextResponse.json(penilaian);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data kriteria' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { dosenId, subKriteriaId, nilai } = await req.json();

    // Validasi input
    if (!dosenId || !subKriteriaId || nilai === undefined) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 },
      );
    }

    const dosenID = parseInt(dosenId, 10);
    const subKriteriaID = parseInt(subKriteriaId, 10);
    const nilaiFloat = parseFloat(nilai);

    if (isNaN(dosenID) || isNaN(subKriteriaID) || isNaN(nilaiFloat)) {
      return NextResponse.json(
        { error: 'Invalid input format' },
        { status: 400 },
      );
    }

    // Cek apakah penilaian sudah ada
    const existingPenilaian = await prisma.penilaian.findFirst({
      where: { dosenId: dosenID, subKriteriaId: subKriteriaID },
    });

    if (existingPenilaian) {
      return NextResponse.json(
        { error: 'Penilaian sudah ada' },
        { status: 400 },
      );
    }

    // Simpan penilaian baru
    const newPenilaian = await prisma.penilaian.create({
      data: {
        dosenId: dosenID,
        subKriteriaId: subKriteriaID,
        nilai: nilaiFloat,
      },
    });

    return NextResponse.json(
      { message: 'Penilaian berhasil ditambahkan', penilaian: newPenilaian },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan penilaian' },
      { status: 500 },
    );
  }
}
