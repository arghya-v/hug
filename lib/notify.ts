import { Resend } from "resend";

// ─────────────────────────────────────────────────────────────────────────────
//  EMAIL ALERTS  (Resend)
//
//  Every form submission (contact / volunteer / SAT signup / program) is routed
//  through sendAlert() so an email is delivered to the foundation inbox.
//
//  👉  ADD YOUR KEY  — put this line in `.env.local`:
//
//        RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//        CONTACT_EMAIL=you@yourdomain.com
//
//  Until a real key exists, submissions are logged to the server console and the
//  form STILL returns success, so the whole flow keeps working in development.
//
//  `from` uses Resend's shared test sender (onboarding@resend.dev) which works
//  WITHOUT domain verification. Swap to a verified-domain address once the
//  hugfoundation.org domain is verified in the Resend dashboard.
// ─────────────────────────────────────────────────────────────────────────────

interface AlertInput {
  /** Short label for the console log, e.g. "Contact", "Volunteer". */
  label: string;
  /** Email subject line. */
  subject: string;
  /** Rendered HTML body. */
  html: string;
  /** Reply-to address (the submitter). */
  replyTo?: string;
  /** Plain-text snapshot for the dev console log. */
  logData?: Record<string, unknown>;
}

export interface AlertResult {
  /** True when the email was sent OR intentionally skipped (dev w/o key). */
  ok: boolean;
  /** True when no key was configured and we only logged to the console. */
  skipped: boolean;
  /** Resend message id on success. */
  id?: string;
  /** Human-readable error detail on failure (already logged server-side). */
  error?: string;
}

// Resend's shared test sender — works without verifying a domain.
const FROM = "HUG Foundation <onboarding@resend.dev>";

export async function sendAlert({
  label,
  subject,
  html,
  replyTo,
  logData,
}: AlertInput): Promise<AlertResult> {
  const apiKey = process.env.RESEND_API_KEY; // ← key is read from the env here
  const to = process.env.CONTACT_EMAIL ?? "hello@hugfoundation.org";

  // Real Resend keys start with "re_". Treat a missing key OR a placeholder
  // (e.g. the default "get-this-from-resend.com") as "not configured" → log
  // the submission and let the form succeed so dev flows keep working.
  if (!apiKey || !apiKey.startsWith("re_")) {
    console.log(
      `\n📨 [${label}] New submission (RESEND_API_KEY missing — logged only)\n`,
      JSON.stringify(logData ?? { subject, replyTo }, null, 2)
    );
    return { ok: true, skipped: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [to],
      ...(replyTo ? { replyTo } : {}),
      subject,
      html,
    });

    // Resend reports delivery problems via `error` (not a thrown exception).
    if (error) {
      console.error(
        `\n❌ [${label}] Resend rejected the email →`,
        JSON.stringify(error, null, 2)
      );
      return { ok: false, skipped: false, error: error.message ?? "Resend error" };
    }

    console.log(`\n✅ [${label}] Email sent to ${to} (id: ${data?.id ?? "?"})`);
    return { ok: true, skipped: false, id: data?.id };
  } catch (err) {
    // Network / unexpected failure — log the full error, never throw upward.
    console.error(`\n❌ [${label}] Failed to send email (exception) →`, err);
    return {
      ok: false,
      skipped: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
