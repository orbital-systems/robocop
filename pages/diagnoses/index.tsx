import { useEffect, useMemo, useState } from "react";
import { diagnoses } from "../../exampledata";
import { DateInterval, Diagnosis } from "../../types";
import { Report } from "./report";
import { Chart } from "./chart";
import { Filters } from "./filters";

export default function Diagnoses() {
  const [data, setData] = useState<Diagnosis[]>([]);
  const [filteredData, setFilteredData] = useState<Diagnosis[]>([]);

  const [dateInterval, setDateInterval] = useState<DateInterval | undefined>(
    undefined
  );

  useEffect(() => {
    const sort = data.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    if (sort?.length > 0) {
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
    }
  }, [data]);

  useEffect(() => {
    setData(
      diagnoses.map((d, i) => {
        return {
          ...d,
          index: i,
          timestamp: new Date(d.timestamp).toISOString(),
        };
      })
    );
  }, []);

  /* All symptoms in the data set */
  const diagnosisData = useMemo(
    () => Array.from(new Set(data.map((d) => d.code))),
    [data]
  );

  /* All installations in the data set */
  const installationData = useMemo(
    () => Array.from(new Set(data.map((d) => d.device_id))),
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

  /* Function to filter out data that's not selected symptom & installation  */
  const externalFilter = (unfilteredData: Diagnosis[]) => {
    const hiddenSymptomIndexes = diagnosisData.filter(
      (_, i) => !selectedSymptomIndexes[i]
    );

    const hiddenInstallationIndexes = installationData.filter(
      (_, i) => !selectedInstallationIndexes[i]
    );

    return [...unfilteredData].filter(
      (d) =>
        !hiddenSymptomIndexes.includes(d.code) &&
        !hiddenInstallationIndexes.includes(d.device_id)
    );
  };

  const dataInRangeFiltered = externalFilter(filteredData);

  return (
    <>
      <Filters
        diagnosisData={diagnosisData}
        selectedSymptomIndexes={selectedSymptomIndexes}
        setSelectedSymptomIndexes={setSelectedSymptomIndexes}
        installationData={installationData}
        selectedInstallationIndexes={selectedInstallationIndexes}
        setSelectedInstallationIndexes={setSelectedInstallationIndexes}
      />
      <Chart
        data={data}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        diagnosisData={diagnosisData}
        installationData={installationData}
        dateInterval={dateInterval}
        setDateInterval={setDateInterval}
        externalFilter={externalFilter}
      />
      <Report data={dataInRangeFiltered} dateInterval={dateInterval} />
    </>
  );
}
