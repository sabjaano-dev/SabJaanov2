"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GenerateSection() {
  return (
    <section className="relative overflow-hidden">
      {/* animated slanted gradient bg (mirrored for variety) */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          // lowered & mirrored so heading never overlaps the white cut
          clipPath: "polygon(0% 10%, 100% 22%, 100% 95%, 0% 85%)",
          backgroundImage:
            "linear-gradient(-45deg,#00bcd4,rgb(236,128,255),#00c853,#ffd600,#1e90ff,#ff4081)",
          backgroundSize: "600% 600%",
        }}
        animate={{
          backgroundPosition: ["0% 50%","50% 50%","100% 50%","50% 50%","0% 50%"],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-24 pt-24 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* keep the preview light so it doesn’t dominate */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl order-2 lg:order-1">
            <div className="space-y-3">
              <div className="h-10 bg-gray-100 rounded-md" />
              <div className="h-10 bg-gray-100 rounded-md" />
              <div className="h-10 bg-gray-100 rounded-md" />
            </div>
          </div>

          <div className="order-1 lg:order-2 text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
            <h2 className="text-4xl lg:text-5xl font-extrabold">
              Generate Your Ad
            </h2>
            <p className="mt-4 text-lg opacity-95">
              Enter your business details and preview your ad in seconds with our AI creator.
            </p>
            <Link
              href="/generate-ad"
              className="mt-8 inline-block bg-white text-purple-700 font-semibold px-7 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Create Ad
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
