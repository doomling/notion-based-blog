import Link from "next/link";
import Button from "../Button";
import styles from "./style.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.waveContainer}>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
      </div>
      <div className={styles.heroContent}>
        <h1>Te ayudo a ordenar tu carrera en tecnología</h1>
        <p>Clases, kits y recursos para dar el siguiente paso</p>
        <div className={styles.buttons}>
          <Link href="/recursos">
            <Button primary text="Explorar recursos" />
          </Link>
          <a href="#proyectos">
            <Button text="Trabajemos juntos" />
          </a>
        </div>
      </div>
    </section>
  );
}
