'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SideBar from '../../component/sidebar';

export default function EditUserPage() {
  const router = useRouter();
  const { edit } = useParams(); // Ambil ID user dari URL
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // if (!id) return; // Pastikan id tersedia sebelum fetch

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${edit}`);
        if (!res.ok) throw new Error('Gagal mengambil data user');

        const user = await res.json();
        console.log('Data user:', user); // Debugging

        setFormData({
          name: user.name || '',
          email: user.email || '',
          role: user.role || '',
          status: user.status || '',
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Terjadi kesalahan!');
        }
      }
    };

    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (
      !formData.name ||
      !formData.email ||
      !formData.role ||
      !formData.status
    ) {
      setError('Semua field harus diisi!');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/users/${edit}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal mengupdate user!');

      router.push('/users');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <SideBar />
      <main className='w-full px-6 py-10 flex flex-col'>
        <div className='w-full flex justify-between items-center'>
          <h2 className='text-3xl font-semibold mb-6 text-center text-gray-800'>
            Edit User
          </h2>
          <button
            onClick={() => router.push('../users')}
            className='bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition shadow-md'
          >
            Kembali
          </button>
        </div>

        <div className='w-full bg-white p-8 rounded-lg shadow-xl'>
          {error && (
            <p className='text-red-600 bg-red-100 border border-red-500 p-2 rounded text-sm mb-4 text-center'>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-gray-700 font-medium'>Nama</label>
              <input
                type='text'
                name='name'
                placeholder='Masukkan Nama'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className='block text-gray-700 font-medium'>Email</label>
              <input
                type='email'
                name='email'
                placeholder='Masukkan Email'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div>
              <label className='block text-gray-700 font-medium'>Role</label>
              <select
                name='role'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white'
                value={formData.role}
                onChange={handleChange}
              >
                <option value='admin'>Admin</option>
                <option value='user'>User</option>
              </select>
            </div>

            <div>
              <label className='block text-gray-700 font-medium'>Status</label>
              <select
                name='status'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white'
                value={formData.status}
                onChange={handleChange}
              >
                <option value='active'>Aktif</option>
                <option value='inactive'>Non-Aktif</option>
              </select>
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed'
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
