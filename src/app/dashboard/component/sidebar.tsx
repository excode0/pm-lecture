import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaSpinner,
  FaHome,
  FaUser,
  FaChalkboardTeacher,
  FaDatabase,
  FaFilter,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
const SideBar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <aside className='w-64 bg-[#002147] text-white p-5 space-y-6'>
      <div className='text-center'>
        <img
          src='/img/Logo_Universitas_Adzkia.png'
          alt='Universitas Adzkia Logo'
          className='h-20 mx-auto mb-2'
        />
        <h2 className='text-lg font-bold'>Universitas Adzkia</h2>
      </div>
      <nav className='space-y-4'>
        <a
          href='/dashboard'
          className='flex items-center space-x-3 p-3 rounded hover:bg-[#fcba03] transition'
        >
          <FaHome />
          <span>Dashboard</span>
        </a>
        <a
          href='/dashboard/users'
          className='flex items-center space-x-3 p-3 rounded hover:bg-[#fcba03] transition'
        >
          <FaUser />
          <span>User</span>
        </a>
        <a
          href='/dashboard/dosen'
          className='flex items-center space-x-3 p-3 rounded hover:bg-[#fcba03] transition'
        >
          <FaChalkboardTeacher />
          <span>Dosen</span>
        </a>
        <a
          href='/dashboard/penilaian'
          className='flex items-center space-x-3 p-3 rounded hover:bg-[#fcba03] transition'
        >
          <FaChalkboardTeacher />
          <span>Penilaian</span>
        </a>
        <div className='space-y-2'>
          <p className='text-gray-300 text-sm ml-3'>Metode</p>
          <a
            href='/dashboard/dataset'
            className='flex items-center space-x-3 p-3 rounded hover:bg-[#fcba03] transition'
          >
            <FaDatabase />
            <span>Dataset</span>
          </a>
          <a
            href='/dashboard/kriteria'
            className='flex items-center space-x-3 p-3 rounded hover:bg-[#fcba03] transition'
          >
            <FaFilter />
            <span>Kriteria</span>
          </a>
          <a
            href='/dashboard/subkriteria'
            className='flex items-center space-x-3 p-3 rounded hover:bg-[#fcba03] transition'
          >
            <FaFilter />
            <span>SubKriteria</span>
          </a>
          <a
            href='/dashboard/proses'
            className='flex items-center space-x-3 p-3 rounded hover:bg-[#fcba03] transition'
          >
            <FaCog />
            <span>Proses</span>
          </a>
        </div>
      </nav>
      <button
        onClick={handleLogout}
        className='w-full flex items-center justify-center space-x-2 p-3 mt-4 bg-red-600 rounded hover:bg-red-700 transition'
        disabled={loading}
      >
        {loading ? <FaSpinner className='animate-spin' /> : <FaSignOutAlt />}
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default SideBar;
