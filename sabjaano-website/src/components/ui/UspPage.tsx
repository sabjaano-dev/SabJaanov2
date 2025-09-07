"use client";

import { useRef, useState } from "react";
// MODIFICATION: Removed useScroll and useTransform as they are no longer needed
import { motion, useInView } from "framer-motion";
import { ArrowRight, Target, BrainCircuit, Rocket, Store, Calendar, TrendingUp, X, Lightbulb, Check } from "lucide-react";
import Link from 'next/link';
import Footer from "@/components/ui/Footer";

// Helper component to handle scroll-triggered animations
const ScrollAnimator = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number; }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ duration: 0.8, delay }}
        >
            {children}
        </motion.div>
    );
};


// Helper component for feature cards with hover effect
const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <motion.div 
    className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 h-full"
    whileHover={{ scale: 1.05, y: -8 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-cyan-900/50 p-3 rounded-lg">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-400">{children}</p>
  </motion.div>
);

// Helper component for "How it works" steps
const HowItWorksStep = ({ number, title, description, example, isHovered, setHoveredStep }: { number: string; title:string; description: string; example: string; isHovered: boolean; setHoveredStep: (num: string | null) => void; }) => (
    <div 
        className="relative pl-20 pb-16"
        onMouseEnter={() => setHoveredStep(number)}
        onMouseLeave={() => setHoveredStep(null)}
    >
        <motion.div 
            className="absolute -left-6 top-0 w-12 h-12 bg-gray-900 border-2 border-cyan-400 rounded-full flex items-center justify-center font-bold text-cyan-400 z-10"
            initial={{ scale: 0 }}
            animate={{ 
                scale: isHovered ? 1.15 : 1, 
                boxShadow: isHovered ? "0 0 20px #22d3ee" : "0 0 0px #22d3ee00" 
            }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {number}
        </motion.div>
        <div className="cursor-pointer">
            <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-4">{description}</p>
            <p className="text-cyan-400 bg-gray-800/60 p-3 rounded-lg text-sm italic">{example}</p>
        </div>
    </div>
);

// --- PLAN RECOMMENDER COMPONENT ---
const RadioCard = ({ icon, label, value, selected, setSelected }: { icon: React.ReactNode; label: string; value: string; selected: string; setSelected: (value: string) => void; }) => (
    <label className={`block p-4 border rounded-lg cursor-pointer transition ${selected === value ? 'border-cyan-400 bg-cyan-900/50' : 'border-gray-700 bg-gray-800 hover:bg-gray-700/50'}`}>
        <input type="radio" name="goal" value={value} className="sr-only" onChange={(e) => setSelected(e.target.value)} checked={selected === value} />
        <div className="flex flex-col items-center text-center text-white">
            {icon}
            <span className="mt-2 text-sm font-semibold">{label}</span>
        </div>
    </label>
);

function PlanRecommender() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [businessType, setBusinessType] = useState('');
    const [goal, setGoal] = useState('');
    const [recommendation, setRecommendation] = useState<{name: string, reasons: string[]} | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (goal === 'traffic' && (businessType === 'cafe' || businessType === 'retail')) {
            setRecommendation({ name: 'Prime', reasons: ['Unlimited screens for maximum reach.', 'Full dashboard access to track high foot traffic.', '24/7 support for high-volume businesses.'] });
        } else if (goal === 'event') {
            setRecommendation({ name: 'Plus', reasons: ['Advanced analytics to measure event success.', 'Priority support for time-sensitive promotions.', 'More screens to cover key event locations.'] });
        } else {
            setRecommendation({ name: 'Basic', reasons: ['Cost-effective for building initial brand awareness.', 'Includes essential analytics to get started.', 'Perfect for small local businesses.'] });
        }
    };

    const handleReset = () => {
        setRecommendation(null);
        setBusinessType('');
        setGoal('');
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto mt-10">
            <motion.div layout className="bg-gray-800/50 border border-cyan-400/30 rounded-2xl shadow-lg overflow-hidden">
                {!isExpanded && (
                    <motion.button
                        onClick={() => setIsExpanded(true)}
                        className="w-full text-center p-6 text-xl font-semibold text-white flex items-center justify-center gap-3 hover:text-cyan-400 transition-colors"
                        whileHover={{ scale: 1.03 }}
                        layoutId="recommender-button"
                    >
                        <Lightbulb className="text-cyan-400" />
                        Find out what's best for you
                    </motion.button>
                )}

                {isExpanded && (
                    <motion.div
                        className="p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">Plan Recommender</h3>
                            <button onClick={() => { setIsExpanded(false); handleReset(); }} className="text-gray-400 hover:text-white transition-transform hover:scale-110">
                                <X />
                            </button>
                        </div>

                        {!recommendation ? (
                             <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 mb-2">What's your business type?</label>
                                    <select
                                        value={businessType}
                                        onChange={(e) => setBusinessType(e.target.value)}
                                        required
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        <option value="cafe">Cafe / Restaurant</option>
                                        <option value="retail">Retail Store</option>
                                        <option value="gym">Gym / Fitness Center</option>
                                        <option value="salon">Salon / Spa</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">What's your primary goal?</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                       <RadioCard icon={<TrendingUp size={24} />} label="Increase Foot Traffic" value="traffic" selected={goal} setSelected={setGoal} />
                                       <RadioCard icon={<Calendar size={24} />} label="Promote an Event" value="event" selected={goal} setSelected={setGoal} />
                                       <RadioCard icon={<Store size={24} />} label="Build Brand Awareness" value="brand" selected={goal} setSelected={setGoal} />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-600 transition-transform hover:scale-105">
                                    Get Recommendation
                                </button>
                            </form>
                        ) : (
                            <motion.div 
                                className="text-left bg-gray-900/50 backdrop-blur-sm border border-cyan-500/50 rounded-xl p-6"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h4 className="text-lg text-gray-400">Our Recommendation</h4>
                                <p className="text-5xl font-extrabold text-cyan-400 my-2">{recommendation.name} Plan</p>
                                <ul className="space-y-2 my-6 text-gray-300">
                                    {recommendation.reasons.map((reason, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <Check className="text-green-400 flex-shrink-0" size={20} />
                                            <span>{reason}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex gap-4 justify-start">
                                    <button onClick={handleReset} className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition">
                                        Start Over
                                    </button>
                                     <Link href="/choose-plan">
                                        <motion.button className="bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-600 transition" whileHover={{scale: 1.05}}>
                                            View Plans
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default function USPPage() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  return (
    <div className="bg-gray-900 text-white">
      <style jsx global>{`
        .aurora-bg-usp {
          position: absolute; inset: 0; width: 100%; height: 100%;
          z-index: 0; overflow: hidden;
        }
        .aurora-bg-usp::after {
          content: ""; position: absolute; inset: -200px;
          background-image: var(--stripes), var(--rainbow);
          background-size: 300% 300%, 200% 200%;
          background-position: 50% 50%, 50% 50%;
          animation: smoothBg 40s linear infinite;
          filter: blur(20px); 
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
          --stripes: repeating-linear-gradient(100deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 4%, transparent 8%, transparent 12%, rgba(255, 255, 255, 0.1) 16%);
          --rainbow: repeating-linear-gradient(100deg, hsla(212,100%,50%,0.5) 10%, hsla(289,100%,50%,0.5) 25%, hsla(169,100%,50%,0.5) 40%);
        }
        @keyframes smoothBg {
          from { background-position: 50% 50%, 50% 50%; }
          to { background-position: 350% 50%, 350% 50%; }
        }

        /* --- AURORA BUTTON STYLES --- */
        @keyframes btn-glow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .aurora-button-usp {
          position: relative; display: inline-block; padding: 2px;
          border-radius: 1.5rem; background: none; border: none;
          overflow: hidden; cursor: pointer; font-weight: 600;
          color: #e5e7eb;
        }
        .aurora-button-usp__background {
          content: ''; position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(90deg, #a855f7, #2dd4bf, #f472b6, #a855f7);
          background-size: 300% 100%; opacity: 0; transition: opacity 0.3s ease;
        }
        .aurora-button-usp:hover .aurora-button-usp__background {
          opacity: 1; animation: btn-glow 3s linear infinite;
        }
        .aurora-button-usp__label {
          position: relative; display: block; z-index: 1;
          background-color: #1f2937;
          padding: 1.25rem 3rem;
          border-radius: calc(1.5rem - 2px); overflow: hidden;
        }
        .aurora-button-usp__label span, .aurora-button-usp__label::before {
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: transform 0.3s cubic-bezier(0.7, 0, 0.2, 1);
        }
        .aurora-button-usp__label::before {
          content: attr(data-hover); position: absolute; top: 50%;
          left: 50%; transform: translate(-50%, 200%);
        }
        .aurora-button-usp:hover .aurora-button-usp__label span {
          transform: translateY(-200%);
        }
        .aurora-button-usp:hover .aurora-button-usp__label::before {
          transform: translate(-50%, -50%);
        }
      `}</style>
      
      {/* Hero Section */}
      <div className="relative text-center py-24 lg:py-32 px-6 overflow-hidden">
        <div className="aurora-bg-usp" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Google Ads, for the <span className="text-cyan-400">Real World</span>
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
            Our intelligent platform takes the guesswork out of offline advertising. We connect your business with its ideal customers by placing your ads on the most relevant screens—automatically.
          </p>
          <PlanRecommender />
        </motion.div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6 max-w-4xl mx-auto">
        <ScrollAnimator>
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-16">
            Launch Your Offline Campaign in <span className="text-cyan-400">3 Simple Steps</span>
          </h2>
          {/* MODIFICATION: Removed scroll animation ref */}
          <div className="relative">
              {/* MODIFICATION: Added a static, visible div for the timeline */}
              <div 
                className="absolute top-0 bottom-12 left-0 w-1 bg-cyan-400/30" 
                style={{ transform: 'translateX(0px)' }} 
              />

              <HowItWorksStep 
                  number="01"
                  title="Describe Your Business"
                  description="Provide a few key details: your business category, what you offer, your target location, and the audience you want to reach."
                  example="e.g., A physiotherapy clinic in South Delhi targeting fitness enthusiasts."
                  isHovered={hoveredStep === "01"}
                  setHoveredStep={setHoveredStep}
              />
              <HowItWorksStep 
                  number="02"
                  title="AI-Powered Screen Matching"
                  description="Our system analyzes your details and automatically suggests the most effective offline screens to display your ad. We find sister-businesses where your customers already are."
                  example="e.g., We'll suggest screens in nearby gyms and sports stores for your clinic."
                  isHovered={hoveredStep === "02"}
                  setHoveredStep={setHoveredStep}
              />
               <div 
                  className="relative pl-20"
                  onMouseEnter={() => setHoveredStep("03")}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <motion.div 
                      className="absolute -left-6 top-0 w-12 h-12 bg-gray-900 border-2 border-cyan-400 rounded-full flex items-center justify-center font-bold text-cyan-400 z-10"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: hoveredStep === "03" ? 1.15 : 1, 
                        boxShadow: hoveredStep === "03" ? "0 0 20px #22d3ee" : "0 0 0px #22d3ee00" 
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                  >
                      03
                  </motion.div>
                  <div className="cursor-pointer">
                      <h3 className="text-2xl font-semibold text-white mb-2">Publish & Profit</h3>
                      <p className="text-gray-400 mb-4">With one click, your ad is scheduled and published across the recommended network. Sit back and watch your real-world presence—and your profits—grow."</p>
                      <p className="text-cyan-400 bg-gray-800/60 p-3 rounded-lg text-sm italic">e.g., Your ad runs automatically, reaching potential clients at the perfect moment.</p>
                  </div>
              </div>
          </div>
        </ScrollAnimator>
      </div>

      {/* USP / Features Section */}
      <div className="py-20 px-6 bg-gray-900/50">
          <div className="max-w-7xl mx-auto text-center">
            <ScrollAnimator>
              <h2 className="text-3xl md:text-4xl font-bold mb-12">The Future of Local Advertising</h2>
            </ScrollAnimator>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollAnimator delay={0}>
                <FeatureCard icon={<Target size={24} className="text-cyan-400" />} title="Hyper-Local Targeting">
                  Connect with customers based on their physical location and real-world interests. Stop wasting money on irrelevant audiences.
                </FeatureCard>
              </ScrollAnimator>
              <ScrollAnimator delay={0.2}>
                <FeatureCard icon={<BrainCircuit size={24} className="text-cyan-400" />} title="Intelligent Matching">
                  Our "sister business" logic ensures your ad is only shown in relevant contexts, maximizing impact and conversion.
                </FeatureCard>
              </ScrollAnimator>
              <ScrollAnimator delay={0.4}>
                <FeatureCard icon={<Rocket size={24} className="text-cyan-400" />} title="Automated Scheduling">
                  No more manual planning. Our platform handles the scheduling for you, placing your ads at the right time in the right place.
                </FeatureCard>
              </ScrollAnimator>
            </div>
          </div>
      </div>
      
      {/* CTA Section */}
      <div className="text-center py-20 px-6">
        <ScrollAnimator>
          <h2 className="text-3xl font-bold mb-4">Ready to Be Seen?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join the revolution in offline advertising and put your business in front of the right people, right now.
          </p>
          <Link href="/choose-plan">
            <button className="aurora-button-usp">
              <span className="aurora-button-usp__label" data-hover="Let's Go!">
                <span>View Plans and Get Started <ArrowRight className="inline" size={20} /></span>
              </span>
              <span className="aurora-button-usp__background"></span>
            </button>
          </Link>
        </ScrollAnimator>
      </div>
    </div>
  );
}

