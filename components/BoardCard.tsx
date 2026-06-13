import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface BoardMember {
  name: string;
  role: string;
  photo: string; // /board/<file>.png
  funFacts: string[];
  /** CSS object-position for the cover crop (e.g. "center 25%"). Defaults to center. */
  objectPosition?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function BoardCard({
  member,
  index,
}: {
  member: BoardMember;
  index: number;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="group relative space-panel-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-[0_18px_50px_-12px_rgba(109,92,174,0.45)]"
    >
      {/* glow ring on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-[#6D5CAE]/30 transition" />

      {/* Photo / fallback */}
      <div className="relative h-60 w-full overflow-hidden">
        {errored ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #6D5CAE 0%, #9d8fd6 60%, #b9aee6 100%)",
            }}
          >
            <span className="text-white text-5xl font-bold tracking-wide drop-shadow">
              {initials(member.name)}
            </span>
          </div>
        ) : (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setErrored(true)}
            style={{ objectPosition: member.objectPosition ?? "center" }}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold leading-tight">{member.name}</h3>
        <p className="text-[#6D5CAE] text-sm font-medium mb-3">{member.role}</p>
        <ul className="space-y-1.5">
          {member.funFacts.map((fact) => (
            <li
              key={fact}
              className="flex items-start gap-2 text-gray-600 text-sm"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6D5CAE] shrink-0" />
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
