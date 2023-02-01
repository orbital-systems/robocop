import { getSymptomColor } from "../../../util";

export const SymptomCell = ({ row }: any) => (
  <div
    style={{
      backgroundColor: getSymptomColor(row.original.value),
    }}
  >
    {row.original.name}
  </div>
);
