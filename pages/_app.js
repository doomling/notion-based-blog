import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react';

import { Open_Sans } from '@next/font/google';
 
// If loading a variable font, you don't need to specify the font weight
const openSans = Open_Sans({
  display: 'swap',
});

function MyApp({ Component, pageProps }) {
  return <main className={openSans.className}>
    <Component {...pageProps} />
    <Analytics />
  </main>
}

export default MyApp
