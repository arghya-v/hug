import Image from "next/image";
import Head from "next/head";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Layout from "@/components/Layout";
import SATSignupModal from "@/components/SATSignupModal";

gsap.registerPlugin(ScrollTrigger);

export default function SATTutoring() {
  const [signupOpen, setSignupOpen] = useState(false);

  const featuresRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.querySelectorAll(".feature-card"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 85%",
          },
        }
      );
    }

    if (statRef.current) {
      gsap.fromTo(
        statRef.current.querySelectorAll(".stat-item"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statRef.current,
            start: "top 88%",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Head>
        <title>SAT Tutoring | HUG Foundation</title>
        <meta
          name="description"
          content="Free, high-quality SAT tutoring for underprivileged students. Breaking the income–score barrier with top tutors (1500+ scorers)."
        />
      </Head>

      <Layout>
        {/* ─── HERO ───────────────────────────────────────────────────── */}
        <section className="relative flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-20 pt-32 pb-20 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top left, rgba(216,210,255,0.4) 0%, transparent 55%)",
            }}
          />

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl relative z-10"
          >
            <div className="inline-block px-3 py-1 bg-purple-100 text-[#6D5CAE] font-medium rounded-full text-sm mb-4 shadow-sm">
              Free &amp; High-Quality
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              Free{" "}
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 bg-purple-100 rounded-md -z-10"
                  aria-hidden="true"
                />
                <span className="relative text-[#6D5CAE]">SAT Tutoring</span>
              </span>{" "}
              For Every Student
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              We believe that a student&apos;s SAT score should reflect their
              potential—not their family&apos;s income. That&apos;s why we provide
              personalized, high-quality SAT tutoring completely free of charge.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSignupOpen(true)}
              className="bg-[#6D5CAE] text-white px-7 py-3 rounded-lg shadow-md font-medium"
            >
              Sign Up Now — It&apos;s Free
            </motion.button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-14 lg:mt-0 relative z-10 flex justify-center lg:justify-end w-full lg:w-[42%]"
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-purple-100/70 rounded-2xl z-0" />
              <Image
                src="/sat-students.jpg"
                alt="Students studying for SAT"
                width={480}
                height={380}
                priority
                className="relative z-10 rounded-2xl shadow-2xl object-cover w-[280px] sm:w-[340px] md:w-[400px] lg:w-[440px]"
              />
            </div>
          </motion.div>
        </section>

        {/* ─── ANIMATED STAT ─────────────────────────────────────────── */}
        <section className="space-panel-white backdrop-blur-sm py-14 px-6 md:px-20">
          <div
            ref={statRef}
            className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
          >
            {[
              { value: "1500+", label: "Avg. tutor SAT score" },
              { value: "100%", label: "Free — no hidden costs" },
              { value: "1-on-1", label: "Personalized sessions" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="stat-item p-6 bg-[#f9f8ff] rounded-xl shadow-sm"
              >
                <p className="text-3xl font-bold text-[#6D5CAE] mb-1">
                  {value}
                </p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── INCOME–SCORE ──────────────────────────────────────────── */}
        <section className="px-6 md:px-20 py-20 space-panel backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center mb-4">
            Breaking the{" "}
            <span className="text-[#6D5CAE]">Income–Score Barrier</span>
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Studies show a clear correlation between household income and SAT
            scores. Higher income often means access to costly prep classes and
            private tutoring—leaving low-income students at a disadvantage. We
            are here to change that narrative.
          </p>
        </section>

        {/* ─── HOW WE HELP ───────────────────────────────────────────── */}
        <section className="px-6 md:px-20 py-24 space-panel-white backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center mb-14">
            Our <span className="text-[#6D5CAE]">Tutoring Program</span>
          </h2>

          <div
            ref={featuresRef}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                title: "Top Scorers",
                body: "Every tutor scored 1500+ on the SAT and knows what it takes to excel.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                ),
              },
              {
                title: "Personalized Prep",
                body: "We adapt tutoring to each student's strengths, weaknesses, and goals—no one-size-fits-all.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                ),
              },
              {
                title: "Completely Free",
                body: "Families never pay a cent. Access to quality SAT prep should be a right, not a privilege.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  />
                ),
              },
            ].map(({ title, body, icon }) => (
              <div
                key={title}
                className="feature-card bg-[#f9f8ff] p-7 rounded-xl shadow-sm text-center hover:shadow-md transition border border-purple-50"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-[#6D5CAE]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    {icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ───────────────────────────────────────────────────── */}
        <section className="px-6 md:px-20 py-24 space-panel backdrop-blur-sm text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Boost Your SAT Score?
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re aiming for college scholarships or admissions, our
            tutors are here to help you achieve your goals. Sign up today to
            reserve your spot.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSignupOpen(true)}
            className="bg-[#6D5CAE] text-white px-10 py-4 rounded-xl shadow-lg text-lg font-semibold"
          >
            Sign Up for Free Tutoring
          </motion.button>
        </section>

        <SATSignupModal
          open={signupOpen}
          onClose={() => setSignupOpen(false)}
        />
      </Layout>
    </>
  );
}
