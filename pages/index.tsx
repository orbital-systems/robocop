import Head from "next/head";

export default function Home() {
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
        <div>
          <h2>Graph</h2>
        </div>
      </main>
    </>
  );
}
