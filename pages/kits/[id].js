import { useState, useEffect } from "react";
import { Client } from "@notionhq/client";
import { useRouter } from "next/router";
import Nav from "../../components/Nav";
import Block from "../../components/Block";
import styles from "../../styles/Home.module.scss";
import kitStyles from "../../styles/Kit.module.scss";
import DoodleStarsBackground from "../../components/StarsBackground";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default function KitDetail({ kit }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(kit.price);

  // Check access on mount and when email changes in query
  useEffect(() => {
    const checkAccess = async () => {
      const userEmail = router.query.email;
      if (userEmail) {
        try {
          const response = await fetch(`/api/check-kit-access?email=${encodeURIComponent(userEmail)}&kitId=${kit.id}`);
          const data = await response.json();
          if (data.hasAccess) {
            setHasAccess(true);
            // Fetch blocks if user has access
            const blocksResponse = await fetch(`/api/kit-blocks?kitId=${kit.id}`);
            const blocksData = await blocksResponse.json();
            setBlocks(blocksData.blocks || []);
          }
        } catch (err) {
          console.error("Error checking access:", err);
        }
      }
      setCheckingAccess(false);
    };

    if (router.isReady) {
      checkAccess();
    }
  }, [router.isReady, router.query.email, kit.id]);

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

          {/* Loading state while checking access */}
          {checkingAccess && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
              Verificando acceso...
            </div>
          )}

          {/* Contenido del kit: solo visible si el usuario tiene acceso */}
          {!checkingAccess && hasAccess && blocks && blocks.length > 0 && (
            blocks.map((block, key) => <Block data={block} key={key} />)
          )}

          {/* Paywall */}
          {!checkingAccess && !hasAccess && (
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

export async function getStaticPaths() {
  // Fetch all kits to generate paths
  const entries = await notion.databases.query({
    database_id: process.env.NOTION_KITS_DATABASE_ID,
  });

  const paths = entries.results
    .map((entry) => {
      const { properties } = entry;
      const urlProp = properties.niceUrl || properties.NiceUrl || properties.nice_url || properties.url;
      const nameProp = properties.name || properties.Name || properties.Título || properties.titulo;
      
      const niceUrl = urlProp?.rich_text?.[0]?.plain_text || urlProp?.title?.[0]?.plain_text || "";
      const nameText = nameProp?.title?.[0]?.plain_text || "";
      const slug = niceUrl || nameText.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || entry.id;
      
      return slug ? { params: { id: slug } } : null;
    })
    .filter(Boolean);

  return {
    paths,
    fallback: "blocking", // Generate pages on-demand for new kits
  };
}

export async function getStaticProps({ params }) {
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

  return {
    props: {
      kit,
    },
    revalidate: 300,
  };
}
