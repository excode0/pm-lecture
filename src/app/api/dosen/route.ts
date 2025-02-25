import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// GET: Ambil semua dosen
export async function GET() {
  try {
    const dosen = await prisma.dosen.findMany();
    return NextResponse.json(dosen);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data user' },
      { status: 500 },
    );
  }
}

// POST: Tambah dosen baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, email, nidn, mataKuliah, prodi, jabatan, status } = body;

    // Validasi email harus unik
    const existingDosen = await prisma.dosen.findUnique({ where: { email } });
    if (existingDosen) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 },
      );
    }

    // Simpan dosen baru
    const newDosen = await prisma.dosen.create({
      data: { nama, email, nidn, mataKuliah, prodi, jabatan, status },
    });

    return NextResponse.json({
      message: 'Dosen berhasil ditambahkan',
      dosen: newDosen,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menambah dosen' },
      { status: 500 },
    );
  }
}
