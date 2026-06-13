import { Resend } from "resend";

// ─────────────────────────────────────────────────────────────────────────────
//  EMAIL ALERTS  (Resend)
//
//  Every form submission (contact / volunteer / SAT signup) is routed through
//  sendAlert() so an email is sent to the foundation inbox.
//
//  👉  ADD YOUR KEY HERE  — put this line in `.env.local`:
//
//        RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//
//  Until that key exists, submissions are logged to the server console and the
//  form STILL returns success, so the whole flow keeps working in development.
//  Recipient address is configurable via CONTACT_EMAIL (defaults below).
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

const FROM = "HUG Foundation <noreply@hugfoundation.org>";

export async function sendAlert({
  label,
  subject,
  html,
  replyTo,
  logData,
}: AlertInput): Promise<void> {
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
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    ...(replyTo ? { replyTo } : {}),
    subject,
    html,
  });

  if (error) throw error;
}
