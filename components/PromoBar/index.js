import styles from "./style.module.scss";

const PROMO_URL =
  "https://codigofacilito.com/bootcamps/fullstack-javascript-g2?username=doomling";

export default function PromoBar() {
  return (
    <a
      href={PROMO_URL}
      target="_blank"
      rel="noreferrer"
      className={styles.promoBar}
    >
      <span className={styles.text}>
        Bootcamp de desarrollo fullstack con Typescript y supabase{" "}
        <span className={styles.highlight}>70% OFF</span> — cupos limitados
      </span>
      <span className={styles.cta}>→</span>
    </a>
  );
}
