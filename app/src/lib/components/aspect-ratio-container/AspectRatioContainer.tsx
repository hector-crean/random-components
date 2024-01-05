import { AspectRatio } from "@mantine/core";
import { ReactNode } from "react";
import { ResizeContainer } from "../resize-container/ResizeContainer";

/**
 * This component creates a centred child of the aspect ratio specified. We can then stack
 * a video/image under svgs/html/canvas (all in alignment)
 */

interface AspectRatioContainerProps {
  aspectRatio: [number, number];
  children: (args: { width: number; height: number }) => ReactNode;
}
const AspectRatioContainer = ({
  aspectRatio: [aw, ah],
  children,
}: AspectRatioContainerProps) => {
  return (
    <ResizeContainer
      as="div"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {({ width, height }) => {
        return (
          <AspectRatio
            ratio={aw / ah}
            maw={
              width / height < aw / ah
                ? `${width}px`
                : `${(aw / ah) * height}px`
            }
            mah={
              width / height < aw / ah
                ? `${(ah / aw) * width}px`
                : `${height}px`
            }
            w="100%"
          >
            <ResizeContainer as="div">
              {({ width: innerWidth, height: innerHeight }) =>
                children({ width: innerWidth, height: innerHeight })
              }
            </ResizeContainer>
          </AspectRatio>
        );
      }}
    </ResizeContainer>
  );
};

export { AspectRatioContainer };
