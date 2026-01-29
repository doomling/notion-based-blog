import styles from "./style.module.scss";

export default function About() {
  return (
    <section className={styles.about}>
      <div>
        <h2>¿Quién soy?</h2>
        <p className={styles.description}>
          Soy programadora, docente y creadora visual. Investigo, diseño y
          construyo proyectos digitales que cruzan arte, tecnología y comunidad.
        </p>
        <ul>
          <li>🎨 +10 años de diseño tech </li>
          <li>💻 Programadora fullstack en productos reales</li>
          <li> 📚 Docente en bootcamps, talleres y charlas</li>
        </ul>
      </div>
      <img src="/bel-avatar.png" alt="Una foto de Bel Rey con su gato" />
    </section>
  );
}
