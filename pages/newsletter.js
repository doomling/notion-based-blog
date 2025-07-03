import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Client } from "@notionhq/client";
import Nav from "../components/Nav";
import Link from "next/link";
import Courses from "../components/Courses";
import Substack from "../components/Substack";
import DoodleStarsBackground from "../components/StarsBackground";

export default function Newsletter() {
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
      <Substack />
      <DoodleStarsBackground />
    </>
  );
}
