"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit, Building, Calendar, Coffee, Lightbulb, MapPin, ShoppingCart, Target, Zap,
  HeartPulse, Sparkles, Footprints, Check
} from "lucide-react";
import Link from "next/link";

/* ---------------------- MOCK DATA ---------------------- */
type Screen = {
  id: number;
  name: string;
  category: "gym" | "cafe" | "retail" | "hostel" | "college" | "clinic" | "co-working";
  reach: number;
  price: number; // per day
  why: string[];
};

const MOCK_SCREENS: Screen[] = [
  { id: 1, name: "Gold's Gym, Vasant Kunj", category: "gym", reach: 5000, price: 2000, why: ["Audience Overlap (Fitness)", "High Footfall", "Proximity to Target"] },
  { id: 2, name: "CrossFit Box, Saket", category: "gym", reach: 3500, price: 1800, why: ["Audience Overlap (Fitness)", "High Conversion History", "Proximity to Target"] },
  { id: 3, name: "Blue Tokai Coffee, Hauz Khas", category: "cafe", reach: 7000, price: 2500, why: ["High Footfall", "Audience Overlap (Young Adults)", "Event Hotspot"] },
  { id: 4, name: "The Big Chill Creamery, Khan Market", category: "cafe", reach: 9000, price: 3000, why: ["Premium Audience", "High Footfall", "Weekend Hotspot"] },
  { id: 5, name: "ZARA, Select Citywalk", category: "retail", reach: 12000, price: 4000, why: ["High Footfall", "Premium Audience", "Shopping Intent"] },
  { id: 6, name: "St. Stephen's College Hostel", category: "hostel", reach: 4000, price: 1500, why: ["Audience Overlap (Students)", "High Engagement", "Proximity to Target"] },
  { id: 7, name: "IIT Delhi Hostel", category: "hostel", reach: 6000, price: 1700, why: ["Audience Overlap (Students)", "High Engagement", "Tech Savvy Audience"] },
];

const businessCategories = [
  { value: "physiotherapy", label: "Physiotherapy Clinic", icon: <HeartPulse size={20} />, recommendedVenues: ["gym", "clinic"] },
  { value: "nutrition", label: "Sports Nutrition", icon: <Zap size={20} />, recommendedVenues: ["gym"] },
  { value: "food_delivery", label: "Food Delivery", icon: <ShoppingCart size={20} />, recommendedVenues: ["hostel", "co-working"] },
  { value: "event", label: "Event Promotion", icon: <Calendar size={20} />, recommendedVenues: ["cafe", "college"] },
  { value: "cafe", label: "Café / Restaurant", icon: <Coffee size={20} />, recommendedVenues: ["co-working", "college"] },
  { value: "retail", label: "Retail Store", icon: <Building size={20} />, recommendedVenues: ["cafe"] },
];

const venueTypes = [
  { value: "gym", label: "Gyms" },
  { value: "cafe", label: "Cafés" },
  { value: "hostel", label: "Hostels/PG" },
  { value: "college", label: "Colleges" },
  { value: "clinic", label: "Clinics" },
  { value: "co-working", label: "Co-working" },
] as const;

/* ---------------------- PAGE ---------------------- */
export default function SmartAdsPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    location: "New Delhi, India",
    venueTypes: [] as string[],
    goal: "awareness" as "awareness" | "footfall" | "leads",
    budget: 50000,
    days: 14,
  });

  const [recommendations, setRecommendations] = useState<Screen[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedWhy, setExpandedWhy] = useState<number | null>(null);

  const handleNext = () => setStep((p) => p + 1);
  const handleBack = () => setStep((p) => p - 1);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" || name === "days" ? parseInt(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    const category = businessCategories.find((c) => c.value === value);
    setFormData((prev) => ({
      ...prev,
      category: value,
      venueTypes: category?.recommendedVenues || [],
    }));
  };

  const handleGoalChange = (value: "awareness" | "footfall" | "leads") => {
    setFormData((prev) => ({ ...prev, goal: value }));
  };

  const handleVenueToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      venueTypes: prev.venueTypes.includes(value)
        ? prev.venueTypes.filter((v) => v !== value)
        : [...prev.venueTypes, value],
    }));
  };

  const runAlgorithm = () => {
    setStep(4); // loading
    setTimeout(() => {
      let suggested = MOCK_SCREENS.filter((s) =>
        formData.venueTypes.includes(s.category)
      );
      if (!suggested.length) suggested = MOCK_SCREENS.slice(0, 3);
      setRecommendations(suggested);
      setSelectedIds(suggested.map((s) => s.id)); // preselect all
      setStep(5); // results
    }, 1200);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleWhy = (id: number) =>
    setExpandedWhy((prev) => (prev === id ? null : id));

  const selectedScreens = recommendations.filter((s) =>
    selectedIds.includes(s.id)
  );
  const totalDaily = selectedScreens.reduce((sum, s) => sum + s.price, 0);
  const totalCost = totalDaily * formData.days;

  const ProgressBar = () => (
    <div className="w-full bg-gray-700 rounded-full h-2 mb-12">
      <motion.div
        className="bg-cyan-400 h-2 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${((step - 1) / 4) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <style jsx global>{`
        .aurora-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          pointer-events: none; /* ✅ don't block clicks */
        }
        .aurora-bg::after {
          content: "";
          position: absolute;
          inset: -200px;
          background-image: linear-gradient(
            100deg,
            hsla(258, 100%, 50%, 0.3) 10%,
            hsla(169, 100%, 50%, 0.3) 50%,
            hsla(45, 100%, 50%, 0.3) 90%
          );
          background-size: 200% 200%;
          animation: smoothBg 20s linear infinite;
          filter: blur(80px);
          pointer-events: none; /* ✅ don't block clicks */
        }
        @keyframes smoothBg {
          from {
            background-position: 0% 50%;
          }
          to {
            background-position: 200% 50%;
          }
        }
      `}</style>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="aurora-bg" />

        {/* z-10 to sit above the aurora layer */}
        <div className="mx-auto max-w-7xl py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
          {/* ------------ LEFT PANEL ------------ */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                {step < 4 && <ProgressBar />}

                {/* STEP 1 */}
                {step === 1 && (
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                      Let&apos;s Build Your Campaign
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                      Start with your business, and our AI will do the heavy
                      lifting.
                    </p>

                    <div className="mt-10 space-y-8">
                      <div>
                        <label className="text-lg font-semibold">
                          Your Website or Brand Name
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          placeholder="e.g., The Cozy Corner Cafe"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="mt-2 w-full bg-gray-800 border-gray-700 rounded-lg p-3"
                        />
                      </div>

                      <div>
                        <label className="text-lg font-semibold">
                          Business Category
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {businessCategories.map((cat) => {
                            const active = formData.category === cat.value;
                            return (
                              <button
                                key={cat.value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => handleCategoryChange(cat.value)}
                                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all border-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                  active
                                    ? "border-cyan-400 bg-cyan-900/40 scale-105"
                                    : "border-gray-700 hover:border-gray-600"
                                }`}
                              >
                                {cat.icon}
                                <span>{cat.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                      Where Do You Want to Advertise?
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                      Our AI has pre-selected the best venue types for you. Feel
                      free to adjust.
                    </p>

                    <div className="mt-10 space-y-8">
                      <div>
                        <label className="text-lg font-semibold">
                          Target Location
                        </label>
                        <div className="relative mt-2">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border-gray-700 rounded-lg pl-12 pr-4 py-3"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-lg font-semibold">
                          Venue Types
                        </label>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {venueTypes.map((venue) => {
                            const active = formData.venueTypes.includes(
                              venue.value
                            );
                            return (
                              <button
                                key={venue.value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => handleVenueToggle(venue.value)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                  active
                                    ? "bg-cyan-400 border-cyan-400 text-gray-900"
                                    : "bg-gray-800 border-gray-700 hover:border-gray-500"
                                }`}
                              >
                                {venue.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                      What&apos;s Your Goal & Budget?
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                      This helps us optimize your campaign for the best results.
                    </p>

                    <div className="mt-10 space-y-8">
                      <div>
                        <label className="text-lg font-semibold">
                          Primary Goal
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          {[
                            {
                              v: "awareness" as const,
                              label: "Brand Awareness",
                              icon: <Sparkles className="mx-auto mb-2 text-purple-400" />,
                            },
                            {
                              v: "footfall" as const,
                              label: "Foot Traffic",
                              icon: <Footprints className="mx-auto mb-2 text-green-400" />,
                            },
                            {
                              v: "leads" as const,
                              label: "Lead Generation",
                              icon: <Target className="mx-auto mb-2 text-red-400" />,
                            },
                          ].map((g) => {
                            const active = formData.goal === g.v;
                            return (
                              <button
                                key={g.v}
                                type="button"
                                aria-pressed={active}
                                onClick={() => handleGoalChange(g.v)}
                                className={`p-6 border-2 rounded-lg cursor-pointer text-center transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                  active
                                    ? "border-cyan-400 scale-105"
                                    : "border-gray-700 hover:border-gray-600"
                                }`}
                              >
                                {g.icon}
                                {g.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="text-lg font-semibold">
                          Budget & Duration
                        </label>
                        <div className="flex items-center gap-4 mt-2 p-4 bg-gray-800 rounded-lg">
                          <span className="text-2xl font-bold text-cyan-400">
                            ₹{formData.budget.toLocaleString()}
                          </span>
                          <input
                            type="range"
                            name="budget"
                            min={5000}
                            max={200000}
                            step={1000}
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LOADING */}
                {step === 4 && (
                  <div className="text-center py-20 flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <BrainCircuit size={60} className="text-cyan-400 mx-auto" />
                    </motion.div>
                    <h1 className="text-3xl font-bold mt-6">
                      Crafting Your Smart Campaign...
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                      Our AI is analyzing {MOCK_SCREENS.length * 23}+ data points to
                      find your perfect match.
                    </p>
                  </div>
                )}

                {/* RESULTS */}
                {step === 5 && (
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                      Your Custom Growth Plan is Ready!
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                      We&apos;ve pre-selected {recommendations.length} screens for the
                      best impact. Click to select/deselect any screen.
                    </p>

                    <div className="mt-8 space-y-4">
                      {recommendations.map((screen) => {
                        const selected = selectedIds.includes(screen.id);
                        const expanded = expandedWhy === screen.id;
                        return (
                          <motion.div
                            key={screen.id}
                            className={`bg-gray-800/50 border rounded-lg p-4 transition-colors ${
                              selected ? "border-cyan-400" : "border-gray-700"
                            }`}
                            whileHover={{ scale: 1.01, borderColor: "#22d3ee" }}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <button
                                type="button"
                                onClick={() => toggleSelect(screen.id)}
                                className="flex-1 text-left"
                              >
                                <h3 className="font-semibold flex items-center gap-2">
                                  {screen.name}
                                  {selected && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                                      <Check size={14} /> Selected
                                    </span>
                                  )}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  {screen.category} • Est.{" "}
                                  {screen.reach.toLocaleString()} reach/mo
                                </p>
                              </button>

                              <div className="text-right shrink-0">
                                <p className="font-bold text-lg">
                                  ₹{screen.price.toLocaleString()}/day
                                </p>
                                <button
                                  type="button"
                                  onClick={() => toggleWhy(screen.id)}
                                  className="text-xs text-cyan-400 hover:underline"
                                >
                                  {expanded ? "Hide rationale" : "Why this screen?"}
                                </button>
                              </div>
                            </div>

                            <AnimatePresence initial={false}>
                              {expanded && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-3 pl-5 list-disc text-sm text-gray-300"
                                >
                                  {screen.why.map((w, i) => (
                                    <li key={i}>{w}</li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ------------ RIGHT SUMMARY ------------ */}
          <div className="relative lg:col-span-1">
            <div className="sticky top-24 bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Lightbulb className="text-yellow-400" /> Your Campaign Summary
              </h3>

              <div className="mt-6 space-y-4 text-gray-300">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Business:</span>
                  <span className="font-medium text-right truncate max-w-[150px]">
                    {formData.businessName || "..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Category:</span>
                  <span className="font-medium capitalize">
                    {formData.category || "..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Venues:</span>
                  <span className="font-medium">
                    {formData.venueTypes.length} types
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Goal:</span>
                  <span className="font-medium capitalize">{formData.goal}</span>
                </div>
              </div>

              <div className="my-6 border-t border-gray-700" />

              <div className="text-center">
                <p className="text-gray-400">Estimated Cost</p>
                <p className="text-4xl font-bold text-cyan-400">
                  ₹
                  {(totalCost > 0 ? totalCost : formData.budget).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">for {formData.days} days</p>
                {step === 5 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedIds.length} / {recommendations.length} screens selected
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-4">
                {step < 3 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full rounded-md bg-cyan-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-cyan-600 transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    Next Step
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="button"
                    onClick={runAlgorithm}
                    className="w-full rounded-md bg-cyan-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-cyan-600 transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    Get Smart Suggestions
                  </button>
                )}

                {step === 5 && (
                  <Link href="/checkout" className="w-full">
                    <button
                      type="button"
                      disabled={selectedIds.length === 0}
                      className="w-full rounded-md bg-green-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-green-600 disabled:opacity-60 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      Review &amp; Launch
                    </button>
                  </Link>
                )}

                {step > 1 && step < 5 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full rounded-md bg-gray-700 px-5 py-3 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* ------------ /RIGHT SUMMARY ------------ */}
        </div>
      </div>
    </div>
  );
}
