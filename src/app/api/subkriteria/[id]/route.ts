import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Ambil semua Subkriteria
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const subkriteriaId = parseInt(id);
    const subkriterias = await prisma.subKriteria.findUnique({
      where: { id: subkriteriaId },
    });
    return NextResponse.json(subkriterias);
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
    const subkriteriaId = parseInt(params.id, 10);
    if (isNaN(subkriteriaId)) {
      return NextResponse.json(
        { error: 'Invalid kriteria ID' },
        { status: 400 },
      );
    }

    const { nama, keterangan, nilai, target, tipe, kriteriaId } =
      await req.json();
    const updatedsubkriteria = await prisma.subKriteria.update({
      where: { id: subkriteriaId },
      data: {
        nama,
        keterangan,
        nilai,
        target,
        tipe,
        kriteriaId: parseInt(kriteriaId),
      },
    });

    return NextResponse.json(updatedsubkriteria, { status: 200 });
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
    const subkriteriaId = parseInt(params.id, 10);
    if (isNaN(subkriteriaId)) {
      return NextResponse.json(
        { error: 'Invalid kriteria ID' },
        { status: 400 },
      );
    }

    const { nama, keterangan, nilai, target, tipe, kriteriaId } =
      await req.json();
    if (!nama || !keterangan || !nilai) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      );
    }

    const updatedsubkriteria = await prisma.subKriteria.update({
      where: { id: subkriteriaId },
      data: {
        nama,
        keterangan,
        nilai,
        target,
        tipe,
        kriteriaId: parseInt(kriteriaId),
      },
    });

    return NextResponse.json(updatedsubkriteria, { status: 200 });
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
  { params }: { params: { id: string } },
) {
  try {
    const subkriteriaID = parseInt(params.id, 10);
    if (isNaN(subkriteriaID)) {
      return NextResponse.json(
        { error: 'Invalid subkriteria ID' },
        { status: 400 },
      );
    }

    await prisma.subKriteria.delete({ where: { id: subkriteriaID } });

    return NextResponse.json(
      { message: 'subkriteria deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete subkriteria' },
      { status: 500 },
    );
  }
}
