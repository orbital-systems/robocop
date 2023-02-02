import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import dynamic from "next/dynamic";
import { Diagnosis, DateInterval } from "../../types";
import { getDiagnosisColor } from "../../util";

const BarChart = dynamic(() => import("../../components/BarChart"), {
  ssr: false,
});

interface ReportProps {
  data: Diagnosis[];
  dateInterval: DateInterval | undefined;
}

export const Report = ({ data, dateInterval }: ReportProps) => {
  const groupByInstallation = data.reduce(
    (group: { [key: string]: Diagnosis[] }, d) => {
      const id = d.device_id;
      group[id] = group[id] ?? [];
      group[id].push(d);
      return group;
    },
    {}
  );

  const groupedByInstallationData = Object.entries(groupByInstallation).map(
    (d) => {
      const groupByDiagnosis = d[1].reduce((obj: any, b) => {
        const oldVal = obj[b.code] || 0;
        obj[b.code] = oldVal + 1;
        return obj;
      }, {});

      return { name: d[0], ...groupByDiagnosis };
    }
  );

  const reportTimeInterval =
    typeof dateInterval === "undefined"
      ? "all time"
      : `${dateInterval.from.toLocaleDateString()} - ${dateInterval.to.toLocaleDateString()}`;

  const dynamicHeight = groupedByInstallationData?.length * 15;
  const minHeight = 500;

  const groupByDiagnosis = data.reduce((obj: any, b) => {
    const oldVal = obj[b.code] || 0;
    obj[b.code] = oldVal + 1;
    return obj;
  }, {});

  const groupedByDiagnosisData = Object.entries(groupByDiagnosis).map((d) => {
    return { name: d[0], [`${d[0]}`]: d[1] };
  });

  return (
    <div>
      <h2>{`3: Report ${reportTimeInterval}`}</h2>
      {data?.length > 0 ? (
        <>
          <h3>Diagnosis in total</h3>
          {groupedByDiagnosisData?.length > 0 && (
            <div style={{ height: 500 }}>
              <ParentSize>
                {({ width, height }) => (
                  <BarChart
                    width={width}
                    height={height}
                    data={groupedByDiagnosisData}
                    getCodeColor={getDiagnosisColor}
                  />
                )}
              </ParentSize>
            </div>
          )}
          <h3>Diagnosis per installation</h3>
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
                    getCodeColor={getDiagnosisColor}
                  />
                )}
              </ParentSize>
            </div>
          )}
        </>
      ) : (
        <p>Nothing found with selected filters and date interval</p>
      )}
    </div>
  );
};
