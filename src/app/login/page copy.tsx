'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Something went wrong');

    localStorage.setItem('token', data.token);
    router.push('/dashboard'); // Redirect ke dashboard
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded shadow-md w-96'
      >
        <h2 className='text-xl font-bold mb-4'>Login</h2>
        {error && <p className='text-red-500'>{error}</p>}
        <input
          type='email'
          name='email'
          placeholder='Email'
          onChange={handleChange}
          className='w-full p-2 border rounded mb-2'
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          onChange={handleChange}
          className='w-full p-2 border rounded mb-2'
          required
        />
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 rounded'
        >
          Login
        </button>
      </form>
    </div>
  );
}
