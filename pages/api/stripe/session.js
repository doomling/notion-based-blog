import Stripe from "stripe";
import { addKitPurchase, decrementKitStock } from "../../../lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Pago no completado" });
    }

    const email =
      session.metadata?.email ||
      session.customer_email ||
      session.customer_details?.email ||
      null;

    const kitId = session.metadata?.kitId || null;
    const type = session.metadata?.type;

    if (type === "kit" && kitId && email) {
      const stockOk = await decrementKitStock(kitId);
      if (stockOk) {
        await addKitPurchase(email, kitId, session.id);
      } else {
        return res.status(409).json({ error: "No hay cupos disponibles" });
      }
    } else if (type === "consultoria" && email) {
      await addKitPurchase(email, "consultoria-1on1", session.id);
    }

    return res.status(200).json({ email, kitId, type });
  } catch (error) {
    console.error("Stripe session error:", error?.message || error);
    return res.status(500).json({ error: error?.message || "Error al verificar el pago" });
  }
}
