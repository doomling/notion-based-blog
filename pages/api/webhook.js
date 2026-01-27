import { MercadoPagoConfig, Payment } from "mercadopago";
import { addKitPurchase } from "../../lib/mongodb";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, data } = req.body;

  if (type === "payment") {
    try {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: data.id });

      if (paymentData.status === "approved") {
        const kitId = paymentData.external_reference;
        const payerEmail = paymentData.payer?.email;

        if (payerEmail && kitId) {
          await addKitPurchase(payerEmail, kitId, data.id);
          console.log(`Payment approved for kit ${kitId} by ${payerEmail}`);
        }
      }
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(500).json({ error: "Webhook processing failed" });
    }
  }

  return res.status(200).json({ received: true });
}
