import styles from "./../../styles/Home.module.scss";
const Substack = () => {
  return (
    <>
      <p className={styles.cta}>
        Sigamos en contacto: suscribite a Sin códigos, mi newsletter quincenal.
        También podés seguirme en redes para estar al tanto de todo mi nuevo
        contenido
      </p>
      <iframe
        src="https://iamdoomling.substack.com/embed"
        width="100%"
        height="320"
        style={{ border: "1px solid #EEE", background: "white" }}
        frameborder="0"
        scrolling="no"
      ></iframe>
    </>
  );
};

export default Substack;
