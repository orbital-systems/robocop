import { getDiagnoseColor } from "../../../util";

export const DiagnoseCell = ({ row }: any) => (
  <div
    style={{
      backgroundColor: getDiagnoseColor(row.original.value),
    }}
  >
    {row.original.name}
  </div>
);
