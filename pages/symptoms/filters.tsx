import { useMemo } from "react";
import { getSymptomName } from "../../components/Chart/util";
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
  selectedSoftwareVersions: string[];
  setSelectedSoftwareVersions(v: string[]): void;
}
export const Filters = ({
  symptomsData,
  selectedSymptomIndexes,
  setSelectedSymptomIndexes,
  selectedInstallationIndexes,
  setSelectedInstallationIndexes,
  installationData,
  selectedSoftwareVersions,
  setSelectedSoftwareVersions,
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

  const toggleSoftwareVersion = (v: string) => {
    const updatedSoftwareVersions = [...selectedSoftwareVersions];
    if (selectedSoftwareVersions.includes(v)) {
      const removeIndex = updatedSoftwareVersions.indexOf(v);
      updatedSoftwareVersions.splice(removeIndex, 1);
    } else {
      updatedSoftwareVersions.push(v);
    }
    setSelectedSoftwareVersions(updatedSoftwareVersions);
  };

  return (
    <>
      <h2>1: Filter data</h2>
      <h3>Software version</h3>
      <input
        type="checkbox"
        id="r2"
        name="r2"
        checked={selectedSoftwareVersions.includes("r2")}
        onClick={() => toggleSoftwareVersion("r2")}
      />
      <label htmlFor="r2">R2</label>
      <input
        type="checkbox"
        id="r3"
        name="r3"
        checked={selectedSoftwareVersions.includes("r3")}
        onClick={() => toggleSoftwareVersion("r3")}
      />
      <label htmlFor="r3">R3</label>
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
              return { value: d, name: `${d} - ${getSymptomName(d)}` };
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
