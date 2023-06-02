import Link from "next/link";
import styles from "./style.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.innerNav}>
        <Link href="/">
          <div className={styles.logoContainer}>
            <div className={styles.square}>
              <img src="doomling.svg" />
            </div>
            <h1>Bel Rey</h1>
          </div>
        </Link>
        <div className={styles.social}>
          <li>
            <Link href="/about">Sobre mi</Link>
          </li>
          <li>
            <Link href="/colaboraciones">Colaboraciones</Link>
          </li>
          <li>
            <a href="https://twitter.com/iamdoomling">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </li>
          <li>
            <a href="https://youtube.com/@iamdoomling">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </li>
        </div>
      </div>
    </nav>
  );
}
