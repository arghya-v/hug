import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { readContent, writeContent } from "@/lib/contentStore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET — anyone can read the published content.
  if (req.method === "GET") {
    const content = await readContent();
    return res.status(200).json(content);
  }

  // POST — only an authenticated admin may persist changes.
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const saved = await writeContent(req.body);
      return res.status(200).json(saved);
    } catch {
      return res.status(500).json({ error: "Failed to save content" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
