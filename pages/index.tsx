import Head from "next/head";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { exampleData } from "../exampledata";
import { getSymptomColor } from "../components/Chart/util";

const Chart = dynamic(() => import("../components/Chart"), { ssr: false });

export interface Data {
  index: number;
  timestamp: string;
  week: number;
  shower_id: string;
  os_name: string | null;
  session_id: string;
  software_version: string;
  symptom: string;
}

export default function Home() {
  const [data, setData] = useState<Data[]>([]);
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [hiddenSymptoms, setHiddenSymptoms] = useState<string[]>([]);

  useEffect(() => {
    setData(
      exampleData.map((d, i) => {
        return { ...d, index: i };
      })
    );
  }, []);

  const activeSymptoms = Array.from(
    new Set(filteredData.map((d) => d.symptom))
  );

  const toggleHiddenSymptom = (s: string) => {
    const updatedHiddenSymptoms = [...hiddenSymptoms];
    if (hiddenSymptoms.includes(s)) {
      const removeIndex = updatedHiddenSymptoms.indexOf(s);
      updatedHiddenSymptoms.splice(removeIndex, 1);
    } else {
      updatedHiddenSymptoms.push(s);
    }
    setHiddenSymptoms(updatedHiddenSymptoms);
  };

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
        <div style={{ height: 500, marginBottom: 41 }}>
          {data?.length > 0 && (
            <ParentSize>
              {({ width, height }) => (
                <Chart
                  width={width}
                  height={height}
                  data={data}
                  filteredData={filteredData}
                  setFilteredData={setFilteredData}
                  hiddenSymptoms={hiddenSymptoms}
                />
              )}
            </ParentSize>
          )}
        </div>
        <h3>{`Symptoms (${activeSymptoms.length - hiddenSymptoms.length}/${
          activeSymptoms.length
        })`}</h3>
        <div>
          {activeSymptoms.map((s) => (
            <button
              key={s}
              style={{
                backgroundColor: getSymptomColor(s),
                opacity: hiddenSymptoms.includes(s) ? 0.5 : 1,
              }}
              onClick={() => toggleHiddenSymptom(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </main>
    </>
  );
}
