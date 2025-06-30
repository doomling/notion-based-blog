import styles from "./style.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1>La hero tag sobre codigo, cultura y arte digital</h1>
      <p>Contenido tecnico, experimental y curioso para mentes inquietas</p>
      <button>Trabajemos juntos</button>
      <button>Leer blog</button>
    </section>
  );
}
