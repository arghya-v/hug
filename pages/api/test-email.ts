import type { NextApiRequest, NextApiResponse } from "next";
import { sendAlert } from "@/lib/notify";

/**
 * GET /api/test-email — sends a single test email to CONTACT_EMAIL through the
 * same Resend pipeline the forms use, so the wiring can be verified end-to-end.
 *
 * Restricted to development: returns 404 in production.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ error: "Not found" });
  }
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const to = process.env.CONTACT_EMAIL ?? "(CONTACT_EMAIL not set)";

  const result = await sendAlert({
    label: "Test Email",
    subject: "HUG Foundation — Test Email ✅",
    logData: { test: true, to },
    html: `
      <h2>HUG Foundation — Test Email</h2>
      <p>If you can read this, the Resend email pipeline is working.</p>
      <p><strong>Recipient:</strong> ${to}</p>
      <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
    `,
  });

  return res.status(result.ok ? 200 : 502).json({
    ok: result.ok,
    skipped: result.skipped,
    to,
    id: result.id,
    error: result.error,
    note: result.skipped
      ? "RESEND_API_KEY not configured — submission was logged to the server console only."
      : result.ok
        ? "Email sent successfully. Check the CONTACT_EMAIL inbox (and spam)."
        : "Resend returned an error — see the server console for the full detail.",
  });
}
