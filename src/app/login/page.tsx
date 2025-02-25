'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return setError(data.error || 'Login gagal, coba lagi.');

    localStorage.setItem('token', data.token);
    router.push('/dashboard');
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#002147] p-6'>
      <div className='w-full max-w-lg bg-white p-10 rounded-lg shadow-2xl border-t-4 border-[#fcba03]'>
        <div className='flex justify-center mb-6'>
          <img
            src='/img/Logo_Universitas_Adzkia.png'
            alt='Universitas Adzkia Logo'
            className='h-24'
          />
        </div>

        <h2 className='text-2xl font-bold text-[#002147] text-center'>
          Universitas Adzkia
        </h2>
        <p className='text-center text-gray-600 mb-4'>
          Masuk untuk melanjutkan
        </p>

        {error && (
          <p className='text-red-600 bg-red-100 p-2 rounded mt-2'>{error}</p>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-700 font-medium'>Email</label>
            <input
              type='email'
              name='email'
              placeholder='Masukkan email'
              onChange={handleChange}
              required
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fcba03]'
            />
          </div>
          <div>
            <label className='block text-gray-700 font-medium'>Password</label>
            <input
              type='password'
              name='password'
              placeholder='Masukkan password'
              onChange={handleChange}
              required
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fcba03]'
            />
          </div>

          <button
            type='submit'
            className='w-full flex items-center justify-center bg-[#b22222] text-white font-bold py-3 rounded-lg hover:bg-[#a01c1c] transition-all'
            disabled={loading}
          >
            {loading ? <FaSpinner className='animate-spin mr-2' /> : 'Masuk'}
          </button>
        </form>

        <p className='mt-4 text-center text-gray-600'>
          Belum punya akun?{' '}
          <a href='/signup' className='text-[#fcba03] hover:underline'>
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
