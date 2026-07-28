import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pageIds = process.env.DEBUG_PAGE_IDS.split(",");

function preview(block) {
  const type = block.type;
  const rich = block[type]?.rich_text;
  const text = rich?.map((t) => t.plain_text).join("") ?? "";
  return `[${type}]${block.has_children ? "(has_children)" : ""} ${text.slice(0, 60)}`;
}

async function listChildren(blockId, depth) {
  let cursor;
  do {
    const res = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor });
    for (const block of res.results) {
      console.log("  ".repeat(depth) + preview(block));
      if (block.has_children && depth < 2) {
        await listChildren(block.id, depth + 1);
      }
    }
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
}

for (const pageId of pageIds) {
  console.log(`\n=== PAGE ${pageId} ===`);
  await listChildren(pageId.trim(), 0);
}
