'use client';

import { useState, useEffect } from 'react';
import SideBar from '../component/sidebar';

interface Penilaian {
  id: number;
  dosenId: number;
  subKriteriaId: number;
  nilai: number;
  klasifikasi?: string;
  gap?: number;
  bobotGap?: number;
  nilaiAkhir?: number;
}

const getKlasifikasi = (nilai: number) => {
  if (nilai <= 50) return 'Buruk';
  if (nilai <= 60) return 'Sedang';
  if (nilai <= 75) return 'Cukup';
  if (nilai <= 90.99) return 'Baik';
  return 'Sangat Baik';
};

// Fungsi untuk menentukan bobot dari gap
const getBobotGap = (gap: number) => {
  const bobotMapping: { [key: number]: number } = {
    '-3': 0,
    '-2': 1,
    '-1': 2,
    '0': 3,
    '1': 4,
    '2': 5,
    '3': 6,
  };
  return bobotMapping[gap] ?? 0;
};

// Nilai ideal untuk setiap sub kriteria
const nilaiIdeal: { [key: number]: number } = {
  1: 90, // Contoh nilai ideal untuk sub-kriteria tertentu
  2: 85,
  3: 80,
};

export default function DatasetPage() {
  const [choiceMethod, setChoiceMethod] = useState('');
  const [dataset, setDataset] = useState<Penilaian[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/penilaian');
        if (!res.ok) throw new Error('Gagal mengambil dataset');
        let data: Penilaian[] = await res.json();

        data = data.map((item) => {
          const gap = (item.nilai ?? 0) - (nilaiIdeal[item.subKriteriaId] ?? 0);
          const bobotGap = getBobotGap(gap);
          return {
            ...item,
            klasifikasi: getKlasifikasi(item.nilai),
            gap,
            bobotGap,
          };
        });

        setDataset(data);
      } catch (error) {
        console.error('Error fetching dataset:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const jsonPMData = JSON.stringify(dataset, null, 2);

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <SideBar />
      <main className='w-full flex flex-col p-6 gap-5'>
        <h1 className='text-2xl font-bold mb-4'>Dataset Management</h1>

        <div className='w-full bg-white p-8 rounded-lg shadow-xl flex flex-col gap-5'>
          <label className='block font-medium'>Method</label>
          <select
            className='w-full px-3 py-2 border rounded-md'
            value={choiceMethod}
            onChange={(e) => setChoiceMethod(e.target.value)}
          >
            <option value=''>Choice Your Method</option>
            <option value='pm'>Profile Matching</option>
          </select>

          {choiceMethod === 'pm' && (
            <div className='bg-gray-100 p-4 rounded-md'>
              <h2 className='text-lg font-semibold'>Profile Matching Result</h2>
              <button
                className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mt-3'
                onClick={() => setShowJson(!showJson)}
              >
                {showJson ? 'Hide JSON' : 'Show JSON'}
              </button>
              {showJson && (
                <pre className='bg-white p-4 border rounded-lg shadow-md text-sm overflow-x-auto mt-3'>
                  {jsonPMData}
                </pre>
              )}
              <table className='w-full border-collapse border border-gray-300 mt-4'>
                <thead>
                  <tr className='bg-gray-200'>
                    <th className='border p-2'>#</th>
                    <th className='border p-2'>Dosen ID</th>
                    <th className='border p-2'>Sub Kriteria ID</th>
                    <th className='border p-2'>Nilai</th>
                    <th className='border p-2'>Gap</th>
                    <th className='border p-2'>Bobot Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.map((item, index) => (
                    <tr key={item.id} className='text-center'>
                      <td className='border p-2'>{index + 1}</td>
                      <td className='border p-2'>{item.dosenId}</td>
                      <td className='border p-2'>{item.subKriteriaId}</td>
                      <td className='border p-2'>{item.nilai}</td>
                      <td className='border p-2'>{item.gap}</td>
                      <td className='border p-2'>{item.bobotGap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
