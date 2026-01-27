import Link from "next/link";
import styles from "./style.module.scss";

export default function KitCard({ kit }) {
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(kit.price);

  // Generate URL from niceUrl or fallback to ID
  const kitUrl = kit.niceUrl || kit.id;

  return (
    <Link href={`/kits/${kitUrl}`} className={styles.card}>
      {kit.cover && (
        <div className={styles.coverWrapper}>
          <img src={kit.cover} alt={kit.name} className={styles.cover} />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{kit.name}</h3>
        <p className={styles.description}>{kit.description}</p>
        <div className={styles.priceTag}>{formattedPrice}</div>
      </div>
      <div className={styles.buyButton}>
        Ver más
      </div>
    </Link>
  );
}
