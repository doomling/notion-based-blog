import Link from "next/link";
import styles from "./style.module.scss";
import Title from "../Title";

export default function Featured({ data }) {
  return (
    <div className={styles.entry}>
      <p>
        Hola, mi nombre es Bel Rey y soy programadora, emprendedora y creadora
        de contenido. En este blog vas a encontrar artículos sobre todos estos
        temas. También podés encontrar{" "}
        <Link href={"/about"}>más info sobre mi</Link> y lo que hago o{" "}
        <Link href={"/colaboraciones"}>contactarme</Link> para hacer una
        colaboración
      </p>
    </div>
  );
}
