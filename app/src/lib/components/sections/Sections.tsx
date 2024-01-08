import { useResizeObserver } from "@/lib/hooks/use-resize-observer";
import { MotionValue, useInView } from "framer-motion";
import {
  ReactNode,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { create } from "zustand";
import { ScrollDirection } from "../scroll-corridor/ScrollCorridor";
import styles from "./Sections.module.css";
import { sectionActivityOrdForScrollDown, sort, type SectionActivityParams } from './util';
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


//TODO use an intervsal tree to find 




type Section = {
  idx: number;
  isInView: boolean,
  offset: Offset;
};

type SectionsStore = {
  sections: Array<Section>;
  updateSection: (idx: number, sectionParams: Partial<Omit<Section, 'idx'>>) => boolean,
  addSection: (section: Section) => void;
  removeSection: (idx: number) => void;
  activeSectionRank: (scrollContainerHeight: number, scrollY: number, scrollDirection: ScrollDirection) => Array<SectionActivityParams>;

};

const useSectionsStore = create<SectionsStore>((set, get) => ({
  sections: [],
  updateSection: (idx, sectionParams) => {
    const updatedSections = get().sections.map(section =>
      section.idx === idx
        ? { ...section, ...sectionParams }
        : section
    );
    set({ sections: updatedSections });
    return true;
  },

  addSection: (section) => {
    set(state => ({ sections: [...state.sections, section] }));
  },

  removeSection: (id) => {
    set(state => ({
      sections: state.sections.filter(section => section.idx !== id),
    }));
  },

  activeSectionRank: (scrollContainerHeight, scrollY, scrollDirection) => {
    // Implement your logic to rank sections based on their visibility or other criteria

    const project = (section: Section): SectionActivityParams => {

      const isFirstSection = section.idx === 1;

      const h = Math.abs(section.offset.top - section.offset.bottom)

      const compenstatedScrollY = isFirstSection ? (scrollY - h) : scrollY

      return ({ idx: section.idx, isInView: section.isInView, deltaTop: Math.abs(section.offset.top - compenstatedScrollY), deltaBotton: Math.abs(section.offset.bottom - compenstatedScrollY) })
    }

    const arr = get().sections.map(project);

    const sorting = () => {
      switch (scrollDirection) {
        case 'down':
          return sort(sectionActivityOrdForScrollDown, arr)
        case 'up':
          return sort(sectionActivityOrdForScrollDown, arr)

      }
    }

    return sorting()


  },
}));

interface SectionProps {
  idx: number;
  scrollY: MotionValue<number>
  scrollDirection: ScrollDirection
  scrollContainerHeight: number
  activeIdx: number;
  children: ReactNode;
}

type Ref = HTMLDivElement;

type Offset = { top: number; bottom: number };

const Section = forwardRef<Ref, SectionProps>(({ idx, activeIdx, children }, parentRef) => {

  const store = useSectionsStore();

  const sectionRef = useRef<HTMLDivElement>(null);
  const ro = useResizeObserver(sectionRef)
  const isInView = useInView(sectionRef, { once: false, amount: "some" });


  const [offset, setOffset] = useState<Offset>({ top: 0, bottom: 0 })

  const findOffset = () => {

    const scrollContainerRef = parentRef as React.RefObject<HTMLDivElement>;

    if (sectionRef.current && sectionRef.current !== null && scrollContainerRef.current && scrollContainerRef.current !== null) {

      const sectionRect = rect(sectionRef.current);
      const scrollContainerRect = rect(scrollContainerRef.current);


      return {
        top: sectionRect.top - scrollContainerRect.top,
        bottom: sectionRect.bottom - scrollContainerRect.top
      }

    } else {
      return {
        top: 0,
        bottom: 0
      }

    }
  }


  const updateOffset = () => {
    const offset = findOffset()
    store.updateSection(idx, { isInView, offset })
    setOffset(offset)
  }

  //register section
  useEffect(() => {
    store.addSection({ idx, offset: findOffset(), isInView })
  }, [])

  //TODO: can we reduce the rerenders of this? 

  useLayoutEffect(() => {
    updateOffset()
  }, [ro?.height, ro?.width])


  useLayoutEffect(() => {
    store.updateSection(idx, { isInView });
  }, [isInView]);



  // useLayoutEffect(() => {
  //   store.updateSection(idx, { offset: findOffset() })
  // }, []);





  return (
    <section ref={sectionRef} className={styles.section} style={{
      backgroundColor: activeIdx === idx ? "green" : "red",
    }}>
      <p>{offset.top}</p>
      <p>{offset.bottom}</p>



      {children}
    </section>
  );
});

export { Section };

export { useSectionsStore };




const rect = (node: HTMLDivElement) => {
  const rect = node.getBoundingClientRect();

  return {
    top: rect.top + window.scrollY,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX
  };
}