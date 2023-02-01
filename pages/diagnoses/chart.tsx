import dynamic from "next/dynamic";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { Diagnosis, DateInterval } from "../../types";
import { useState } from "react";
import { getDiagnosisColor, getDiagnosisName } from "../../util";

const AreaChart = dynamic(() => import("../../components/Chart"), {
  ssr: false,
});

interface ChartProps {
  data: Diagnosis[];
  filteredData: Diagnosis[];
  setFilteredData(d: Diagnosis[]): void;
  diagnosisData: string[];
  installationData: string[];
  dateInterval: DateInterval | undefined;
  setDateInterval(d: DateInterval): void;
  externalFilter(d: Diagnosis[]): Diagnosis[];
}

export const Chart = ({
  diagnosisData,
  installationData,
  data,
  dateInterval,
  setDateInterval,
  filteredData,
  setFilteredData,
  externalFilter,
}: ChartProps) => {
  const [valueAccessor, setValueAccessor] = useState<"installation" | "code">(
    "installation"
  );

  const codeAccessor = (d: Diagnosis): number =>
    diagnosisData?.indexOf(d.code) + 1 || 0;

  const installationAccessor = (d: Diagnosis): number =>
    installationData?.indexOf(d.device_id) + 1 || 0;

  const getValueAccessor =
    valueAccessor === "code" ? codeAccessor : installationAccessor;

  return (
    <>
      <h2>2: Select time span</h2>
      <div style={{ height: 500, marginBottom: 200 }}>
        {data?.length > 0 && typeof dateInterval?.from !== "undefined" && (
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
                getCodeColor={getDiagnosisColor}
                hoverContent={(dataPoint) => (
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        backgroundColor: getDiagnosisColor(dataPoint?.code),
                        marginLeft: 8,
                      }}
                    >
                      {dataPoint?.code} -{getDiagnosisName(dataPoint?.code)}
                    </div>
                  </div>
                )}
              />
            )}
          </ParentSize>
        )}
      </div>
    </>
  );
};
