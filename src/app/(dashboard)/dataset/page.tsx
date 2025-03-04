'use client';

import { useState, useEffect } from 'react';
import SideBar from '../component/sidebar';
interface SubKriteria {
  tipe: string;
}

interface Penilaian {
  id: number;
  dosenId: number;
  subKriteriaId: number;
  subKriteria: SubKriteria;
  nilai: number;
  klasifikasi?: string;
}

// Fungsi untuk menentukan klasifikasi berdasarkan nilai
const getKlasifikasi = (nilai: number) => {
  if (nilai <= 50) return 'Buruk';
  if (nilai <= 60) return 'Sedang';
  if (nilai <= 75) return 'Cukup';
  if (nilai <= 90.99) return 'Baik';
  return 'Sangat Baik';
};
// Fungsi untuk mengelompokkan data berdasarkan dosenId
const groupByDosen = (data: Penilaian[]) => {
  const groupedData: {
    dosenId: number;
    penilaian: {
      subKriteriaId: number;
      tipe: string;
      nilai: number;
      klasifikasi: string;
    }[];
  }[] = [];

  data.forEach((item) => {
    let existingDosen = groupedData.find((d) => d.dosenId === item.dosenId);

    if (!existingDosen) {
      existingDosen = { dosenId: item.dosenId, penilaian: [] };
      groupedData.push(existingDosen);
    }

    existingDosen.penilaian.push({
      subKriteriaId: item.subKriteriaId,
      tipe: item.subKriteria.tipe,
      nilai: item.nilai,
      klasifikasi: getKlasifikasi(item.nilai),
    });
  });

  return groupedData;
};
export default function DatasetPage() {
  const [choiceMethod, setChoiceMethod] = useState('');
  const [dataset, setDataset] = useState<Penilaian[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupNilai, setSetupNilai] = useState({
    Buruk: 0,
    Sedang: 0,
    Cukup: 0,
    Baik: 0,
    Sangat_Baik: 0,
    bb_cf: 0,
    bb_sf: 0,
  });
  const [showJson, setShowJson] = useState(false);
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
        // console.log(data);
        setDataset(data);
      } catch (error) {
        console.error('Error fetching dataset:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Konversi dataset ke JSON
  const groupedDataset = groupByDosen(dataset);
  const jsonPMData = JSON.stringify(groupedDataset, null, 2);

  // Fungsi untuk menyalin JSON ke clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonPMData);
    alert('JSON copied to clipboard!');
  };

  // Fungsi untuk mengunduh JSON sebagai file
  const downloadJson = () => {
    const blob = new Blob([jsonPMData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dataset.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setSetupNilai({ ...setupNilai, [e.target.name]: parseInt(e.target.value) });
  };
  const showDataTmp = () => {
    console.log(jsonPMData);
    console.log(JSON.stringify(setupNilai));
  };
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

              {/* Tombol Download dan Copy JSON */}

              {/* Tampilkan Data Penilaian */}
              {loading ? (
                <p className='text-gray-600 mt-4'>Loading dataset...</p>
              ) : dataset.length > 0 ? (
                <>
                  {/* Form Input Setup */}
                  <div className='bg-white flex justify-between items-center p-4 shadow-md rounded-lg'>
                    <h2 className='text-lg font-semibold border-l-4 border-red-600 px-3 py-1'>
                      SETUP
                    </h2>
                    <button
                      onClick={showDataTmp}
                      className='bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300'
                    >
                      SAVE DATASET
                    </button>
                  </div>

                  <form
                    //   onSubmit={handleSubmit}
                    className='bg-white p-6 rounded shadow-md flex flex-col gap-2'
                  >
                    <div className='p-2'>
                      <label className='block text-gray-700 font-medium'>
                        Buruk
                      </label>
                      <input
                        type='number'
                        name='Buruk'
                        placeholder='Masukkan Nama'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                        value={setupNilai.Buruk}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='p-2'>
                      <label className='block text-gray-700 font-medium'>
                        Sedang
                      </label>
                      <input
                        type='number'
                        name='Sedang'
                        placeholder='Masukkan Nama'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                        value={setupNilai.Sedang}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='p-2'>
                      <label className='block text-gray-700 font-medium'>
                        Cukup
                      </label>
                      <input
                        type='number'
                        name='Cukup'
                        placeholder='Masukkan Nama'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                        value={setupNilai.Cukup}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='p-2'>
                      <label className='block text-gray-700 font-medium'>
                        Baik
                      </label>
                      <input
                        type='number'
                        name='Baik'
                        placeholder='Masukkan Nama'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                        value={setupNilai.Baik}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='p-2'>
                      <label className='block text-gray-700 font-medium'>
                        Sangat Baik
                      </label>
                      <input
                        type='number'
                        name='Sangat_Baik'
                        placeholder='Masukkan Nama'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                        value={setupNilai.Sangat_Baik}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='p-2'>
                      <label className='block text-gray-700 font-medium'>
                        Bobot Core Factor
                      </label>
                      <input
                        type='number'
                        name='bb_cf'
                        placeholder='Masukkan Nama'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                        value={setupNilai.bb_cf}
                        onChange={handleChange}
                      />
                    </div>
                    <div className='p-2'>
                      <label className='block text-gray-700 font-medium'>
                        Bobot Secondary Factor
                      </label>
                      <input
                        type='number'
                        name='bb_sf'
                        placeholder='Masukkan Nama'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                        value={setupNilai.bb_sf}
                        onChange={handleChange}
                      />
                    </div>
                  </form>

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
                  <div className='flex gap-4 mt-4'>
                    <button
                      className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                      onClick={copyToClipboard}
                    >
                      Copy JSON
                    </button>
                    <button
                      className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
                      onClick={downloadJson}
                    >
                      Download JSON
                    </button>

                    <button
                      className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
                      onClick={() => setShowJson(!showJson)}
                    >
                      {showJson ? 'Hide JSON' : 'Show JSON'}
                    </button>
                  </div>
                  {showJson && (
                    <div className='mt-6 bg-white p-4 border rounded-lg shadow-md'>
                      <h3 className='font-semibold mb-2'>JSON Output:</h3>
                      <pre className='bg-gray-50 p-3 border rounded-lg text-sm overflow-x-auto'>
                        {jsonPMData}
                      </pre>
                    </div>
                  )}
                  {/* Tampilkan JSON dalam Box */}
                  {/* <div className='mt-6 bg-white p-4 border rounded-lg shadow-md'>
                    <h3 className='font-semibold mb-2'>JSON Output:</h3>
                    <pre className='bg-gray-50 p-3 border rounded-lg text-sm overflow-x-auto'>
                      {jsonPMData}
                    </pre>
                  </div> */}
                </>
              ) : (
                <p className='text-gray-500 mt-4'>Dataset masih kosong.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
