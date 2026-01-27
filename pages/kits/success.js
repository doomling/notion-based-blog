import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../../components/Nav";
import styles from "../../styles/Home.module.scss";

export default function Success() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const kitId = router.query.kit;
  const paymentId = router.query.payment_id;
  const status = router.query.status;

  useEffect(() => {
    if (!router.isReady) return;
    
    if (status === "approved" && kitId && paymentId) {
      // Fetch payment details to get email
      fetch(`/api/payment-details?payment_id=${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            // Store email in localStorage for persistent access
            localStorage.setItem("userEmail", data.email);
            // Redirect to kit with email for access check
            router.push(`/kits/${kitId}?email=${encodeURIComponent(data.email)}`);
          } else {
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching payment details:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [router.isReady, kitId, paymentId, status]);

  if (loading) {
    return (
      <>
        <Nav />
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <h1>Procesando pago...</h1>
            <p>Por favor espera mientras verificamos tu pago.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h1>¡Pago exitoso!</h1>
          <p>Tu pago ha sido procesado correctamente.</p>
          {kitId && (
            <a href={`/kits/${kitId}`} style={{ color: "#4CAF50" }}>
              Ver tu kit
            </a>
          )}
        </div>
      </div>
    </>
  );
}
