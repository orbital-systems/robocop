import { ColumnDef } from "@tanstack/react-table";
import { DiagnoseCell } from "./cells";

export enum DiagnosisTableAccessors {
  name = "name",
}

export enum SymptomTableNames {
  name = "Diagnose",
}

interface Symptom {
  name: string;
}
type DiagnosisTable = Symptom[];

export const DiagnosisTableColumns: ColumnDef<DiagnosisTable>[] = [
  {
    accessorKey: DiagnosisTableAccessors.name,
    id: DiagnosisTableAccessors.name,
    header: SymptomTableNames.name,
    cell: DiagnoseCell,
  },
];
