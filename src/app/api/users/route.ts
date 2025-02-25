import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// GET: Ambil semua user
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data user' },
      { status: 500 },
    );
  }
}

// POST: Tambah user baru
export async function POST(req: Request) {
  const { name, email, password, role, status } = await req.json();

  // Cek apakah email sudah digunakan
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: 'Email already exists' },
      { status: 400 },
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user baru
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, role, status },
  });

  return NextResponse.json({ message: 'User created', user: newUser });
}
