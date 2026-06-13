import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { sendAlert } from "@/lib/notify";

const schema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  roleInterest: z.enum([
    "Clothing Drive Assistant",
    "Student Mentor",
    "Event Coordinator",
  ]),
  availability: z.array(z.enum(["Weekdays", "Weekends", "Both"])).min(1),
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

  const { fullName, email, phone, roleInterest, availability, message } =
    parsed.data;

  try {
    await sendAlert({
      label: "Volunteer",
      subject: `[HUG Volunteer] Application from ${fullName}`,
      replyTo: email,
      logData: { fullName, email, phone, roleInterest, availability, message },
      html: `
        <h2>New Volunteer Application</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Role Interest:</strong> ${roleInterest}</p>
        <p><strong>Availability:</strong> ${availability.join(", ")}</p>
        ${
          message
            ? `<p><strong>Message:</strong></p><p style="white-space:pre-wrap">${message}</p>`
            : ""
        }
      `,
    });
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to send email" });
  }
}
