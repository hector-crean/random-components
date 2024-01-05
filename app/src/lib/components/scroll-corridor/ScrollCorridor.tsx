import { MotionValue, useMotionValue } from "framer-motion";

import { ReactNode, useRef } from "react";
import styles from "./ScrollCorridor.module.css";

/**
 */

interface ScrollCorridorProps {
  children: (args: { scrollYProgress: MotionValue<number> }) => ReactNode;
}

function ScrollCorridor({ children }: ScrollCorridorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollYProgress = useMotionValue(0);

  return (
    <div
      id="scroller-container"
      className={styles.scroll_container}
      ref={containerRef}
    >
      {children({ scrollYProgress })}
    </div>
  );
}

export { ScrollCorridor };
