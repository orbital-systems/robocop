import { useMemo } from "react";
import { DataTable } from "../../components/DataTable";
import { DiagnosisTableColumns } from "../../components/DataTable/Diagnosis/columns";
import { installationTableColumns } from "../../components/DataTable/Installations/columns";
import { IndeterminateCheckbox } from "../../components/InterminateCheckbox";
import { deviceIdNameMap } from "../../exampledata";
import { getDiagnosisName } from "../../util";

interface FiltersProps {
  diagnosisData: string[];
  selectedDiagnoseIndexes: { [key: string]: boolean };
  setSelectedDiagnoseIndexes(data: { [key: string]: boolean }): void;
  selectedInstallationIndexes: { [key: string]: boolean };
  setSelectedInstallationIndexes(data: { [key: string]: boolean }): void;
  installationData: string[];
}
export const Filters = ({
  diagnosisData,
  selectedDiagnoseIndexes,
  setSelectedDiagnoseIndexes,
  selectedInstallationIndexes,
  setSelectedInstallationIndexes,
  installationData,
}: FiltersProps) => {
  const diagnosesColumns = useMemo(
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
          <h3>Diagnoses</h3>
          <DataTable
            data={diagnosisData.map((d) => {
              return { value: d, name: `${d} - ${getDiagnosisName(d)}` };
            })}
            columns={diagnosesColumns as any}
            rowSelection={selectedDiagnoseIndexes}
            setRowSelection={setSelectedDiagnoseIndexes}
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
              return {
                value: d,
                name:
                  deviceIdNameMap?.find((s) => s.device_id === d)?.os_name || d,
              };
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
