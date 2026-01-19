import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { payment_id } = req.query;

  if (!payment_id) {
    return res.status(400).json({ error: "Missing payment_id" });
  }

  try {
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: payment_id });

    return res.status(200).json({
      email: paymentData.payer?.email,
      status: paymentData.status,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return res.status(500).json({ error: "Failed to fetch payment details" });
  }
}
