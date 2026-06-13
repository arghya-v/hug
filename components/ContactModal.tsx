import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  defaultSubject?: string;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emptyForm: FormState = { name: "", email: "", subject: "", message: "" };

function validate(f: FormState) {
  const errs: Partial<FormState> = {};
  if (!f.name.trim()) errs.name = "Name is required";
  if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    errs.email = "Valid email required";
  if (!f.subject.trim()) errs.subject = "Subject is required";
  if (f.message.trim().length < 10)
    errs.message = "Message must be at least 10 characters";
  return errs;
}

export default function ContactModal({
  open,
  onClose,
  title = "Contact Us",
  defaultSubject = "",
}: Props) {
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    subject: defaultSubject,
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  // Prefill the subject (e.g. from a program "Apply" button) each time the
  // modal opens.
  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, subject: f.subject || defaultSubject }));
    }
  }, [open, defaultSubject]);

  function handleClose() {
    setForm({ ...emptyForm, subject: defaultSubject });
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
      const res = await fetch("/api/contact", {
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

  function field(
    key: keyof FormState,
    label: string,
    placeholder: string,
    type = "text"
  ) {
    return (
      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
          {label}
        </label>
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition"
        />
        {errors[key] && (
          <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
        )}
      </div>
    );
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

            <h2 className="text-2xl font-bold text-[#6D5CAE] mb-6">{title}</h2>

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
                  Message sent!
                </p>
                <p className="text-gray-600 mb-6 text-sm">
                  We&apos;ll get back to you soon.
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
                {field("name", "Name", "Your name")}
                {field("email", "Email", "you@example.com", "email")}
                {field("subject", "Subject", "How can we help?")}
                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-1">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    rows={4}
                    placeholder="Tell us more…"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] resize-none transition"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </p>
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
                  {status === "loading" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
