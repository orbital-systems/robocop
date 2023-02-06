import { ColumnDef } from "@tanstack/react-table";
import { DiagnoseCell } from "./cells";

export enum DiagnoseTableAccessors {
  name = "name",
}

export enum SymptomTableNames {
  name = "Diagnose",
}

interface Symptom {
  name: string;
}
type DiagnoseTable = Symptom[];

export const diagnoseTableColumns: ColumnDef<DiagnoseTable>[] = [
  {
    accessorKey: DiagnoseTableAccessors.name,
    id: DiagnoseTableAccessors.name,
    header: SymptomTableNames.name,
    cell: DiagnoseCell,
  },
];
