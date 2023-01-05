import { ColumnDef } from "@tanstack/react-table";

export enum InstallationTableAccessors {
  name = "name",
}

export enum InstallationTableNames {
  name = "Installation",
}

interface Installation {
  name: string;
}
type InstallationTable = Installation[];

export const installationTableColumns: ColumnDef<InstallationTable>[] = [
  {
    accessorKey: InstallationTableAccessors.name,
    id: InstallationTableAccessors.name,
    header: InstallationTableNames.name,
  },
];
