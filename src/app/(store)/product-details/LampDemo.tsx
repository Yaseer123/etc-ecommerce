"use client";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";

export function LampDemo() {
  return (
    <LampContainer>
      {/* <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build lamps <br /> the right way
      </motion.h1> */}
      <div className="mt-8 flex justify-center">
        <motion.img
          src="/images/test/test-product.png"
          alt="Test Product"
          className="h-auto w-64 drop-shadow-[0_10px_40px_rgba(0,255,255,0.5)]"
          style={{
            filter:
              "brightness(1.15) drop-shadow(0 0 40px rgba(34,211,238,0.5))",
          }}
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </LampContainer>
  );
}
