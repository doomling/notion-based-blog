// Use environment variable to switch between sandbox and production
// Set PAYPAL_ENVIRONMENT=sandbox for testing, or production for live
const PAYPAL_ENV = process.env.PAYPAL_ENVIRONMENT || "sandbox";
const PAYPAL_BASE_URL =
  PAYPAL_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || "Failed to get PayPal token");
  }

  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { kitId, kitName, priceUsd, email } = req.body;

  if (!kitId || !kitName || !priceUsd) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate email format if provided
  if (email && (!email.includes("@") || !email.includes("."))) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate price is a positive number
  const price = Number(priceUsd);
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "Invalid price" });
  }

  const protocol =
    req.headers["x-forwarded-proto"] ||
    (req.headers.host?.includes("localhost") ? "http" : "https");
  const host = req.headers.host || req.headers["x-forwarded-host"];
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (host ? `${protocol}://${host}` : "http://localhost:3000");

  try {
    const { getKitStock } = await import("../../../lib/mongodb");
    const stock = await getKitStock(kitId);
    if (stock !== null && stock <= 0) {
      return res.status(409).json({ error: "No hay cupos disponibles" });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: kitId,
            description: kitName,
            amount: {
              currency_code: "USD",
              value: price.toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: `${baseUrl}/kits/success?provider=paypal&kit=${kitId}`,
          cancel_url: `${baseUrl}/kits/${kitId}?paypal=cancelled`,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create PayPal order");
    }

    const approveUrl =
      data.links?.find((link) => link.rel === "approve")?.href || null;

    return res.status(200).json({
      id: data.id,
      approveUrl,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create PayPal order" });
  }
}
