import { getDb } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Test connection
    const db = await getDb();
    
    // Test query - get collection stats
    const collections = await db.listCollections().toArray();
    const usersCount = await db.collection("users").countDocuments();
    
    return res.status(200).json({
      connected: true,
      database: "blog",
      collections: collections.map(c => c.name),
      usersCount: usersCount,
      message: "MongoDB connection successful",
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return res.status(500).json({
      connected: false,
      error: error.message,
      message: "Failed to connect to MongoDB",
    });
  }
}
