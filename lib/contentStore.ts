// Server-only file persistence for the flat-file CMS.
// Only import this from API routes or getServerSideProps — never from a
// component rendered on the client.
import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "./content";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

export async function readContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    return mergeContent(JSON.parse(raw));
  } catch {
    // File missing or unreadable → fall back to defaults.
    return DEFAULT_CONTENT;
  }
}

export async function writeContent(raw: unknown): Promise<SiteContent> {
  const merged = mergeContent(raw);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONTENT_FILE, JSON.stringify(merged, null, 2), "utf8");
  return merged;
}
