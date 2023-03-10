import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../../components/DataTable";
import { diagnoseTableColumns } from "../../components/DataTable/Diagnose/columns";
import { installationTableColumns } from "../../components/DataTable/Installations/columns";
import { symptomsTableColumns } from "../../components/DataTable/Symptoms/columns";
import { IndeterminateCheckbox } from "../../components/InterminateCheckbox";
import { ChartData, DateInterval } from "../../types";
import { getDiagnoseName, getSymptomName } from "../../util";
import DatePicker from "react-datepicker";
import { ValueAccessor } from "../../types/valueaccessor.interface";
import {
  Accordion,
  Button,
  Checkbox,
  Header,
  Icon,
  Label,
  Segment,
} from "semantic-ui-react";
import { DataType } from ".";

interface Settings {
  data: ChartData[];
  setFilteredData(d: ChartData[]): void;
  dateInterval: DateInterval | undefined;
  setDesiredDateInterval({ to, from }: { to: Date; from: Date }): void;
  setValueAccessor(a: ValueAccessor): void;
  valueAccessor: ValueAccessor;
  dataType: DataType;
  setDataType(d: DataType): void;
}

export const Settings = ({
  data,
  setFilteredData,
  dateInterval,
  setDesiredDateInterval,
  valueAccessor,
  setValueAccessor,
  dataType,
  setDataType,
}: Settings) => {
  const [accordionIndex, setAccordionIndex] = useState(0);
  const toggleAccordionIndex = (index: number) => {
    const newIndex = accordionIndex === index ? -1 : index;
    setAccordionIndex(newIndex);
  };

  /* All software versions */
  const [selectedSoftwareVersions, setSelectedSoftwareVersions] = useState<
    string[]
  >(["r2", "r3"]);

  /* All codes in the data set */
  const codeData = useMemo(
    () => Array.from(new Set(data.map((d) => d.code))),
    [data]
  );

  /* All installations in the data set */
  const installationData = useMemo(
    () =>
      Array.from(new Set(data.map((d) => d.device_id))).map((d) => {
        const device = data.find((org) => org.device_id === d);
        return {
          id: d,
          name: device?.os_name,
          oas_revision: device?.oas_revision,
        };
      }),
    [data]
  );

  /* Indexes of selected diagnoses */
  const [selectedIndexes, setSelectedIndexes] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    setSelectedIndexes({});
  }, [dataType]);

  /* Indexes of selected installations */
  const [selectedInstallationIndexes, setSelectedInstallationIndexes] =
    useState<{
      [key: string]: boolean;
    }>({});

  const diagnosesColumns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      ,
      ...diagnoseTableColumns,
    ],
    []
  );

  const symtomsColumns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      ,
      ...symptomsTableColumns,
    ],
    []
  );

  const installationColumns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      ,
      ...installationTableColumns,
    ],
    []
  );

  /* Function to filter out data that's not selected sw-version, diagnose and installation  */
  useEffect(() => {
    const hiddenDiagnosesIndexes = codeData.filter(
      (_, i) => !selectedIndexes[i]
    );

    const hiddenInstallationIndexes = installationData.filter(
      (_, i) => !selectedInstallationIndexes[i]
    );

    const filteredData = [...data].filter(
      (d) =>
        !hiddenDiagnosesIndexes.includes(d.code) &&
        !hiddenInstallationIndexes.map((d) => d.id).includes(d.device_id) &&
        selectedSoftwareVersions.includes(`r${d?.oas_revision}`)
    );
    setFilteredData(filteredData);
  }, [
    data,
    codeData,
    selectedIndexes,
    installationData,
    selectedInstallationIndexes,
    selectedSoftwareVersions,
    dataType,
  ]);

  const toggleSoftwareVersion = (v: string) => {
    const updatedSoftwareVersions = [...selectedSoftwareVersions];
    if (selectedSoftwareVersions.includes(v)) {
      const removeIndex = updatedSoftwareVersions.indexOf(v);
      updatedSoftwareVersions.splice(removeIndex, 1);
    } else {
      updatedSoftwareVersions.push(v);
    }
    setSelectedSoftwareVersions(updatedSoftwareVersions);
  };

  const handleDatepickerClick = (newValue: Date, type: "from" | "to") => {
    if (typeof dateInterval !== "undefined" && type === "to") {
      setDesiredDateInterval({ ...dateInterval, to: newValue });
    } else if (typeof dateInterval !== "undefined" && type === "from") {
      setDesiredDateInterval({ ...dateInterval, from: newValue });
    }
  };

  const setBrushPastWeek = () => {
    if (typeof dateInterval !== "undefined") {
      const oneWeekAgo = new Date(dateInterval.max);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      setDesiredDateInterval({
        ...dateInterval,
        from: oneWeekAgo,
        to: dateInterval.max,
      });
    }
  };

  const setBrushPastMonth = () => {
    if (typeof dateInterval !== "undefined") {
      const oneMonthAgo = new Date(dateInterval.max);
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 31);

      setDesiredDateInterval({
        ...dateInterval,
        from: oneMonthAgo,
        to: dateInterval.max,
      });
    }
  };

  const setBrushAllTime = () => {
    if (typeof dateInterval !== "undefined") {
      const oneMonthAgo = new Date(dateInterval.max);
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 31);

      setDesiredDateInterval({
        ...dateInterval,
        from: dateInterval.min,
        to: dateInterval.max,
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setBrushPastWeek();
    }, 1000);
  }, [dataType]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 550,
        maxWidth: 550,
        marginLeft: 16,
        paddingLeft: 16,
        borderLeft: "1px solid #00000030",
      }}
    >
      <Accordion>
        <Accordion.Title
          active={accordionIndex === 0}
          index={0}
          onClick={() => toggleAccordionIndex(0)}
        >
          <Header>
            <Icon name="dropdown" />
            Installations
          </Header>
        </Accordion.Title>
        <Accordion.Content active={accordionIndex === 0}>
          <Segment>
            <Header size="small">Software version</Header>
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <Checkbox
                type="checkbox"
                id="r2"
                name="r2"
                checked={selectedSoftwareVersions.includes("r2")}
                onClick={() => toggleSoftwareVersion("r2")}
              />
              <Label htmlFor="r2" style={{ marginLeft: 8 }}>
                R2
              </Label>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <Checkbox
                type="checkbox"
                id="r3"
                name="r3"
                checked={selectedSoftwareVersions.includes("r3")}
                onClick={() => toggleSoftwareVersion("r3")}
              />
              <Label htmlFor="r3" style={{ marginLeft: 8 }}>
                R3
              </Label>
            </div>
          </Segment>
          <Segment>
            <Header size="small">Installations</Header>
            <DataTable
              data={installationData.map((d) => {
                return {
                  value: d.id,
                  name: d.name,
                  oas_revision: d.oas_revision,
                };
              })}
              columns={installationColumns as any}
              rowSelection={selectedInstallationIndexes}
              setRowSelection={setSelectedInstallationIndexes}
            />
          </Segment>
        </Accordion.Content>
        <Accordion.Title
          active={accordionIndex === 1}
          index={1}
          onClick={() => toggleAccordionIndex(1)}
        >
          <Header>
            <Icon name="dropdown" />
            Data
          </Header>
        </Accordion.Title>
        <Accordion.Content active={accordionIndex === 1}>
          <Segment>
            <Header size="small">Type</Header>
            <Checkbox
              radio
              label="Diagnoses"
              value="DIAGNOSIS"
              checked={dataType === "diagnosis"}
              onChange={() => setDataType("diagnosis")}
              style={{ marginRight: 8 }}
            />
            <Checkbox
              radio
              label="Symptoms"
              value="symptoms"
              checked={dataType === "symptom"}
              onChange={() => setDataType("symptom")}
            />
          </Segment>
          <Segment>
            <Header size="small">
              {dataType === "diagnosis" ? "Diagnosis" : "Symptom"}
            </Header>
            {dataType === "diagnosis" ? (
              <DataTable
                data={codeData.map((d) => {
                  return { value: d, name: `${d} - ${getDiagnoseName(d)}` };
                })}
                columns={diagnosesColumns as any}
                rowSelection={selectedIndexes}
                setRowSelection={setSelectedIndexes}
              />
            ) : (
              <DataTable
                data={codeData.map((d) => {
                  return { value: d, name: `${d} - ${getSymptomName(d)}` };
                })}
                columns={symtomsColumns as any}
                rowSelection={selectedIndexes}
                setRowSelection={setSelectedIndexes}
              />
            )}
          </Segment>
        </Accordion.Content>
        <Accordion.Title
          active={accordionIndex === 2}
          index={2}
          onClick={() => toggleAccordionIndex(2)}
        >
          <Header>
            <Icon name="dropdown" />
            Plot settings
          </Header>
        </Accordion.Title>
        <Accordion.Content active={accordionIndex === 2}>
          <Segment>
            <Header size="small">Y axis</Header>
            <Checkbox
              radio
              label="Installation"
              value="installation"
              checked={valueAccessor === "installation"}
              onChange={() => setValueAccessor("installation")}
              style={{ marginRight: 8 }}
            />
            <Checkbox
              radio
              label="Code"
              value="code"
              checked={valueAccessor === "code"}
              onChange={() => setValueAccessor("code")}
            />
          </Segment>
          <Segment>
            <Header size="small">Time span</Header>
            <div>
              <div style={{ display: "flex" }}>
                <Button onClick={setBrushAllTime} style={{ marginRight: 8 }}>
                  All time
                </Button>
                <Button onClick={setBrushPastMonth} style={{ marginRight: 8 }}>
                  Past month
                </Button>
                <Button onClick={setBrushPastWeek} style={{ marginRight: 8 }}>
                  Past week
                </Button>
              </div>
              {typeof dateInterval !== "undefined" && (
                <>
                  <div style={{ marginTop: 8 }}>
                    <label style={{ marginRight: 8 }}>From</label>
                    <DatePicker
                      selected={dateInterval.from}
                      onChange={(date: Date) =>
                        handleDatepickerClick(date, "from")
                      }
                      showTimeSelect
                      dateFormat="dd/MM/yyyy"
                      timeFormat="HH:mm"
                      minDate={dateInterval.min}
                      maxDate={dateInterval.to}
                      className="myDatePicker"
                    />
                  </div>
                  <div>
                    <label style={{ marginRight: 8 }}>To</label>
                    <DatePicker
                      selected={dateInterval.to}
                      onChange={(date: Date) =>
                        handleDatepickerClick(date, "to")
                      }
                      showTimeSelect
                      dateFormat="dd/MM/yyyy"
                      timeFormat="HH:mm"
                      minDate={dateInterval.from}
                      maxDate={dateInterval.max}
                      className="myDatePicker"
                    />
                  </div>
                </>
              )}
            </div>
          </Segment>
        </Accordion.Content>
      </Accordion>
    </div>
  );
};
