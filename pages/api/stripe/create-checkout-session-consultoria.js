import Stripe from "stripe";
import { getSlots } from "../../../lib/slots";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email inválido" });
  }

  const priceUsd = Number(process.env.CONSULTORIA_PRICE_USD);
  if (!priceUsd || isNaN(priceUsd) || priceUsd <= 0) {
    return res.status(500).json({ error: "Precio USD de consultoría no configurado" });
  }

  const slots = getSlots();
  if (slots !== null && slots <= 0) {
    return res.status(409).json({ error: "No hay cupos disponibles" });
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const protocol = isLocalhost ? "http" : (req.headers["x-forwarded-proto"]?.split(",")[0]?.trim() || "https");
  const rawBase = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${protocol}://${host}` : "http://localhost:3000");
  const baseUrl = rawBase.replace(/\/$/, "");

  try {
    console.log("Stripe consultoria success_url:", `${baseUrl}/consultoria/success?session_id={CHECKOUT_SESSION_ID}`);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Consultoría 1:1 - 60 min" },
            unit_amount: Math.round(priceUsd * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      metadata: { email, type: "consultoria" },
      success_url: `${baseUrl}/consultoria/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/consultoria`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe consultoria error:", error?.message || error);
    return res.status(500).json({ error: error?.message || "Error al crear sesión de pago" });
  }
}
