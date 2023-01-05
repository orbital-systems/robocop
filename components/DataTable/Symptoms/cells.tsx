import { getSymptomColor } from "../../Chart/util";

export const SymptomCell = ({ row }: any) => (
  <div
    style={{
      backgroundColor: getSymptomColor(row.original.name),
    }}
  >
    {row.original.name}
  </div>
);
