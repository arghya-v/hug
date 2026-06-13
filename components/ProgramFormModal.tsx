import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  program: string;
}

interface FormState {
  name: string;
  email: string;
  message: string;
}

const empty: FormState = { name: "", email: "", message: "" };

function validate(f: FormState) {
  const errs: Partial<FormState> = {};
  if (!f.name.trim()) errs.name = "Name is required";
  if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    errs.email = "Valid email required";
  return errs;
}

export default function ProgramFormModal({ open, onClose, program }: Props) {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  // Reset state whenever the modal opens for a (possibly different) program.
  useEffect(() => {
    if (open) {
      setForm(empty);
      setErrors({});
      setStatus("idle");
    }
  }, [open, program]);

  function handleClose() {
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
      const res = await fetch("/api/program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, program }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative"
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none transition"
            >
              &times;
            </button>

            <p className="text-xs font-semibold uppercase tracking-wide text-[#6D5CAE] mb-1">
              Get Involved
            </p>
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-1">{program}</h2>
            <p className="text-gray-500 text-sm mb-6">
              Tell us a little about you and we&apos;ll be in touch.
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
                  Thanks for your interest!
                </p>
                <p className="text-gray-600 mb-6 text-sm">
                  We received your interest in {program} and will reach out soon.
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
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
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
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                    Message{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    rows={4}
                    placeholder={`Why are you interested in ${program}?`}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] resize-none transition"
                  />
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
                  {status === "loading" ? "Submitting…" : "Submit"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
