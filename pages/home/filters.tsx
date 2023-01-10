import { useMemo } from "react";
import { DataTable } from "../../components/DataTable";
import { installationTableColumns } from "../../components/DataTable/Installations/columns";
import { symptomsTableColumns } from "../../components/DataTable/Symptoms/columns";
import { IndeterminateCheckbox } from "../../components/InterminateCheckbox";

interface FiltersProps {
  symptomsData: string[];
  selectedSymptomIndexes: { [key: string]: boolean };
  setSelectedSymptomIndexes(data: { [key: string]: boolean }): void;
  selectedInstallationIndexes: { [key: string]: boolean };
  setSelectedInstallationIndexes(data: { [key: string]: boolean }): void;
  installationData: string[];
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
            data={symptomsData.map((d) => {
              return { name: d };
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
