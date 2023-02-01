import { getDiagnosisColor } from "../../../util";

export const DiagnoseCell = ({ row }: any) => (
  <div
    style={{
      backgroundColor: getDiagnosisColor(row.original.value),
    }}
  >
    {row.original.name}
  </div>
);
