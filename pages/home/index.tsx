import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import dynamic from "next/dynamic";
import { exampleData } from "../../exampledata";
import { Filters } from "./filters";
import { Data, DateInterval } from "../../types";
import { Report } from "./report";

const Chart = dynamic(() => import("../../components/Chart"), { ssr: false });

export default function Home() {
  const [data, setData] = useState<Data[]>([]);
  const [filteredData, setFilteredData] = useState<Data[]>([]);

  const [dateInterval, setDateInterval] = useState<DateInterval | undefined>(
    undefined
  );

  useEffect(() => {
    const sort = data.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const minDate = new Date(sort[0]?.timestamp);
    const maxDate = new Date(sort[sort.length - 1]?.timestamp);

    const oneWeekAgo = new Date(maxDate);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    setDateInterval({
      from: oneWeekAgo,
      to: maxDate,
      min: minDate,
      max: maxDate,
    });
  }, [data]);

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

  const [selectedSoftwareVersions, setSelectedSoftwareVersions] = useState<
    string[]
  >(["r2", "r3"]);

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
        !hiddenInstallationIndexes.includes(d?.os_name || d.shower_id) &&
        selectedSoftwareVersions.includes(`r${d.software_version[0]}`)
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
        {/* <Report data={filteredData} /> */}
        <div style={{ height: 500, marginBottom: 200 }}>
          {data?.length > 0 && typeof dateInterval !== "undefined" && (
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
                  dateInterval={dateInterval}
                  setDateInterval={setDateInterval}
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
          selectedSoftwareVersions={selectedSoftwareVersions}
          setSelectedSoftwareVersions={setSelectedSoftwareVersions}
        />
      </main>
    </>
  );
}
