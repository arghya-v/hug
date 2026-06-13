import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PartnerMarquee from "@/components/PartnerMarquee";
import ContactModal from "@/components/ContactModal";

export default function PartnersPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Partners | HUG Foundation</title>
        <meta
          name="description"
          content="HUG Foundation partners with community organizations like Vegas Stronger to deliver warmth, hygiene, and education across the Las Vegas valley."
        />
      </Head>

      <Layout>
        {/* Hero */}
        <section className="relative px-6 md:px-20 pt-36 pb-14 text-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(216,210,255,0.4) 0%, transparent 60%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <span className="inline-block px-3 py-1 bg-purple-100 text-[#6D5CAE] font-medium rounded-full text-sm mb-4 shadow-sm">
              Stronger Together
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-5">
              Our <span className="text-[#6D5CAE]">Partners</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              We collaborate with community organizations to create lasting
              impact across Henderson and the greater Las Vegas area.
            </p>
          </motion.div>
        </section>

        {/* Marquee */}
        <section className="py-8">
          <PartnerMarquee />
        </section>

        {/* Vegas Stronger detail */}
        <section className="px-6 md:px-20 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-5xl mx-auto space-panel-white border border-purple-50 rounded-3xl shadow-sm overflow-hidden backdrop-blur-sm"
          >
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <span className="inline-block px-3 py-1 bg-purple-100 text-[#6D5CAE] text-xs font-semibold rounded-full mb-4">
                  Featured Partner
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#6D5CAE]">
                  Vegas Stronger
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  HUG Foundation started in July 2024, where we collected 250
                  blankets and donated them all to Vegas Stronger. We worked with
                  Stacey Lockhart to help hundreds of people to ensure their
                  comfort in a time of need. As of now, we assist Vegas Stronger
                  on a quarterly basis, partnering with other schools in the
                  Clark County district to achieve a set goal of donations
                  ranging from shirts to shoes. HUG continues to strive for the
                  warmth that everyone deserves.
                </p>
              </div>
              <div className="grid grid-rows-2 gap-2 p-4">
                <Image
                  src="/vegasstronger1.jpg"
                  alt="Vegas Stronger Partnership 1"
                  width={600}
                  height={300}
                  className="rounded-2xl object-cover w-full h-full"
                />
                <Image
                  src="/vegasstronger2.jpg"
                  alt="Vegas Stronger Partnership 2"
                  width={600}
                  height={300}
                  className="rounded-2xl object-cover w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Become a Partner */}
        <section className="px-6 md:px-20 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center rounded-3xl p-10 md:p-14 relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(157,143,214,0.18) 0%, rgba(255,255,255,0.85) 70%)",
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Become a <span className="text-[#6D5CAE]">Partner</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto">
              We&apos;re always looking to collaborate with organizations that
              share our vision for a stronger, more inclusive community in
              Henderson and beyond.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              onClick={() => setContactOpen(true)}
              className="bg-[#6D5CAE] text-white px-8 py-3.5 rounded-xl font-semibold shadow-md"
            >
              Start a Partnership
            </motion.button>
          </motion.div>
        </section>

        <ContactModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          title="Become a Partner"
          defaultSubject="Partnership Inquiry"
        />
      </Layout>
    </>
  );
}
