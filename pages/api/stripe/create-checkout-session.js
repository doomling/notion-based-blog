import Stripe from "stripe";
import { getKitStock } from "../../../lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { kitId, kitName, priceUsd, email } = req.body;
  if (!kitId || !kitName || !priceUsd) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const price = Number(priceUsd);
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "Invalid price" });
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const protocol = isLocalhost ? "http" : (req.headers["x-forwarded-proto"]?.split(",")[0]?.trim() || "https");
  const rawBase = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${protocol}://${host}` : "http://localhost:3000");
  const baseUrl = rawBase.replace(/\/$/, "");

  try {
    const stock = await getKitStock(kitId);
    if (stock !== null && stock <= 0) {
      return res.status(409).json({ error: "No hay cupos disponibles" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: kitName },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email || undefined,
      metadata: { kitId, email: email || "", type: "kit" },
      success_url: `${baseUrl}/kits/success?session_id={CHECKOUT_SESSION_ID}&kit=${kitId}`,
      cancel_url: `${baseUrl}/kits/${kitId}`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error?.message || error);
    return res.status(500).json({ error: error?.message || "Error al crear sesión de pago" });
  }
}
