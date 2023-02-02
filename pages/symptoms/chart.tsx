import dynamic from "next/dynamic";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { Symptom, DateInterval } from "../../types";
import { useState } from "react";
import { getSymptomColor, getSymptomName } from "../../util";
import { deviceIdNameMap } from "../../exampledata";

const AreaChart = dynamic(() => import("../../components/Chart"), {
  ssr: false,
});

interface ChartProps {
  data: Symptom[];
  filteredData: Symptom[];
  setFilteredData(d: Symptom[]): void;
  symptomsData: string[];
  installationData: string[];
  dateInterval: DateInterval | undefined;
  setDateInterval(d: DateInterval): void;
  externalFilter(d: Symptom[]): Symptom[];
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
  const [valueAccessor, setValueAccessor] = useState<"installation" | "code">(
    "installation"
  );

  const codeAccessor = (d: Symptom): number =>
    symptomsData?.indexOf(d.code) + 1 || 0;

  const installationAccessor = (d: Symptom): number =>
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
                getCodeColor={getSymptomColor}
                onDataPointClick={(dataPoint: Symptom) =>
                  window.open(
                    `https://osw.orb-sys.com/plotting/?device_id=${dataPoint.device_id}&session_id=${dataPoint.session_id}`,
                    "blank"
                  )
                }
                hoverContent={(dataPoint: Symptom) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <div>
                      {deviceIdNameMap.find(
                        (d) => d.device_id === dataPoint?.device_id
                      )?.os_name || dataPoint?.device_id}
                    </div>
                    <div
                      style={{
                        backgroundColor: getSymptomColor(dataPoint?.code),
                        marginLeft: 8,
                      }}
                    >
                      {dataPoint?.code} -{getSymptomName(dataPoint?.code)}
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
