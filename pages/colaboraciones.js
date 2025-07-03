import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Nav from "../components/Nav";

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
      </div>
    </>
  );
}
