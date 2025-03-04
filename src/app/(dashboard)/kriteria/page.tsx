'use client';

import { useState, useEffect } from 'react';
import { FaUserEdit, FaTrash, FaPlus } from 'react-icons/fa';
import SideBar from '../component/sidebar';
import { useRouter } from 'next/navigation';
export default function KriteriaPage() {
  const [kriteria, setKriteria] = useState<IKriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteKriteriaID, setDeleteKriteriaID] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  useEffect(() => {
    fetch('/api/kriteria')
      .then((res) => res.json())
      .then((data) => {
        setKriteria(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async () => {
    if (!deleteKriteriaID) return;
    setIsDeleting(true);

    try {
      await fetch(`/api/kriteria/${deleteKriteriaID}`, { method: 'DELETE' });
      setKriteria(
        kriteria.filter((kriteria) => kriteria.id !== deleteKriteriaID),
      );
    } catch (error) {
      console.error('Gagal menghapus Kriteria:', error);
    } finally {
      setIsDeleting(false);
      setDeleteKriteriaID(null);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <SideBar />
      {/* Content */}
      <main className='flex-1 p-6'>
        <h1 className='text-2xl font-bold mb-4'>Kriteria Management</h1>
        <button
          onClick={() => router.push('/kriteria/add')}
          className='mb-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2'
        >
          <FaPlus /> Tambah Kriteria
        </button>
        <div className='bg-white p-4 rounded shadow-md'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 border'>Nama</th>
                  <th className='p-2 border'>Keterangan</th>
                  <th className='p-2 border'>Bobot</th>
                  <th className='p-2 border'>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kriteria.map((kriteria) => (
                  <tr key={kriteria?.id} className='text-center'>
                    <td className='p-2 border text-start'>{kriteria?.nama}</td>
                    <td className='p-2 border text-start'>
                      {kriteria?.keterangan}
                    </td>
                    <td className='p-2 border'>{kriteria?.bobot}</td>
                    <td className='p-2 border flex justify-center gap-2'>
                      <button
                        onClick={() => router.push('/kriteria/' + kriteria.id)}
                        className='bg-yellow-500 text-white p-2 rounded'
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        className='bg-red-600 text-white p-2 rounded'
                        onClick={() => {
                          setDeleteKriteriaID(kriteria.id);
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
      {deleteKriteriaID !== null && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-semibold'>Konfirmasi Hapus</h2>
            <p className='mt-2 text-gray-600'>
              Apakah Anda yakin ingin menghapus user ini?
            </p>
            <div className='mt-4 flex justify-end gap-3'>
              <button
                className='bg-gray-300 px-4 py-2 rounded'
                onClick={() => setDeleteKriteriaID(null)}
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
