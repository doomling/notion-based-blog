import { addKitPurchase } from "../../lib/mongodb";
import { decrementSlots } from "../../lib/slots";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, paymentId } = req.body;
  if (!email || !paymentId) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  decrementSlots(paymentId);
  await addKitPurchase(email, "consultoria-1on1", paymentId);

  return res.status(200).json({ ok: true });
}
