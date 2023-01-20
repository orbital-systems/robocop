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

  const groupedData = Object.entries(groupByInstallation).map((d, i) => {
    const groupBySymptom = d[1].reduce((obj: any, b) => {
      const oldVal = obj[b.symptom] || 0;
      obj[b.symptom] = oldVal + 1;
      return obj;
    }, {});

    return { name: d[0], ...groupBySymptom };
  });

  const reportTimeInterval =
    typeof dateInterval === "undefined"
      ? "all time"
      : `${dateInterval.from.toLocaleDateString()} - ${dateInterval.to.toLocaleDateString()}`;

  const dynamicHeight = groupedData?.length * 15;
  const minHeight = 500;

  return (
    <div>
      <h2>{`3: Report ${reportTimeInterval}`}</h2>
      {groupedData?.length > 0 && (
        <div
          style={{
            height: dynamicHeight > minHeight ? dynamicHeight : minHeight,
          }}
        >
          <ParentSize>
            {({ width, height }) => (
              <BarChart width={width} height={height} data={groupedData} />
            )}
          </ParentSize>
        </div>
      )}
    </div>
  );
};
