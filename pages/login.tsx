import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return { redirect: { destination: "/admin", permanent: false } };
  }
  return { props: {} };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/admin");
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login | HUG Foundation</title>
      </Head>

      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(216,210,255,0.35) 0%, #f9f8ff 60%)",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/HUGlogo.png"
              alt="HUG Foundation"
              width={72}
              height={72}
              className="rounded-xl mb-3"
            />
            <h1 className="text-xl font-bold text-[#6D5CAE]">HUG Foundation</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hugfoundation.org"
                autoComplete="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-[#6D5CAE] text-white py-3 rounded-xl font-semibold hover:bg-[#5a4a99] transition disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            <a href="/" className="text-[#6D5CAE] hover:underline">
              ← Back to website
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
}
