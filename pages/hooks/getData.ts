import { useEffect, useState } from "react";
import { ChartData } from "../../types";
import Devices from "../../utils/api/devices";
import { DataType } from "../analyze";
import { symptoms_diagnoses_db } from "../../exampledata";

export const getData = (dataType: DataType) => {
  const [data, setData] = useState<ChartData[]>([]);

  const [devices, setDevices] = useState<any[]>([]); // Ugly but will get from OSW later
  useEffect(() => {
    const getAllData = async () => {
      const states = ["pending", "active", "archived", "service", "all"];

      const fethedData: any = await Promise.all(
        states.map((state) =>
          Devices.getAll({ state }).then((res) => res.Items)
        )
      );
      setDevices(fethedData.flat());
    };
    getAllData();
  }, []);

  useEffect(() => {
    setData(
      symptoms_diagnoses_db
        .filter((d) => d.type === dataType)
        .map((d) => {
          const device = devices.find((s) => s.id === d.device_id);
          return {
            ...d,
            id: d.PK,
            timestamp: new Date(d?.timestamp).toISOString(),
            os_name: device?.os_name || d.device_id,
            oas_revision: device?.oas_revision,
          };
        })
    );
  }, [dataType, devices]);

  return { data };
};
