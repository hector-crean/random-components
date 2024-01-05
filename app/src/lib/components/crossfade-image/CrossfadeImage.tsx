import { ComponentProps } from "react";

import { ImageAsset } from "@/assets/images";
import { motion } from "framer-motion";

import styles from "./CrossFadeImage.module.css";

interface CrossFadeImageProps extends ComponentProps<typeof motion.img> {
  image1: ImageAsset;
  image2: ImageAsset;
  ratio: number;
}

const CrossFadeImage = ({
  image1,
  image2,
  ratio,
  ...props
}: CrossFadeImageProps) => {
  return (
    <motion.img
      data-image-1-url={`"${image1.url}"`}
      data-image-2-url={`"${image2.url}"`}
      className={styles.crossfade}
    />
  );
};

export { CrossFadeImage };
