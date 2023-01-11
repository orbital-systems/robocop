import { useMemo } from "react";
import { DataTable } from "../../components/DataTable";
import { symptomsTableColumns } from "../../components/DataTable/Symptoms/columns";
import { Data } from "../../types";

interface ReportProps {
  data: Data[];
}
export const Report = ({ data }: ReportProps) => {
  const symptomsColumns = useMemo(() => [...symptomsTableColumns], []);

  const installationData = useMemo(
    () => Array.from(new Set(data.map((d) => d?.os_name || d.shower_id))),
    [data]
  );

  return (
    <>
      <div>
        <h2>Report</h2>
        <DataTable
          data={installationData.map((d) => {
            return { name: d };
          })}
          columns={symptomsColumns as any}
        />
      </div>
    </>
  );
};
