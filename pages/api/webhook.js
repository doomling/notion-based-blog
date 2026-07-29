import { MercadoPagoConfig, Payment } from "mercadopago";
import { addKitPurchase, decrementKitStock } from "../../lib/mongodb";
import { sendConsultoriaBookingEmail } from "../../lib/email";

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
        const payerEmail = paymentData.metadata?.email || paymentData.payer?.email;

        if (payerEmail && kitId) {
          const stockOk = await decrementKitStock(kitId);
          if (stockOk) {
            await addKitPurchase(payerEmail, kitId, data.id);
          }

          // Deliver the booking link server-side so it no longer depends on
          // the buyer completing the MercadoPago redirect back to the site.
          if (kitId === "consultoria-1on1") {
            await sendConsultoriaBookingEmail(payerEmail, data.id);
          }
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Webhook processing failed" });
    }
  }

  return res.status(200).json({ received: true });
}
