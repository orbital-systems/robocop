import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import dynamic from "next/dynamic";
import { Symptom, DateInterval } from "../../types";

const BarChart = dynamic(() => import("../../components/BarChart"), {
  ssr: false,
});

interface ReportProps {
  data: Symptom[];
  dateInterval: DateInterval | undefined;
}

export const Report = ({ data, dateInterval }: ReportProps) => {
  const groupByInstallation = data.reduce(
    (group: { [key: string]: Symptom[] }, d) => {
      const id = d.os_name || d.session_id;
      group[id] = group[id] ?? [];
      group[id].push(d);
      return group;
    },
    {}
  );

  const groupedByInstallationData = Object.entries(groupByInstallation).map(
    (d) => {
      const groupBySymptom = d[1].reduce((obj: any, b) => {
        const oldVal = obj[b.symptom] || 0;
        obj[b.symptom] = oldVal + 1;
        return obj;
      }, {});

      return { name: d[0], ...groupBySymptom };
    }
  );

  const reportTimeInterval =
    typeof dateInterval === "undefined"
      ? "all time"
      : `${dateInterval.from.toLocaleDateString()} - ${dateInterval.to.toLocaleDateString()}`;

  const dynamicHeight = groupedByInstallationData?.length * 15;
  const minHeight = 500;

  const groupBySymptom = data.reduce((obj: any, b) => {
    const oldVal = obj[b.symptom] || 0;
    obj[b.symptom] = oldVal + 1;
    return obj;
  }, {});

  const groupedBySymptomData = Object.entries(groupBySymptom).map((d) => {
    return { name: d[0], [`${d[0]}`]: d[1] };
  });

  return (
    <div>
      <h2>{`3: Report ${reportTimeInterval}`}</h2>
      {data?.length > 0 ? (
        <>
          <h3>Symptoms in total</h3>
          {groupedBySymptomData?.length > 0 && (
            <div style={{ height: 500 }}>
              <ParentSize>
                {({ width, height }) => (
                  <BarChart
                    width={width}
                    height={height}
                    data={groupedBySymptomData}
                  />
                )}
              </ParentSize>
            </div>
          )}
          <h3>Symptoms per installation</h3>
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
