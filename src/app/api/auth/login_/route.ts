// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const SECRET_KEY = 'your_secret_key'; // Ubah dengan secret key yang aman

// export async function POST(req: Request) {
//   const { email, password } = await req.json();

//   // Cek user di database
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) {
//     return NextResponse.json({ error: 'User not found' }, { status: 404 });
//   }

//   // Verifikasi password
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
//   }

//   // Buat token JWT
//   const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
//     expiresIn: '1h',
//   });
//   console.log('🔥 Token di middleware:', token);

//   return NextResponse.json({ message: 'Login successful', token });
// }
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password diperlukan.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('User tidak ditemukan.');
        }

        const isValidPassword = await compare(
          credentials.password,
          user.password,
        );
        if (!isValidPassword) {
          throw new Error('Password salah.');
        }

        return {
          id: user.id.toString(), // Pastikan ID dikembalikan sebagai string
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔥 JWT Callback - User:', user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      console.log('🔥 JWT Callback - Token:', token);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
