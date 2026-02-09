import { addKitPurchase, decrementKitStock } from "../../../lib/mongodb";

const PAYPAL_BASE_URL = "https://api-m.paypal.com";

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

  const { orderId } = req.body;

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

    const kitId =
      data.purchase_units?.[0]?.custom_id ||
      data.purchase_units?.[0]?.reference_id ||
      null;
    const payerEmail = data.payer?.email_address || null;

    if (payerEmail && kitId) {
      const stockOk = await decrementKitStock(kitId);
      if (stockOk) {
        await addKitPurchase(payerEmail, kitId, orderId);
      } else {
        console.warn(`Stock exhausted for kit ${kitId} on PayPal order ${orderId}`);
      }
    }

    return res.status(200).json({
      status: data.status,
      kitId,
      email: payerEmail,
    });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return res.status(500).json({ error: "Failed to capture PayPal order" });
  }
}
