import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  grade: string;
  currentScore: string;
  goals: string;
}

const empty: FormState = {
  name: "",
  email: "",
  grade: "",
  currentScore: "",
  goals: "",
};

function validate(f: FormState) {
  const errs: Partial<Record<keyof FormState, string>> = {};
  if (!f.name.trim()) errs.name = "Name is required";
  if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    errs.email = "Valid email required";
  if (!f.grade.trim()) errs.grade = "Grade is required";
  if (!f.goals.trim()) errs.goals = "Please share your goals";
  return errs;
}

export default function SATSignupModal({ open, onClose }: Props) {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  function handleClose() {
    setForm(empty);
    setErrors({});
    setStatus("idle");
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/sat-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const grades = [
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
    "College Freshman",
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none transition"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-[#6D5CAE] mb-2">
              Sign Up for Free Tutoring
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Reserve your spot in our free SAT tutoring program.
            </p>

            {status === "success" ? (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-[#6D5CAE]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg font-semibold text-[#6D5CAE] mb-2">
                  You&apos;re signed up!
                </p>
                <p className="text-gray-600 mb-6 text-sm">
                  We&apos;ll reach out soon with next steps. Welcome to HUG!
                </p>
                <button
                  onClick={handleClose}
                  className="bg-[#6D5CAE] text-white px-6 py-2 rounded-full font-medium hover:bg-[#5a4a99] transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                    Current Grade
                  </label>
                  <select
                    value={form.grade}
                    onChange={(e) =>
                      setForm({ ...form, grade: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition bg-white"
                  >
                    <option value="">Select grade…</option>
                    {grades.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {errors.grade && (
                    <p className="text-red-500 text-xs mt-1">{errors.grade}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                    Current SAT Score{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.currentScore}
                    onChange={(e) =>
                      setForm({ ...form, currentScore: e.target.value })
                    }
                    placeholder="e.g. 1050"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                    Goals
                  </label>
                  <textarea
                    value={form.goals}
                    onChange={(e) =>
                      setForm({ ...form, goals: e.target.value })
                    }
                    rows={3}
                    placeholder="What score are you aiming for? Any specific areas to work on?"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] resize-none transition"
                  />
                  {errors.goals && (
                    <p className="text-red-500 text-xs mt-1">{errors.goals}</p>
                  )}
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#6D5CAE] text-white py-2.5 rounded-full font-medium hover:bg-[#5a4a99] transition disabled:opacity-60"
                >
                  {status === "loading" ? "Submitting…" : "Sign Up for Free"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
