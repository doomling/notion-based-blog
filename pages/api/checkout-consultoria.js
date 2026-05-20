import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email inválido" });
  }

  const price = Number(process.env.CONSULTORIA_PRICE_ARS);
  if (!price || isNaN(price) || price <= 0) {
    return res.status(500).json({ error: "Precio de consultoría no configurado" });
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const protocol = isLocalhost ? "http" : (req.headers["x-forwarded-proto"]?.split(",")[0]?.trim() || "https");
  const rawBase = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${protocol}://${host}` : "http://localhost:3000");
  const baseUrl = rawBase.replace(/\/$/, "");

  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: "consultoria-1on1",
            title: "Consultoría 1:1 - 60 min",
            quantity: 1,
            unit_price: price,
            currency_id: "ARS",
          },
        ],
        payer: { email },
        metadata: { email },
        back_urls: {
          success: `${baseUrl}/consultoria/success`,
          failure: `${baseUrl}/consultoria`,
          pending: `${baseUrl}/consultoria/success`,
        },
        auto_return: "approved",
        external_reference: "consultoria-1on1",
        notification_url: `${baseUrl}/api/webhook`,
      },
    });

    return res.status(200).json({ init_point: result.init_point });
  } catch (error) {
    return res.status(500).json({ error: "Error al crear la preferencia de pago" });
  }
}
