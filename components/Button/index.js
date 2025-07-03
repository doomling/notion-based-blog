import styles from "./style.module.scss";

export default function Button({ text, primary }) {
  return (
    <button className={primary ? styles.primary : styles.common}>{text}</button>
  );
}
