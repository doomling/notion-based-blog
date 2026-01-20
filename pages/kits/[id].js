import { useState } from "react";
import { Client } from "@notionhq/client";
import { useRouter } from "next/router";
import Nav from "../../components/Nav";
import Block from "../../components/Block";
import styles from "../../styles/Home.module.scss";
import kitStyles from "../../styles/Kit.module.scss";
import DoodleStarsBackground from "../../components/StarsBackground";
import { hasUserPurchasedKit } from "../../lib/mongodb";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default function KitDetail({ kit, blocks, hasAccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(kit.price);

  const handlePurchase = async () => {
    // Validate email
    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitId: kit.id,
          kitName: kit.name,
          price: kit.price,
          email,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al procesar el pago");
      }

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error("No se pudo crear el link de pago");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error.message || "Ocurrió un error. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.back}>
          <div onClick={() => router.back()}>← Volver</div>
        </div>
        <div className={styles.articleContainer}>
          <h1>{kit.name}</h1>
          <p className={kitStyles.description}>{kit.description}</p>

          {/* Contenido del kit: solo visible si el usuario tiene acceso */}
          {hasAccess &&
            blocks &&
            blocks.map((block, key) => <Block data={block} key={key} />)}

          {/* Paywall */}
          {!hasAccess && (
            <div className={kitStyles.paywall}>
              <div className={kitStyles.paywallContent}>
                <div className={kitStyles.lockIcon}>🔒</div>
                <h2>Contenido Premium</h2>
                <p>Obtené acceso completo a este kit</p>
                <div className={kitStyles.price}>{formattedPrice}</div>
                <input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className={kitStyles.emailInput}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handlePurchase();
                    }
                  }}
                />
                {error && (
                  <p className={kitStyles.errorMessage}>{error}</p>
                )}
                <button
                  onClick={handlePurchase}
                  disabled={loading || !email}
                  className={kitStyles.buyButton}
                >
                  {loading ? "Procesando..." : "Comprar ahora"}
                </button>
                <p className={kitStyles.secureNote}>
                  Pago seguro con Mercado Pago
                </p>
              </div>
            </div>
          )}

          <DoodleStarsBackground />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params, query }) {
  // Get all entries and find by niceUrl or ID
  const allEntries = await notion.databases.query({
    database_id: process.env.NOTION_KITS_DATABASE_ID,
  });

  // Try to find by niceUrl first
  let entry = allEntries.results.find((e) => {
    const niceUrl = e.properties.niceUrl?.rich_text?.[0]?.plain_text || 
                   e.properties.niceUrl?.title?.[0]?.plain_text || "";
    return niceUrl === params.id;
  });

  // If not found by niceUrl, try by ID (for fallback URLs)
  if (!entry) {
    entry = allEntries.results.find((e) => e.id === params.id);
  }

  // If still not found, try matching generated slug from name
  if (!entry) {
    entry = allEntries.results.find((e) => {
      const name = e.properties.name?.title?.[0]?.plain_text || "";
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      return slug === params.id;
    });
  }

  if (!entry) {
    return { notFound: true };
  }

  const { properties } = entry;

  const kit = {
    id: entry.id,
    name: properties.name?.title?.[0]?.plain_text || "",
    description: properties.description?.rich_text?.[0]?.plain_text || "",
    price: properties.price?.number || 0,
    niceUrl: properties.niceUrl?.rich_text?.[0]?.plain_text || "",
  };

  // Check if user has access via email from query (set after payment)
  const userEmail = query.email;
  const hasAccess = userEmail
    ? await hasUserPurchasedKit(userEmail, entry.id)
    : false;

  // Solo traemos el contenido completo del kit si el usuario tiene acceso
  let blocksResolved = [];

  if (hasAccess) {
    const blocks = await notion.blocks.children.list({
      block_id: entry.id,
    });

    const mappedBlocks = await Promise.all(
      blocks.results.map(async (block) => {
        let filteredBlock = { ...block };

        if (block.has_children) {
          const response = await notion.blocks.children.list({
            block_id: block.id,
            page_size: 50,
          });
          filteredBlock[block.type].children = response.results;
        }

        delete filteredBlock.object;
        delete filteredBlock.id;
        delete filteredBlock.parent;
        delete filteredBlock.created_time;
        delete filteredBlock.last_edited_time;
        delete filteredBlock.created_by;
        delete filteredBlock.last_edited_by;
        delete filteredBlock.archived;

        return filteredBlock;
      })
    );

    blocksResolved = mappedBlocks;
  }

  return {
    props: {
      kit,
      blocks: blocksResolved,
      hasAccess,
    },
  };
}
