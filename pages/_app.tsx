import "../styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [tab, setTab] = useState<"symptoms" | "diagnoses">("symptoms");

  const router = useRouter();

  const handleTabClick = (t: "symptoms" | "diagnoses") => {
    setTab(t);
    router.push(t);
  };

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
            borderBottom: "1px solid #047130",
          }}
        >
          <h1>Robocop</h1>
          <a href="https://orbital-systems.atlassian.net/browse/OSW-271">
            Feature request or bug report
          </a>
          <div>
            <a
              style={{
                marginRight: 8,
                fontWeight: tab === "symptoms" ? "bold" : "normal",
                cursor: "pointer",
              }}
              onClick={() => handleTabClick("symptoms")}
            >
              Symptoms
            </a>
            <a
              style={{
                fontWeight: tab === "diagnoses" ? "bold" : "normal",
                cursor: "pointer",
              }}
              onClick={() => handleTabClick("diagnoses")}
            >
              Diagnoses
            </a>
          </div>
        </div>
        <Component {...pageProps} />
      </main>
    </>
  );
}
