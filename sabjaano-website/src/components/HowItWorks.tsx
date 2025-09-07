
'use client';

import React, { FC, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const HowItWorks: FC = () => {
  const ref = useRef<HTMLElement>(null);

  // state to control the image size (in px)
  const [imgWidth, setImgWidth] = useState(800);

  // Parallax on heading only
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const headingX = useTransform(scrollYProgress, [0, 0.2], ['100vw', '0vw']);
  const headingOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);

  // Step labels
  const steps = [
    '1️⃣ CHOOSE YOUR PLAN',
    '2️⃣ GENERATE AI AD IN 60 SEC',
    '3️⃣ YOUR AD RUNS ON SCREENS IN 30 MINS',
    '4️⃣ GET ACCESS TO ANALYTICS 🚀',
  ];

  // Static positions for the boxes
  const boxPositions = [
    { left: '3%',  top: '45%' },
    { left: '3%',  top: '55%' },
    { left: '3%',  top: '65%' },
    { left: '3%',  top: '75%' },
  ];

  return (
    <section
      ref={ref}
      className="relative h-screen px-6 lg:px-24"
    >
      {/* Parallax Heading */}
      <motion.h2
        style={{ x: headingX, opacity: headingOpacity }}
        className="absolute top-8 left-8 text-6xl lg:text-8xl font-extrabold text-black"
      >
        How it works?
      </motion.h2>

      {/* Four gradient boxes */}
      {steps.map((label, i) => (
        <div
          key={i}
          style={boxPositions[i]}
          className="
            absolute w-70 h-35
            bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50
            rounded-xl shadow-lg
            flex items-center justify-center p-6
            transition-transform transition-shadow duration-300 ease-out
            hover:scale-105 hover:shadow-2xl
            hover:from-indigo-100 hover:via-pink-100 hover:to-yellow-100
          "
        >
          <span className="text-2xl lg:text-3xl font-extrabold text-center">
            {label}
          </span>
        </div>
      ))}

      {/* Static illustration on the right; adjust imgWidth as needed */}
      <img
        src="how/HowItWorksFlowchart.png"
        alt="Illustration"
        className="absolute right-16 md:right-3 top-1/2 transform -translate-y-1/2 object-contain"
        style={{ width: imgWidth }}
      />
    </section>
  );
};
