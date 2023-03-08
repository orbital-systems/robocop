import { ColumnDef } from "@tanstack/react-table";

export enum InstallationTableAccessors {
  name = "name",
  oas_revision = "oas_revision",
}

export enum InstallationTableNames {
  name = "Installation",
  oas_revision = "Release version",
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
  {
    accessorKey: InstallationTableAccessors.oas_revision,
    id: InstallationTableAccessors.oas_revision,
    header: InstallationTableNames.oas_revision,
    enableColumnFilter: false,
  },
];
