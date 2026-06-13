import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: {} };
}

const QUICK_LINKS = [
  {
    label: "View Website",
    href: "/",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    ),
    external: false,
  },
  {
    label: "Donorbox Dashboard",
    href: "https://donorbox.org/dashboard",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    ),
    external: true,
  },
  {
    label: "Resend Dashboard",
    href: "https://resend.com/emails",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    ),
    external: true,
  },
];

const STATS = [
  { label: "Programs", value: "4", color: "bg-purple-50 text-[#6D5CAE]" },
  { label: "Active Volunteers", value: "50", color: "bg-purple-50 text-[#6D5CAE]" },
  { label: "Items Donated", value: "6k+", color: "bg-purple-50 text-[#6D5CAE]" },
  { label: "Year Founded", value: "2024", color: "bg-purple-50 text-[#6D5CAE]" },
];

export default function AdminPage() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <>
      <Head>
        <title>Admin | HUG Foundation</title>
      </Head>

      <div
        className="min-h-screen bg-[#f9f8ff] text-[#1d1d1f]"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* Admin navbar */}
        <header className="bg-white border-b border-purple-100 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <Image
              src="/HUGlogo.png"
              alt="HUG Foundation"
              width={36}
              height={36}
              className="rounded"
            />
            <span className="font-semibold text-[#6D5CAE]">
              HUG Foundation — Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-[#6D5CAE] transition hidden sm:block"
            >
              View site →
            </a>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSignOut}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
            >
              Sign Out
            </motion.button>
          </div>
        </header>

        <main className="px-6 md:px-12 lg:px-20 py-12 max-w-5xl mx-auto">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold mb-1">Welcome, Admin 👋</h1>
            <p className="text-gray-500 text-sm">
              HUG Foundation management dashboard
            </p>
          </motion.div>

          {/* Stats */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4 text-[#6D5CAE]">
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map(({ label, value, color }) => (
                <div
                  key={label}
                  className={`rounded-xl p-5 shadow-sm ${color}`}
                >
                  <p className="text-2xl font-bold mb-1">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick links */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-[#6D5CAE]">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {QUICK_LINKS.map(({ label, href, icon, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition border border-purple-50 group"
                >
                  <div className="p-2.5 bg-purple-100 rounded-lg group-hover:bg-[#6D5CAE] transition">
                    <svg
                      className="w-5 h-5 text-[#6D5CAE] group-hover:text-white transition"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      {icon}
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#1d1d1f] group-hover:text-[#6D5CAE] transition">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
