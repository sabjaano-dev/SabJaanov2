'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

type Props = {
  heading: string
  sub: string
  rotatingWords?: string[]
}

export default function Slide({ heading, sub, rotatingWords }: Props) {
  const [index, setIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl text-center w-full"
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-4">{heading}</h1>

      {heading === "Maximum Attention. Minimal Waste." ? (
        <p className="text-xl md:text-4xl font-medium text-sabBlack/80">
          50%{" "}
          <span className="inline-flex items-center relative h-[1.1em] min-w-[105px] align-middle">
            <AnimatePresence mode="wait">
              {index % 2 === 0 ? (
                <motion.span
                  key="arrow"
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-0 w-full text-sabPurple font-bold leading-none"
                >
                  ↓
                </motion.span>
              ) : (
                <motion.span
                  key="lower"
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-0 w-full text-sabPurple font-bold leading-none"
                >
                  lower
                </motion.span>
              )}
            </AnimatePresence>
          </span>{" "}
          marketing cost
        </p>
      ) : heading === "" && sub === "20x more qualified real estate leads." ? (
        <p className="text-xl md:text-4xl font-medium text-sabBlack/80">
          20x{" "}
          <span className="inline-flex items-center relative h-[1.1em] min-w-[100px] align-middle">
            <AnimatePresence mode="wait">
              {index % 2 === 0 ? (
                <motion.span
                  key="arrow-up"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-0 w-full text-sabPurple font-bold leading-none"
                >
                  ↑
                </motion.span>
              ) : (
                <motion.span
                  key="more"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-0 w-full text-sabPurple font-bold leading-none"
                >
                  more
                </motion.span>
              )}
            </AnimatePresence>
          </span>{" "}
          conversions.
        </p>
      ) : heading === "" && sub === "How will my Ad look like?" ? (
        <div className="flex flex-col items-center justify-center gap-8 h-full">
          <AnimatePresence mode="wait">
            {!showGallery ? (
              <motion.button
                key="trigger"
                onClick={() => setShowGallery(true)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-semibold text-sabPurple underline hover:opacity-80 transition-all"
              >
                How will my Ad look like?
              </motion.button>
            ) : (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative w-full max-w-4xl flex overflow-x-auto snap-x gap-6 px-6"
              >
                {/* ❌ Exit button */}
                <button
                  onClick={() => setShowGallery(false)}
                  className="absolute top-2 right-2 text-xl text-sabPurple font-bold bg-white/80 px-3 py-1 rounded hover:bg-white transition"
                >
                  ×
                </button>

                {/* Gallery images */}
                {["/ad1.png", "/ad2.png", "/ad3.png","/ad4.png","/ad5.png","/ad6.png","/ad7.png","/ad8.png"].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`ad-preview-${i}`}
                    className="rounded-xl object-cover w-full max-w-[90%] h-[400px] snap-center"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-xl md:text-4xl font-medium text-sabBlack/80">
          {sub}
          {rotatingWords && (
            <span
              className="inline-flex items-center relative h-[1.1em] align-middle min-w-[125px]"
              style={{ padding: '0 2px' }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingWords[index % rotatingWords.length]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-0 w-full text-sabPurple font-bold leading-none"
                >
                  {rotatingWords[index % rotatingWords.length]}
                </motion.span>
              </AnimatePresence>
            </span>
          )}
        </p>
      )}
    </motion.div>
  )
}
