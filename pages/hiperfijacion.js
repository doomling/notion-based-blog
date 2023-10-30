import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Client } from "@notionhq/client";
import Entry from "../components/Entry";
import Nav from "../components/Nav";
import Featured from "../components/Featured";
import Substack from "../components/Substack";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default function Home({ entries }) {
  return (
    <>
      <Head>
        <title>
          Sobre mi - Bel Rey - blog sobre programación, emprendimiento y
          búsqueda laboral
        </title>
        <meta
          name="description"
          content="Programación, emprendimiento y búsqueda laboral"
        />
        <link rel="icon" href="doomling.svg" />
      </Head>
      <Nav />
      <div className={styles.container}>
        <h1>Se viene la hiperfijación</h1>
        <p>
          ¿Les pasa que se interesan por un tema y sienten la necesidad de
          aprender todo lo que hay que saber sobre eso, pasan obsesionados un
          par de días y después se olvidan completamente? A mi si, todo el
          tiempo. Por eso empecé este newsletter semanal donde hablo sobre cosas
          aleatorias que me llaman la atención cada semana. Se suscriben acá
          abajo:
        </p>
        <iframe
          src="https://hiperfijacion.substack.com/embed"
          width="100%"
          height="320"
          style={{ border: "1px solid #EEE", background: "black" }}
          frameborder="0"
        ></iframe>
      </div>
    </>
  );
}
