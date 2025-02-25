import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// GET: Ambil semua user
export async function GET() {
  try {
    const kriterias = await prisma.kriteria.findMany();
    return NextResponse.json(kriterias);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data kriteria' },
      { status: 500 },
    );
  }
}

// POST: Tambah kriteria baru
export async function POST(req: Request) {
  const { nama, keterangan, bobot } = await req.json();

  // Cek apakah nama sudah digunakan
  const existingkriteria = await prisma.kriteria.findUnique({
    where: { nama },
  });
  if (existingkriteria) {
    return NextResponse.json(
      { error: 'Kriteria already exists' },
      { status: 400 },
    );
  }

  // Simpan user baru
  const newkriteria = await prisma.kriteria.create({
    data: { nama, keterangan, bobot },
  });

  return NextResponse.json({
    message: 'Kriteria created',
    kriteria: newkriteria,
  });
}
