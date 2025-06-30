"use client";

import Image from "next/image";
import { motion, easeOut, easeInOut } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: easeOut,
    },
  },
};

const floatAnim = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 2, -2, 0],
  },
  transition: {
    repeat: Infinity,
    duration: 5,
    ease: easeInOut,
  },
};

export const Heroes = () => {
  return (
    <section className="w-full px-6 py-16 md:py-24 flex justify-center items-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl w-full flex flex-col md:flex-row justify-center items-center gap-12"
      >
        {/* Left Image */}
        <motion.div
          variants={imageVariants}
          className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px]"
        >
          <motion.div
            {...floatAnim}
            className="w-full h-full rounded-xl group relative"
          >
            <Image
              src="/documents.png"
              alt="Documents"
              fill
              className="object-contain rounded-xl dark:hidden"
              priority
            />
            <Image
              src="/documents-dark.png"
              alt="Documents Dark"
              fill
              className="object-contain rounded-xl hidden dark:block"
              priority
            />

            {/* Neon Glow on hover in dark mode */}
            <div className="absolute inset-0 rounded-xl hidden dark:block group-hover:shadow-[0_0_20px_#00bfff70] transition-all duration-300" />
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          variants={imageVariants}
          className="relative hidden md:block w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px]"
        >
          <motion.div
            {...floatAnim}
            className="w-full h-full rounded-xl group relative"
          >
            <Image
              src="/reading.png"
              alt="Reading"
              fill
              className="object-contain rounded-xl dark:hidden"
              priority
            />
            <Image
              src="/reading-dark.png"
              alt="Reading Dark"
              fill
              className="object-contain rounded-xl hidden dark:block"
              priority
            />

            {/* Neon Glow on hover in dark mode */}
            <div className="absolute inset-0 rounded-xl hidden dark:block group-hover:shadow-[0_0_20px_#00bfff70] transition-all duration-300" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
