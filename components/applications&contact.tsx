import React, { forwardRef, useState } from "react";
import { motion } from "framer-motion";

type RoleInterest =
  | "Clothing Drive Assistant"
  | "Student Mentor"
  | "Event Coordinator"
  | "";

type Availability = "Weekdays" | "Weekends" | "Both";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  roleInterest: RoleInterest;
  availability: Availability[];
  message: string;
}

const empty: FormState = {
  fullName: "",
  email: "",
  phone: "",
  roleInterest: "",
  availability: [],
  message: "",
};

function validate(f: FormState) {
  const errs: Partial<Record<keyof FormState, string>> = {};
  if (!f.fullName.trim()) errs.fullName = "Full name is required";
  if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    errs.email = "Valid email required";
  if (!f.roleInterest) errs.roleInterest = "Please select a role";
  if (!f.availability.length)
    errs.availability = "Please select your availability";
  return errs;
}

const VolunteerSection = forwardRef<HTMLElement>((_, ref) => {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  function toggleAvailability(val: Availability) {
    setForm((prev) => ({
      ...prev,
      availability: prev.availability.includes(val)
        ? prev.availability.filter((a) => a !== val)
        : [...prev.availability, val],
    }));
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
      const res = await fetch("/api/volunteer", {
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

  return (
    <section
      ref={ref}
      id="volunteer"
      className="min-h-screen space-panel-white backdrop-blur-sm text-[#1d1d1f] py-20 px-6 md:px-16"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
        <span className="text-[#6D5CAE]">Volunteer </span>
        <span>with</span>
        <span className="text-[#6D5CAE]"> Us</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Left — Why Volunteer */}
        <div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#6D5CAE]">
              Why Volunteer With Us?
            </h2>
            <ul className="space-y-2 text-gray-700">
              {[
                "Develop valuable leadership skills",
                "Make a direct impact in your community",
                "Flexible scheduling for students",
                "Letters of recommendation for dedicated volunteers",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-[#6D5CAE] mt-0.5 shrink-0"
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
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — Application Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[#6D5CAE]">
            Apply to Volunteer
          </h2>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <svg
                className="w-20 h-20 mx-auto mb-4 text-[#6D5CAE]"
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
              <p className="text-xl font-semibold text-[#6D5CAE] mb-2">
                Application submitted!
              </p>
              <p className="text-gray-600 mb-6">
                Thank you for your interest. We&apos;ll be in touch soon.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-[#6D5CAE] hover:underline text-sm"
              >
                Submit another application
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  placeholder="Your full name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone (optional) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="(702) 555-0000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition"
                />
              </div>

              {/* Role Interest */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Role Interest
                </label>
                <select
                  value={form.roleInterest}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      roleInterest: e.target.value as RoleInterest,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] transition bg-white"
                >
                  <option value="">Select a role…</option>
                  <option>Clothing Drive Assistant</option>
                  <option>Student Mentor</option>
                  <option>Event Coordinator</option>
                </select>
                {errors.roleInterest && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.roleInterest}
                  </p>
                )}
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Availability
                </label>
                <div className="flex gap-4 flex-wrap">
                  {(["Weekdays", "Weekends", "Both"] as Availability[]).map(
                    (opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 text-sm cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={form.availability.includes(opt)}
                          onChange={() => toggleAvailability(opt)}
                          className="w-4 h-4 accent-[#6D5CAE]"
                        />
                        {opt}
                      </label>
                    )
                  )}
                </div>
                {errors.availability && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.availability}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  rows={4}
                  placeholder="Tell us a bit about yourself and why you'd like to volunteer…"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D5CAE] resize-none transition"
                />
              </div>

              {status === "error" && (
                <p className="text-red-500 text-sm">
                  Something went wrong. Please try again.
                </p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === "loading"}
                className="w-full bg-[#6D5CAE] text-white py-3 rounded-xl font-semibold text-base hover:bg-[#5a4a99] transition disabled:opacity-60"
              >
                {status === "loading" ? "Submitting…" : "Submit Application"}
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
});

VolunteerSection.displayName = "VolunteerSection";
export default VolunteerSection;
