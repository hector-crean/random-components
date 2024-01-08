import { MotionValue, useMotionValueEvent, useScroll } from "framer-motion";

import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { useResizeObserver } from "../../hooks/use-resize-observer";
import { useSectionsStore } from "../sections/Sections";
import styles from "./ScrollCorridor.module.css";


/**
 */

type ScrollDirection = 'up' | 'down'

interface Args {
  scrollYProgress: MotionValue<number>,
  scrollY: MotionValue<number>,
  scrollContainerRef: React.RefObject<HTMLDivElement>,
  scrollDirection: ScrollDirection,
  scrollContainerHeight: number
  activeIdx: number;
}
interface ScrollCorridorProps {
  children: (args: Args) => ReactNode;
}

function ScrollCorridor({ children }: ScrollCorridorProps) {

  const store = useSectionsStore()

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ro = useResizeObserver(scrollContainerRef)

  const { scrollYProgress, scrollY } = useScroll({
    container: scrollContainerRef,
  });


  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('down')

  const [scrollContainerHeight, setScrollContainerHeight] = useState(0)


  useLayoutEffect(() => {
    setScrollContainerHeight(ro?.height ?? 0)
  }, [ro?.height, ro?.width])


  const [activeIdx, setActiveIdx] = useState(0)



  const randkingHandler = (scrollContainerHeight: number, scrollY: number, scrollDirection: ScrollDirection) => {
    const ranking = store.activeSectionRank(scrollContainerHeight, scrollY, scrollDirection);
    if (ranking[0].idx !== activeIdx) {
      setActiveIdx(ranking[0].idx)
    }
  }



  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrollingDown = scrollY.getPrevious() - latest < 0;
    const currSrollDirection: ScrollDirection = isScrollingDown ? "down" : "up";
    if (scrollDirection !== currSrollDirection) {
      setScrollDirection(currSrollDirection)
    }
    randkingHandler(scrollContainerHeight, latest, scrollDirection)
  })






  return (
    <div
      id="scroller-container"
      className={styles.scroll_container}
      ref={scrollContainerRef}
      style={{ paddingBottom: `${((scrollContainerRef.current?.clientHeight ?? 0))}px` }}
    >
      {children({ scrollYProgress, scrollY, scrollContainerRef, scrollDirection, scrollContainerHeight, activeIdx })}
    </div>
  );
}

export { ScrollCorridor };
export type { ScrollDirection };

