'use client';

import { useState, useEffect } from 'react';
import { FaUserEdit, FaTrash, FaPlus } from 'react-icons/fa';
import SideBar from '../component/sidebar';
import { useRouter } from 'next/navigation';
export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async () => {
    if (!deleteUserId) return;
    setIsDeleting(true);

    try {
      await fetch(`/api/users/${deleteUserId}`, { method: 'DELETE' });
      setUsers(users.filter((user) => user.id !== deleteUserId));
    } catch (error) {
      console.error('Gagal menghapus user:', error);
    } finally {
      setIsDeleting(false);
      setDeleteUserId(null);
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
          onClick={() => router.push('/users/add')}
          className='mb-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2'
        >
          <FaPlus /> Tambah User
        </button>
        <div className='bg-white p-4 rounded shadow-md'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 border'>Nama</th>
                  <th className='p-2 border'>Email</th>
                  <th className='p-2 border'>Role</th>
                  <th className='p-2 border'>Status</th>
                  <th className='p-2 border'>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user?.id} className='text-center'>
                    <td className='p-2 border text-start'>{user?.name}</td>
                    <td className='p-2 border text-start'>{user?.email}</td>
                    <td className='p-2 border'>{user?.role}</td>
                    <td className='p-2 border'>{user?.status}</td>
                    <td className='p-2 border flex justify-center gap-2'>
                      <button
                        onClick={() => router.push('/users/' + user.id)}
                        className='bg-yellow-500 text-white p-2 rounded'
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        className='bg-red-600 text-white p-2 rounded'
                        onClick={() => {
                          setDeleteUserId(user.id);
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
      {deleteUserId !== null && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-xl font-semibold'>Konfirmasi Hapus</h2>
            <p className='mt-2 text-gray-600'>
              Apakah Anda yakin ingin menghapus user ini?
            </p>
            <div className='mt-4 flex justify-end gap-3'>
              <button
                className='bg-gray-300 px-4 py-2 rounded'
                onClick={() => setDeleteUserId(null)}
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
