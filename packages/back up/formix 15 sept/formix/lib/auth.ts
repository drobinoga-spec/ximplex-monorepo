import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "./supabaseClient";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          throw new Error("Invalid credentials");
        }

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || "User",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { auth } = NextAuth(authOptions);
