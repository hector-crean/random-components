import { imageAssets } from "@/assets/images";
import styles from "./Sandbox.module.css";

import { AspectRatioContainer, Frame } from "@/lib/components";
import { Section } from "@/lib/components/sections/Sections";
import { SvgChild, renderSvgChild } from "@/lib/components/svg/svg-child";
import { useRef, useState } from "react";
//Svg? Clip>

/**
 * Draft ansers ?
 */

type Renderable =
  | { type: "Text"; props: { text: string } }
  | { type: "Position"; props: { coord: [number, number] } };

const render = ({ type, props }: Renderable) => {
  switch (type) {
    case "Position":
      return <div>{props.coord}</div>;
    case "Text":
      return <div>{props.text}</div>;
  }
};

// Questions which require a user to make bijections (i.e. one to one correspondences) between elements in two sets
interface BijectiveMappingQuestionSet<
  T extends Record<string | number | symbol, Renderable>
> {
  /**
   *
   */
  sets: Array<{
    id: string;
    elements: T;
  }>;
  questionMap: { [key in keyof T]: string };
  answerStack: Array<{
    domain: { setId: string; element: keyof T };
    codomain: { setId: string; element: keyof T };
  }>;
  answeredCorrectly: Array<{
    setId: string;
    element: Exclude<keyof T, "setId">;
  }>;
}

const bijectiveMappingQuestionSet: BijectiveMappingQuestionSet<{
  position: { type: "Position"; props: { coord: [number, number] } };
  name: { type: "Text"; props: { text: string } };
  role: { type: "Text"; props: { text: string } };
  effect_of_aging: { type: "Text"; props: { text: string } };
}> = {
  sets: [
    {
      id: "fibroblast",
      elements: {
        position: { type: "Position", props: { coord: [1, 1] } },
        name: { type: "Text", props: { text: "fibroblast" } },
        role: {
          type: "Text",
          props: {
            text: "Produce ECM components and contribute to their structural organization",
          },
        },
        effect_of_aging: {
          type: "Text",
          props: {
            text: "Activity and mechanical interaction reduce the production of ECM components, altering ECM structure and weakening the skin’s mechanical properties, ultimately resulting in the appearance of wrinkles and skin laxity.",
          },
        },
      },
    },
    {
      id: "collagen I",
      elements: {
        position: { type: "Position", props: { coord: [1, 1] } },
        name: { type: "Text", props: { text: "collagen I" } },
        role: {
          type: "Text",
          props: { text: "Provides tensile strength and stability" },
        },
        effect_of_aging: {
          type: "Text",
          props: {
            text: "Content within the skin reduces with age, and that which remains becomes fragmented and unevenly distributed, ultimately hindering the mechanical interaction between fibroblasts and collagen fibrils, leading to a deterioration in fibroblast function and a reduction in neocollagenesis",
          },
        },
      },
    },
    {
      id: "collagen  III",
      elements: {
        position: { type: "Position", props: { coord: [1, 1] } },
        name: { type: "Text", props: { text: "collagen III" } },
        role: {
          type: "Text",
          props: {
            text: "Ensures collagen I is aligned and mechanically robust, providing long-term structural support and stability",
          },
        },
        effect_of_aging: {
          type: "Text",
          props: {
            text: "Content within the skin reduces with age, and that which remains becomes fragmented and unevenly distributed, ultimately hindering the mechanical interaction between fibroblasts and collagen fibrils, leading to a deterioration in fibroblast function and a reduction in neocollagenesis",
          },
        },
      },
    },
    {
      id: "elastin",
      elements: {
        position: { type: "Position", props: { coord: [1, 1] } },
        name: { type: "Text", props: { text: "elastin" } },
        role: {
          type: "Text",
          props: {
            text: "Provides skin with elasticity, stretch, and resilience.",
          },
        },
        effect_of_aging: {
          type: "Text",
          props: {
            text: "Fibers become coarse and disorientated, while the production of new fibers slows, leading to a loss of skin elasticity and wrinkle formation",
          },
        },
      },
    },
    {
      id: "proteoglycans",
      elements: {
        position: { type: "Position", props: { coord: [1, 1] } },
        name: { type: "Text", props: { text: "proteoglycans" } },
        role: {
          type: "Text",
          props: {
            text: "Provides hydration and water retention, while also playing a role in the regulation of collagen formation and organization",
          },
        },
        effect_of_aging: {
          type: "Text",
          props: {
            text: "Decrease in size with age, contributing to skin fragility",
          },
        },
      },
    },
    {
      id: "blood vessels",
      elements: {
        position: { type: "Position", props: { coord: [1, 1] } },
        name: { type: "Text", props: { text: "blood vessels" } },
        role: { type: "Text", props: { text: "" } },
        effect_of_aging: {
          type: "Text",
          props: {
            text: "Angiogenesis is impaired, resulting in a diminished supply to the dermis, which is thought to contribute to the decrease in the number of fibroblasts",
          },
        },
      },
    },
    {
      id: "macrophages",
      elements: {
        position: { type: "Position", props: { coord: [1, 1] } },
        name: { type: "Text", props: { text: "fibroblast" } },
        role: {
          type: "Text",
          props: {
            text: "Facilitate tissue regeneration and wound repair by releasing pro-inflammatory factors that allow the infiltration of immune cells",
          },
        },
        effect_of_aging: { type: "Text", props: { text: "fibroblast" } },
      },
    },
  ],
  questionMap: {
    position: "What is the position of",
    name: "What is the name of",
    role: "What is the role of",
    effect_of_aging: "What is the effect of aging on",
  },
  answerStack: [
    {
      domain: { setId: "1", element: "effect_of_aging" },
      codomain: { setId: "2", element: "name" },
    },
  ],
  answeredCorrectly: [{ setId: "1", element: "name" }],
};

interface BijectiveMappingQuestionSetProps<
  T extends Record<string | number | symbol, Renderable>
> {
  questionKey: keyof T;
  setId: string;
  questionSet: BijectiveMappingQuestionSet<T>;
}

function BijectiveMappingQuestionSet<
  T extends Record<string | number | symbol, Renderable>
>({ setId, questionKey, questionSet }: BijectiveMappingQuestionSetProps<T>) {
  const set = questionSet.sets.find((set) => set.id === setId);

  if (!set) return null;

  return (
    <div>
      <header>{questionSet.questionMap[questionKey]}</header>
      <header>{set.id}</header>

      <main>
        <>
          {questionSet.sets.map(({ id, elements }) => (
            <div
              key={id}
              style={{ backgroundColor: id === set.id ? "green" : "red" }}
            >
              {render(elements[questionKey])}
            </div>
          ))}
        </>
      </main>
    </div>
  );
}

interface InteractableCanvasProps {}

const InteractableCanvas = () => {
  const ASPECT_RATIO = imageAssets.MEZ105_Skin_CS_0016_0000.aspectRatio;

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

import { ScrollCorridor } from "@/lib/components/scroll-corridor/ScrollCorridor";
import { v4 as uuid } from "uuid";

function Sections() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <ScrollCorridor>
      {({ scrollYProgress }) => (
        <div ref={ref}>
          <Section ref={ref} id={uuid()}>
            Animate
          </Section>
          <Section ref={ref} id={uuid()}>
            when
          </Section>
          <Section ref={ref} id={uuid()}>
            in
          </Section>
          <Section ref={ref} id={uuid()}>
            view!
          </Section>
          <Section ref={ref} id={uuid()}>
            Animate
          </Section>
          <Section ref={ref} id={uuid()}>
            when
          </Section>
          <Section ref={ref} id={uuid()}>
            in
          </Section>
          <Section ref={ref} id={uuid()}>
            view!
          </Section>
          <Section ref={ref} id={uuid()}>
            Animate
          </Section>
          <Section ref={ref} id={uuid()}>
            when
          </Section>
          <Section ref={ref} id={uuid()}>
            in
          </Section>
          <Section ref={ref} id={uuid()}>
            view!
          </Section>
        </div>
      )}
    </ScrollCorridor>
  );
}

const SandboxPage = () => {
  return (
    <main className={styles.sandbox_page}>
      <section className={styles.section}>
        {/* <InteractableCanvas /> */}
        <Sections />
      </section>
    </main>
  );
};

export { SandboxPage };
