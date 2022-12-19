import type { AppProps } from "next/app";
import Head from "next/head";
import { Divider, NextUIProvider } from "@nextui-org/react";
import { createTheme } from "@nextui-org/react";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const darkTheme = createTheme({
  type: "dark",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Depulso | Deploy your static site in seconds</title>
        <meta
          name="description"
          content="Easy, one command deployments with free depulso.site subdomains"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://depulso.co/" />
        <meta
          property="og:title"
          content="Depulso | Deploy your static site in seconds"
        />
        <meta
          property="og:description"
          content="Easy, one command deployments with free depulso.site subdomains"
        />
        <meta property="og:image" content="https://depulso.co/og-image.png" />

        <meta
          property="twitter:title"
          content="Depulso | Deploy your static site in seconds"
        />
        <meta
          property="twitter:description"
          content="Easy, one command deployments with free depulso.site subdomains"
        />
        <meta
          property="twitter:image"
          content="https://depulso.co/og-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <NextThemesProvider
        defaultTheme="dark"
        attribute="class"
        value={{
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider theme={darkTheme}>
          <SessionContextProvider supabaseClient={supabase}>
            <Navbar />
            <Component {...pageProps} />
            <Divider />
            <Footer />
          </SessionContextProvider>
        </NextUIProvider>
      </NextThemesProvider>
    </>
  );
}
