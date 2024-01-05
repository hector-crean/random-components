import { Svg } from "@/lib/components/svg/Svg";
import { GradientPinkBlue } from "@visx/gradient";
import { Group } from "@visx/group";
import { throttle } from "lodash";
import {
  ComponentProps,
  PointerEvent,
  ReactNode,
  forwardRef,
  useCallback,
  useRef,
} from "react";
import type { FrameProps } from "./types";
import { ZIndex } from "./types";
import { getPointerPositionWithinElement } from "./utill";

const BG_PATTERN_ID = "bg-pattern";

const Frame = ({
  width,
  height,
  aspectRatio,
  setCursorPosition,
  svgLayer,
  htmlLayer,
  canvasLayer,
  ...props
}: FrameProps) => {
  const htmlFrameRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {}, []);
  const handleMovePointer = useCallback(() => {}, []);

  const handlePointerMove = useCallback(
    throttle((e: PointerEvent<HTMLDivElement>) => {
      if (htmlFrameRef.current) {
        const { x, y } = getPointerPositionWithinElement(
          htmlFrameRef.current,
          e
        );
        setCursorPosition({ x, y });
      }
    }, 100),
    [htmlFrameRef]
  );

  return (
    <RelativeContainer zIndex={ZIndex.Zero} {...props}>
      <AbsoluteContainer
        id="svg-container"
        zIndex={ZIndex.Four}
        style={{ pointerEvents: "none" }}
      >
        <Svg
          innerWidth={width}
          innerHeight={height}
          aspectRatio={aspectRatio}
          pointerEvents={"all"}
        >
          {({ xScale, yScale, margin }) => (
            <>
              <GradientPinkBlue id={BG_PATTERN_ID} />
              {/* background */}
              <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="transparent"
                onPointerMove={handleMovePointer}
                onPointerLeave={handleClickOutside}
                // onPointerDown={handleClickOutside}
                // onPointerMove={handleMovePointer}
              />
              {/* background */}
              <rect
                x={margin.left}
                y={margin.top}
                width={width}
                height={height}
                fill={`url(#${BG_PATTERN_ID})`}
                fillOpacity={0.3}
                pointerEvents={"none"}
                //   animate={{ stdDeviation: isHovered ? 0 : 10 }}
                // filter="url(#my-filter)"
              />

              <Group top={margin.top} left={margin.left}>
                {svgLayer({ xScale, yScale })}
              </Group>
            </>
          )}
        </Svg>
      </AbsoluteContainer>
      <AbsoluteContainer
        id="html-container"
        zIndex={ZIndex.Two}
        ref={htmlFrameRef}
        onPointerMove={handlePointerMove}
      >
        {htmlLayer({})}
      </AbsoluteContainer>
      <AbsoluteContainer
        id="canvas-container"
        zIndex={ZIndex.Three}
        style={{ pointerEvents: "none" }}
      >
        {canvasLayer({})}
      </AbsoluteContainer>
    </RelativeContainer>
  );
};

export { Frame };

// utils components :

type RelativeContainerProps = {
  zIndex: ZIndex;
  children: ReactNode;
} & ComponentProps<"div">;

const RelativeContainer = ({
  children,
  zIndex,
  style,
  ...props
}: RelativeContainerProps) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        zIndex: zIndex,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

type AbsoluteContainerProps = {
  zIndex: ZIndex;
  children: ReactNode;
} & React.ComponentPropsWithRef<"div">;

const AbsoluteContainer = forwardRef<HTMLDivElement, AbsoluteContainerProps>(
  ({ children, zIndex, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
          zIndex: zIndex,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
