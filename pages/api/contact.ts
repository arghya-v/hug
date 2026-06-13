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

  const result = await sendAlert({
    label: "Contact",
    subject: `New Contact Message: ${subject}`,
    replyTo: email,
    logData: { name, email, subject, message },
    html: `
      <h2>New Contact Message</h2>
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${message}</p>
    `,
  });

  if (!result.ok) {
    return res
      .status(502)
      .json({ error: "Email could not be sent. Please try again later." });
  }
  return res.status(200).json({ success: true });
}
