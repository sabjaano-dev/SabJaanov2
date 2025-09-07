// src/components/ui/PlansSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { Monitor, BarChart2, LifeBuoy, Calendar } from "lucide-react";

const scannerAnimation = {
  animate: {
    x1: ["-200%", "200%"],
    x2: ["-100%", "300%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const pathData = [
  "M 0 0 Q 50 -75 145 -165",
  "M 0 0 Q 50 -25 145 -55",
  "M 0 0 Q 50 25 145 55",
  "M 0 0 Q 50 75 145 165",
];

// Text for the new typewriter effect
const fullLine1 = "Compare Basic, Plus and Prime";
const fullLine2 = "— pick screens, analytics and support that match your goals.";

export default function PlansSection() {
  const router = useRouter();
  const containerRef = React.useRef<HTMLElement>(null);
  
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");

  useEffect(() => {
    const speed = 50; 
    let i = 0;
    let timeoutId: NodeJS.Timeout;

    const typeLine1 = () => {
      if (i < fullLine1.length) {
        setLine1(fullLine1.substring(0, i + 1));
        i++;
        timeoutId = setTimeout(typeLine1, speed);
      } else {
        i = 0; 
        timeoutId = setTimeout(typeLine2, 300);
      }
    };
    
    const typeLine2 = () => {
      if (i < fullLine2.length) {
        setLine2(fullLine2.substring(0, i + 1));
        i++;
        timeoutId = setTimeout(typeLine2, speed);
      }
    };

    timeoutId = setTimeout(typeLine1, 1000);

    return () => clearTimeout(timeoutId);
  }, []);


  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const headingX = useTransform(scrollYProgress, [0, 0.2], ["100vw", "0vw"]);
  const headingOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden">
      <style jsx global>{`
        /* --- Line Styles --- */
        .line-track { stroke: aqua; stroke-opacity: 0.2; stroke-width: 8px; fill: none; }
        .line-scanner { stroke-width: 5px; fill: none; filter: drop-shadow(0 0 8px #fff) drop-shadow(0 0 12px aqua); }
        
        /* --- AURORA BUTTON STYLES --- */
        @keyframes btn-glow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .aurora-button { position: relative; display: inline-block; padding: 2px; border-radius: 1.5rem; background: none; border: none; overflow: hidden; cursor: pointer; font-weight: 600; color: #3b7cffff; }
        .aurora-button__background { content: ''; position: absolute; inset: 0; z-index: 0; background: linear-gradient(90deg, #a855f7, #2dd4bf, #f472b6, #a855f7); background-size: 300% 100%; opacity: 0; transition: opacity 0.3s ease; }
        .aurora-button:hover .aurora-button__background { opacity: 1; animation: btn-glow 3s linear infinite; }
        .aurora-button__label { position: relative; display: block; z-index: 1; background-color: #ffffffff; padding: 1.25rem 3rem; border-radius: calc(1.5rem - 2px); overflow: hidden; }
        .aurora-button__label span, .aurora-button__label::before { display: inline-block; transition: transform 0.3s cubic-bezier(0.7, 0, 0.2, 1); }
        .aurora-button__label::before { content: attr(data-hover); position: absolute; top: 50%; left: 50%; transform: translate(-50%, 200%); }
        .aurora-button:hover .aurora-button__label span { transform: translateY(-200%); }
        .aurora-button:hover .aurora-button__label::before { transform: translate(-50%, -50%); }

        /* --- TYPEWRITER STYLES --- */
        .typewriter-text {
          font-family: 'Anonymous Pro', monospace;
          font-size: 1.5rem; /* 24px */
          line-height: 1.5;
          letter-spacing: .05rem;
          min-height: 1.5em; 
          word-wrap: break-word;
          color: #1f2937; /* A darker text for better contrast */
        }
        .blinking-cursor {
          position: relative;
        }
        .blinking-cursor::after {
          content: '';
          position: absolute;
          right: -5px;
          top: 0.1em;
          bottom: 0.1em;
          width: 3px;
          background: #374151;
          animation: blinkTextCursor 700ms infinite;
        }
        @keyframes blinkTextCursor {
          from { background: #374151; }
          to { background: transparent; }
        }
      `}</style>

      {/* background gradient */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          clipPath: "polygon(0% 20%, 100% 0%, 100% 80%, 0% 100%)",
          backgroundImage:
            "linear-gradient(-45deg,#00bcd4,rgb(236,128,255),#00c850,#ffd600,#1e90ff,#ff4081)",
          backgroundSize: "600% 600%",
        }}
        animate={{
          backgroundPosition: [
            "0% 50%", "50% 50%", "100% 50%", "50% 50%", "0% 50%",
          ],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* heading */}
      <motion.h2
        style={{ x: headingX, opacity: headingOpacity }}
        className="absolute top-8 left-8 text-6xl lg:text-8xl font-extrabold text-black"
      >
        Choose Your Plan
      </motion.h2>

      {/* main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-24 pt-48 pb-32">
        <div className="grid lg:grid-cols-[1.5fr_1fr_1.5fr] gap-8 items-center">
          
          {/* left column: description */}
          {/* MODIFICATION: Added -translate-x-24 to shift text left */}
          <div className="flex flex-col items-start -translate-x-24">
            <p className={`typewriter-text ${line2.length === 0 ? 'blinking-cursor' : ''}`}>{line1}</p>
            {line1.length === fullLine1.length && (
              <p className={`typewriter-text ${line2.length > 0 ? 'blinking-cursor' : ''}`}>{line2}</p>
            )}
          </div>

          {/* middle column: button and connecting lines */}
          <div className="relative flex justify-center items-center h-full">
            {/* SVG container */}
            <svg
              viewBox="-20 -210 240 420"
              className="absolute w-full h-full overflow-visible"
              style={{ left: '150px' }}
            >
              <defs>
                <motion.linearGradient
                  id="scanner-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="-200%" x2="-100%" y1="0" y2="0"
                  variants={scannerAnimation}
                  animate="animate"
                >
                  <stop stopColor="#111" stopOpacity="0" />
                  <stop stopColor="aqua" />
                  <stop offset="0.5" stopColor="white" />
                  <stop offset="1" stopColor="aqua" />
                  <stop offset="1" stopColor="#111" stopOpacity="0" />
                </motion.linearGradient>
              </defs>
              {pathData.map((path, index) => (
                <g key={index}>
                  <path d={path} className="line-track" />
                  <path d={path} className="line-scanner" stroke="url(#scanner-gradient)" />
                </g>
              ))}
            </svg>

            <motion.button
              onClick={() => router.push("/choose-plan")}
              className="aurora-button relative z-10"
            >
              <span className="aurora-button__label" data-hover="Go for it">
                <span>View Plans</span>
              </span>
              <span className="aurora-button__background"></span>
            </motion.button>
          </div>

          {/* right column: feature list */}
          <div className="space-y-5">
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-md">
              <Monitor className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium text-gray-800">
                <strong>Screens & locations per plan</strong>
              </span>
            </div>
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-md">
              <BarChart2 className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium text-gray-800">
                <strong>Analytics & reporting</strong>
              </span>
            </div>
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-md">
              <LifeBuoy className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium text-gray-800">
                <strong>Priority support options</strong>
              </span>
            </div>
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-md">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium text-gray-800">
                <strong>Monthly / Annual billing</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}