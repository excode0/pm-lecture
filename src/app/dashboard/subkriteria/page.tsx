'use client';

import { useState, useEffect } from 'react';
import { FaUserEdit, FaTrash, FaPlus } from 'react-icons/fa';
import SideBar from '../component/sidebar';
import { useRouter } from 'next/navigation';

export default function SubKriteriaPage() {
  const [subKriteria, setSubKriteria] = useState<ISubKriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSubKriteriaID, setDeleteSubKriteriaID] = useState<number | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetch('/api/subkriteria')
      .then((res) => res.json())
      .then((data) => {
        setSubKriteria(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async () => {
    if (!deleteSubKriteriaID) return;
    setIsDeleting(true);

    try {
      await fetch(`/api/subkriteria/${deleteSubKriteriaID}`, {
        method: 'DELETE',
      });
      setSubKriteria(
        subKriteria.filter((item) => item.id !== deleteSubKriteriaID),
      );
    } catch (error) {
      console.error('Gagal menghapus Sub Kriteria:', error);
    } finally {
      setIsDeleting(false);
      setDeleteSubKriteriaID(null);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <SideBar />
      {/* Content */}
      <main className='flex-1 p-6'>
        <h1 className='text-2xl font-bold mb-4'>Manajemen Sub Kriteria</h1>
        <button
          onClick={() => router.push('/dashboard/subkriteria/add')}
          className='mb-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2'
        >
          <FaPlus /> Tambah Sub Kriteria
        </button>
        <div className='bg-white p-4 rounded shadow-md'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 border'>Kriteria</th>
                  <th className='p-2 border'>Nama</th>
                  <th className='p-2 border'>Keterangan</th>
                  <th className='p-2 border'>Nilai</th>
                  <th className='p-2 border'>Target</th>
                  <th className='p-2 border'>Tipe</th>
                  <th className='p-2 border'>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {subKriteria.map((item) => (
                  <tr key={item?.id} className='text-center'>
                    <td className='p-2 border text-start'>
                      {item?.kriteria?.nama}
                    </td>
                    <td className='p-2 border text-start'>{item?.nama}</td>
                    <td className='p-2 border text-start'>
                      {item?.keterangan || '-'}
                    </td>
                    <td className='p-2 border'>{item?.nilai}</td>
                    <td className='p-2 border'>{item?.target}</td>
                    <td className='p-2 border'>{item?.tipe}</td>
                    <td className='p-2 border flex justify-center gap-2'>
                      <button
                        onClick={() =>
                          router.push('/dashboard/subkriteria/' + item.id)
                        }
                        className='bg-yellow-500 text-white p-2 rounded'
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        className='bg-red-600 text-white p-2 rounded'
                        onClick={() => {
                          setDeleteSubKriteriaID(item.id);
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
      {deleteSubKriteriaID !== null && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-semibold'>Konfirmasi Hapus</h2>
            <p className='mt-2 text-gray-600'>
              Apakah Anda yakin ingin menghapus sub kriteria ini?
            </p>
            <div className='mt-4 flex justify-end gap-3'>
              <button
                className='bg-gray-300 px-4 py-2 rounded'
                onClick={() => setDeleteSubKriteriaID(null)}
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
