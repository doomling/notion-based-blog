import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Client } from "@notionhq/client";
import Entry from "../components/Entry";
import Nav from "../components/Nav";
import Substack from "../components/Substack";
import Hero from "../components/Hero";
import About from "../components/About";
import BlogEntries from "../components/BlogEntries";

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
      <main className={styles.container}>
        <Hero />
        <About />
        <h2>Proyectos destacados</h2>
        <Substack />
      </main>
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
