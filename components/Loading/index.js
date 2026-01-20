import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";

export default function Loading() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    </div>
  );
}
