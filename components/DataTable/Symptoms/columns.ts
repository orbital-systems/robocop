import { ColumnDef } from "@tanstack/react-table";

export enum SymptomsTableAccessors {
  name = "name",
}

export enum SymptomTableNames {
  name = "Symptom",
}

interface Symptom {
  name: string;
}
type SymptomsTable = Symptom[];

export const symptomsTableColumns: ColumnDef<SymptomsTable>[] = [
  {
    accessorKey: SymptomsTableAccessors.name,
    id: SymptomsTableAccessors.name,
    header: SymptomTableNames.name,
  },
];
