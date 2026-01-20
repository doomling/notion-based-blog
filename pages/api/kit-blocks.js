import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { kitId } = req.query;

  if (!kitId) {
    return res.status(400).json({ error: "Missing kitId" });
  }

  try {
    const blocks = await notion.blocks.children.list({
      block_id: kitId,
    });

    const mappedBlocks = await Promise.all(
      blocks.results.map(async (block) => {
        let filteredBlock = { ...block };

        if (block.has_children) {
          const response = await notion.blocks.children.list({
            block_id: block.id,
            page_size: 50,
          });
          filteredBlock[block.type].children = response.results;
        }

        delete filteredBlock.object;
        delete filteredBlock.id;
        delete filteredBlock.parent;
        delete filteredBlock.created_time;
        delete filteredBlock.last_edited_time;
        delete filteredBlock.created_by;
        delete filteredBlock.last_edited_by;
        delete filteredBlock.archived;

        return filteredBlock;
      })
    );

    return res.status(200).json({ blocks: mappedBlocks });
  } catch (error) {
    console.error("Error fetching kit blocks:", error);
    return res.status(500).json({ error: "Failed to fetch blocks" });
  }
}
