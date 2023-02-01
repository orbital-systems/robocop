import dynamic from "next/dynamic";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { Diagnosis, DateInterval, Symptom } from "../../types";
import { useEffect, useState } from "react";
import {
  getDiagnosisColor,
  getDiagnosisName,
  getSymptomColor,
  getSymptomName,
} from "../../util";
import { joins, symptoms } from "../../exampledata";

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
  const [selectedDiagnose, setSelectedDiagnose] = useState<
    Diagnosis | undefined
  >(undefined);

  const [triggeredBy, setTriggeredBy] = useState<Symptom[]>([]);

  const [valueAccessor, setValueAccessor] = useState<"installation" | "code">(
    "installation"
  );

  const codeAccessor = (d: Diagnosis): number =>
    diagnosisData?.indexOf(d.code) + 1 || 0;

  const installationAccessor = (d: Diagnosis): number =>
    installationData?.indexOf(d.device_id) + 1 || 0;

  const getValueAccessor =
    valueAccessor === "code" ? codeAccessor : installationAccessor;

  useEffect(() => {
    if (typeof selectedDiagnose !== "undefined") {
      const triggeredByList =
        joins
          ?.filter((j) => j.diagnosis_id === selectedDiagnose?.diagnosis_id)
          ?.map((d) => symptoms.find((s) => s.symptom_id === d.symptom_id))
          ?.filter((s) => typeof s !== "undefined") || [];

      const temporaryUglyCode = triggeredByList as unknown as Symptom[]; // this is temporary anyway :)
      setTriggeredBy(temporaryUglyCode);
    }
  }, [selectedDiagnose]);

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
                onDataPointClick={(point: Diagnosis) =>
                  setSelectedDiagnose(point)
                }
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
      <div>
        {typeof selectedDiagnose !== "undefined" ? (
          <div
            style={{
              backgroundImage:
                "linear-gradient(to right, #0a325733, #04713080)",
              padding: 15,
              borderRadius: 8,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>{`${selectedDiagnose.code} - ${getDiagnosisName(
                  selectedDiagnose.code
                )}`}</h3>
                <button onClick={() => setSelectedDiagnose(undefined)}>
                  close
                </button>
              </div>
              <span>
                {`${new Date(selectedDiagnose.timestamp).toLocaleString()} on `}
                <a
                  href={`https://osw.orb-sys.com/device/?id=${selectedDiagnose.device_id}`}
                >
                  device
                </a>
              </span>
            </div>
            <h4>Triggered by:</h4>
            <ul>
              {triggeredBy?.map((t) => (
                <li key={t.symptom_id}>
                  <div
                    style={{
                      backgroundColor: getSymptomColor(t.code),
                      padding: 8,
                    }}
                  >
                    <p>{`${t.code} - ${getSymptomName(t.code)}`}</p>
                    <span>
                      {`${new Date(t.timestamp).toLocaleString()} on `}
                      <a
                        href={`https://osw.orb-sys.com/device/?id=${t.device_id}`}
                      >
                        device
                      </a>
                    </span>
                    {" : "}
                    <a
                      href={`https://osw.orb-sys.com/plotting/?device_id=${t.device_id}&session_id=${t.session_id}`}
                    >
                      session
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Click on a point to get more information about the diagnosis</p>
        )}
      </div>
    </>
  );
};
