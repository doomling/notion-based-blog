import Link from "next/link";
import styles from "./style.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.innerNav}>
        <Link href="/">
          <div className={styles.logoContainer}>
            <div className={styles.square}>
              <img src="logo-doom.svg" alt="doomling.dev" />
            </div>
          </div>
        </Link>
        <div className={styles.social}>
          <li>
            <Link href="/recursos">Recursos</Link>
          </li>
          <li>
            <Link href="/newsletter">Newsletter</Link>
          </li>
          <li>
            <Link href="/colaboraciones">Colaboraciones</Link>
          </li>
          <div className={styles.rrss}>
            <li>
              <a
                href="https://twitter.com/iamdoomling"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com/@iamdoomling"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com/@iamdoomling"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </li>
          </div>
        </div>
      </div>
    </nav>
  );
}
