"use client";
import { cn } from "@/lib/utils";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import React, { useRef } from "react";

// Polymorphic type helper
export type PolymorphicComponentProps<
  T extends React.ElementType,
  Props = object,
> = Props & { as?: T } & Omit<
    React.ComponentPropsWithRef<T>,
    keyof Props | "as"
  >;

function safeClassName(value: unknown): string {
  return typeof value === "string" ? value : "";
}

type ButtonOwnProps = {
  borderRadius?: string;
  children: React.ReactNode;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  as?: React.ElementType;
};

type ButtonProps = ButtonOwnProps &
  Omit<React.ComponentPropsWithRef<React.ElementType>, keyof ButtonOwnProps>;

const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    as: Component = "button",
    borderRadius = "1.75rem",
    children,
    containerClassName,
    borderClassName,
    duration,
    className,
    ...otherProps
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(
        "relative h-16 w-40 overflow-hidden bg-transparent p-[1px] text-xl",
        safeClassName(containerClassName),
      )}
      style={{
        borderRadius: String(borderRadius),
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${String(borderRadius)} * 0.96)` }}
      >
        <MovingBorder
          duration={typeof duration === "number" ? duration : undefined}
          rx="30%"
          ry="30%"
        >
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
              safeClassName(borderClassName),
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl",
          safeClassName(className),
        )}
        style={{
          borderRadius: `calc(${String(borderRadius)} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
});
Button.displayName = "Button";

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: unknown;
}) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => {
    if (pathRef.current) {
      const pt = pathRef.current.getPointAtLength(val);
      return pt.x;
    }
    return 0;
  });
  const y = useTransform(progress, (val) => {
    if (pathRef.current) {
      const pt = pathRef.current.getPointAtLength(val);
      return pt.y;
    }
    return 0;
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
