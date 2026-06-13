import { useState } from "react";
import Nav from "../../components/Nav";
import kitStyles from "../../styles/Kit.module.scss";
import styles from "../../styles/Consultoria.module.scss";
import { getCountryFromRequest } from "../../lib/geo";
import { getSlots } from "../../lib/slots";

export default function Consultoria({ countryCode, priceArs, priceUsd, stock }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isArgentina = countryCode === "AR";
  const isOutOfStock = typeof stock === "number" && stock <= 0;

  const formattedPrice = isArgentina
    ? new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(priceArs)
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(priceUsd);

  const handlePurchase = async () => {
    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout-consultoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar el pago");
      if (data.init_point) {
        window.location.href = data.init_point;
        return;
      }
      throw new Error("No se pudo crear el link de pago");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStripePurchase = async () => {
    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "/api/stripe/create-checkout-session-consultoria",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar el pago");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No se pudo crear el link de pago");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className={styles.page}>
        <div className={kitStyles.terminalHeader}>
          <span className={kitStyles.terminalBracket}>[</span> doomling{" "}
          <span className={kitStyles.terminalBracket}>]</span>
          <span className={kitStyles.statusDot} />
        </div>
        <div className={kitStyles.commandLine}>
          $ ./consulta{" "}
          <span className={kitStyles.commandArg}>--area carrera_tech</span>
        </div>
        <div className={kitStyles.commentLine}>{"// mentoring & orientación"}</div>

        <h1 className={styles.headline}>
          Impulsá tu <span className={styles.accentWord}>carrera</span> en
          tecnología.
        </h1>
        <p className={styles.subheadline}>
          Una hora sin filtros.
          <br />
          Con alguien que ya recorrió el camino.
        </p>

        <div className={styles.formatCard}>
          <div className={kitStyles.commentLine}>{"// formato"}</div>
          <div className={styles.sessionLabel}>
            Sesión 1:1 de consultoría
            <span className={styles.durationTag}>60 min</span>
          </div>
          <div className={styles.tags}>
            <span className={styles.tag}>#carrera</span>
            <span className={styles.tag}>#freelance</span>
            <span className={styles.tag}>#tech-local</span>
            <span className={styles.tag}>#orientación</span>
          </div>
        </div>

        <div className={styles.topicsGrid}>
          <div>
            <p>Perfil público y reputación online</p>
            <p>Mercado tech actual y tendencias</p>
          </div>
          <div>
            <p>Manejo de clientes freelance</p>
            <p>Transición a otros roles</p>
          </div>
        </div>

        <div className={styles.buySection}>
          <input
            type="email"
            placeholder="// tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.emailInput}
          />
          {error && <div className={kitStyles.errorMessage}>{error}</div>}
          <button
            onClick={isArgentina ? handlePurchase : handleStripePurchase}
            disabled={loading || isOutOfStock}
            className={kitStyles.buyButton}
          >
            {isOutOfStock
              ? "Sin cupos disponibles"
              : loading
              ? "procesando..."
              : `→ reservar sesión · ${formattedPrice}`}
          </button>
          <p className={kitStyles.secureNote}>
            {isArgentina
              ? "Pago seguro con Mercado Pago."
              : "Pago seguro con Stripe."}{" "}
            Recibirás el link de la sesión por email.
          </p>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const overrideCountry =
    query.country && /^[A-Za-z]{2}$/.test(String(query.country).trim())
      ? String(query.country).trim().toUpperCase()
      : null;
  const countryCode = overrideCountry || getCountryFromRequest(req) || null;

  const stock = getSlots();

  return {
    props: {
      countryCode,
      priceArs: Number(process.env.CONSULTORIA_PRICE_ARS) || 0,
      priceUsd: Number(process.env.CONSULTORIA_PRICE_USD) || 0,
      stock,
    },
  };
}
