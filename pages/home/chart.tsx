import dynamic from "next/dynamic";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { Data, DateInterval } from "../../types";
import { useState } from "react";

const AreaChart = dynamic(() => import("../../components/Chart"), {
  ssr: false,
});

interface ChartProps {
  data: Data[];
  filteredData: Data[];
  setFilteredData(d: Data[]): void;
  symptomsData: string[];
  installationData: string[];
  dateInterval: DateInterval | undefined;
  setDateInterval(d: DateInterval): void;
  externalFilter(d: Data[]): Data[];
}

export const Chart = ({
  symptomsData,
  installationData,
  data,
  dateInterval,
  setDateInterval,
  filteredData,
  setFilteredData,
  externalFilter,
}: ChartProps) => {
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
      <h2>2: Select time span</h2>
      <div style={{ height: 500, marginBottom: 200 }}>
        {data?.length > 0 && typeof dateInterval !== "undefined" && (
          <ParentSize>
            {({ width, height }) => (
              <AreaChart
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
    </>
  );
};
