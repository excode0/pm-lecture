import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ GET: Ambil Dosen berdasarkan ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const dosenID = parseInt(id);
    const dosen = await prisma.dosen.findUnique({
      where: { id: dosenID },
    });
    return NextResponse.json(dosen);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data user' },
      { status: 500 },
    );
  }
}

// ✅ PATCH: Update sebagian data user berdasarkan ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const dosenID = parseInt(params.id, 10);
    if (isNaN(dosenID)) {
      return NextResponse.json({ error: 'Invalid dosen ID' }, { status: 400 });
    }

    const updateData = await req.json();
    const updatedDosen = await prisma.dosen.update({
      where: { id: dosenID },
      data: updateData,
    });

    return NextResponse.json(updatedDosen, { status: 200 });
  } catch (error) {
    console.error('PATCH Error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    );
  }
}

// ✅ PUT: Update semua data user berdasarkan ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const dosenID = parseInt(params.id, 10);
    if (isNaN(dosenID)) {
      return NextResponse.json({ error: 'Invalid dosen ID' }, { status: 400 });
    }

    const { nama, email, nidn, mataKuliah, prodi, jabatan, status } =
      await req.json();
    if (!nama || !email || !nidn || !status) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      );
    }

    const updatedDosen = await prisma.dosen.update({
      where: { id: dosenID },
      data: { nama, email, nidn, mataKuliah, prodi, jabatan, status },
    });

    return NextResponse.json(updatedDosen, { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update dosen' },
      { status: 500 },
    );
  }
}

// ✅ DELETE: Hapus dosen berdasarkan ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const dosenID = parseInt(params.id, 10);
    if (isNaN(dosenID)) {
      return NextResponse.json({ error: 'Invalid Dosen ID' }, { status: 400 });
    }

    await prisma.dosen.delete({ where: { id: dosenID } });

    return NextResponse.json(
      { message: 'Dosen deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete dosen' },
      { status: 500 },
    );
  }
}
