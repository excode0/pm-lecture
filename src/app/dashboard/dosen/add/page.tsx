'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SideBar from '../../component/sidebar';

export default function AddDosenPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nidn: '',
    nama: '',
    email: '',
    mataKuliah: '',
    prodi: '',
    jabatan: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      !formData.nidn ||
      !formData.nama ||
      !formData.email ||
      !formData.prodi ||
      !formData.mataKuliah ||
      !formData.jabatan ||
      !formData.status
    ) {
      setError('Semua field harus diisi!');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/dosen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gagal menambahkan dosen!');

      router.push('../dosen'); // Redirect ke halaman daftar dosen
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
          <h2 className='text-3xl font-semibold mb-6 text-gray-800'>
            Tambah Dosen
          </h2>
          <button
            onClick={() => router.push('../dosen')}
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
            {/* NIDN */}
            <div>
              <label className='block text-gray-700 font-medium'>NIDN</label>
              <input
                type='text'
                name='nidn'
                placeholder='Masukkan NIDN'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                value={formData.nidn}
                onChange={handleChange}
              />
            </div>

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

            {/* Email */}
            <div>
              <label className='block text-gray-700 font-medium'>Email</label>
              <input
                type='email'
                name='email'
                placeholder='Masukkan Email'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Program Studi */}
            <div>
              <label className='block text-gray-700 font-medium'>
                Program Studi
              </label>
              <input
                type='text'
                name='prodi'
                placeholder='Masukkan Program Studi'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                value={formData.prodi}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className='block text-gray-700 font-medium'>
                MataKuliah Diampu
              </label>
              <input
                type='text'
                name='mataKuliah'
                placeholder='Masukkan Program Studi'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                value={formData.mataKuliah}
                onChange={handleChange}
              />
            </div>

            {/* Jabatan */}
            <div>
              <label className='block text-gray-700 font-medium'>Jabatan</label>
              <select
                name='jabatan'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white'
                value={formData.jabatan}
                onChange={handleChange}
              >
                <option value=''>Pilih Jabatan</option>
                <option value='rektor'>Rektor</option>
                <option value='dekan 1'>Dekan 1</option>
                <option value='dekan 2'>Dekan 2</option>
                <option value='dosen'>Dosen</option>
              </select>
            </div>
            {/* Status */}
            <div>
              <label className='block text-gray-700 font-medium'>Status</label>
              <select
                name='status'
                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white'
                value={formData.status}
                onChange={handleChange}
              >
                <option value=''>Pilih Status</option>
                <option value='aktif'>Aktif</option>
                <option value='nonaktif'>Non-Aktif</option>
              </select>
            </div>

            {/* Tombol Submit */}
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed'
              disabled={loading}
            >
              {loading ? 'Menambahkan...' : 'Tambah Dosen'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
