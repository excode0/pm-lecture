import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ GET: Ambil kriteria berdasarkan ID

// GET: Ambil semua kriteria
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const kriteriaId = parseInt(id);
    const kriterias = await prisma.kriteria.findUnique({
      where: { id: kriteriaId },
    });
    return NextResponse.json(kriterias);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data kriteria' },
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
    const kriteriaId = parseInt(params.id, 10);
    if (isNaN(kriteriaId)) {
      return NextResponse.json(
        { error: 'Invalid kriteria ID' },
        { status: 400 },
      );
    }

    const updateData = await req.json();
    const updatedkriteria = await prisma.kriteria.update({
      where: { id: kriteriaId },
      data: updateData,
    });

    return NextResponse.json(updatedkriteria, { status: 200 });
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
    const kriteriaId = parseInt(params.id, 10);
    if (isNaN(kriteriaId)) {
      return NextResponse.json(
        { error: 'Invalid kriteria ID' },
        { status: 400 },
      );
    }

    const { nama, keterangan, bobot } = await req.json();
    if (!nama || !keterangan || !bobot) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      );
    }

    const updatedkriteria = await prisma.kriteria.update({
      where: { id: kriteriaId },
      data: { nama, keterangan, bobot },
    });

    return NextResponse.json(updatedkriteria, { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    );
  }
}

// ✅ DELETE: Hapus user berdasarkan ID
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const penilaianID = parseInt(id, 10);
    if (isNaN(penilaianID)) {
      return NextResponse.json(
        { error: 'Invalid penilaian ID' },
        { status: 400 },
      );
    }

    await prisma.penilaian.delete({ where: { id: penilaianID } });

    return NextResponse.json(
      { message: 'penilaian deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete penilaian' },
      { status: 500 },
    );
  }
}
