import { useState, useEffect } from "react";
import { Client } from "@notionhq/client";
import { useRouter } from "next/router";
import Nav from "../../components/Nav";
import Block from "../../components/Block";
import styles from "../../styles/Home.module.scss";
import kitStyles from "../../styles/Kit.module.scss";
import DoodleStarsBackground from "../../components/StarsBackground";
import Link from "next/link";
import { getCountryFromRequest } from "../../lib/geo";
import { getKitStock } from "../../lib/mongodb";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default function KitDetail({ kit, countryCode, stock }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [paypalLoading, setPaypalLoading] = useState(false);

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(kit.price);

  const formattedUsdPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(kit.priceUsd || 0);

  const isArgentina = countryCode === "AR";
  const isOutOfStock = typeof stock === "number" && stock <= 0;

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

  const handlePayPalPurchase = async () => {
    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setPaypalLoading(true);
    setError("");

    try {
      localStorage.setItem("paypalEmail", email);

      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitId: kit.id,
          kitName: kit.name,
          priceUsd: kit.priceUsd,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar el pago");
      }

      if (data.approveUrl) {
        window.location.href = data.approveUrl;
      } else {
        throw new Error("No se pudo crear el link de pago");
      }
    } catch (error) {
      console.error("PayPal checkout error:", error);
      setError(error.message || "Ocurrió un error. Por favor intenta nuevamente.");
    } finally {
      setPaypalLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.back}>
          <Link href="/kits" className={styles.card}>← Volver</Link>
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
                <div className={kitStyles.price}>
                  {isArgentina ? formattedPrice : formattedUsdPrice}
                </div>
                {isArgentina ? (
                  <>
                    <button
                      onClick={handlePurchase}
                      disabled={loading || isOutOfStock}
                      className={kitStyles.buyButton}
                    >
                      {isOutOfStock
                        ? "Sin cupos"
                        : loading
                        ? "Procesando..."
                        : "Comprar con Mercado Pago"}
                    </button>
                    <p className={kitStyles.secureNote}>
                      {typeof stock === "number"
                        ? `Cupos disponibles: ${stock}`
                        : "Pago seguro con Mercado Pago"}
                    </p>
                  </>
                ) : (
                  <>
                    <input
                      type="email"
                      placeholder="Tu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={kitStyles.emailInput}
                    />
                    {error && <div className={kitStyles.errorMessage}>{error}</div>}
                    <button
                      onClick={handlePayPalPurchase}
                      disabled={paypalLoading || isOutOfStock}
                      className={kitStyles.buyButton}
                    >
                      {isOutOfStock
                        ? "Sin cupos"
                        : paypalLoading
                        ? "Procesando..."
                        : "Pagar con PayPal"}
                    </button>
                    <p className={kitStyles.secureNote}>
                      {typeof stock === "number"
                        ? `Cupos disponibles: ${stock}`
                        : "Pago seguro con PayPal."}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          <DoodleStarsBackground />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params, query, req }) {
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
    priceUsd: properties.priceUSD?.number || 0,
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

  let stock = null;
  try {
    stock = await getKitStock(kit.id);
  } catch (error) {
    console.warn("Failed to load kit stock:", error);
  }

  return {
    props: {
      kit,
      blocks: blocksResolved,
      hasAccess,
      countryCode: getCountryFromRequest(req) || null,
      stock,
    },
  };
}
