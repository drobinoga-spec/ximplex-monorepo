import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const { data: user, error } = await supabase
          .from('profiles')
          .select('id, email, name, subscription_plan, subscription_status, password_hash')
          .eq('email', credentials.email)
          .single();

        if (error || !user) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const passwordValid = await bcrypt.compare(credentials.password, user.password_hash || '');
        if (!passwordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.subscription_plan,
          status: user.subscription_status,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan;
        token.status = (user as any).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).plan = token.plan;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export const auth = handler;

export { handler as GET, handler as POST };