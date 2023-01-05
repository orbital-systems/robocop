import { useMemo } from "react";
import { DataTable } from "../../components/DataTable";
import { installationTableColumns } from "../../components/DataTable/Installations/columns";
import { symptomsTableColumns } from "../../components/DataTable/Symptoms/columns";
import { IndeterminateCheckbox } from "../../components/InterminateCheckbox";

interface FiltersProps {
  symptomsData: { name: string }[];
  selectedSymptomIndexes: { [key: string]: boolean };
  setSelectedSymptomIndexes(data: { [key: string]: boolean }): void;
  selectedInstallationIndexes: { [key: string]: boolean };
  setSelectedInstallationIndexes(data: { [key: string]: boolean }): void;
  installationData: { name: string }[];
}
export const Filters = ({
  symptomsData,
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
      ...symptomsTableColumns,
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
      <h2>Filters</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "48%",
            backgroundColor: "#0a325733",
            border: "3px solid #0a3257",
          }}
        >
          <DataTable
            data={symptomsData}
            columns={symptomsColumns as any}
            rowSelection={selectedSymptomIndexes}
            setRowSelection={setSelectedSymptomIndexes}
          />
        </div>
        <div
          style={{
            width: "48%",
            backgroundColor: "#0a325733",
            border: "3px solid #0a3257",
          }}
        >
          <DataTable
            data={installationData}
            columns={installationColumns as any}
            rowSelection={selectedInstallationIndexes}
            setRowSelection={setSelectedInstallationIndexes}
          />
        </div>
      </div>
    </>
  );
};
