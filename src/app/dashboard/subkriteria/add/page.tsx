'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import SideBar from '../../component/sidebar';
import { useRouter } from 'next/navigation';

const subKriteriaSchema = z.object({
  nama: z.string().min(3, 'Nama harus minimal 3 karakter'),
  keterangan: z.string().optional(),
  nilai: z.number().positive('Nilai harus lebih dari 0'),
  target: z.number().positive('Nilai harus lebih dari 0'),
  tipe: z.enum(['benefit/core', 'cost/secondary']),
  kriteriaId: z.string().min(1, 'Kriteria harus dipilih'),
});

export default function AddSubKriteria() {
  const router = useRouter();
  const [kriteriaList, setKriteriaList] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subKriteriaSchema),
  });

  // Ambil daftar kriteria dari backend
  const fetchKriteria = useCallback(async () => {
    try {
      const res = await fetch('/api/kriteria');
      const data = await res.json();
      setKriteriaList(data);
    } catch (error) {
      toast.error('Gagal mengambil data kriteria');
    }
  }, []);

  useEffect(() => {
    fetchKriteria();
  }, [fetchKriteria]);

  // Submit Form
  const onSubmit = async (data: any) => {
    // console.log('data');
    setLoading(true);
    try {
      const res = await fetch('/api/subkriteria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan subkriteria');
      }

      toast.success('Subkriteria berhasil ditambahkan!');
      setValue('nama', '');
      setValue('keterangan', '');
      setValue('nilai', 0);
      setValue('target', 0);
      setValue('tipe', 'cost/secondary');
      setValue('kriteriaId', '');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan yang tidak diketahui');
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
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='block font-medium'>Nama Subkriteria</label>
              <input
                {...register('nama')}
                type='text'
                className='w-full px-3 py-2 border rounded-md'
                placeholder='Masukkan nama'
              />
              {errors.nama && (
                <p className='text-red-500 text-sm'>{errors.nama.message}</p>
              )}
            </div>

            <div>
              <label className='block font-medium'>Keterangan</label>
              <input
                {...register('keterangan')}
                type='text'
                className='w-full px-3 py-2 border rounded-md'
                placeholder='Masukkan keterangan'
              />
            </div>

            <div>
              <label className='block font-medium'>Nilai</label>
              <input
                {...register('nilai', { valueAsNumber: true })}
                type='number'
                className='w-full px-3 py-2 border rounded-md'
                placeholder='Masukkan nilai'
              />
              {errors.nilai && (
                <p className='text-red-500 text-sm'>{errors.nilai.message}</p>
              )}
            </div>

            <div>
              <label className='block font-medium'>Target</label>
              <input
                {...register('target', { valueAsNumber: true })}
                type='number'
                className='w-full px-3 py-2 border rounded-md'
                placeholder='Masukkan target'
              />
              {errors.target && (
                <p className='text-red-500 text-sm'>{errors.target.message}</p>
              )}
            </div>

            <div>
              <label className='block font-medium'>Tipe</label>
              <select
                {...register('tipe')}
                className='w-full px-3 py-2 border rounded-md'
              >
                <option value='benefit/core'>Benefit/Core</option>
                <option value='cost/secondary'>Cost/Secondary</option>
              </select>
            </div>

            <div>
              <label className='block font-medium'>Pilih Kriteria</label>
              <select
                {...register('kriteriaId')}
                className='w-full px-3 py-2 border rounded-md'
              >
                <option value=''>Pilih Kriteria</option>
                {kriteriaList.map((kriteria: any) => (
                  <option key={kriteria.id} value={kriteria.id}>
                    {kriteria.nama}
                  </option>
                ))}
              </select>
              {errors.kriteriaId && (
                <p className='text-red-500 text-sm'>
                  {errors.kriteriaId.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition'
            >
              {loading ? 'Menyimpan...' : 'Tambah Subkriteria'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
