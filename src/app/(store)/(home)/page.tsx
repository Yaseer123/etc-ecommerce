"use client";

import Globe from "@/components/globe/Globe";
import FeaturedProducts from "@/components/store-components/FeaturedProducts";
import Slider from "@/components/store-components/Slider";
import { Button } from "@/components/ui/moving-border";
import { motion } from "motion/react";

const page = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-center justify-center gap-4 px-4"
      >
        <div id="header" className="relative w-full">
          <Slider />
        </div>
        <div className="mt-40 text-center text-3xl font-bold dark:text-white md:text-7xl">
          Background lights are cool you know.
        </div>
        <div className="py-4 text-base font-extralight dark:text-neutral-200 md:text-4xl">
          And this, is chemical burn.
        </div>

        <Button
          borderRadius="1.75rem"
          className="border-neutral-200 bg-white text-black dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        >
          Debug now
        </Button>

        <FeaturedProducts />

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="div"
        >
          <h2 className="text-center text-xl font-bold text-black dark:text-white md:text-4xl">
            We sell products worldwide
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-base font-normal text-neutral-700 dark:text-neutral-200 md:text-lg">
            This globe is interactive and customizable. Have fun with it, and
            don&apos;t forget to share it. :)
          </p>
        </motion.div>

        <div className="relative flex min-h-[400px] w-full items-center justify-center py-8 md:min-h-[600px]">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-40 w-full select-none bg-gradient-to-b from-transparent to-white dark:to-black" />
          <div className="absolute z-10 h-full w-full">
            <Globe />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default page;
