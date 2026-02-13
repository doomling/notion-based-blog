import { addKitPurchase, decrementKitStock } from "../../../lib/mongodb";

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

  const { orderId, email: providedEmail, kitIdFromUrl } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Missing orderId" });
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to capture PayPal order");
    }

    // Check if order was successfully captured
    if (data.status !== "COMPLETED") {
      return res.status(400).json({
        error: `Order status is ${data.status}, expected COMPLETED`,
        status: data.status,
      });
    }

    let kitId =
      data.purchase_units?.[0]?.custom_id ||
      data.purchase_units?.[0]?.reference_id ||
      null;
    // PayPal sometimes returns "default" for custom_id; use kit from return URL when invalid
    if (!kitId || kitId === "default") {
      kitId = kitIdFromUrl && String(kitIdFromUrl).trim() ? kitIdFromUrl.trim() : null;
    }
    const payerEmail =
      (providedEmail && String(providedEmail).trim()) ||
      data.payer?.email_address ||
      null;

    if (!kitId) {
      return res.status(400).json({ error: "Kit ID not found in order" });
    }

    if (!payerEmail) {
      return res.status(400).json({ error: "Email not found in order" });
    }

    // Decrement stock and record purchase
    const stockOk = await decrementKitStock(kitId);
    if (stockOk) {
      await addKitPurchase(payerEmail, kitId, orderId);
    } else {
      return res.status(409).json({ error: "No hay cupos disponibles" });
    }

    return res.status(200).json({
      status: data.status,
      kitId,
      email: payerEmail,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to capture PayPal order" });
  }
}
