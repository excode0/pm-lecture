'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideBar from '../../component/sidebar';
import toast from 'react-hot-toast';

interface IDosen {
  id: number;
  nama: string;
}

interface ISubKriteria {
  id: number;
  nama: string;
}

export default function TambahPenilaian() {
  const [dosen, setDosen] = useState<IDosen[]>([]);
  const [subKriteria, setSubKriteria] = useState<ISubKriteria[]>([]);
  const [selectedDosen, setSelectedDosen] = useState('');
  const [selectedSubKriteria, setSelectedSubKriteria] = useState('');
  const [nilai, setNilai] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dosenRes, subKriteriaRes] = await Promise.all([
          fetch('/api/dosen'),
          fetch('/api/subkriteria'),
        ]);
        const dosenData = await dosenRes.json();
        const subKriteriaData = await subKriteriaRes.json();
        setDosen(dosenData);
        setSubKriteria(subKriteriaData);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/penilaian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dosenId: selectedDosen,
          subKriteriaId: selectedSubKriteria,
          nilai: parseFloat(nilai),
        }),
      });
      let errorMessage = 'Gagal menambahkan penilaian';
      if (!res.ok) {
        try {
          const errorData = await res.json();
          errorMessage = errorData?.error || errorMessage;
        } catch {
          errorMessage = 'Server tidak merespons dengan benar';
        }

        // console.error('Error Response:', errorMessage);
        toast.error(errorMessage);
        return;
      }

      toast.success('Penilaian berhasil ditambahkan!');
      router.push('/penilaian');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <SideBar />
      <main className='flex-1 p-6'>
        <div className='w-full flex justify-between items-center'>
          <h2 className='text-3xl font-semibold mb-6 text-center text-gray-800'>
            Add Penilaian
          </h2>
          <button
            onClick={() => router.push('../penilaian')}
            className='bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition shadow-md'
          >
            Kembali
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className='bg-white p-6 rounded shadow-md'
        >
          <div className='mb-4'>
            <label className='block text-gray-700'>Dosen</label>
            <select
              value={selectedDosen}
              onChange={(e) => setSelectedDosen(e.target.value)}
              className='w-full p-2 border rounded'
              required
            >
              <option value=''>Pilih Dosen</option>
              {dosen.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700'>Sub Kriteria</label>
            <select
              value={selectedSubKriteria}
              onChange={(e) => setSelectedSubKriteria(e.target.value)}
              className='w-full p-2 border rounded'
              required
            >
              <option value=''>Pilih Sub Kriteria</option>
              {subKriteria.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700'>Nilai</label>
            <input
              type='number'
              value={nilai}
              onChange={(e) => setNilai(e.target.value)}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <button
            type='submit'
            className='bg-blue-600 text-white px-4 py-2 rounded'
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </main>
    </div>
  );
}
