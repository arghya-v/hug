import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { sendAlert } from "@/lib/notify";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  grade: z.string().min(1),
  currentScore: z.string().optional(),
  goals: z.string().min(1),
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

  const { name, email, grade, currentScore, goals } = parsed.data;

  try {
    await sendAlert({
      label: "SAT Signup",
      subject: `[HUG SAT] New signup from ${name}`,
      replyTo: email,
      logData: { name, email, grade, currentScore, goals },
      html: `
        <h2>New SAT Tutoring Signup</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Grade:</strong> ${grade}</p>
        ${
          currentScore
            ? `<p><strong>Current SAT Score:</strong> ${currentScore}</p>`
            : ""
        }
        <p><strong>Goals:</strong></p>
        <p style="white-space:pre-wrap">${goals}</p>
      `,
    });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to send email" });
  }
}
