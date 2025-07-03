import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Client } from "@notionhq/client";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import About from "../components/About";
import Courses from "../components/Courses";
import Projects from "../components/Projects";
import DoodleStarsBackground from "../components/StarsBackground";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default function Home() {
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
        <DoodleStarsBackground />
        <Hero />
        <About />
        <Projects />
        <Courses />
        {/* <Substack /> */}
      </main>
    </>
  );
}
