import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

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
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان");
        }

        const email = credentials.email.trim().toLowerCase();

        const user = await prisma.user.findFirst({
          where: { 
            email: {
              equals: email,
            }
          },
        });

        if (!user || !user.password) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        if (!user.isActive) {
          throw new Error("حسابك في انتظار الموافقة من المسؤول");
        }

        return {
          id: user.id,
          email: user.email ?? "",
          name: user.name ?? "",
          role: user.role,
          image: user.avatar ?? undefined,
        } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "aqar-crm-super-secret-key-2026-auth",
};

export default authOptions;
