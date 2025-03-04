'use client';

import { useState, useEffect } from 'react';
import { FaUserEdit, FaTrash, FaPlus } from 'react-icons/fa';
import SideBar from '../component/sidebar';
import { useRouter } from 'next/navigation';

interface IPenilaian {
  id: number;
  dosen: { nama: string };
  subKriteria: { nama: string };
  nilai: number;
}

export default function PenilaianPage() {
  const [penilaian, setPenilaian] = useState<IPenilaian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletePenilaianID, setDeletePenilaianID] = useState<number | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/penilaian');
        if (!res.ok) throw new Error('Gagal mengambil data');
        const data = await res.json();
        setPenilaian(data);
      } catch (err) {
        setError('Gagal memuat data penilaian');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deletePenilaianID) return;
    setIsDeleting(true);

    try {
      await fetch(`/api/penilaian/${deletePenilaianID}`, { method: 'DELETE' });
      setPenilaian((prev) =>
        prev.filter((penilaian) => penilaian.id !== deletePenilaianID),
      );
    } catch (error) {
      console.error('Gagal menghapus penilaian:', error);
    } finally {
      setIsDeleting(false);
      setDeletePenilaianID(null);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <SideBar />

      {/* Content */}
      <main className='flex-1 p-6'>
        <h1 className='text-2xl font-bold mb-4'>Manajemen Penilaian</h1>
        <button
          onClick={() => router.push('/penilaian/add')}
          className='mb-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2'
        >
          <FaPlus /> Tambah Penilaian
        </button>

        <div className='bg-white p-4 rounded shadow-md'>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className='text-red-600'>{error}</p>
          ) : penilaian.length === 0 ? (
            <p className='text-gray-600'>Belum ada data penilaian.</p>
          ) : (
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 border'>Dosen</th>
                  <th className='p-2 border'>Sub Kriteria</th>
                  <th className='p-2 border'>Nilai</th>
                  <th className='p-2 border'>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {penilaian.map((item) => (
                  <TableRow
                    key={item.id}
                    data={item}
                    onDelete={() => setDeletePenilaianID(item.id)}
                    onEdit={() => router.push('/penilaian/' + item.id)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal Konfirmasi Hapus */}
      {deletePenilaianID !== null && (
        <DeleteModal
          onClose={() => setDeletePenilaianID(null)}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

// Komponen untuk baris tabel
function TableRow({
  data,
  onDelete,
  onEdit,
}: {
  data: IPenilaian;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <tr className='text-center'>
      <td className='p-2 border text-start'>{data.dosen.nama}</td>
      <td className='p-2 border text-start'>{data.subKriteria.nama}</td>
      <td className='p-2 border'>{data.nilai}</td>
      <td className='p-2 border flex justify-center gap-2'>
        <button
          onClick={onEdit}
          className='bg-yellow-500 text-white p-2 rounded'
        >
          <FaUserEdit />
        </button>
        <button
          className='bg-red-600 text-white p-2 rounded'
          onClick={onDelete}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

// Komponen untuk modal konfirmasi hapus
function DeleteModal({
  onClose,
  onDelete,
  isDeleting,
}: {
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-xl font-semibold'>Konfirmasi Hapus</h2>
        <p className='mt-2 text-gray-600'>
          Apakah Anda yakin ingin menghapus penilaian ini?
        </p>
        <div className='mt-4 flex justify-end gap-3'>
          <button
            className='bg-gray-300 px-4 py-2 rounded'
            onClick={onClose}
            disabled={isDeleting}
          >
            Batal
          </button>
          <button
            className='bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2'
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
