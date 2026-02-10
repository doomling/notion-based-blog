import { MercadoPagoConfig, Preference } from "mercadopago";
import { getKitStock } from "../../lib/mongodb";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { kitId, kitName, price, email } = req.body;

  if (!kitId || !kitName || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Get base URL from request headers or environment variable
  const protocol = req.headers['x-forwarded-proto'] || (req.headers.host?.includes('localhost') ? 'http' : 'https');
  const host = req.headers.host || req.headers['x-forwarded-host'];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${protocol}://${host}` : 'http://localhost:3000');

  try {
    const stock = await getKitStock(kitId);
    if (stock !== null && stock <= 0) {
      return res.status(409).json({ error: "No hay cupos disponibles" });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: kitId,
            title: kitName,
            quantity: 1,
            unit_price: Number(price),
            currency_id: "ARS",
          },
        ],
        payer: email ? { email } : undefined,
        metadata: email ? { email } : undefined,
        back_urls: {
          success: `${baseUrl}/kits/success?kit=${kitId}`,
          failure: `${baseUrl}/kits/failure`,
          pending: `${baseUrl}/kits/pending`,
        },
        auto_return: "approved",
        external_reference: kitId,
        notification_url: `${baseUrl}/api/webhook`,
      },
    });

    return res.status(200).json({
      id: result.id,
      init_point: result.init_point,
    });
  } catch (error) {
    console.error("Mercado Pago error:", error);
    return res.status(500).json({ error: "Failed to create preference" });
  }
}
