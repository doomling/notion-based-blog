import styles from "./style.module.scss";
import Button from "../Button";

export default function Contact() {
  return (
    <section className={styles.formContainer}>
      <form className={styles.form}>
        <input placeholder="Tu nombre" />
        <tu placeholder="Tu mail" />
        <textarea placeholder="Contame que estás buscando" />
        <Button text="Contactame" />
      </form>
    </section>
  );
}
