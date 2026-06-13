import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { sendAlert } from "@/lib/notify";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
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

  const { name, email, subject, message } = parsed.data;

  try {
    await sendAlert({
      label: "Contact",
      subject: `[HUG Contact] ${subject}`,
      replyTo: email,
      logData: { name, email, subject, message },
      html: `
        <h2>New contact form submission</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${message}</p>
      `,
    });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to send email" });
  }
}
