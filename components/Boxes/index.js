import styles from "./style.module.scss";

export default function Boxes({ items }) {
  return (
    <section className={styles.entries}>
      {items.map((item, i) => {
        return (
          <div className={styles.item} key={i}>
            <img src={item.img} />
            <div className={styles.name}>
              <h3>{item.name}</h3>
            </div>
          </div>
        );
      })}
    </section>
  );
}
