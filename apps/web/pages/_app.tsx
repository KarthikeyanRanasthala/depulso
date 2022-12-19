import type { AppProps } from "next/app";
import Head from "next/head";
import { NextUIProvider } from "@nextui-org/react";
import { createTheme } from "@nextui-org/react";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import Navbar from "../components/Navbar";

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
        <title>Depulso</title>
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
          </SessionContextProvider>
        </NextUIProvider>
      </NextThemesProvider>
    </>
  );
}
