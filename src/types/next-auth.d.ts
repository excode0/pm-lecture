import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Tambahkan ID ke dalam session user
      role: string;
      status: string;
      createdAt: Date;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: Date;
  }
}
