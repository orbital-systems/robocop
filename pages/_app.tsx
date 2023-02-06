import "../styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import "semantic-ui-css/semantic.min.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { Header } from "semantic-ui-react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Robocop</title>
        <meta name="description" content="Robocop" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #00000030",
            marginBottom: 16,
            marginTop: 16,
          }}
        >
          <Header size="huge">Robocop</Header>
          <a href="https://orbital-systems.atlassian.net/browse/OSW-271">
            Feature request or bug report
          </a>
        </div>
        <Component {...pageProps} />
      </main>
    </>
  );
}
