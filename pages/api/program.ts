import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { sendAlert } from "@/lib/notify";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  program: z.enum([
    "HUG for Hygiene",
    "HUG for Education",
    "HUG for Warmth",
    "International Scholars Program",
  ]),
  message: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { name, email, program, message } = parsed.data;

  try {
    await sendAlert({
      label: "Program Interest",
      subject: `[HUG Program] ${program} — ${name}`,
      replyTo: email,
      logData: { name, email, program, message },
      html: `
        <h2>New Program Interest</h2>
        <p><strong>Program:</strong> ${program}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${
          message
            ? `<p><strong>Message:</strong></p><p style="white-space:pre-wrap">${message}</p>`
            : ""
        }
      `,
    });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to send submission" });
  }
}
