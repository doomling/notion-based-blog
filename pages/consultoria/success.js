import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../../components/Nav";
import kitStyles from "../../styles/Kit.module.scss";
import styles from "../../styles/Consultoria.module.scss";


export default function ConsultoriaSuccess() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const status = router.query.status;
  const paymentId = router.query.payment_id;
  const sessionId = router.query.session_id;

  useEffect(() => {
    if (!router.isReady) return;

    // MercadoPago success
    if (status === "approved" && paymentId) {
      fetch(`/api/payment-details?payment_id=${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            setEmail(data.email);
            fetch("/api/consultoria-mp-confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: data.email, paymentId }),
            }).catch(() => {});
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    // Stripe success
    if (sessionId) {
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => { if (data.email) setEmail(data.email); })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    setLoading(false);
  }, [router.isReady, status, paymentId, sessionId]);

  if (loading) {
    return (
      <>
        <Nav />
        <div className={styles.bookingSection}>
          <div className={kitStyles.terminalHeader} style={{ justifyContent: "center" }}>
            <span className={kitStyles.terminalBracket}>[</span>
            {" "}verificando_pago{" "}
            <span className={kitStyles.terminalBracket}>]</span>
          </div>
          <div className={kitStyles.commandLine} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            $ ./consulta --estado verificando
          </div>
          <p className={kitStyles.secureNote} style={{ fontSize: "0.9rem", color: "#555" }}>
            {"// confirmando tu reserva..."}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className={styles.bookingSection}>
        <div className={kitStyles.terminalHeader} style={{ justifyContent: "center" }}>
          <span className={kitStyles.terminalBracket}>[</span>
          {" "}reserva_confirmada{" "}
          <span className={kitStyles.terminalBracket}>]</span>
          <span className={kitStyles.statusDot} />
        </div>
        <div className={kitStyles.commandLine} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          $ ./consulta --estado{" "}
          <span className={kitStyles.commandArg}>aprobado</span>
        </div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem", color: "#f8faff" }}>
          ¡Todo listo!
        </h1>
        <p style={{ color: "#888" }}>
          Tu pago fue procesado correctamente.
          {email ? ` Confirmación enviada a ${email}.` : ""}
        </p>
        <p style={{ color: "#888", marginBottom: "2rem" }}>
          Ahora elegí el horario que mejor te quede.
        </p>
        <a
          href="/api/booking-redirect"
          target="_blank"
          rel="noreferrer"
          className={styles.bookingButton}
        >
          → elegir horario en el calendario
        </a>
      </div>
    </>
  );
}
