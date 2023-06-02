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
          Bel Rey - blog sobre programación, emprendimiento y búsqueda laboral
        </title>
        <meta
          name="description"
          content="Programación, emprendimiento y búsqueda laboral"
        />
        <link rel="icon" href="doomling.svg" />
      </Head>
      <Nav />
      <div className={styles.container}>
        {entries.length == 0 && "There are no entries"}
        {entries.length != 0 && (
          <>
            <h1>Te doy la bienvenida a mi blog</h1>
            <Featured />
          </>
        )}
        <h2>Artículos</h2>
        <section className={styles.entries}>
          {entries.map((entry, key) => {
            return <Entry key={key} data={entry} />;
          })}
        </section>
        <Substack />
      </div>
    </>
  );
}

export async function getServerSideProps() {
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
