import { ScaleLinear } from "d3";
import {
    ComponentProps,
    Dispatch,
    ReactNode,
    SetStateAction
} from "react";

type SvgLayerArgs = {
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
};
type CanvasLayerArgs = {};
type HtmlLayerArgs = {};

interface FrameProps extends ComponentProps<"div"> {
    width: number;
    height: number;
    aspectRatio: [number, number];
    setCursorPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
    svgLayer: (args: {
        xScale: ScaleLinear<number, number, never>;
        yScale: ScaleLinear<number, number, never>;
    }) => ReactNode;
    htmlLayer: (args: HtmlLayerArgs) => ReactNode;
    canvasLayer: (args: CanvasLayerArgs) => ReactNode;
}


enum ZIndex {
    Zero = 0, // 00000000
    One = 1 << 0, // 00000001
    Two = 1 << 1, // 00000010
    Three = 1 << 2, // 00000100
    Four = 1 << 3, // 00001000
    Five = 1 << 4, // 00010000
    Six = 1 << 5, // 00100000
    Seven = 1 << 6, // 01000000
    Eight = 1 << 7, // 10000000
}

export type { SvgLayerArgs, CanvasLayerArgs, HtmlLayerArgs, FrameProps };
export { ZIndex };

