import { LinearGradient } from "@visx/gradient";
import { PatternCircles, PatternWaves } from "@visx/pattern";
import { ScaleLinear } from "@visx/vendor/d3-scale";
import { curveCatmullRom, line } from "d3";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

const RADIAL_GRADIENT_ID = "gradient";
const GLOW_FILTER_ID = "glow";
const CIRCLES_PATTERN_ID = "circle-pattern";
const WAVE_PATTERN_ID = "wave-pattern";
const LINEAR_GRADIENT_ID = "linear-gradient";

type OutlinePathsSerdeProps = {
  points: Array<[number, number]>;

  active?: boolean;
};
type OutlinePathDynamicProps = {
  key: string;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
};

type OutlinePathProps = OutlinePathsSerdeProps & OutlinePathDynamicProps;

const OutlinePath = ({
  key,
  points,
  xScale,
  yScale,
  active = true,
}: OutlinePathProps) => {
  const [isHovered, setHovered] = useState(false);

  const accessorX = useCallback(
    (d: [number, number]) => xScale(d[0]),
    [xScale]
  );
  const accessorY = useCallback(
    (d: [number, number]) => yScale(d[1]),
    [yScale]
  );

  const pathFn = useMemo(
    () => line().x(accessorX).y(accessorY).curve(curveCatmullRom.alpha(0.5)),
    [accessorX, accessorY]
  );

  return (
    <AnimatePresence key={key}>
      {active && (
        <>
          <PatternCircles
            id={CIRCLES_PATTERN_ID}
            height={40}
            width={40}
            radius={5}
            fill="#036ecf"
            complement
          />
          <PatternWaves
            id={WAVE_PATTERN_ID}
            height={12}
            width={12}
            fill="transparent"
            stroke="#232493"
            strokeWidth={1}
          />

          <LinearGradient
            id={LINEAR_GRADIENT_ID}
            from="#351CAB"
            to="#621A61"
            rotate="-45"
          />

          <radialGradient
            id={RADIAL_GRADIENT_ID}
            cx="0"
            cy="0"
            r="267"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(491.25,402)"
          >
            <stop offset="0" stopColor="white" stopOpacity="0"></stop>
            <stop offset="0.25" stopColor="white" stopOpacity="0.7"></stop>
            <stop offset="0.5" stopColor="white" stopOpacity="0"></stop>
            <stop offset="0.75" stopColor="white" stopOpacity="0.7"></stop>
            <stop offset="1" stopColor="white" stopOpacity="0"></stop>
            <animateTransform
              attributeName="gradientTransform"
              attributeType="XML"
              type="scale"
              from="0"
              to="12"
              dur="1.5s"
              begin=".3s"
              fill="freeze"
              additive="sum"
            ></animateTransform>
          </radialGradient>

          <filter
            id={GLOW_FILTER_ID}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="2"
              floodColor="#1d85bb"
            ></feDropShadow>
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodColor="#1d85bb"
            ></feDropShadow>
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6"
              floodColor="#1d85bb"
            ></feDropShadow>
          </filter>

          <clipPath id="clip-path" d={pathFn(points) ?? ""}></clipPath>

          <motion.path
            id="mask-gradient"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-opacity="0"
            fill-opacity="1"
            fill={`url(#${RADIAL_GRADIENT_ID})`}
            d={pathFn(points) ?? ""}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5 }}
          ></motion.path>

          <motion.path
            id="mask-path"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            filter={`url(#${GLOW_FILTER_ID})`}
            d={pathFn(points) ?? ""}
            stroke-opacity=".8"
            stroke={"#1d85bb"}
            fill-opacity="1"
            fill={isHovered ? "red" : "transparent"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            onPointerEnter={() => {
              setHovered(true);
            }}
          ></motion.path>
        </>
      )}
    </AnimatePresence>
  );
};

const renderOutlinePath =
  ({ key, xScale, yScale }: OutlinePathDynamicProps) =>
  ({ points, active }: OutlinePathsSerdeProps) =>
    (
      <OutlinePath
        key={key}
        xScale={xScale}
        yScale={yScale}
        points={points}
        active={active}
      />
    );

export { OutlinePath };
export { renderOutlinePath };
export type { OutlinePathDynamicProps, OutlinePathsSerdeProps };
