import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Client } from "@notionhq/client";
import Nav from "../components/Nav";
import Link from "next/link";
import Courses from "../components/Courses";
import DoodleStarsBackground from "../components/StarsBackground";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default function Resources({ entries }) {
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
        <h1>Recursos</h1>
        <p>
          En esta sección comparto guías y recursos para estudiantes
          autodidactas, freelancers y más
          <ul>
            {entries.map((data, i) => {
              return (
                <li key={i}>
                  <Link href={`/${data.niceUrl}`}>
                    {data.name[0].plain_text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </p>
        <Courses />
        <DoodleStarsBackground />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const entries = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  const mappedEntries = entries.results
    .map((entry) => {
      const { properties } = entry;
      const { name, description, tags, visible, niceUrl, hideInList } =
        properties;

      return {
        name: name.title,
        description: description.rich_text,
        tags: tags.multi_select,
        id: entry.id,
        visible: visible.checkbox,
        niceUrl: niceUrl.rich_text[0].plain_text,
        hideInList: hideInList?.checkbox,
      };
    })
    .filter((entry) => entry.visible == true && entry.hideInList == false);

  return {
    props: {
      entries: mappedEntries ?? [],
    },
  };
}
