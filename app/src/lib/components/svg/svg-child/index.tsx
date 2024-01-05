import { ScaleLinear } from "d3";
import {
  renderOutlinePath,
  type OutlinePathsSerdeProps,
} from "./outline-path/OutlinePath";

type OutlinePathADT = {
  type: "outline-path";
  props: OutlinePathsSerdeProps;
};

type SvgChild = OutlinePathADT;

const renderSvgChild = (
  key: string,
  data: SvgChild,
  xScale: ScaleLinear<number, number, never>,
  yScale: ScaleLinear<number, number, never>
) => {
  switch (data.type) {
    case "outline-path":
      return renderOutlinePath({ key, xScale, yScale })(data.props);
    default:
      return <g></g>;
  }
};

export { renderSvgChild };
export type { SvgChild };
