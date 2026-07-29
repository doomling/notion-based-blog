import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM;
const replyToAddress = process.env.RESEND_REPLY_TO;

const resend = apiKey ? new Resend(apiKey) : null;

// In-memory guard so MercadoPago webhook retries don't email the same
// buyer twice. Consistent with lib/slots.js — good enough for this volume.
if (!global._consultoriaEmailsSent) {
  global._consultoriaEmailsSent = new Set();
}

export function bookingEmailAlreadySent(paymentId) {
  return global._consultoriaEmailsSent.has(String(paymentId));
}

/**
 * Sends the consultoría buyer the calendar link so booking no longer depends
 * on them completing the MercadoPago redirect. Safe to call unconditionally:
 * it no-ops (and logs) when Resend or the calendar URL isn't configured.
 *
 * @returns {Promise<boolean>} true if an email was sent.
 */
export async function sendConsultoriaBookingEmail(email, paymentId) {
  const calendarUrl = process.env.NOTION_CALENDAR_URL;

  if (!email) return false;
  if (paymentId && bookingEmailAlreadySent(paymentId)) return false;

  if (!resend || !fromAddress) {
    console.warn(
      "[email] Resend not configured (RESEND_API_KEY / RESEND_FROM missing) — skipping booking email",
    );
    return false;
  }
  if (!calendarUrl) {
    console.warn("[email] NOTION_CALENDAR_URL missing — skipping booking email");
    return false;
  }

  try {
    await resend.emails.send({
      from: fromAddress,
      to: email,
      ...(replyToAddress ? { replyTo: replyToAddress } : {}),
      subject: "Tu consultoría 1:1 — elegí tu horario",
      html: bookingEmailHtml(calendarUrl),
      text: bookingEmailText(calendarUrl),
    });
    if (paymentId) global._consultoriaEmailsSent.add(String(paymentId));
    return true;
  } catch (error) {
    console.error("[email] Failed to send booking email:", error?.message || error);
    return false;
  }
}

function bookingEmailText(calendarUrl) {
  return [
    "¡Gracias por tu compra!",
    "",
    "Tu pago fue confirmado. Ahora elegí el horario que mejor te quede:",
    calendarUrl,
    "",
    "Nos vemos pronto.",
  ].join("\n");
}

function bookingEmailHtml(calendarUrl) {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
    <h1 style="font-size: 1.4rem; margin-bottom: 0.5rem;">¡Todo listo!</h1>
    <p style="color: #444; line-height: 1.5;">
      Tu pago fue confirmado. Ahora elegí el horario que mejor te quede para tu
      sesión de consultoría 1:1.
    </p>
    <p style="margin: 1.75rem 0;">
      <a href="${calendarUrl}"
         style="display: inline-block; background: #6d28d9; color: #fff; text-decoration: none; padding: 0.85rem 1.5rem; border-radius: 8px; font-weight: 600;">
        → Elegir horario en el calendario
      </a>
    </p>
    <p style="color: #888; font-size: 0.85rem; line-height: 1.5;">
      Si el botón no funciona, copiá y pegá este link:<br />
      <a href="${calendarUrl}" style="color: #6d28d9;">${calendarUrl}</a>
    </p>
  </div>`;
}
