import { setKitStock } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = req.headers["x-admin-secret"] || req.body?.secret;
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { kitId, stock } = req.body;

  if (!kitId) {
    return res.status(400).json({ error: "Missing kitId" });
  }

  if (stock !== null && (typeof stock !== "number" || Number.isNaN(stock))) {
    return res.status(400).json({ error: "Invalid stock" });
  }

  try {
    const updated = await setKitStock(kitId, stock);
    return res.status(200).json({ kitId, stock: updated });
  } catch (error) {
    console.error("Set kit stock error:", error);
    return res.status(500).json({ error: "Failed to set stock" });
  }
}
