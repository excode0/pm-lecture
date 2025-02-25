'use client';
import { FaChalkboardTeacher, FaDatabase, FaUsers } from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import SideBar from './component/sidebar';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function Dashboard() {
  const barData = {
    labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei'],
    datasets: [
      {
        label: 'Jumlah User',
        data: [50, 80, 100, 120, 150],
        backgroundColor: '#002147',
      },
    ],
  };

  const pieData = {
    labels: ['Mahasiswa', 'Dosen', 'Staff'],
    datasets: [
      {
        data: [300, 50, 20],
        backgroundColor: ['#002147', '#fcba03', '#ff5733'],
      },
    ],
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <SideBar />
      {/* Content */}
      <main className='flex-1 p-6'>
        <h1 className='text-2xl font-bold text-[#002147]'>Dashboard</h1>
        <p className='text-gray-600 mb-6'>
          Selamat datang di Dashboard Universitas Adzkia.
        </p>

        {/* Cards */}
        <div className='grid grid-cols-3 gap-6 mb-6'>
          <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center'>
            <FaUsers className='text-4xl text-[#002147] mb-2' />
            <h3 className='text-lg font-semibold text-[#002147]'>Total User</h3>
            <p className='text-3xl font-bold text-gray-800'>120</p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center'>
            <FaChalkboardTeacher className='text-4xl text-[#002147] mb-2' />
            <h3 className='text-lg font-semibold text-[#002147]'>
              Total Dosen
            </h3>
            <p className='text-3xl font-bold text-gray-800'>35</p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center'>
            <FaDatabase className='text-4xl text-[#002147] mb-2' />
            <h3 className='text-lg font-semibold text-[#002147]'>
              Jumlah Dataset
            </h3>
            <p className='text-3xl font-bold text-gray-800'>200</p>
          </div>
        </div>

        {/* Statistik */}
        <div className='grid grid-cols-2 gap-6'>
          <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
            <h3 className='text-lg font-semibold text-[#002147] mb-4'>
              Grafik Pertumbuhan User
            </h3>
            <Bar data={barData} />
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
            <h3 className='text-lg font-semibold text-[#002147] mb-4'>
              Distribusi Pengguna
            </h3>
            <Pie data={pieData} />
          </div>
        </div>
      </main>
    </div>
  );
}
