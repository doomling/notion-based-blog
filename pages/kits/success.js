import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../../components/Nav";
import styles from "../../styles/Home.module.scss";
import kitStyles from "../../styles/Kit.module.scss";

export default function Success() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const kitId = router.query.kit;
  const paymentId = router.query.payment_id;
  const status = router.query.status;
  const sessionId = router.query.session_id;

  useEffect(() => {
    if (!router.isReady) return;

    // MercadoPago success
    if (status === "approved" && kitId && paymentId) {
      fetch(`/api/payment-details?payment_id=${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            try { localStorage.setItem("userEmail", data.email); } catch (e) {}
            router.push(`/kits/${kitId}?email=${encodeURIComponent(data.email)}`);
          } else {
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
      return;
    }

    // Stripe success
    if (sessionId) {
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email && data.kitId) {
            try { localStorage.setItem("userEmail", data.email); } catch (e) {}
            router.push(`/kits/${data.kitId}?email=${encodeURIComponent(data.email)}`);
          } else {
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
      return;
    }

    setLoading(false);
  }, [router.isReady, kitId, paymentId, status, sessionId]);

  if (loading) {
    return (
      <>
        <Nav />
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div className={kitStyles.terminalHeader} style={{ justifyContent: "center" }}>
              <span className={kitStyles.terminalBracket}>[</span>
              {" "}procesando_pago{" "}
              <span className={kitStyles.terminalBracket}>]</span>
            </div>
            <div className={kitStyles.commandLine} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              $ ./verificar --pago en_curso
            </div>
            <p className={kitStyles.secureNote} style={{ fontSize: "0.9rem", color: "#666" }}>
              // esperá mientras verificamos tu transacción...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div className={kitStyles.terminalHeader} style={{ justifyContent: "center" }}>
            <span className={kitStyles.terminalBracket}>[</span>
            {" "}pago_exitoso{" "}
            <span className={kitStyles.terminalBracket}>]</span>
            <span className={kitStyles.statusDot} />
          </div>
          <div className={kitStyles.commandLine} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            $ ./acceso --estado{" "}
            <span className={kitStyles.commandArg}>confirmado</span>
          </div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>¡Todo listo!</h1>
          <p style={{ color: "#888" }}>Tu pago fue procesado correctamente.</p>
          {kitId && (
            <a href={`/kits/${kitId}`} className={kitStyles.buyButton}
              style={{ display: "inline-block", marginTop: "1.5rem", width: "auto", padding: "14px 32px", textDecoration: "none" }}>
              → ver tu kit
            </a>
          )}
        </div>
      </div>
    </>
  );
}
