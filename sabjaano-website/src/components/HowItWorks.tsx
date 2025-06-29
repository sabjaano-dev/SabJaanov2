// components/HowItWorks.tsx
'use client';

import { FC, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const HowItWorks: FC = () => {
  // This ref will scope the scroll to just this section
  const ref = useRef<HTMLElement>(null);
  // useScroll with a target lets us get a 0→1 value as this section enters/leaves viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // slide from right to left while fading in
  const x = useTransform(scrollYProgress, [0, 1], ['100vw', '0vw']);
  const opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-end justify-start px-6 lg:px-24"
    >
      <motion.h2
        className="text-6xl lg:text-8xl font-extrabold text-black mb-12"
        style={{ x, opacity }}
      >
        How it works?
      </motion.h2>
    </section>
  );
};
