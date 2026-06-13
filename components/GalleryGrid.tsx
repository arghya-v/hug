import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  src: string;
  caption: string;
}

// Real event photos drop in automatically once added to /public/gallery with
// these filenames; until then each tile shows a polished "coming soon" placeholder.
const ITEMS: GalleryItem[] = [
  { src: "/gallery/impact-1.jpg", caption: "Hygiene packet assembly" },
  { src: "/gallery/impact-2.jpg", caption: "Students with HUG bags" },
  { src: "/gallery/impact-3.jpg", caption: "Donation box drop-off" },
  { src: "/gallery/impact-4.jpg", caption: "Volunteer group photo" },
  { src: "/gallery/impact-5.jpg", caption: "Blanket drive" },
  { src: "/gallery/impact-6.jpg", caption: "SAT tutoring session" },
  { src: "/gallery/impact-7.jpg", caption: "Community outreach" },
  { src: "/gallery/impact-8.jpg", caption: "Clothing distribution" },
];

function Tile({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen: () => void;
}) {
  const [errored, setErrored] = useState(false);
  // Vary tile heights for a masonry rhythm.
  const heights = ["h-56", "h-72", "h-64", "h-80"];
  const h = heights[index % heights.length];

  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.12, ease: "easeOut" }}
      className={`group relative mb-4 w-full ${h} overflow-hidden rounded-2xl shadow-sm border border-purple-50 block`}
    >
      {errored ? (
        <div className="absolute inset-0 shimmer flex flex-col items-center justify-center text-[#6D5CAE]">
          <svg
            className="w-9 h-9 mb-2 opacity-70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 9h.008v.008H18V9z M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z"
            />
          </svg>
          <span className="text-xs font-medium opacity-80">Photo coming soon</span>
        </div>
      ) : (
        <Image
          src={item.src}
          alt={item.caption}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          onError={() => setErrored(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <span className="text-white text-sm font-medium">{item.caption}</span>
      </div>
    </motion.button>
  );
}

export default function GalleryGrid() {
  const [active, setActive] = useState<number | null>(null);
  const [lightboxErr, setLightboxErr] = useState(false);

  function open(i: number) {
    setLightboxErr(false);
    setActive(i);
  }

  return (
    <>
      <div className="columns-2 md:columns-3 gap-4 max-w-5xl mx-auto [column-fill:_balance]">
        {ITEMS.map((item, i) => (
          <div key={item.src} className="break-inside-avoid">
            <Tile item={item} index={i} onOpen={() => open(i)} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-5 right-6 text-white/80 hover:text-white text-4xl font-light leading-none"
            >
              &times;
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
            >
              {lightboxErr ? (
                <div className="absolute inset-0 shimmer flex flex-col items-center justify-center text-[#6D5CAE]">
                  <span className="text-sm font-medium">
                    {ITEMS[active].caption} — photo coming soon
                  </span>
                </div>
              ) : (
                <Image
                  src={ITEMS[active].src}
                  alt={ITEMS[active].caption}
                  fill
                  sizes="100vw"
                  onError={() => setLightboxErr(true)}
                  className="object-cover"
                />
              )}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <p className="text-white font-medium">{ITEMS[active].caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
