import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPumpSoap,
  FaGraduationCap,
  FaTshirt,
  FaGlobeAmericas,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { useEditable, Editable } from "@/components/cms/EditableProvider";

interface Props {
  onApply: (subject: string) => void;
}

// Icons + CTA subjects are mapped to programs by index; the editable text
// (title / desc / provides) lives in the CMS content store.
const META: { icon: IconType; subject: string; cta: string }[] = [
  { icon: FaPumpSoap, subject: "HUG for Hygiene", cta: "Get Involved" },
  { icon: FaGraduationCap, subject: "HUG for Education", cta: "Apply Now" },
  { icon: FaTshirt, subject: "HUG for Warmth", cta: "Get Involved" },
  {
    icon: FaGlobeAmericas,
    subject: "International Scholars Program",
    cta: "Apply Now",
  },
];

export default function ProgramTabs({ onApply }: Props) {
  const { content } = useEditable();
  const [active, setActive] = useState(0);
  const programs = content.programs;
  const ActiveIcon = META[active].icon;

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8">
      {/* Tab list */}
      <div
        className="flex md:flex-col gap-2 md:w-[34%] overflow-x-auto md:overflow-visible pb-2 md:pb-0"
        role="tablist"
        aria-label="Programs"
      >
        {programs.map((p, i) => {
          const Icon = META[i].icon;
          const isActive = i === active;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap md:whitespace-normal shrink-0 md:shrink transition-colors ${
                isActive ? "text-white" : "text-[#1d1d1f] hover:bg-purple-50"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeProgramTab"
                  className="absolute inset-0 rounded-xl bg-[#6D5CAE] shadow-md"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span
                className={`relative z-10 p-2 rounded-lg ${
                  isActive ? "bg-white/20" : "bg-purple-100"
                }`}
              >
                <Icon
                  className={isActive ? "text-white" : "text-[#6D5CAE]"}
                  size={18}
                />
              </span>
              <span className="relative z-10 font-medium text-sm md:text-base">
                {p.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div className="flex-1 relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="space-panel-white border border-purple-50 rounded-2xl shadow-sm p-7 md:p-9 h-full backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <ActiveIcon className="text-[#6D5CAE]" size={24} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold">
                {programs[active].title}
              </h3>
            </div>

            <Editable
              as="p"
              field={`programs.${active}.desc`}
              className="text-gray-600 leading-relaxed mb-6"
            />

            <div className="bg-purple-50/70 rounded-xl p-5 mb-7">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6D5CAE] mb-2">
                What your support provides
              </p>
              <Editable
                as="p"
                field={`programs.${active}.provides`}
                className="text-gray-700 text-sm leading-relaxed"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              onClick={() => onApply(META[active].subject)}
              className="bg-[#6D5CAE] text-white px-6 py-3 rounded-xl font-medium shadow-md"
            >
              {META[active].cta} →
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
