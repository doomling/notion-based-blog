import Link from "next/link";
import Button from "../Button";
import styles from "./style.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1>Acá se crea côdigo, cultura y arte digital</h1>
      <p>Contenido tecnico, experimental y curioso para mentes inquietas</p>
      <Link href="/recursos">
        <Button primary text="Explorar recursos" />
      </Link>
      <Button text="Trabajemos juntos" />
    </section>
  );
}
