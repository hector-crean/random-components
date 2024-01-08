import { ImageAsset, imageAssets } from "@/assets/images";
import { AspectRatioContainer, Frame } from "@/lib/components";
import { SvgChild, renderSvgChild } from "@/lib/components/svg/svg-child";
import { useState } from "react";



interface ComparisonSliderProps {
    asset: ImageAsset
}

const ComparisonSlider = (props: ComparisonSliderProps) => {

    const [cursorPosition, setCursorPosition] = useState({
        x: 0,
        y: 0,
    });

    const svgChildren: Array<SvgChild> = [
        // { type: "outline-path", props: { points: [] } },
    ];

    return (
        <AspectRatioContainer aspectRatio={ASPECT_RATIO}>
            {({ width, height }) => (
                <Frame
                    width={width}
                    height={height}
                    aspectRatio={ASPECT_RATIO}
                    setCursorPosition={setCursorPosition}
                    svgLayer={({ xScale, yScale }) => (
                        <g>
                            {svgChildren.map((child, index) =>
                                renderSvgChild(
                                    `svg-child-${index}-${child.type}`,
                                    child,
                                    xScale,
                                    yScale
                                )
                            )}
                        </g>
                    )}
                    canvasLayer={() => null}
                    htmlLayer={() => (
                        <img
                            src={imageAssets.MEZ105_Skin_CS_0016_0000.url}
                            style={{ width: "100%" }}
                        />
                    )}
                />
            )}
        </AspectRatioContainer>
    );
};


export { ComparisonSlider };
