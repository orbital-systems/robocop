import Head from "next/head";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("../components/BrushChart"), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Robocop</title>
        <meta name="description" content="Robocop" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Robocop</h1>
        <h2>Tables</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div>installations</div>
            <div>symptoms</div>
          </div>
          <div>all</div>
        </div>
        <div style={{ height: 500 }}>
          <h2>Graph</h2>
          {!loading && (
            <ParentSize>
              {({ width, height }) => <Chart width={width} height={height} />}
            </ParentSize>
          )}
        </div>
      </main>
    </>
  );
}
