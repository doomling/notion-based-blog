import { hasUserPurchasedKit } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, kitId } = req.query;

  if (!email || !kitId) {
    return res.status(400).json({ error: "Missing email or kitId" });
  }

  try {
    const hasAccess = await hasUserPurchasedKit(email, kitId);
    return res.status(200).json({ hasAccess });
  } catch (error) {
    console.error("Error checking kit access:", error);
    return res.status(500).json({ error: "Failed to check access" });
  }
}
