import styles from "./style.module.scss";

export default function Boxes({ items }) {
  return (
    <section className={styles.entries}>
      {items.map((item, i) => {
        return (
          <a href={item.link} key={i} target="_blank" rel="noreferrer">
            <div className={styles.item} key={i}>
              <img src={item.img} alt="imagen decorativa" />
              <div className={styles.name}>
                <h3>{item.name}</h3>
              </div>
            </div>
          </a>
        );
      })}
    </section>
  );
}
