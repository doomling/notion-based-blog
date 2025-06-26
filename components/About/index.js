import styles from "./style.module.scss";

export default function About() {
  return (
   <section className={styles.about}>
    <p>Mi description</p>
    <img src="/doomling.svg"/>
   </section>
  );
}
