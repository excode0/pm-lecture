'use client';

import { useState, useEffect } from 'react';
import SideBar from '../component/sidebar';

interface Penilaian {
  id: number;
  dosenId: number;
  subKriteriaId: number;
  nilai: number;
  dosen?: IDosen;
  kriteria?: IKriteria;
  klasifikasi?: string; // Tambahkan field untuk klasifikasi
}

// Fungsi untuk menentukan klasifikasi berdasarkan nilai
const getKlasifikasi = (nilai: number) => {
  if (nilai <= 50) return 'Buruk';
  if (nilai <= 60) return 'Sedang';
  if (nilai <= 75) return 'Cukup';
  if (nilai <= 90.99) return 'Baik';
  return 'Sangat Baik';
};

export default function DatasetPage() {
  const [choiceMethod, setChoiceMethod] = useState('');
  const [dataset, setDataset] = useState<Penilaian[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data penilaian
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/penilaian');
        if (!res.ok) throw new Error('Gagal mengambil dataset');
        let data: Penilaian[] = await res.json();

        // Tambahkan klasifikasi ke setiap data
        data = data.map((item) => ({
          ...item,
          klasifikasi: getKlasifikasi(item.nilai),
        }));

        setDataset(data);
      } catch (error) {
        console.error('Error fetching dataset:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <SideBar />

      {/* Content */}
      <main className='w-full flex flex-col p-6 gap-5'>
        <h1 className='text-2xl font-bold mb-4'>Dataset Management</h1>

        {/* Card Pilihan Metode */}
        <div className='w-full bg-white p-8 rounded-lg shadow-xl flex flex-col gap-5'>
          <div>
            <label className='block font-medium'>Method</label>
            <select
              className='w-full px-3 py-2 border rounded-md'
              value={choiceMethod}
              onChange={(e) => setChoiceMethod(e.target.value)}
            >
              <option value=''>Choice Your Method</option>
              <option value='pm'>Profile Matching</option>
              <option value='available_soon'>Available soon...</option>
            </select>
          </div>

          {/* Dataset berdasarkan pilihan metode */}
          {choiceMethod === '' && (
            <span className='text-gray-500'>Nothing to show up</span>
          )}

          {choiceMethod === 'pm' && (
            <div className='bg-gray-100 p-4 rounded-md'>
              <h2 className='text-lg font-semibold'>
                Profile Matching Dataset
              </h2>
              <form className='space-y-5'>
                <div>
                  <label className='block text-gray-700 font-medium'>
                    Nama
                  </label>
                  <input
                    type='text'
                    name='nama'
                    placeholder='Masukkan Nama'
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                  />
                </div>
              </form>

              {/* Tampilkan Data Penilaian */}
              {loading ? (
                <p className='text-gray-600'>Loading dataset...</p>
              ) : dataset.length > 0 ? (
                <table className='w-full border-collapse border border-gray-300 mt-4'>
                  <thead>
                    <tr className='bg-gray-200'>
                      <th className='border p-2'>#</th>
                      <th className='border p-2'>Dosen ID</th>
                      <th className='border p-2'>Sub Kriteria ID</th>
                      <th className='border p-2'>Nilai</th>
                      <th className='border p-2'>Klasifikasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.map((item, index) => (
                      <tr key={item.id} className='text-center'>
                        <td className='border p-2'>{index + 1}</td>
                        <td className='border p-2'>{item.dosenId}</td>
                        <td className='border p-2'>{item.subKriteriaId}</td>
                        <td className='border p-2'>{item.nilai}</td>
                        <td className='border p-2'>{item.klasifikasi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className='text-gray-500'>Dataset masih kosong.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
