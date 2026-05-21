import Head from "next/head";
import styles from "../styles/Home.module.scss";
// import { Client } from "@notionhq/client";
import Nav from "../components/Nav";
// import Link from "next/link";
import Courses from "../components/Courses";
import DoodleStarsBackground from "../components/StarsBackground";

// const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default function Resources() {
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
        <div className={styles.terminalHeader}>
          <span className={styles.terminalBracket}>[</span>
          {" "}recursos{" "}
          <span className={styles.terminalBracket}>]</span>
          <span className={styles.statusDot} />
        </div>
        <div className={styles.commandLine}>
          $ ./recursos{" "}
          <span className={styles.commandArg}>--para devs</span>
        </div>
        <div className={styles.commentLine}>{"// guías · freelance · carrera"}</div>
        <h1>Recursos</h1>
        <p>
          En esta sección comparto guías y recursos para estudiantes
          autodidactas, freelancers y más
        </p>
        <Courses />
        <DoodleStarsBackground />
      </div>
    </>
  );
}

export async function getStaticProps() {
  // const entries = await notion.databases.query({
  //   database_id: process.env.NOTION_DATABASE_ID,
  // });

  return {
    props: {
      // entries: [],
    },
  };
}
