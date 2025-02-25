'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SideBar from '../../component/sidebar';

export default function AddKriteriaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '',
    keterangan: '',
    bobot: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    // setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.nama || !formData.keterangan || !formData.bobot) {
      setError('Semua field harus diisi!');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/kriteria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal menambahkan kriteria!');

      router.push('../kriteria'); // Redirect ke halaman user list
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
      {/* Sidebar */}
      <SideBar />
      <main className='w-full px-6 py-10 flex flex-col'>
        <div className='w-full flex justify-between items-center'>
          <h2 className='text-3xl font-semibold mb-6 text-center text-gray-800'>
            Tambah User
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
            {/* Nama */}
            <div>
              <label className='block text-gray-700 font-medium'>Nama</label>
              <input
                type='text'
                name='nama'
                placeholder='Masukkan Nama'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                value={formData.nama}
                onChange={handleChange}
              />
            </div>

            {/* Keterangan */}
            <div>
              <label className='block text-gray-700 font-medium'>
                Keterangan
              </label>
              <textarea
                name='keterangan'
                placeholder='Masukkan Keterangan'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                value={formData.keterangan}
                onChange={handleChange}
                rows={4} // Atur jumlah baris sesuai kebutuhan
              />
            </div>

            {/* Password */}
            <div>
              <label className='block text-gray-700 font-medium'>Bobot</label>
              <input
                type='number'
                name='bobot'
                placeholder='Masukkan bobot'
                step='0.01'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                value={formData.bobot}
                onChange={handleChange}
              />
            </div>

            {/* Tombol Submit */}
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed'
              disabled={loading}
            >
              {loading ? 'Menambahkan...' : 'Tambah kriteria'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
