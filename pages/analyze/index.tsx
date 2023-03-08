import { useEffect, useState } from "react";
import { DateInterval, ChartData } from "../../types";
import { ValueAccessor } from "../../types/valueaccessor.interface";
import { getData } from "../hooks/getData";
import { DiagnoseReport } from "./diagnose-report";
import { Settings } from "./settings";
import { SymtpomsReport } from "./symptom-report";

export type DataType = "diagnosis" | "symptom";

export default function Analyze() {
  const [dataType, setDataType] = useState<DataType>("diagnosis");

  const [valueAccessor, setValueAccessor] =
    useState<ValueAccessor>("installation");

  const [filteredData, setFilteredData] = useState<ChartData[]>([]);

  const [dateInterval, setDateInterval] = useState<DateInterval | undefined>(
    undefined
  );
  const [desiredDateInterval, setDesiredDateInterval] = useState<
    { to: Date; from: Date } | undefined
  >(undefined);

  const { data } = getData(dataType);

  useEffect(() => {
    const sort = data.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    if (sort?.length > 0) {
      const minDate = new Date(sort[0]?.timestamp);
      const maxDate = new Date(sort[sort.length - 1]?.timestamp);

      const oneWeekAgo = new Date(maxDate);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      setDateInterval({
        from: oneWeekAgo,
        to: maxDate,
        min: minDate,
        max: maxDate,
      });
      setDesiredDateInterval({ to: maxDate, from: oneWeekAgo });
    }
  }, [data]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      {dataType === "diagnosis" ? (
        <DiagnoseReport
          filteredData={filteredData}
          dateInterval={dateInterval}
          setDateInterval={setDateInterval}
          valueAccessor={valueAccessor}
          desiredDateInterval={desiredDateInterval}
        />
      ) : (
        <SymtpomsReport
          filteredData={filteredData}
          dateInterval={dateInterval}
          setDateInterval={setDateInterval}
          valueAccessor={valueAccessor}
          desiredDateInterval={desiredDateInterval}
        />
      )}
      <Settings
        data={data}
        setFilteredData={setFilteredData}
        dateInterval={dateInterval}
        setDesiredDateInterval={setDesiredDateInterval}
        valueAccessor={valueAccessor}
        setValueAccessor={setValueAccessor}
        dataType={dataType}
        setDataType={setDataType}
      />
    </div>
  );
}
