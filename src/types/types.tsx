interface User {
  id: number;
  name: String;
  email: String;
  password: String;
  role: string;
  status: string;
  createdAt: Date;
}
// interfaces.ts

interface IDosen {
  id: number;
  nama: string;
  email: string;
  nidn: string;
  mataKuliah: string;
  prodi: string;
  jabatan: string;
  status: string; // "aktif" atau "tidak aktif"
  createdAt: Date;
  updatedAt: Date;
}

interface IKriteria {
  id: number;
  nama: string;
  keterangan?: string; // Optional karena bisa null
  bobot: number;
  subKriteria?: ISubKriteria[]; // Relasi ke SubKriteria
}

interface ISubKriteria {
  id: number;
  nama: string;
  keterangan?: string;
  nilai: number;
  target: number; // "tinggi", "sedang", "rendah"
  tipe: string; // "benefit" atau "cost"
  kriteriaId: number; // Foreign key ke Kriteria
  kriteria?: IKriteria;
}

interface IPenilaian {
  id: number;
  dosenId: number;
  subKriteriaId: number;
  nilai: number;
  dosen?: IDosen;
  kriteria?: IKriteria;
}
