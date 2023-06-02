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
        <h1>Colaboraciones</h1>
        <p>
          ¿Te parece que podemos colaborar en un proyecto? Estos son algunos de
          los detalles a tener en cuenta
        </p>
        <h2>Charlas y eventos</h2>
        <p>
          Estoy siempre abierta a participar en eventos o dar charlas para la
          comunidad de desarrollo y tecnología. Mis tópicos suelen estar en el
          rango de: charlas técnicas sobre desarrollo y tecnologías
          decentralizadas, educación en tecnología, búsqueda laboral y
          emprendedurismo. Si te parece que alguno de estos tópicos puede
          funcionar en tu evento contactame{" "}
        </p>
        <h2>Sponsorship de contenido</h2>
        <p>
          No suelo tomar sponsorships de contenido pero si te parece que podemos
          concretar alguna propuesta estoy abierda a considerarlo. El requisito
          es que el producto o servicio esté relacionado a tecnología y que
          tenga un impacto positivo en la comunidad. En el caso de productos
          educativos voy a necesitar poder probarlos antes de participar.
        </p>
        <p>
          Para contacto, dudas y consultas me pueden encontrar en{" "}
          <a href="mailto:belenrey@gmail.com">belenrey@gmail.com</a>
        </p>
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
