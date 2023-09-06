import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Open_Sans } from "@next/font/google";
import Script from "next/script";

// If loading a variable font, you don't need to specify the font weight
const openSans = Open_Sans({
  display: "swap",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>

      <main className={openSans.className}>
        <Component {...pageProps} />
        <Analytics />
      </main>
    </>
  );
}

export default MyApp;
