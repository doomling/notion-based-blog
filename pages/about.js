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
        <h1>¿Quién soy?</h1>
        <p>
          Hola, gracias por visitar este blog. Mi nombre es Bel Rey y soy una
          programadora, emprendedora y creadora de contenido nacida en Buenos
          Aires, Argentina.
        </p>

        <p>
          Tengo 15+ años de experiencia trabajando en tecnología en los que hice
          cosas muy variadas. Desde mis inicios como QA trabajando para varias
          empresas locales e internacionales hasta fundar una software factory y
          más recientemente una plataforma de #edTech.{" "}
        </p>

        <p>
          En los últimos años me dediqué principalmente al trabajo independiente
          mientras aprovecho para divulgar sobre tecnología y programación en
          diversos proyectos. Los más relevantes son{" "}
          <a
            href="https://teloexplicocongatitos.com"
            target="_blank"
            rel="noreferrer"
          >
            teloexplicocongatitos
          </a>{" "}
          y{" "}
          <a
            href="https://www.youtube.com/watch?v=NUGKYfArU54&list=PLoIQktQDGsr8qFskV3lWcg0cabOmfgRce"
            target="_blank"
            rel="noreferrer"
          >
            mi curso semanal gratuito de nodeJS en Youtube.
          </a>
        </p>

        <p>
          También me gusta dar charlas y participar en eventos que acerquen a
          personas con la tecnología y ayuden a romper la barrera de entrada y
          adopción.
        </p>

        <p>
          Si querés conocer más sobre mi perfil profesional podés visitar mi{" "}
          <a
            href="https://www.linkedin.com/in/belrey/"
            target="_blank"
            rel="noreferrer"
          >
            Linkedin
          </a>
          .
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
