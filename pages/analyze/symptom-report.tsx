import dynamic from "next/dynamic";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { DateInterval, ChartData, Diagnose } from "../../types";
import { useEffect, useMemo, useState } from "react";
import {
  getDiagnoseColor,
  getDiagnoseName,
  getSymptomColor,
  getSymptomName,
} from "../../util";
import { ValueAccessor } from "../../types/valueaccessor.interface";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { deviceIdNameMap, joins, diagnoses } from "../../exampledata";

const AreaChart = dynamic(() => import("../../components/Chart"), {
  ssr: false,
});

const BarChart = dynamic(() => import("../../components/BarChart"), {
  ssr: false,
});

interface SymtpomsReport {
  filteredData: ChartData[];
  dateInterval: DateInterval | undefined;
  desiredDateInterval: { to: Date; from: Date } | undefined;
  setDateInterval(d: DateInterval): void;
  valueAccessor: ValueAccessor;
}

export const SymtpomsReport = ({
  filteredData,
  dateInterval,
  desiredDateInterval,
  setDateInterval,
  valueAccessor,
}: SymtpomsReport) => {
  const [dataInTimeSpan, setDataInTimeSpan] = useState<ChartData[]>([]);

  const [hoverData, setHoverData] = useState<ChartData | undefined>(undefined);

  const [selectedDataPoint, setSelectedDataPoint] = useState<
    ChartData | undefined
  >(undefined);

  const [hasTriggered, setHasTriggered] = useState<Diagnose[]>([]);
  useEffect(() => {
    if (typeof selectedDataPoint !== "undefined") {
      const triggeredByList =
        joins
          ?.filter((j) => j.symptom_id === selectedDataPoint?.id)
          ?.map((d) => diagnoses.find((s) => s.diagnosis_id === d.diagnosis_id))
          ?.filter((s) => typeof s !== "undefined") || [];
      const temporaryUglyCode = triggeredByList as unknown as Diagnose[]; // this is temporary anyway :)
      setHasTriggered(temporaryUglyCode);
    }
  }, [selectedDataPoint]);

  /* All symptoms in the data set */
  const symptomsData = useMemo(
    () => Array.from(new Set(filteredData.map((d) => d.code))),
    [filteredData]
  );

  /* All installations in the data set */
  const installationData = useMemo(
    () => Array.from(new Set(filteredData.map((d) => d.device_id))),
    [filteredData]
  );

  const groupByInstallation = dataInTimeSpan.reduce(
    (group: { [key: string]: ChartData[] }, d) => {
      const id = d.device_id;
      group[id] = group[id] ?? [];
      group[id].push(d);
      return group;
    },
    {}
  );

  const groupedByInstallationData = Object.entries(groupByInstallation).map(
    (d) => {
      const groupBySymtpom = d[1].reduce((obj: any, b) => {
        const oldVal = obj[b.code] || 0;
        obj[b.code] = oldVal + 1;
        return obj;
      }, {});
      const deviceId = d[0];
      const deviceName = deviceIdNameMap.find(
        (d) => d.device_id === deviceId
      )?.os_name;
      return { name: deviceName || deviceId, ...groupBySymtpom };
    }
  );

  const reportTimeInterval =
    typeof dateInterval === "undefined"
      ? "all time"
      : `${dateInterval.from.toLocaleDateString()} - ${dateInterval.to.toLocaleDateString()}`;

  const dynamicHeight = groupedByInstallationData?.length * 15;
  const minHeight = 500;

  const groupBySymtpom = dataInTimeSpan.reduce((obj: any, b) => {
    const oldVal = obj[b.code] || 0;
    obj[b.code] = oldVal + 1;
    return obj;
  }, {});

  const groupBySymtomData = Object.entries(groupBySymtpom).map((d) => {
    return { name: d[0], [`${d[0]}`]: d[1] };
  });

  const codeAccessor = (d: ChartData): number =>
    symptomsData?.indexOf(d.code) + 1 || 0;

  const installationAccessor = (d: ChartData): number =>
    installationData?.indexOf(d.device_id) + 1 || 0;

  const getValueAccessor =
    valueAccessor === "code" ? codeAccessor : installationAccessor;

  if (filteredData?.length <= 0)
    return (
      <div style={{ width: "100%" }}>
        <p>No data with selected settings</p>
      </div>
    );

  return (
    <div style={{ height: 500, width: "100%" }}>
      {typeof dateInterval !== "undefined" && (
        <ParentSize>
          {({ width, height }) => (
            <AreaChart
              width={width}
              height={height}
              dateInterval={dateInterval}
              desiredDateInterval={desiredDateInterval}
              setDateInterval={setDateInterval}
              getCodeColor={getSymptomColor}
              setHoverData={setHoverData}
              data={filteredData}
              dataInTimeSpan={dataInTimeSpan}
              setDataInTimeSpan={setDataInTimeSpan}
              getValueAccessor={getValueAccessor}
              setSelectedDataPoint={setSelectedDataPoint}
            />
          )}
        </ParentSize>
      )}
      <div
        style={{
          display: "flex",
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ marginRight: 8 }}>
          <Segment>
            <p>Time frame</p>
            <strong>{reportTimeInterval}</strong>
          </Segment>
        </div>
        <div style={{ marginRight: 8 }}>
          <Segment>
            <p>Symptoms shown</p>
            <strong>{dataInTimeSpan?.length}</strong>
          </Segment>
        </div>

        {typeof hoverData !== "undefined" && (
          <div>
            <Segment
              style={{ backgroundColor: getSymptomColor(hoverData?.code) }}
            >
              <p>Hovering - click to select</p>
              <strong>{`${hoverData?.code} - ${getSymptomName(
                hoverData?.code
              )}`}</strong>
            </Segment>
          </div>
        )}
      </div>
      {typeof selectedDataPoint !== "undefined" && (
        <Segment
          style={{
            margin: 0,
            border: `1px solid ${getSymptomColor(selectedDataPoint.code)}`,
            backgroundColor: `${getSymptomColor(selectedDataPoint.code)}33`,
            marginBottom: 16,
          }}
        >
          <>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Header>{`${selectedDataPoint.code} - ${getSymptomName(
                  selectedDataPoint.code
                )}`}</Header>
                <Button icon onClick={() => setSelectedDataPoint(undefined)}>
                  <Icon name="close" />
                </Button>
              </div>
              <span>
                {`${new Date(
                  selectedDataPoint.timestamp
                ).toLocaleString()} on `}
                <a
                  href={`https://osw.orb-sys.com/device/?id=${selectedDataPoint.device_id}`}
                  target="_blank"
                >
                  {`${
                    deviceIdNameMap?.find(
                      (d) => d.device_id === selectedDataPoint.device_id
                    )?.os_name || selectedDataPoint.device_id
                  }`}
                </a>
              </span>
            </div>
            <Header size="small">Has triggered diagnoses:</Header>
            <ul>
              {hasTriggered?.map((t) => (
                <li key={t.diagnosis_id}>
                  <div
                    style={{
                      border: `1px solid ${getDiagnoseColor(t.code)}`,
                      backgroundColor: `${getDiagnoseColor(t.code)}33`,
                      padding: 8,
                    }}
                  >
                    <p>{`${t.code} - ${getDiagnoseName(t.code)}`}</p>
                    <span>
                      {`${new Date(t.timestamp).toLocaleString()} on `}
                      <a
                        href={`https://osw.orb-sys.com/device/?id=${t.device_id}`}
                        target="_blank"
                      >
                        {`${
                          deviceIdNameMap?.find(
                            (d) => d.device_id === t.device_id
                          )?.os_name || t.device_id
                        }`}
                      </a>
                    </span>
                    {" : "}
                    <a
                      href={`https://osw.orb-sys.com/plotting/?device_id=${t.device_id}&session_id=${t.session_id}`}
                      target="_blank"
                    >
                      session
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </>
        </Segment>
      )}
      <div>
        <Header size="small">Symptom distribution</Header>
        {groupBySymtomData?.length > 0 && (
          <div style={{ height: 500 }}>
            <ParentSize>
              {({ width, height }) => (
                <BarChart
                  width={width}
                  height={height}
                  data={groupBySymtomData}
                  getCodeColor={getSymptomColor}
                />
              )}
            </ParentSize>
          </div>
        )}
        <Header size="small">Symptom distribution per installation</Header>
        {groupedByInstallationData?.length > 0 && (
          <div
            style={{
              height: dynamicHeight > minHeight ? dynamicHeight : minHeight,
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <BarChart
                  width={width}
                  height={height}
                  data={groupedByInstallationData}
                  getCodeColor={getSymptomColor}
                />
              )}
            </ParentSize>
          </div>
        )}
      </div>
    </div>
  );
};
