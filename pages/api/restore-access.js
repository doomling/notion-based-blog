import { getDb } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email inválido" });
  }

  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({
      email,
      "purchasedKits": { $exists: true, $ne: [] },
    });

    if (!user || !user.purchasedKits || user.purchasedKits.length === 0) {
      return res.status(200).json({
        hasPurchases: false,
        message: "No se encontraron compras para este email",
      });
    }

    // Return purchased kit IDs
    const purchasedKitIds = user.purchasedKits.map((purchase) => purchase.kitId);

    return res.status(200).json({
      hasPurchases: true,
      email: user.email,
      purchasedKits: purchasedKitIds,
      message: "Acceso restaurado correctamente",
    });
  } catch (error) {
    console.error("Error restoring access:", error);
    return res.status(500).json({ error: "Error al restaurar acceso" });
  }
}
