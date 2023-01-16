import React from "react";
import { BarStackHorizontal } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { withTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { getSymptomColor } from "../Chart/util";

interface DataPointValues {
  heatup_error?: number;
  b11_other?: number;
  drain_leak?: number;
  w7_other?: number;
  no_inlet?: number;
  airsuction?: number;
  restricted_flow?: number;
  weak_radar?: number;
  radar_ghost?: number;
  setpoint_too_low?: number;
  w7_c7?: number;
  slow_heatup?: number;
  insufficient_power?: number;
  lid_open?: number;
}
interface DataPoint extends DataPointValues {
  name: string;
}

type TooltipData = {
  bar: SeriesPoint<DataPoint>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

type BarStackHorizontalProps = {
  data: DataPoint[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

const color = "#a44afe";
const background = "#eaedff";

const defaultMargin = { top: 40, left: 200, right: 40, bottom: 100 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
};

// accessors
const yAccessor = (d: DataPoint) => d.name;

let tooltipTimeout: number;

export default withTooltip<BarStackHorizontalProps, TooltipData>(
  ({
    data,
    width,
    height,
    events = false,
    margin = defaultMargin,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  }: BarStackHorizontalProps & WithTooltipProvidedProps<TooltipData>) => {
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const keys = Array.from(
      new Set(
        data?.map((d) => Object.keys(d).filter((d) => d !== "name")).flat()
      )
    );

    const totalNbrSymptoms = data.reduce((allTotals, currentInstallation) => {
      const total = keys.reduce((dailyTotal, k) => {
        dailyTotal += currentInstallation[k as keyof DataPointValues] || 0;
        return dailyTotal;
      }, 0);

      allTotals.push(total);
      return allTotals;
    }, [] as number[]);

    const getNbrOfSymtoms = (row: DataPoint) => {
      const totalNbrOfSymptoms = Object.values(row).map((r) => {
        if (typeof r === "number") return r;
        return 0;
      });
      return totalNbrOfSymptoms.reduce((partialSum, a) => partialSum + a, 0);
    };

    const sortedData = data.sort(
      (a, b) => getNbrOfSymtoms(a) - getNbrOfSymtoms(b)
    );

    // scales
    const xScale = scaleLinear<number>({
      domain: [0, Math.max(...totalNbrSymptoms)],
      nice: true,
    });
    const yScale = scaleBand<string>({
      domain: sortedData.map((d) => d.name),
      padding: 0.2,
    });

    xScale.rangeRound([0, xMax]);
    yScale.rangeRound([yMax, 0]);

    return width < 10 && height > 10 ? null : (
      <div>
        <svg width={width} height={height}>
          <rect width={width} height={height} fill={background} rx={14} />
          <Group top={margin.top} left={margin.left}>
            <BarStackHorizontal<DataPoint, string>
              data={sortedData}
              keys={keys}
              height={yMax}
              y={yAccessor}
              xScale={xScale}
              yScale={yScale}
              color={(symptom) => getSymptomColor(symptom)}
            >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar) => (
                    <rect
                      key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width > 0 ? bar.width : 0}
                      height={bar.height > 0 ? bar.height : 0}
                      fill={bar.color}
                      onClick={() => {
                        if (events) alert(`clicked: ${JSON.stringify(bar)}`);
                      }}
                      onMouseLeave={() => {
                        tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      }}
                      onMouseMove={() => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        const top = bar.y + margin.top;
                        const left = bar.x + bar.width + margin.left;
                        showTooltip({
                          tooltipData: bar,
                          tooltipTop: top,
                          tooltipLeft: left,
                        });
                      }}
                    />
                  ))
                )
              }
            </BarStackHorizontal>
            <AxisLeft
              hideAxisLine
              hideTicks
              scale={yScale}
              stroke={color}
              numTicks={sortedData?.length}
              tickStroke={color}
              tickLabelProps={() => ({
                fill: color,
                fontSize: 11,
                textAnchor: "end",
                dy: "0.33em",
              })}
            />
            <AxisBottom
              top={yMax}
              scale={xScale}
              stroke={color}
              tickStroke={color}
              numTicks={Math.max(...totalNbrSymptoms)}
              tickLabelProps={() => ({
                fill: color,
                fontSize: 11,
                textAnchor: "middle",
              })}
            />
          </Group>
        </svg>
        {tooltipOpen && tooltipData && (
          <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
            <div style={{ color: getSymptomColor(tooltipData.key) }}>
              <strong>{tooltipData.key}</strong>
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
);
