import { useMemo } from "react";
import { DataTable } from "../../components/DataTable";
import { DiagnosisTableColumns } from "../../components/DataTable/Diagnosis/columns";
import { installationTableColumns } from "../../components/DataTable/Installations/columns";
import { IndeterminateCheckbox } from "../../components/InterminateCheckbox";
import { getDiagnosisName } from "../../util";

interface FiltersProps {
  diagnosisData: string[];
  selectedSymptomIndexes: { [key: string]: boolean };
  setSelectedSymptomIndexes(data: { [key: string]: boolean }): void;
  selectedInstallationIndexes: { [key: string]: boolean };
  setSelectedInstallationIndexes(data: { [key: string]: boolean }): void;
  installationData: string[];
}
export const Filters = ({
  diagnosisData,
  selectedSymptomIndexes,
  setSelectedSymptomIndexes,
  selectedInstallationIndexes,
  setSelectedInstallationIndexes,
  installationData,
}: FiltersProps) => {
  const symptomsColumns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      ,
      ...DiagnosisTableColumns,
    ],
    []
  );

  const installationColumns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      ,
      ...installationTableColumns,
    ],
    []
  );

  return (
    <>
      <h2>1: Filter data</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: "48%",
          }}
        >
          <h3>Symptoms</h3>
          <DataTable
            data={diagnosisData.map((d) => {
              return { value: d, name: `${d} - ${getDiagnosisName(d)}` };
            })}
            columns={symptomsColumns as any}
            rowSelection={selectedSymptomIndexes}
            setRowSelection={setSelectedSymptomIndexes}
          />
        </div>
        <div
          style={{
            width: "48%",
          }}
        >
          <h3>Installations</h3>
          <DataTable
            data={installationData.map((d) => {
              return { name: d };
            })}
            columns={installationColumns as any}
            rowSelection={selectedInstallationIndexes}
            setRowSelection={setSelectedInstallationIndexes}
          />
        </div>
      </div>
    </>
  );
};
