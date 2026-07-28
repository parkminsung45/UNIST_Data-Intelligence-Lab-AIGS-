import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error("NOTION_TOKEN and NOTION_DATABASE_ID env vars are required.");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

// Drop images: Notion's hosted image URLs are pre-signed and expire, so
// embedding them would leave dead links in the repo.
n2m.setCustomTransformer("image", async () => "");

const OUT_DIR = path.join(SCRIPT_DIR, "..", "TIL");
const MANIFEST_PATH = path.join(SCRIPT_DIR, ".notion-sync-manifest.json");

function dedent(text) {
  const lines = text.split("\n");
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => l.match(/^ */)[0].length);
  const minIndent = indents.length ? Math.min(...indents) : 0;
  if (minIndent === 0) return text;
  return lines.map((l) => (l.startsWith(" ".repeat(minIndent)) ? l.slice(minIndent) : l)).join("\n");
}

function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "untitled";
}

function getTitle(properties) {
  const titleProp = Object.values(properties).find((p) => p.type === "title");
  const text = titleProp?.title?.map((t) => t.plain_text).join("") ?? "";
  return text.trim() || "Untitled";
}

function getDate(properties, fallbackISO) {
  const dateProp = Object.values(properties).find((p) => p.type === "date");
  return dateProp?.date?.start ?? fallbackISO.slice(0, 10);
}

function getTags(properties) {
  const multiSelect = Object.values(properties).find((p) => p.type === "multi_select");
  return multiSelect?.multi_select?.map((t) => t.name) ?? [];
}

function stripTranscriptDisclaimer(text) {
  return text
    .split("\n")
    .filter((l) => !(l.trim().startsWith(">") && /트랜스크립트|전사 품질/.test(l)))
    .join("\n");
}

// Notion's audio transcription block stores AI-generated notes as the first
// child group, followed by the raw speech-to-text transcript as later groups.
// We only want the curated notes, not the raw dictation.
async function renderTranscriptionBlock(block) {
  const groups = await notion.blocks.children.list({ block_id: block.id });
  const notesGroup = groups.results[0];
  if (!notesGroup) return "";
  const mdBlocks = await n2m.pageToMarkdown(notesGroup.id);
  return n2m.toMarkdownString(mdBlocks).parent;
}

async function pageToMarkdownBody(pageId) {
  const topLevel = await notion.blocks.children.list({ block_id: pageId });
  const transcriptionBlocks = topLevel.results.filter((b) => b.type === "transcription");

  let body;
  if (transcriptionBlocks.length > 0) {
    const parts = await Promise.all(transcriptionBlocks.map(renderTranscriptionBlock));
    body = parts.join("\n\n");
  } else {
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    body = n2m.toMarkdownString(mdBlocks).parent;
  }

  return dedent(stripTranscriptDisclaimer(body ?? ""));
}

async function fetchAllPages() {
  const pages = [];
  let cursor = undefined;
  do {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
    });
    pages.push(...response.results.filter(isFullPage));
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);
  return pages;
}

function frontmatter({ title, date, tags, notionUrl, lastEditedTime }) {
  const lines = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `date: ${date}`,
    tags.length ? `tags: [${tags.map((t) => JSON.stringify(t)).join(", ")}]` : "tags: []",
    `notion_url: ${notionUrl}`,
    `last_edited_time: ${lastEditedTime}`,
    "---",
    "",
  ];
  return lines.join("\n");
}

async function loadManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const manifest = await loadManifest();
  const nextManifest = {};

  const pages = await fetchAllPages();

  for (const page of pages) {
    const title = getTitle(page.properties);
    const date = getDate(page.properties, page.created_time);
    const tags = getTags(page.properties);

    const body = await pageToMarkdownBody(page.id);

    // Skip blank/placeholder database rows (no title and no content).
    if (title === "Untitled" && body.trim() === "") continue;

    const fileName = `${date}-${slugify(title)}.md`;
    const filePath = path.join(OUT_DIR, fileName);

    const content =
      frontmatter({
        title,
        date,
        tags,
        notionUrl: page.url,
        lastEditedTime: page.last_edited_time,
      }) +
      body +
      "\n";

    await fs.writeFile(filePath, content, "utf8");
    nextManifest[page.id] = fileName;
  }

  // Remove files for pages that no longer exist in Notion (deleted/archived).
  for (const [pageId, fileName] of Object.entries(manifest)) {
    if (!nextManifest[pageId]) {
      await fs.rm(path.join(OUT_DIR, fileName), { force: true });
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(nextManifest, null, 2) + "\n", "utf8");

  console.log(`Synced ${pages.length} TIL entries from Notion.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
