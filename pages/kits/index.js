import Head from "next/head";
import styles from "../../styles/Home.module.scss";
import { Client } from "@notionhq/client";
import Nav from "../../components/Nav";
import KitCard from "../../components/KitCard";
import DoodleStarsBackground from "../../components/StarsBackground";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default function Kits({ kits, error }) {
  return (
    <>
      <Head>
        <title>Kits - doomling.dev</title>
        <meta
          name="description"
          content="Kits premium con recursos exclusivos para desarrolladores"
        />
        <link rel="icon" href="/doomling.svg" />
      </Head>
      <Nav />
      <div className={styles.container}>
        <h1>Kits</h1>
        {error ? (
          <div style={{ color: "#ff6b6b", padding: "2rem" }}>
            <p>Error al cargar los kits: {error}</p>
            <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
              Verifica que NOTION_KITS_DATABASE_ID esté configurado en tu .env.local
            </p>
          </div>
        ) : (
          <>
            <p className={styles.kitsDescription}>
              Recursos premium con guías detalladas, código y materiales exclusivos
            </p>
            {kits && kits.length > 0 ? (
              <div className={styles.kitsGrid}>
                {kits.map((kit, i) => (
                  <KitCard key={i} kit={kit} />
                ))}
              </div>
            ) : (
              <p style={{ color: "#aaa", padding: "2rem" }}>
                No hay kits disponibles en este momento.
              </p>
            )}
          </>
        )}
        <DoodleStarsBackground />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    if (!process.env.NOTION_KITS_DATABASE_ID) {
      return {
        props: {
          kits: [],
          error: "NOTION_KITS_DATABASE_ID no está configurado",
        },
      };
    }

    const entries = await notion.databases.query({
      database_id: process.env.NOTION_KITS_DATABASE_ID,
    });

    const kits = entries.results
      .map((entry) => {
        const { properties } = entry;
        
        // Try to find properties with flexible matching
        const nameProp = properties.name || properties.Name || properties.Título || properties.titulo;
        const descProp = properties.description || properties.Description || properties.Descripción || properties.descripcion;
        const priceProp = properties.price || properties.Price || properties.Precio || properties.precio;
        const urlProp = properties.niceUrl || properties.NiceUrl || properties.nice_url || properties.url;
        const coverProp = properties.cover || properties.Cover || properties.portada || properties.Portada;
        const visibleProp = properties.visible || properties.Visible || properties.Visible || properties.publicado;
        
        // Generate a slug from name if niceUrl is missing
        const nameText = nameProp?.title?.[0]?.plain_text || "";
        const niceUrlText = urlProp?.rich_text?.[0]?.plain_text || urlProp?.title?.[0]?.plain_text || "";
        const niceUrl = niceUrlText || nameText.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || entry.id;
        
        const kit = {
          id: entry.id,
          name: nameText,
          description: descProp?.rich_text?.[0]?.plain_text || "",
          price: priceProp?.number || 0,
          niceUrl: niceUrl,
          cover: coverProp?.url || coverProp?.files?.[0]?.file?.url || coverProp?.files?.[0]?.external?.url || null,
          visible: visibleProp?.checkbox ?? true,
        };
        return kit;
      })
      .filter((kit) => kit.visible);

    return {
      props: {
        kits: kits ?? [],
      },
    };
  } catch (error) {
    console.error("Error fetching kits:", error);
    return {
      props: {
        kits: [],
        error: error.message || "Error desconocido al cargar los kits",
      },
    };
  }
}
