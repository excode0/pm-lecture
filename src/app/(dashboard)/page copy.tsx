'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/auth/user', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          setUser(data);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-lg'>
        Loading...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <nav className='bg-[#002147] text-white p-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <FaUserCircle className='text-2xl' />
            <span>{user?.name || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center bg-red-500 hover:bg-red-600 px-3 py-2 rounded'
          >
            <FaSignOutAlt className='mr-2' /> Logout
          </button>
        </div>
      </nav>
      <main className='p-6'>
        <h2 className='text-xl font-semibold'>
          Selamat datang, {user?.name || 'User'}!
        </h2>
        <p className='text-gray-600'>Ini adalah halaman dashboard Anda.</p>
      </main>
    </div>
  );
}
