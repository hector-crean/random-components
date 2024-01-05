import { useInView } from "framer-motion";
import {
  ReactNode,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { create } from "zustand";
import styles from "./Sections.module.css";

/* 
**Most** active section? 

1. Threshold-based Approach:
Define thresholds for each section based on their position in the viewport.
Track the scroll position and compare it against these thresholds.
Determine the most active section based on the current scroll position.
2. Directional Analysis:
Track the scroll direction (up or down).
Based on the direction, prioritize sections that are closer in that direction.
This approach considers the direction of the scroll movement to determine the most active section.
3. Time-based Decay:
Implement a time-based decay for the active sections.
The closer a section is in time to the current scroll position, the more influence it has.
This approach considers both the position and recency of sections in determining the most active one.

*/

type ActiveSection = {
  id: string;
  offsetTop: number;
  offsetBottom: number;
};
type SectionsStore = {
  activeSections: Array<string>;
  sectionIsActive: (id: string) => boolean;
  addActiveSection: (id: string) => void;
  removeActiveSection: (id: string) => void;
};

const useSectionsStore = create<SectionsStore>()((set, get) => ({
  activeSections: [],
  sectionIsActive: (id: string) =>
    get().activeSections.includes(id) && get().activeSections[0] === id,
  removeActiveSection: (id: string) =>
    set(({ activeSections }) => ({
      activeSections: activeSections.filter((s) => s !== id),
    })),
  addActiveSection: (id: string) =>
    set(({ activeSections }) => ({ activeSections: [...activeSections, id] })),
}));

const Sections = () => {
  return <div></div>;
};

interface SectionProps {
  id: string;
  children: ReactNode;
}

type Ref = HTMLDivElement;

type Offset = { top: number; bottom: number };

const Section = forwardRef<Ref, SectionProps>(({ id, children }, ref) => {
  const [offset, setOffset] = useState<Offset>({ top: 0, bottom: 0 });

  const store = useSectionsStore();

  const sectionRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: false, amount: "all" });

  useLayoutEffect(() => {
    const sectionRect = sectionRef.current?.getBoundingClientRect();
    const parentRect = (
      ref as React.RefObject<HTMLDivElement>
    ).current?.getBoundingClientRect();

    setOffset({
      top: (sectionRect?.top ?? 0) - (parentRect?.top ?? 0),
      bottom: (sectionRect?.bottom ?? 0) - (parentRect?.bottom ?? 0),
    });
  }, []);

  useEffect(() => {
    switch (isInView) {
      case true:
        store.addActiveSection(id);
        break;
      case false:
        store.removeActiveSection(id);
        break;
    }
  }, [isInView, id]);

  return (
    <section id={id} ref={sectionRef} className={styles.section}>
      <span>
        Top: {offset.top} Bottom: {offset.bottom}
      </span>
      <span
        style={{
          color: store.sectionIsActive(id) ? "white" : "black",
          transform: isInView ? "none" : "translateX(-200px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }}
      >
        {children}
      </span>
    </section>
  );
});

export { Section };
