import { scaleLinear } from "@visx/scale";
import { ScaleLinear } from "d3-scale";
import { ComponentProps, ReactNode, useMemo } from "react";
import { type Margin } from "./types";
import { computeMarginForAspectRatio } from "./utils";

type SvgProps = PropsWithoutChildren<ComponentProps<"svg">> & {
  children: (args: {
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
    margin: Margin;
  }) => ReactNode;
  innerWidth: number;
  innerHeight: number;
  aspectRatio: [aw: number, ah: number];
};

const Svg = ({
  innerWidth,
  innerHeight,
  aspectRatio: [aw, ah],
  children,
}: SvgProps) => {
  const margin = useMemo(() => {
    return computeMarginForAspectRatio(innerWidth, innerHeight, aw, ah);
  }, [innerWidth, innerHeight, aw, ah]);

  const xScale = useMemo(
    () =>
      scaleLinear({
        range: [margin.left, innerWidth - margin.right],
        round: true,
        domain: [0, 1],
      }),
    [innerWidth, margin]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight - margin.top, margin.bottom],
        round: true,
        domain: [0, 1],
      }),
    [innerHeight, margin]
  );

  return (
    <svg
      width={innerWidth + margin.left + margin.right}
      height={innerHeight + margin.bottom + margin.top}
      fill="#044B94"
      fillOpacity="0.4"
      style={{
        resize: "both",
        overflow: "auto",
        position: "absolute",
        top: 0,
        left: 0,
        height: innerHeight + margin.bottom + margin.top,
        width: innerWidth + margin.left + margin.right,
        pointerEvents: "none",
      }}
    >
      {children({
        xScale,
        yScale,
        margin,
      })}
    </svg>
  );
};

// utils types

type PropsWithoutChildren<P> = P extends any
  ? "children" extends keyof P
    ? Omit<P, "children">
    : P
  : P;

export { Svg };
