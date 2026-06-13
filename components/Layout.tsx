import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import ContactModal from "@/components/ContactModal";

const Starfield = dynamic(() => import("@/components/Starfield"), {
  ssr: false,
  loading: () => null,
});

interface Props {
  children: React.ReactNode;
  onScrollToSection?: (id: string) => void;
  className?: string;
}

const NAV_SECTIONS = [
  { label: "About", id: "about" },
  { label: "Programs", id: "programs" },
  { label: "Volunteer", id: "volunteer" },
];

const NAV_ROUTES = [
  { label: "Board", href: "/board" },
  { label: "Partners", href: "/partners" },
  { label: "SAT Tutoring", href: "/sat-tutoring" },
];

export default function Layout({ children, onScrollToSection, className }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const isHome = router.pathname === "/";

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y < 50) setShowHeader(true);
      else if (y > lastScrollY.current) setShowHeader(false);
      else setShowHeader(true);
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function navigate(id: string) {
    setMenuOpen(false);
    if (isHome && onScrollToSection) {
      onScrollToSection(id);
    } else {
      router.push(`/#${id}`);
    }
  }

  return (
    <div className={`relative text-[#1d1d1f] ${className ?? ""}`}>
      {/* Continuous cosmic starfield behind everything */}
      <Starfield />

      {/* Glassmorphism Navbar */}
      <AnimatePresence>
        {showHeader && (
          <motion.header
            key="navbar"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-white/30 shadow-sm"
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold text-[#6D5CAE]"
            >
              <Image
                src="/HUGlogo.png"
                alt="HUG Logo"
                width={36}
                height={36}
                className="rounded"
              />
              HUG Foundation
            </Link>

            {/* Desktop nav — center */}
            <nav className="hidden lg:flex items-center gap-5 text-sm absolute left-1/2 -translate-x-1/2">
              {NAV_SECTIONS.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className="hover:text-[#6D5CAE] transition-colors"
                >
                  {label}
                </button>
              ))}
              {NAV_ROUTES.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover:text-[#6D5CAE] transition-colors"
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => setContactOpen(true)}
                className="hover:text-[#6D5CAE] transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Right — Login + Donate */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-[#6D5CAE] hover:underline font-medium"
              >
                Login
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("donate")}
                className="bg-[#6D5CAE] text-white rounded-full px-5 py-1.5 text-sm font-medium shadow-sm"
              >
                Donate Now
              </motion.button>
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden z-50 relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <HiX size={26} /> : <HiMenu size={26} />}
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-12 right-0 w-60 bg-white/95 backdrop-blur-md shadow-xl rounded-xl p-4 flex flex-col gap-3 text-sm border border-white/40"
                  >
                    {NAV_SECTIONS.map(({ label, id }) => (
                      <button
                        key={id}
                        onClick={() => navigate(id)}
                        className="text-left hover:text-[#6D5CAE] transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                    {NAV_ROUTES.map(({ label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-[#6D5CAE] transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setContactOpen(true);
                      }}
                      className="text-left hover:text-[#6D5CAE] transition-colors"
                    >
                      Contact
                    </button>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-[#6D5CAE] transition-colors font-medium"
                    >
                      Login
                    </Link>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("donate")}
                      className="bg-[#6D5CAE] text-white rounded-full px-4 py-2 font-medium text-center"
                    >
                      Donate Now
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Page content — sits above the starfield */}
      <div className="relative z-10">
      <main>{children}</main>

      {/* Premium Footer */}
      <footer
        className="pt-16 pb-8 text-sm"
        style={{ backgroundColor: "rgba(109, 92, 174, 0.07)" }}
      >
        <div className="px-6 md:px-20 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Col 1 — Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/HUGlogo.png"
                  alt="HUG Foundation"
                  width={44}
                  height={44}
                  className="rounded"
                />
                <span className="text-base font-semibold text-[#6D5CAE]">
                  HUG Foundation
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed text-xs mb-4">
                Empowering underserved communities in Henderson, NV through
                education, wellness, and compassionate outreach.
              </p>
              {/* 501c3 badge */}
              <span className="inline-block bg-purple-100 text-[#6D5CAE] text-xs font-medium px-3 py-1 rounded-full">
                501(c)(3) Non-Profit
              </span>
            </div>

            {/* Col 2 — Quick Links */}
            <div>
              <h4 className="font-semibold text-[#6D5CAE] mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_SECTIONS.map(({ label, id }) => (
                  <li key={id}>
                    <button
                      onClick={() => navigate(id)}
                      className="text-gray-600 hover:text-[#6D5CAE] transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
                {NAV_ROUTES.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-gray-600 hover:text-[#6D5CAE] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="text-gray-600 hover:text-[#6D5CAE] transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("donate")}
                    className="text-gray-600 hover:text-[#6D5CAE] transition-colors"
                  >
                    Donate
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 — Connect */}
            <div>
              <h4 className="font-semibold text-[#6D5CAE] mb-4">Connect</h4>
              <ul className="space-y-2 mb-6">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#6D5CAE] transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Instagram
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="text-gray-600 hover:text-[#6D5CAE] transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    Email Us
                  </button>
                </li>
              </ul>
              <p className="text-xs text-gray-500">
                📍 Henderson, NV
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-purple-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>
              © {new Date().getFullYear()} HUG Foundation. All rights reserved.
            </p>
            <p>
              Website designed and built by{" "}
              <a
                href="https://arghyav.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6D5CAE] underline hover:text-[#4b3a8f]"
              >
                Arghya Vyas
              </a>
            </p>
          </div>
        </div>
      </footer>
      </div>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Get in Touch"
      />
    </div>
  );
}
