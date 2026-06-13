import { useState } from "react";
import Image from "next/image";

interface Partner {
  name: string;
  file: string; // /public/partners/<file>
}

// Logo files drop into /public/partners and appear automatically; until a file
// exists, each slot falls back to a styled text chip so the marquee never breaks.
const PARTNERS: Partner[] = [
  { name: "Chicken N Pickle", file: "/partners/chicken-n-pickle.png" },
  { name: "Vegas Stronger", file: "/partners/vegas-stronger.png" },
  { name: "Autism Cares", file: "/partners/autism-cares.png" },
  { name: "SomiSomi", file: "/partners/somisomi.png" },
  { name: "Shake Shack", file: "/partners/shake-shack.png" },
  { name: "Chipotle", file: "/partners/chipotle.png" },
];

function PartnerLogo({ partner }: { partner: Partner }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="mx-8 flex h-14 items-center justify-center whitespace-nowrap rounded-xl border border-purple-100 bg-white/80 px-6 font-semibold text-[#6D5CAE] shadow-sm">
        {partner.name}
      </div>
    );
  }

  return (
    <div className="mx-8 flex h-14 items-center justify-center">
      <Image
        src={partner.file}
        alt={partner.name}
        width={160}
        height={60}
        onError={() => setErrored(true)}
        className="h-12 md:h-[56px] w-auto object-contain grayscale opacity-80 transition duration-300 hover:grayscale-0 hover:opacity-100"
      />
    </div>
  );
}

export default function PartnerMarquee() {
  // Duplicate the set so the -50% keyframe loops seamlessly.
  const doubled = [...PARTNERS, ...PARTNERS];
  return (
    <div className="relative overflow-hidden py-2">
      {/* edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#f9f8ff] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#f9f8ff] to-transparent" />
      <div className="marquee-track items-center">
        {doubled.map((partner, i) => (
          <PartnerLogo key={`${partner.name}-${i}`} partner={partner} />
        ))}
      </div>
    </div>
  );
}
