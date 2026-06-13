import Head from "next/head";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import BoardCard, { type BoardMember } from "@/components/BoardCard";

const MEMBERS: BoardMember[] = [
  {
    name: "Yash Kalla",
    role: "President",
    photo: "/board/yash.png",
    funFacts: [
      "Used to speedrun Mario Odyssey",
      "Has played 4000+ hours of Fortnite",
    ],
  },
  {
    name: "Anish Ganapa",
    role: "Vice President",
    photo: "/board/anish.png",
    funFacts: [
      "Has watched over 200 animes",
      "“Cookies are the best dessert”",
    ],
  },
  {
    name: "David Hsiao",
    role: "Fundraising Director",
    photo: "/board/david.png",
    funFacts: [
      "Earned a black belt in taekwondo at age 8",
      "Has played piano for 10 years",
    ],
  },
  {
    name: "Soraya Rincon",
    role: "Outreach Director",
    photo: "/board/soraya.png",
    objectPosition: "center 22%",
    funFacts: ["Born in Italy", "Has had two knee surgeries"],
  },
  {
    name: "Gabrielle Sioson",
    role: "Social Media Coordinator",
    photo: "/board/gabrielle.png",
    funFacts: [
      "Both near-sighted and far-sighted",
      "Polynesian dancer for 10+ years",
    ],
  },
  {
    name: "Ishaan Shroff",
    role: "Project Lead of HUG for Education",
    photo: "/board/ishaan.png",
    funFacts: [
      "Has broken his arm three times",
      "Placed 9th in state for tennis",
    ],
  },
  {
    name: "Chris Manjooran",
    role: "Project Lead of HUG for Warmth",
    photo: "/board/chris.png",
    funFacts: ["Supports Liverpool FC"],
  },
];

export default function BoardPage() {
  return (
    <>
      <Head>
        <title>Our Board | HUG Foundation</title>
        <meta
          name="description"
          content="Meet the student leaders behind HUG Foundation — the board members driving our hygiene, education, and warmth programs forward."
        />
      </Head>

      <Layout>
        {/* Hero */}
        <section className="relative px-6 md:px-20 pt-36 pb-16 text-center overflow-hidden">
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
              Meet the Team
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-5">
              Our <span className="text-[#6D5CAE]">Board</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              The student leaders steering HUG Foundation — building a brighter
              future one HUG at a time.
            </p>
          </motion.div>
        </section>

        {/* Grid */}
        <section className="px-6 md:px-20 pb-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {MEMBERS.map((member, i) => (
              <BoardCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
