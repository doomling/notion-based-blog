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
        <div className={styles.terminalTag}>
          $ ./doomling --area carrera_tech
        </div>
        <div className={styles.commentTag}>
          {"// recursos & educación en tecnología"}
        </div>
        <h1>Te ayudo a ordenar tu carrera en tecnología</h1>
        <p>Clases, kits y recursos para dar el siguiente paso</p>
        <div className={styles.buttons}>
          <Link href="/consultoria">
            <Button primary text="Consultoría 1:1" />
          </Link>
          <a href="#proyectos">
            <Button text="Trabajemos juntos" />
          </a>
        </div>
      </div>
    </section>
  );
}
