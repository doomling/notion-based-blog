import Link from "next/link";
import Button from "../Button";
import styles from "./style.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1>Acá se crea côdigo, cultura y arte digital</h1>
      <p>Contenido tecnico, experimental y curioso para mentes ignquietas</p>
      <Link href="/recursos">
        <Button primary text="Explorar recursos" />
      </Link>
      <a href="#proyectos">
        {" "}
        <Button text="Trabajemos juntos" />
      </a>
    </section>
  );
}
