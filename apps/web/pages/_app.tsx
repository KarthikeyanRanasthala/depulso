import type { AppProps } from "next/app";
import Head from "next/head";
import { NextUIProvider } from "@nextui-org/react";
import { createTheme } from "@nextui-org/react";

import Navbar from "../components/Navbar";

const darkTheme = createTheme({
  type: "dark",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Depulso</title>
      </Head>

      <NextUIProvider theme={darkTheme}>
        <Navbar />
        <Component {...pageProps} />
      </NextUIProvider>
    </>
  );
}
