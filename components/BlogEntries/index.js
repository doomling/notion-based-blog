import styles from "./style.module.scss";
import Entry from "../Entry";

export default function BlogEntries({ entries }) {
  return (
    <section>
      {entries.length == 0 && "There are no entries"}
      {entries.length != 0 && (
        <>
          <h2>Blog</h2>
          <section className={styles.entries}>
            {entries.map((entry, key) => {
              return <Entry key={key} data={entry} />;
            })}
          </section>
        </>
      )}
    </section>
  );
}
