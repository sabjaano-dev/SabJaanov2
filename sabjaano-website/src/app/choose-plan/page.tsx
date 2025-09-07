// src/app/choose-plan/page.tsx
"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "₹4,999",
    features: ["5 Screens", "Basic Analytics", "Standard Support"],
    glowClass: "basic",
  },
  {
    name: "Plus",
    price: "₹9,999",
    features: ["15 Screens", "Advanced Analytics", "Priority Support"],
    glowClass: "plus",
  },
  {
    name: "Prime",
    price: "₹19,999",
    features: ["Unlimited Screens", "Full Dashboard Access", "24/7 Support"],
    glowClass: "prime",
  },
];

export default function ChoosePlanPage() {
  return (
    <>
      <style jsx global>{`
        /* --- AMBIENT AURORA BACKGROUND EFFECT --- */
        @keyframes fluidAnimation {
          0% { background-position: 0% 50%, 50% 50%, 100% 50%; }
          50% { background-position: 100% 50%, 0% 50%, 50% 100%; }
          100% { background-position: 0% 50%, 50% 50%, 100% 50%; }
        }
        .rays-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }
        .rays-bg::after {
          content: "";
          position: absolute;
          inset: -200px;
          
          background-image:
            radial-gradient(at 10% 20%, hsla(212,100%,50%,0.3) 0px, transparent 40%),
            radial-gradient(at 80% 30%, hsla(289,100%,50%,0.3) 0px, transparent 40%),
            radial-gradient(at 20% 90%, hsla(169,100%,50%,0.3) 0px, transparent 40%),
            radial-gradient(at 90% 80%, hsla(320,100%,50%,0.3) 0px, transparent 40%);
          
          background-size: 150% 150%;
          
          animation: fluidAnimation 30s ease-in-out infinite;
          
          filter: blur(60px);
        }
        /* --- END BACKGROUND --- */

        .plan-container {
          width: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .plan-container .card {
          position: relative;
          width: 320px;
        }
        .plan-container .card .face.face1 {
          width: 100%;
          background: #333;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 240px;
          border-radius: 1.5rem;
          transition: 0.4s;
        }
        .plan-container .card:hover .face.face1 {
          background: #1f2937;
        }
        .plan-container .card.basic:hover .face.face1 {
          box-shadow: inset 0 0 50px rgba(255, 255, 255, 0.2), inset 20px 0 70px #8b5cf6, inset -20px 0 70px #6366f1, 0 0 40px #fff, -10px 0 70px #8b5cf6, 10px 0 70px #6366f1;
        }
        .plan-container .card.plus:hover .face.face1 {
          box-shadow: inset 0 0 50px rgba(255, 255, 255, 0.2), inset 20px 0 70px #ec4899, inset -20px 0 70px #a855f7, 0 0 40px #fff, -10px 0 70px #ec4899, 10px 0 70px #a855f7;
        }
        .plan-container .card.prime:hover .face.face1 {
          box-shadow: inset 0 0 50px rgba(255, 255, 255, 0.2), inset 20px 0 70px #3b82f6, inset -20px 0 70px #8b5cf6, 0 0 40px #fff, -10px 0 70px #3b82f6, 10px 0 70px #8b5cf6;
        }
        .plan-container .card .face.face1 .content {
          color: white; text-align: center;
        }
        .plan-container .card .face.face2 {
          position: absolute;
          width: 100%;
          top: 105%; 
          left: 50%;
          background: #fff;
          padding: 1.5rem;
          box-sizing: border-box;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          border-radius: 1.5rem;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-20px); 
          transition: opacity 0.4s ease, transform 0.4s ease, visibility 0s 0.4s;
        }
        .plan-container .card:hover .face.face2 {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
          transition: opacity 0.4s ease, transform 0.4s ease, visibility 0s 0s;
        }
      `}</style>

      <div className="relative min-h-screen bg-gray-900 overflow-hidden">
        {/* Background Effect Layer */}
        <div className="rays-bg" />

        {/* Foreground Content Layer */}
        <div className="relative z-10 min-h-screen py-20 px-6 flex flex-col justify-start items-center">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Choose Your Plan
            </h1>
            <p className="mt-4 text-gray-400 text-lg">
              Start your journey with SabJaano and reach more customers today.
            </p>
          </div>

          <div className="plan-container">
            {plans.map((plan, idx) => (
              <div key={idx} className={`card ${plan.glowClass}`}>
                <div className="face face2">
                  <div className="content text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {plan.name} Features
                    </h3>
                    <ul className="space-y-2 text-left">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-600">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/generate-ad"
                      className="mt-6 inline-block rounded-lg font-semibold py-3 px-6 bg-gray-800 text-white hover:bg-gray-700 transition-colors w-full"
                    >
                      Select Plan
                    </Link>
                  </div>
                </div>

                <div className="face face1">
                  <div className="content">
                    <h2 className="text-4xl font-bold">{plan.name}</h2>
                    <p className="text-2xl mt-2">
                      {plan.price}
                      <span className="text-lg font-normal">/mo</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* --- NEW BUTTON ADDED --- */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <button className="bg-transparent border border-gray-600 text-gray-300 font-semibold rounded-lg px-8 py-3 hover:bg-gray-800 hover:text-white transition-colors">
              Reach out to Sales
            </button>
          </div>
        </div>
      </div>
    </>
  );
}