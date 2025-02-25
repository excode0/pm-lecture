'use client';

import { useState, useEffect } from 'react';
import { FaUserEdit, FaTrash, FaPlus } from 'react-icons/fa';
import SideBar from '../component/sidebar';
import { useRouter } from 'next/navigation';
export default function DosenPage() {
  const [dosen, setDosen] = useState<IDosen[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDosenId, setDeleteDosenId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  useEffect(() => {
    fetch('/api/dosen')
      .then((res) => res.json())
      .then((data) => {
        setDosen(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async () => {
    if (!deleteDosenId) return;
    setIsDeleting(true);

    try {
      await fetch(`/api/dosen/${deleteDosenId}`, { method: 'DELETE' });
      setDosen(dosen.filter((user) => user.id !== deleteDosenId));
    } catch (error) {
      console.error('Gagal menghapus user:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDosenId(null);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <SideBar />
      {/* Content */}
      <main className='flex-1 p-6'>
        <h1 className='text-2xl font-bold mb-4'>User Management</h1>
        <button
          onClick={() => router.push('/dashboard/dosen/add')}
          className='mb-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2'
        >
          <FaPlus /> Tambah Dosen
        </button>
        <div className='bg-white p-4 rounded shadow-md'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-200'>
                  <th className='border p-2'>Nama</th>
                  <th className='border p-2'>Email</th>
                  <th className='border p-2'>NIP</th>
                  <th className='border p-2'>Mata Kuliah</th>
                  <th className='border p-2'>Fakultas</th>
                  <th className='border p-2'>Jabatan</th>
                  <th className='border p-2'>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dosen.map((dosen: any) => (
                  <tr key={dosen.id} className='text-center'>
                    <td className='border p-2'>{dosen.nama}</td>
                    <td className='border p-2'>{dosen.email}</td>
                    <td className='border p-2'>{dosen.nidn}</td>
                    <td className='border p-2'>{dosen.mataKuliah}</td>
                    <td className='border p-2'>{dosen.prodi}</td>
                    <td className='border p-2'>{dosen.jabatan}</td>
                    <td className='border p-2 flex gap-2 justify-center'>
                      <button
                        onClick={() =>
                          router.push('/dashboard/dosen/' + dosen.id)
                        }
                        className='bg-yellow-500 text-white p-2 rounded'
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        className='bg-red-600 text-white p-2 rounded'
                        onClick={() => {
                          setDeleteDosenId(dosen.id);
                          handleDelete();
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      {/* Modal Konfirmasi Hapus */}
      {deleteDosenId !== null && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-semibold'>Konfirmasi Hapus</h2>
            <p className='mt-2 text-gray-600'>
              Apakah Anda yakin ingin menghapus user ini?
            </p>
            <div className='mt-4 flex justify-end gap-3'>
              <button
                className='bg-gray-300 px-4 py-2 rounded'
                onClick={() => setDeleteDosenId(null)}
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                className='bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2'
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
