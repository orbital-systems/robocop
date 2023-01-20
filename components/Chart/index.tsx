import React, { useRef, useState, useMemo, useEffect } from "react";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Brush } from "@visx/brush";
import { Bounds } from "@visx/brush/lib/types";
import BaseBrush, {
  BaseBrushState,
  UpdateBrush,
} from "@visx/brush/lib/BaseBrush";
import { PatternLines } from "@visx/pattern";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import { max, extent } from "d3-array";
import AreaChart from "./AreaChart";
import { getDateAccessor, getSymptomColor } from "./util";
import { Symptom, DateInterval } from "../../types";
import DatePicker from "react-datepicker";

const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 20;
const PATTERN_ID = "brush_pattern";
const GRADIENT_ID = "brush_gradient";
const accentColor = "#fff";
const background = "#0a3257";
const background2 = "#047130";

const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: "white",
};

type ChartProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  compact?: boolean;
  data: Symptom[];
  filteredData: Symptom[];
  setFilteredData(d: Symptom[]): void;
  externalFilter(d: Symptom[]): Symptom[];
  getValueAccessor(d: Symptom): number;
  setValueAccessor(a: "symptom" | "installation"): void;
  valueAccessor: "symptom" | "installation";
  dateInterval: DateInterval;
  setDateInterval(d: DateInterval): void;
};

const Chart = ({
  compact = false,
  width,
  height,
  margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  },
  data,
  filteredData,
  setFilteredData,
  externalFilter,
  getValueAccessor,
  setValueAccessor,
  valueAccessor,
  dateInterval,
  setDateInterval,
}: ChartProps) => {
  const brushRef = useRef<BaseBrush | null>(null);

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;

    setDateInterval({
      ...dateInterval,
      from: new Date(x0),
      to: new Date(x1),
    });
    const dataCopy = data.filter((s) => {
      const x = getDateAccessor(s).getTime();
      const y = getValueAccessor(s);
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredData(dataCopy);
  };

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = compact
    ? chartSeparation / 2
    : chartSeparation + 10;
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(
    bottomChartHeight - brushMargin.top - brushMargin.bottom,
    0
  );

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xMax],
        domain: extent(filteredData, getDateAccessor) as [Date, Date],
      }),
    [xMax, filteredData]
  );

  const valueScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        domain: [0, max(filteredData, getValueAccessor) || 0],
        nice: true,
      }),
    [yMax, filteredData]
  );

  const brushDateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xBrushMax],
        domain: extent(data, getDateAccessor) as [Date, Date],
      }),
    [xBrushMax]
  );

  const brushvalueScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, max(data, getValueAccessor) || 0],
        nice: true,
      }),
    [yBrushMax]
  );

  const getXFromDate = (d: Date) =>
    brushDateScale(
      getDateAccessor({
        timestamp: d?.toISOString(),
      } as Symptom)
    );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: getXFromDate(dateInterval.from) },
      end: { x: getXFromDate(dateInterval.to) },
    }),
    [brushDateScale, dateInterval]
  );

  // event handlers
  const handleClearClick = () => {
    if (brushRef?.current) {
      setFilteredData(data);
      brushRef.current.reset();
    }
  };

  const setBrushPastWeek = () => {
    if (brushRef?.current) {
      const updater: UpdateBrush = (prevBrush) => {
        const oneWeekAgo = new Date(dateInterval.max);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newExtent = brushRef.current!.getExtent(
          { x: getXFromDate(oneWeekAgo) },
          { x: getXFromDate(dateInterval.max) }
        );

        const newState: BaseBrushState = {
          ...prevBrush,
          start: { y: newExtent.y0, x: newExtent.x0 },
          end: { y: newExtent.y1, x: newExtent.x1 },
          extent: newExtent,
        };

        return newState;
      };
      brushRef.current.updateBrush(updater);
    }
  };

  const setBrushPastMonth = () => {
    if (brushRef?.current) {
      const updater: UpdateBrush = (prevBrush) => {
        const oneWeekAgo = new Date(dateInterval.max);
        oneWeekAgo.setMonth(oneWeekAgo.getMonth() - 1);
        const newExtent = brushRef.current!.getExtent(
          { x: getXFromDate(oneWeekAgo) },
          { x: getXFromDate(dateInterval.max) }
        );

        const newState: BaseBrushState = {
          ...prevBrush,
          start: { y: newExtent.y0, x: newExtent.x0 },
          end: { y: newExtent.y1, x: newExtent.x1 },
          extent: newExtent,
        };

        return newState;
      };
      brushRef.current.updateBrush(updater);
    }
  };

  const handleDatepickerClick = (newValue: Date, type: "from" | "to") => {
    if (brushRef?.current) {
      const updater: UpdateBrush = (prevBrush) => {
        const newExtent = brushRef.current!.getExtent(
          {
            x: type === "from" ? getXFromDate(newValue) : prevBrush.extent.x0,
          },
          {
            x: type === "to" ? getXFromDate(newValue) : prevBrush.extent.x1,
          }
        );

        const newState: BaseBrushState = {
          ...prevBrush,
          start: { y: newExtent.y0, x: newExtent.x0 },
          end: { y: newExtent.y1, x: newExtent.x1 },
          extent: newExtent,
        };

        return newState;
      };
      brushRef.current.updateBrush(updater);
    }
  };

  useEffect(() => {
    setBrushPastWeek();
  }, []);

  const dataInRangeFiltered = externalFilter(filteredData);
  const allDataFiltered = externalFilter(data);

  const [hoverData, setHoverData] = useState<Symptom | undefined>(undefined);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 8,
        }}
      >
        <div>
          <div>
            <h3>Y axis</h3>
            <button
              onClick={() => setValueAccessor("installation")}
              style={{
                marginRight: 8,
                fontWeight:
                  valueAccessor === "installation" ? "bold" : "normal",
              }}
            >
              {"Installation"}
            </button>
            <button
              onClick={() => setValueAccessor("symptom")}
              style={{
                fontWeight: valueAccessor === "symptom" ? "bold" : "normal",
              }}
            >
              {"Symptom"}
            </button>
          </div>
          <div>
            <h3>Time span</h3>
            <div style={{ display: "flex" }}>
              <button onClick={handleClearClick} style={{ marginRight: 8 }}>
                All time
              </button>
              <button onClick={setBrushPastMonth} style={{ marginRight: 8 }}>
                Past month
              </button>
              <button onClick={setBrushPastWeek} style={{ marginRight: 8 }}>
                Past week
              </button>
              <div style={{ display: "flex" }}>
                <label style={{ marginRight: 8 }}>From</label>
                <DatePicker
                  selected={dateInterval.from}
                  onChange={(date: Date) => handleDatepickerClick(date, "from")}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy"
                  timeFormat="HH:mm"
                  minDate={dateInterval.min}
                  maxDate={dateInterval.to}
                />
                <label style={{ marginRight: 8, marginLeft: 8 }}>To</label>
                <DatePicker
                  selected={dateInterval.to}
                  onChange={(date: Date) => handleDatepickerClick(date, "to")}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy"
                  timeFormat="HH:mm"
                  minDate={dateInterval.from}
                  maxDate={dateInterval.max}
                />
              </div>
            </div>
            <span style={{ fontSize: 10, color: "red", float: "right" }}>
              Not corresponding to the X-axis, I'm loooking into why. Trust
              these values more.
            </span>
          </div>
        </div>
        <div>
          {typeof hoverData !== "undefined" && (
            <div style={{ display: "flex" }}>
              <div>
                {hoverData?.os_name || hoverData?.session_id}
                {` (sw version: ${hoverData.software_version})`}
              </div>
              <div
                style={{
                  backgroundColor: getSymptomColor(hoverData.symptom),
                  marginLeft: 8,
                }}
              >
                {hoverData?.symptom}
              </div>
            </div>
          )}
        </div>
      </div>
      <svg width={width} height={height}>
        <LinearGradient
          id={GRADIENT_ID}
          from={background}
          to={background2}
          rotate={45}
        />
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={`url(#${GRADIENT_ID})`}
          rx={14}
        />
        <AreaChart
          hideLeftAxis
          data={dataInRangeFiltered}
          width={width}
          margin={{ ...margin, bottom: topChartBottomMargin }}
          yMax={yMax}
          xScale={dateScale}
          yScale={valueScale}
          gradientColor={background2}
          onHover={setHoverData}
          getValueAccessor={getValueAccessor}
        />
        <AreaChart
          hideBottomAxis
          hideLeftAxis
          circleRadius={2}
          data={allDataFiltered}
          width={width}
          yMax={yBrushMax}
          xScale={brushDateScale}
          yScale={brushvalueScale}
          margin={brushMargin}
          top={topChartHeight + topChartBottomMargin + margin.top}
          gradientColor={background2}
          getValueAccessor={getValueAccessor}
        >
          <PatternLines
            id={PATTERN_ID}
            height={8}
            width={8}
            stroke={accentColor}
            strokeWidth={1}
            orientation={["diagonal"]}
          />
          <Brush
            xScale={brushDateScale}
            yScale={brushvalueScale}
            width={xBrushMax}
            height={yBrushMax}
            margin={brushMargin}
            handleSize={8}
            innerRef={brushRef}
            resizeTriggerAreas={["left", "right"]}
            brushDirection="horizontal"
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredData(data)}
            selectedBoxStyle={selectedBrushStyle}
            useWindowMoveEvents
            renderBrushHandle={(props) => <BrushHandle {...props} />}
          />
        </AreaChart>
      </svg>
    </div>
  );
};
// We need to manually offset the handles for them to be rendered at the right position
function BrushHandle({ x, height, isBrushActive }: any) {
  const pathWidth = 8;
  const pathHeight = 15;
  if (!isBrushActive) {
    return null;
  }

  return (
    <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
      <path
        fill="#f2f2f2"
        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
        stroke="#999999"
        strokeWidth="1"
        style={{ cursor: "ew-resize" }}
      />
    </Group>
  );
}

export default Chart;
