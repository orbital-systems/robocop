import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import dynamic from "next/dynamic";
import { exampleData } from "../../exampledata";
import { Filters } from "./filters";
import { Data } from "../../types";

const Chart = dynamic(() => import("../../components/Chart"), { ssr: false });

export default function Home() {
  const [data, setData] = useState<Data[]>([]);
  const [filteredData, setFilteredData] = useState<Data[]>([]);

  useEffect(() => {
    setData(
      exampleData.map((d, i) => {
        return { ...d, index: i };
      })
    );
  }, []);

  /* All symptoms in the data set */
  const symptomsData = useMemo(
    () => Array.from(new Set(data.map((d) => d.symptom))),
    [data]
  );

  /* All installations in the data set */
  const installationData = useMemo(
    () => Array.from(new Set(data.map((d) => d?.os_name || d.shower_id))),
    [data]
  );

  /* Indexes of selected symtpoms */
  const [selectedSymptomIndexes, setSelectedSymptomIndexes] = useState<{
    [key: string]: boolean;
  }>({});

  /* Indexes of selected installations */
  const [selectedInstallationIndexes, setSelectedInstallationIndexes] =
    useState<{
      [key: string]: boolean;
    }>({});

  /* Make sure everything is selected by default when you render the app */
  useEffect(() => {
    setSelectedInstallationIndexes({
      ...Array(installationData.length).fill(true),
    } as any as { [key: string]: boolean });
  }, [installationData]);

  useEffect(() => {
    setSelectedSymptomIndexes({
      ...Array(symptomsData.length).fill(true),
    } as any as { [key: string]: boolean });
  }, [symptomsData]);

  /* Function to filter out data that's not selected symptom & installation  */
  const externalFilter = (unfilteredData: Data[]) => {
    const hiddenSymptomIndexes = symptomsData.filter(
      (_, i) => !selectedSymptomIndexes[i]
    );

    const hiddenInstallationIndexes = installationData.filter(
      (_, i) => !selectedInstallationIndexes[i]
    );

    return [...unfilteredData].filter(
      (d) =>
        !hiddenSymptomIndexes.includes(d.symptom) &&
        !hiddenInstallationIndexes.includes(d?.os_name || d.shower_id)
    );
  };

  const [valueAccessor, setValueAccessor] = useState<
    "installation" | "symptom"
  >("installation");

  const symptomAccessor = (d: Data): number =>
    symptomsData?.indexOf(d.symptom) + 1 || 0;

  const installationAccessor = (d: Data): number =>
    installationData?.indexOf(d?.os_name || d.shower_id) + 1 || 0;

  const getValueAccessor =
    valueAccessor === "symptom" ? symptomAccessor : installationAccessor;

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
        <div style={{ position: "absolute", top: 20, right: 20 }}>
          <a href="https://orbital-systems.atlassian.net/browse/OSW-271">
            Feature request or bug report
          </a>
        </div>
        <div style={{ height: 500, marginBottom: 30 }}>
          {data?.length > 0 && (
            <ParentSize>
              {({ width, height }) => (
                <Chart
                  key={valueAccessor}
                  width={width}
                  height={height}
                  data={data}
                  filteredData={filteredData}
                  setFilteredData={setFilteredData}
                  externalFilter={externalFilter}
                  getValueAccessor={getValueAccessor}
                  setValueAccessor={setValueAccessor}
                  valueAccessor={valueAccessor}
                />
              )}
            </ParentSize>
          )}
        </div>
        <Filters
          symptomsData={symptomsData}
          selectedSymptomIndexes={selectedSymptomIndexes}
          setSelectedSymptomIndexes={setSelectedSymptomIndexes}
          installationData={installationData}
          selectedInstallationIndexes={selectedInstallationIndexes}
          setSelectedInstallationIndexes={setSelectedInstallationIndexes}
        />
      </main>
    </>
  );
}
