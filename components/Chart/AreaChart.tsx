import React from "react";
import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import { AxisLeft, AxisBottom, AxisScale } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { getDateAccessor } from "../../util";
import { ChartData } from "../../types";

const axisColor = "#fff";
const axisBottomTickLabelProps = {
  textAnchor: "middle" as const,
  fontFamily: "Arial",
  fontSize: 10,
  fill: axisColor,
};
const axisLeftTickLabelProps = {
  dx: "-0.25em",
  dy: "0.25em",
  fontFamily: "Arial",
  fontSize: 10,
  textAnchor: "end" as const,
  fill: axisColor,
};

export default function AreaChart({
  data,
  gradientColor,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  hideBottomAxis = false,
  hideLeftAxis = false,
  top,
  left,
  children,
  onHover,
  onClick,
  getValueAccessor,
  circleRadius,
  getCodeColor,
}: {
  data: ChartData[];
  gradientColor: string;
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  width: number;
  yMax: number;
  margin: { top: number; right: number; bottom: number; left: number };
  hideBottomAxis?: boolean;
  hideLeftAxis?: boolean;
  top?: number;
  left?: number;
  children?: React.ReactNode;
  onHover?(d: ChartData | undefined): void;
  onClick?(d: ChartData): void;
  getValueAccessor(d: ChartData): number;
  circleRadius?: number;
  getCodeColor(code: string): string;
}) {
  if (width < 10) return null;
  return (
    <Group left={left || margin.left} top={top || margin.top}>
      <LinearGradient
        id="gradient"
        from={gradientColor}
        fromOpacity={1}
        to={gradientColor}
        toOpacity={0.2}
      />
      {data.map((d, i) => (
        <Circle
          key={`point-${i}`}
          className="dot"
          cx={xScale(getDateAccessor(d))}
          cy={yScale(getValueAccessor(d))}
          fill={getCodeColor(d.code)}
          r={circleRadius ?? 3}
          onMouseEnter={() => onHover && onHover(d)}
          onMouseLeave={() => onHover && onHover(undefined)}
          style={{ cursor: onHover && "pointer" }}
          onClick={() => onClick && onClick(d)}
        />
      ))}
      {!hideBottomAxis && (
        <AxisBottom
          top={yMax}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisBottomTickLabelProps}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisLeftTickLabelProps}
        />
      )}
      {children}
    </Group>
  );
}
