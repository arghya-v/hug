import Image from "next/image";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { readContent } from "@/lib/contentStore";
import { getByPath, type SiteContent } from "@/lib/content";
import Layout from "@/components/Layout";
import VolunteerSection from "@/components/applications&contact";
import ProgramFormModal from "@/components/ProgramFormModal";
import ProgramTabs from "@/components/ProgramTabs";
import GalleryGrid from "@/components/GalleryGrid";
import NebulaDivider from "@/components/NebulaDivider";
import {
  EditableProvider,
  Editable,
  useEditable,
} from "@/components/cms/EditableProvider";

gsap.registerPlugin(ScrollTrigger);

const GlobeScene = dynamic(() => import("@/components/GlobeScene"), {
  ssr: false,
  loading: () => null,
});

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const [content, session] = await Promise.all([
    readContent(),
    getServerSession(ctx.req, ctx.res, authOptions),
  ]);
  return { props: { content, isAdmin: !!session } };
}

/**
 * A stat number that counts up when scrolled into view, but becomes inline
 * editable text for an admin in edit mode (parsing e.g. "6k+" → 6 + "k+").
 */
function StatNumber({ field }: { field: string }) {
  const { content, editing, isAdmin } = useEditable();
  const value = getByPath(content, field);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (editing) return;
    const el = ref.current;
    if (!el) return;
    const match = value.match(/^(\d+)(.*)$/);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!match || reduced) {
      el.textContent = value;
      return;
    }
    const end = parseInt(match[1], 10);
    const suffix = match[2];
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: end,
      duration: 2,
      ease: "power1.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate() {
        el.textContent = Math.round(obj.val) + suffix;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, editing]);

  if (editing && isAdmin) {
    return <Editable as="span" field={field} />;
  }
  return <span ref={ref}>{value}</span>;
}

function HomeContent() {
  const [impact1Open, setImpact1Open] = useState(false);
  const [impact2Open, setImpact2Open] = useState(false);
  const [impact3Open, setImpact3Open] = useState(false);
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [programName, setProgramName] = useState("");

  const volunteerRef = useRef<HTMLElement>(null);
  const aboutValuesRef = useRef<HTMLUListElement>(null);
  const donateCardsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const anyModalOpen =
    impact1Open || impact2Open || impact3Open || programModalOpen;

  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModalOpen]);

  // Pause/hide video when user prefers reduced motion
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.style.display = "none";
    }
  }, []);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      if (aboutValuesRef.current) {
        gsap.fromTo(
          aboutValuesRef.current.querySelectorAll("li"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: aboutValuesRef.current, start: "top 85%" },
          }
        );
        gsap.fromTo(
          aboutValuesRef.current.querySelectorAll(".value-check"),
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            stagger: 0.12,
            ease: "back.out(2)",
            scrollTrigger: { trigger: aboutValuesRef.current, start: "top 85%" },
          }
        );
      }

      if (donateCardsRef.current) {
        gsap.fromTo(
          donateCardsRef.current.querySelectorAll(".impact-card"),
          { opacity: 0, x: 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.13,
            ease: "power2.out",
            scrollTrigger: { trigger: donateCardsRef.current, start: "top 85%" },
          }
        );
      }

    });

    return () => ctx.revert();
  }, []);

  function scrollToSection(id: string) {
    if (id === "volunteer") {
      volunteerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openProgram(program: string) {
    setProgramName(program);
    setProgramModalOpen(true);
  }

  function closeAllModals() {
    setImpact1Open(false);
    setImpact2Open(false);
    setImpact3Open(false);
  }

  return (
    <>
      <Head>
        <title>HUG Foundation</title>
        <meta
          name="description"
          content="Helping Underprivileged Groups — Henderson, NV non-profit empowering communities through education, wellness, and compassionate outreach."
        />
      </Head>

      <Layout onScrollToSection={scrollToSection}>
        {/* ─── HERO (black space) ───────────────────────────────────────── */}
        <section
          id="hero"
          className="relative flex flex-col lg:flex-row items-center justify-between px-6 md:px-10 lg:px-20 min-h-screen pt-24 pb-16 overflow-hidden bg-black"
        >
          {/* Video starfield background */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          >
            <source src="/space-bg.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay — ensures hero text passes WCAG AA over the video */}
          <div className="absolute inset-0 pointer-events-none z-[1] bg-black/40" />

          {/* Purple accent glow — top-left */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background:
                "radial-gradient(ellipse at top left, rgba(109,92,174,0.35) 0%, transparent 55%)",
            }}
          />

          {/* Blend: black space → daylight (#f9f8ff) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 z-[2] bg-gradient-to-b from-transparent to-[#f9f8ff]"
          />

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl relative z-10"
          >
            <Editable
              as="div"
              field="heroBadge"
              className="inline-block px-3 py-1 bg-[#8B7BD8]/20 text-[#cabdf2] font-medium rounded-full text-sm mb-4 border border-[#8B7BD8]/40"
            />

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              <Editable as="span" field="heroHeadlinePre" className="text-white" />
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 bg-purple-100 rounded-md -z-10"
                  aria-hidden="true"
                />
                <Editable
                  as="span"
                  field="heroHeadlineHighlight"
                  className="relative text-[#6D5CAE]"
                />
              </span>
              <Editable as="span" field="heroHeadlinePost" className="text-white" />
            </h1>

            <Editable
              as="p"
              field="heroSubtitle"
              className="text-[#cfcfcf] mb-8 text-lg leading-relaxed"
            />

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("donate")}
                className="bg-[#6D5CAE] text-white px-7 py-3 rounded-lg shadow-md font-medium"
              >
                Get Involved
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("about")}
                className="border border-white/70 text-white px-7 py-3 rounded-lg font-medium bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: "easeOut" }}
            className="mt-14 lg:mt-0 relative z-10 flex justify-center lg:justify-end w-full lg:w-[44%]"
          >
            <div
              className="relative"
              style={{ animation: "heroFloat 4s ease-in-out infinite" }}
            >
              {/* purple glow behind the bright logo card */}
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-full bg-[#6D5CAE]/40 blur-3xl z-0"
              />
              <div className="absolute -top-5 -left-5 w-full h-full bg-purple-100/70 rounded-2xl z-0" />
              <Image
                src="/HUGlogo.png"
                alt="HUG Foundation"
                width={520}
                height={520}
                priority
                className="relative z-10 rounded-2xl shadow-2xl w-[260px] sm:w-[320px] md:w-[380px] lg:w-[440px] xl:w-[480px]"
              />
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <button
            onClick={() => scrollToSection("stats")}
            aria-label="Scroll down"
            className="absolute bottom-8 left-1/2 z-10 text-white opacity-70 hover:opacity-100 transition"
            style={{
              transform: "translateX(-50%)",
              animation: "bounce 2s ease-in-out infinite",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </section>

        {/* ─── STATS ────────────────────────────────────────────────────── */}
        <section
          id="stats"
          className="space-panel-white backdrop-blur-sm py-14 px-6 md:px-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x divide-purple-100">
              <div className="text-center px-4 py-4 border-b md:border-b-0 border-purple-100">
                <p className="text-3xl md:text-4xl font-bold text-[#6D5CAE]">
                  <StatNumber field="statPrograms" />
                </p>
                <p className="text-sm text-gray-500 mt-1">Programs</p>
              </div>
              <div className="text-center px-4 py-4 border-b md:border-b-0 border-purple-100">
                <p className="text-3xl md:text-4xl font-bold text-[#6D5CAE]">
                  <StatNumber field="statVolunteers" />
                </p>
                <p className="text-sm text-gray-500 mt-1">Active Volunteers</p>
              </div>
              <div className="text-center px-4 py-4">
                <p className="text-3xl md:text-4xl font-bold text-[#6D5CAE]">
                  <StatNumber field="statItems" />
                </p>
                <p className="text-sm text-gray-500 mt-1">Items Donated</p>
              </div>
              <div className="text-center px-4 py-4">
                <p className="text-3xl md:text-4xl font-bold text-[#6D5CAE]">
                  <Editable as="span" field="statEstablished" />
                </p>
                <p className="text-sm text-gray-500 mt-1">Established</p>
              </div>
            </div>
          </div>
        </section>

        <NebulaDivider />

        {/* ─── ABOUT ────────────────────────────────────────────────────── */}
        <section
          id="about"
          className="relative px-6 md:px-20 py-28 md:py-32 space-panel backdrop-blur-sm text-[#1d1d1f] overflow-hidden"
        >
          {/* whisper-subtle cosmic accents (kept very light on the light bg) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-24 left-[15%] w-[38rem] h-[38rem] rounded-full opacity-60 nebula-drift"
              style={{
                background:
                  "radial-gradient(circle, rgba(157,143,214,0.10) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-[-6rem] right-[12%] w-[32rem] h-[32rem] rounded-full opacity-60 nebula-drift-slow"
              style={{
                background:
                  "radial-gradient(circle, rgba(109,92,174,0.08) 0%, transparent 70%)",
              }}
            />
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* heading block */}
            <div className="text-center mb-16 md:mb-20">
              <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#6D5CAE] mb-5">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#6D5CAE]" />
                Who We Are
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#6D5CAE]" />
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                About <span className="text-[#6D5CAE]">HUG Foundation</span>
              </h2>
              <div className="mx-auto h-[3px] w-24 rounded-full bg-gradient-to-r from-[#9d8fd6] to-[#6D5CAE] shadow-[0_0_14px_rgba(109,92,174,0.6)] mb-7" />
              <Editable
                as="p"
                field="aboutIntro"
                className="block text-center text-gray-600 max-w-2xl mx-auto leading-relaxed text-base md:text-lg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Mission + Values */}
              <div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">
                  Our Mission
                </h3>
                <Editable
                  as="p"
                  field="aboutMission"
                  className="block text-gray-600 mb-11 leading-relaxed"
                />

                <h3 className="text-xl font-semibold mb-6 tracking-tight">
                  Our Values
                </h3>
                <ul ref={aboutValuesRef} className="space-y-5 text-gray-700">
                  {[
                    {
                      title: "Compassionate Service",
                      desc: "Approaching every interaction with empathy and care",
                    },
                    {
                      title: "Inclusive Community",
                      desc: "Creating spaces where everyone feels valued and welcome",
                    },
                    {
                      title: "Leadership Development",
                      desc: "Empowering students to become tomorrow's leaders",
                    },
                    {
                      title: "Sustainable Impact",
                      desc: "Making lasting differences in the communities we serve",
                    },
                  ].map(({ title, desc }) => (
                    <li key={title} className="flex items-start gap-4">
                      <span className="value-check grid place-items-center w-9 h-9 rounded-xl bg-purple-100 text-[#6D5CAE] shrink-0 shadow-[0_0_16px_rgba(109,92,174,0.28)] ring-1 ring-[#6D5CAE]/15">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </span>
                      <span className="pt-1 leading-relaxed">
                        <strong className="font-semibold text-[#1d1d1f]">
                          {title}
                        </strong>{" "}
                        — <span className="text-gray-600">{desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Premium glass cards */}
              <div className="space-y-5">
                {[
                  {
                    title: "Student Volunteers",
                    body: "We proudly engage student volunteers, providing leadership opportunities that make a lasting difference in both their lives and the communities they serve.",
                  },
                  {
                    title: "Community Impact",
                    body: "Our programs directly address the needs of underserved communities, providing essential resources, educational support, and wellness initiatives.",
                  },
                  {
                    title: "Holistic Approach",
                    body: "We believe in addressing the whole person – their educational needs, physical well-being, and emotional support – creating comprehensive solutions.",
                  },
                ].map(({ title, body }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.12,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -6,
                      transition: { type: "spring", stiffness: 300, damping: 20 },
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-purple-100/70 bg-white/70 backdrop-blur-md p-6 shadow-[0_6px_28px_-10px_rgba(109,92,174,0.22)] transition-shadow duration-300 hover:shadow-[0_22px_60px_-16px_rgba(109,92,174,0.5)]"
                  >
                    {/* hover glow */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#9d8fd6]/0 blur-2xl transition-colors duration-300 group-hover:bg-[#9d8fd6]/25" />
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-[#6D5CAE]/30" />
                    <h4 className="relative font-semibold text-[#6D5CAE] mb-2 text-lg">
                      {title}
                    </h4>
                    <p className="relative text-gray-600 text-sm leading-relaxed">
                      {body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── GLOBE ────────────────────────────────────────────────────── */}
        <section className="space-panel-white backdrop-blur-sm py-20 px-6 md:px-20 overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 h-64 md:h-80 relative">
              <GlobeScene />
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Making an impact in{" "}
                <span className="text-[#6D5CAE]">Henderson, NV</span> and beyond
              </h2>
              <p className="text-gray-600 leading-relaxed">
                From local clothing drives to SAT tutoring, every initiative we
                run creates ripples of positive change throughout our community
                and inspires future leaders to give back.
              </p>
            </div>
          </div>
        </section>

        <NebulaDivider />

        {/* ─── PROGRAMS (tabs) ──────────────────────────────────────────── */}
        <section
          id="programs"
          className="space-panel backdrop-blur-sm px-6 md:px-20 py-24"
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Our <span className="text-[#6D5CAE]">Programs</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-14">
            Four focused initiatives, each built to uplift a different part of
            our community.
          </p>

          <ProgramTabs onApply={openProgram} />
        </section>

        {/* ─── DONATE ───────────────────────────────────────────────────── */}
        <section
          id="donate"
          className="space-panel-white backdrop-blur-sm py-24 px-6 md:px-20 flex flex-col lg:flex-row gap-10 items-start justify-center"
        >
          {/* Donorbox iframe — untouched */}
          <div className="bg-white shadow-md rounded-xl p-4 max-w-[500px] w-full">
            <iframe
              src="https://donorbox.org/embed/hug-cares-a-community-call-to-action-784141?"
              name="donorbox"
              allow="payment"
              seamless
              style={{
                maxWidth: "500px",
                minWidth: "250px",
                minHeight: "580px",
                maxHeight: "none",
                overflow: "hidden",
                border: "none",
              }}
              height="auto"
              width="100%"
            />
          </div>

          {/* Impact cards */}
          <div
            ref={donateCardsRef}
            className="flex flex-col gap-5 w-full lg:max-w-md"
          >
            {[
              {
                open: impact1Open,
                setOpen: setImpact1Open,
                heading: "$25 Provides",
                body: "Essential school supplies for a student in need, supporting their educational journey.",
              },
              {
                open: impact2Open,
                setOpen: setImpact2Open,
                heading: "$100 Provides",
                body: "An entire month of after-school programming for a child, including academic support and enrichment activities.",
              },
              {
                open: impact3Open,
                setOpen: setImpact3Open,
                heading: "Clothing Donations",
                body: "Your donated clothing items go directly to families in need, providing warmth, comfort, and dignity.",
              },
            ].map(({ heading, body, setOpen }) => (
              <div
                key={heading}
                className="impact-card bg-white rounded-xl shadow-sm p-6 border border-purple-50"
              >
                <h3 className="text-lg font-semibold mb-2">{heading}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {body}
                </p>
                <button
                  onClick={() => setOpen(true)}
                  className="text-[#6D5CAE] text-sm font-medium hover:underline"
                >
                  See impact stories →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Impact modals */}
        <AnimatePresence>
          {(impact1Open || impact2Open || impact3Open) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center px-4"
              onClick={closeAllModals}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white relative rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto"
              >
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none"
                  onClick={closeAllModals}
                  aria-label="Close"
                >
                  &times;
                </button>

                {impact1Open && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">$25 Impact</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Thanks to a generous $25 donation, HUG Foundation assembled
                      a complete hygiene packet filled with essentials such as
                      soap, shampoo, conditioner, toothpaste, a toothbrush,
                      deodorant, and sanitary items. For someone struggling with
                      homelessness or financial hardship, these items are not just
                      products they are tools for confidence, dignity, and self
                      care. This single packet means someone can go to school work
                      or an important meeting feeling fresh and respected. Your
                      $25 doesn&apos;t just buy hygiene items, it creates a moment of
                      hope and reminds someone in need that their community cares
                      for them.
                    </p>
                  </>
                )}
                {impact2Open && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">$100 Impact</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      At HUG Foundation, a $100 donation goes a long way. With
                      just one contribution, we were able to provide 4 hygiene
                      packets filled with essentials like soap, toothbrushes, and
                      sanitary items. These packets were distributed during a
                      community outreach event, helping people experiencing
                      homelessness feel clean, cared for, and seen. That same
                      $100 also helped support our SAT tutoring initiative. Three
                      students received a full week of tutoring and access to test
                      prep materials. These students, who otherwise would not have
                      had access to quality support, were given a real chance to
                      improve their scores and pursue college with confidence.
                      Part of the donation also went toward expanding our outreach
                      efforts. We printed flyers, delivered supplies, and reached
                      more than 40 individuals in just one day. The impact of one
                      donation stretched across hygiene, education, and community
                      care. At HUG Foundation, every dollar is used to create
                      meaningful, lasting change.
                    </p>
                  </>
                )}
                {impact3Open && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">
                      Clothing Donation Impact
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Thanks to the generosity of our supporters, HUG Foundation
                      collected over 1,000 articles of clothing through local
                      drives, school partnerships, and neighborhood drop-off
                      events. These clothes were sorted, cleaned, and carefully
                      packed by our volunteers before being donated to Vegas
                      Stronger, a nonprofit dedicated to helping individuals
                      recovering from homelessness, addiction, and poverty in Las
                      Vegas. From warm jackets to clean shirts, every piece of
                      clothing you donated reached someone who needed it
                      most—men, women, and children striving to rebuild their
                      lives. These clothes don&apos;t just keep people warm— they
                      offer confidence for job interviews, comfort during tough
                      times, and a reminder that they are not forgotten. Your
                      support allows HUG Foundation to continue partnering with
                      organizations like Vegas Stronger, turning every closet
                      clean out into a chance to change lives.
                    </p>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <NebulaDivider />

        {/* ─── GALLERY ──────────────────────────────────────────────────── */}
        <section className="space-panel backdrop-blur-sm px-6 md:px-20 py-24">
          <h2 className="text-3xl font-bold text-center mb-4">
            Our Impact in <span className="text-[#6D5CAE]">Action</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-14">
            Moments from our drives, tutoring sessions, and community outreach
            across the valley.
          </p>
          <GalleryGrid />
        </section>

        {/* ─── VOLUNTEER ────────────────────────────────────────────────── */}
        <VolunteerSection ref={volunteerRef} />

        {/* Per-program interest form modal (opened from program tabs) */}
        <ProgramFormModal
          open={programModalOpen}
          onClose={() => setProgramModalOpen(false)}
          program={programName}
        />
      </Layout>
    </>
  );
}

export default function Home({
  content,
  isAdmin,
}: {
  content: SiteContent;
  isAdmin: boolean;
}) {
  return (
    <EditableProvider initialContent={content} isAdmin={isAdmin}>
      <HomeContent />
    </EditableProvider>
  );
}
