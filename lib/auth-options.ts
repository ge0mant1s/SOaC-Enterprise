import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Emails that automatically get admin role on registration/login.
// Reads from ADMIN_EMAILS env var (comma-separated), with a hardcoded fallback.
export const AUTO_ADMIN_EMAILS: string[] = (() => {
  const envVal = process.env.ADMIN_EMAILS ?? '';
  const fromEnv = envVal
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  // Merge with hardcoded fallback to ensure carlos always has admin
  const fallback = ['carlos@soacframe.io'];
  const merged = new Set([...fromEnv, ...fallback]);
  return Array.from(merged);
})();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user?.passwordHash) return null;

          // Block disabled or soft-deleted users
          if (user.status === 'disabled' || user.deletedAt) return null;

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) return null;

          // Auto-promote to admin if email is in ADMIN_EMAILS but role is not admin yet
          const shouldBeAdmin =
            AUTO_ADMIN_EMAILS.includes((user.email ?? '').toLowerCase()) && user.role !== 'admin';

          await prisma.user.update({
            where: { id: user.id },
            data: {
              lastLogin: new Date(),
              ...(shouldBeAdmin ? { role: 'admin' } : {}),
            },
          }).catch(() => { /* non-critical */ });

          const effectiveRole = shouldBeAdmin ? 'admin' : user.role;
          return { id: user.id, email: user.email, name: user.name, role: effectiveRole };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string })?.role ?? 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as { id?: string }).id = token.sub ?? '';
        (session.user as { role?: string }).role = (token.role as string) ?? 'user';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
