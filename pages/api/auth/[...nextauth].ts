import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = (
          process.env.ADMIN_EMAIL ?? "admin@hugfoundation.org"
        ).trim();
        const adminPassword = process.env.ADMIN_PASSWORD?.trim();

        if (!adminPassword || !credentials) return null;

        const email = credentials.email?.trim().toLowerCase() ?? "";
        const password = credentials.password ?? "";

        // Email is matched case-insensitively; password is exact.
        if (email === adminEmail.toLowerCase() && password === adminPassword) {
          return { id: "admin", name: "Admin", email: adminEmail };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
