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
import { Data } from "../../pages/home";
import { getDateAccessor, getSymptomColor, getValueAccessor } from "./util";

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
  data: Data[];
  filteredData: Data[];
  setFilteredData(d: Data[]): void;
  externalFilter(d: Data[]): Data[];
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
}: ChartProps) => {
  const brushRef = useRef<BaseBrush | null>(null);

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
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

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushDateScale(getDateAccessor(data[0])) },
      end: { x: brushDateScale(getDateAccessor(data[150])) },
    }),
    [brushDateScale]
  );

  // event handlers
  const handleClearClick = () => {
    if (brushRef?.current) {
      setFilteredData(data);
      brushRef.current.reset();
    }
  };

  const handleResetClick = () => {
    if (brushRef?.current) {
      const updater: UpdateBrush = (prevBrush) => {
        const newExtent = brushRef.current!.getExtent(
          initialBrushPosition.start,
          initialBrushPosition.end
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
    handleResetClick();
  }, []);

  const dataInRangeFiltered = externalFilter(filteredData);
  const allDataFiltered = externalFilter(data);

  const [hoverData, setHoverData] = useState<Data | undefined>(undefined);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div>
          <button onClick={handleClearClick} style={{ marginRight: 8 }}>
            Clear timespan
          </button>
          <button onClick={handleResetClick}>Reset timespan</button>
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
        />
        <AreaChart
          hideBottomAxis
          hideLeftAxis
          data={allDataFiltered}
          width={width}
          yMax={yBrushMax}
          xScale={brushDateScale}
          yScale={brushvalueScale}
          margin={brushMargin}
          top={topChartHeight + topChartBottomMargin + margin.top}
          gradientColor={background2}
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
