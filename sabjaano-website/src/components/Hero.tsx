"use client";

import { useState, useEffect, useRef } from "react";
// MODIFICATION: Added useInView for scroll animations
import { Menu, ShoppingBag, Search, ChevronDown, Play, Pause, Volume2, VolumeX, MapPin, BarChart, Video, Dot } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { HowItWorks } from '@/components/HowItWorks';
import Link from 'next/link'
import PlanCard from "@/components/ui/PlanCard";
import Footer from "./ui/Footer";
import USPPage from "./ui/UspPage";
import ContactUs from "./ui/ContactUs";
import SignInSignUp from "./ui/SignInSignUp";

// --- VIDEO SHOWCASE COMPONENT ---
function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("00:00");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isSeeking, setIsSeeking] = useState(false);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (!isSeeking) {
        setProgress((video.currentTime / video.duration) * 100);
      }
      setCurrentTime(formatTime(video.currentTime));
    };

    const setVideoDuration = () => {
      setDuration(formatTime(video.duration));
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', setVideoDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', setVideoDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [isSeeking]);

  useEffect(() => {
    const video = videoRef.current;
    const seekBar = seekBarRef.current;
    if (!video || !seekBar) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isSeeking) {
        const rect = seekBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const width = rect.width;
        const newProgress = Math.max(0, Math.min(1, offsetX / width));
        video.currentTime = newProgress * video.duration;
        setProgress(newProgress * 100);
      }
    };

    const handleMouseUp = () => {
      setIsSeeking(false);
    };

    if (isSeeking) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSeeking, videoRef, seekBarRef]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };
  
  const handleSeekMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const seekBar = seekBarRef.current;
    if (!video || !seekBar) return;

    setIsSeeking(true);

    const rect = seekBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = Math.max(0, Math.min(1, offsetX / width));
    video.currentTime = newProgress * video.duration;
    setProgress(newProgress * 100);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 z-10 py-20 px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
            See It in Action
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Watch how easy it is to generate professional ads in seconds.
          </p>
        </div>
        
        <div className="relative rounded-2xl p-1 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/50">
          <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden group">
            <video 
              ref={videoRef}
              className="w-full h-full object-cover rounded-lg"
              src="/vid.mp4" 
              autoPlay 
              muted 
              playsInline
              onClick={togglePlayPause}
            >
              Your browser does not support the video tag.
            </video>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div 
                ref={seekBarRef} 
                className="relative h-1.5 bg-white/20 rounded-full cursor-pointer" 
                onMouseDown={handleSeekMouseDown}
              >
                <div className="absolute h-full bg-cyan-400 rounded-full" style={{ width: `${progress}%` }}></div>
                <div className="absolute h-4 w-4 -mt-1.5 bg-white rounded-full shadow" style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}></div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlayPause} className="text-white">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button onClick={toggleMute} className="text-white">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                </div>
                <div className="text-white text-sm font-mono">
                  {currentTime} / {duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ANALYTICAL DASHBOARD COMPONENT ---
function AnalyticalDashboard() {
  // MODIFICATION: Added refs and hooks for parallax and scroll animations
  const dashboardRef = useRef(null);
  const isInView = useInView(dashboardRef, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: dashboardRef,
    offset: ["start end", "end start"],
  });

  // Parallax transformations for each card
  const y1 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  
  // Staggered animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  return (
    // MODIFICATION: Added ref and overflow-hidden for animations
    <div ref={dashboardRef} className="relative min-h-screen bg-gray-900 z-10 py-20 px-6 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Comprehensive Analytics Dashboard
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Real-time insights to maximize your ad campaign's impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Live Camera Monitoring */}
          <motion.div 
            style={{ y: y1 }}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
          >
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <Video className="text-cyan-400" size={28} />
                <h3 className="text-xl font-semibold text-white">24/7 Live Monitoring</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <img src="https://placehold.co/600x400/000000/FFF?text=CAM_01" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex items-center gap-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-md">
                    <Dot /> LIVE
                  </div>
                </div>
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <img src="https://placehold.co/600x400/000000/FFF?text=CAM_02" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex items-center gap-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-md">
                    <Dot /> LIVE
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Clicks & Active Screens */}
          <motion.div 
            style={{ y: y2 }}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={1}
          >
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <BarChart className="text-cyan-400" size={28} />
                <h3 className="text-xl font-semibold text-white">Performance Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400">Total Clicks</p>
                  <p className="text-4xl font-bold text-white">1,28,492</p>
                </div>
                <div>
                  <p className="text-gray-400">Active Screens</p>
                  <p className="text-4xl font-bold text-white">874 / 900</p>
                </div>
              </div>
              <div className="mt-6">
                <svg width="100%" height="100" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <polyline fill="none" stroke="#06b6d4" strokeWidth="2" points="0,50 50,30 100,60 150,40 200,70 250,50 300,80" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Geographical Region */}
          <motion.div 
            className="lg:col-span-2" 
            style={{ y: y3 }}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={2}
          >
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
               <div className="flex items-center gap-4 mb-4">
                <MapPin className="text-cyan-400" size={28} />
                <h3 className="text-xl font-semibold text-white">Geographical Customization</h3>
              </div>
              <div className="relative w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center">
                <svg className="w-full h-full p-4 text-gray-700" viewBox="0 0 1000 500">
                  <path d="M500 0L490 20L480 10L470 30L460 20L450 40L440 30L430 50L420 40L410 60L400 50L390 70L380 60L370 80L360 70L350 90L340 80L330 100L320 90L310 110L300 100L290 120L280 110L270 130L260 120L250 140L240 130L230 150L220 140L210 160L200 150L190 170L180 160L170 180L160 170L150 190L140 180L130 200L120 190L110 210L100 200L90 220L80 210L70 230L60 220L50 240L40 230L30 250L20 240L10 260L0 250 M500 500L510 480L520 490L530 470L540 480L550 460L560 470L570 450L580 460L590 440L600 450L610 430L620 440L630 420L640 430L650 410L660 420L670 400L680 410L690 390L700 400L710 380L720 390L730 370L740 380L750 360L760 370L770 350L780 360L790 340L800 350L810 330L820 340L830 320L840 330L850 310L860 320L870 300L880 310L890 290L900 300L910 280L920 290L930 270L940 280L950 260L960 270L970 250L980 260L990 240L1000 250" fill="currentColor"/>
                  <circle cx="250" cy="150" r="10" className="text-cyan-400 fill-current" />
                  <circle cx="550" cy="200" r="15" className="text-purple-500 fill-current" />
                  <circle cx="700" cy="350" r="8" className="text-cyan-400 fill-current" />
                  <circle cx="450" cy="300" r="12" className="text-purple-500 fill-current" />
                   <circle cx="800" cy="120" r="10" className="text-cyan-400 fill-current" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function StripeHero() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modalType, setModalType] = useState<"signin" | "signup" | null>(
    null
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
    router.push("/");
  };

  const openSignIn = () => {
    setModalType("signin");
  };

  const closeModal = () => {
    setModalType(null);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };
  
  const switchAuthModal = (type: "signin" | "signup") => {
    setModalType(type);
  };

  const navItems = [
    { label: "Products", menu: ["Ad Formats", "Analytics", "Billing"] },
    {
      label: "Solutions",
      mega: true,
      content: [
        { title: "By Stage", items: ["Enterprises", "Startups"] },
        {
          title: "By Industry",
          items: ["E-commerce", "Retail", "SaaS", "Platforms"],
        },
        {
          title: "By Use Case",
          items: ["Fintech", "Real Estate", "Events", "D2C"],
        },
      ],
    },
    { label: "Developers", menu: ["API Docs", "Webhooks", "SDKs"] },
    { label: "Resources", menu: ["Blog", "Guides", "Help Center"] },
    { label: "Pricing", menu: ["Plans", "FAQs"] },
  ];

  const handleMouseEnter = (i: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIndex(i);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenIndex(null), 150);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-[75vh] z-0"
        style={{
          clipPath: "polygon(0 0,100% 0,100% 70%,0 100%)",
          backgroundImage:
            "linear-gradient(-45deg,#00bcd4,rgb(236,128,255),#00c853,#ffd600,#1e90ff,#ff4081)",
          backgroundSize: "600% 600%",
        }}
        animate={{
          backgroundPosition: [
            "0% 50%",
            "50% 50%",
            "100% 50%",
            "50% 50%",
            "0% 50%",
          ],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 px-6 lg:px-24">
        <header className="flex items-center justify-between py-6 text-white text-sm font-semibold">
          <div className="flex items-center gap-12">
            <h1 className="text-2xl font-bold tracking-tight">SabJaano</h1>
            <nav className="hidden md:flex gap-14 font-semibold text-white text-base">
              {navItems.map((nav, idx) => (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>{nav.label}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openIndex === idx ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {!nav.mega && openIndex === idx && nav.menu && (
                    <div className="absolute left-0 mt-3 w-44 bg-white text-black rounded-lg shadow-xl z-50">
                      <ul className="p-2 space-y-1 text-sm font-medium">
                        {nav.menu.map((item, i) => (
                          <li
                            key={i}
                            className="hover:bg-gray-100 px-3 py-1 rounded"
                          >
                            <a href="#">{item}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {nav.mega && openIndex === idx && nav.content && (
                    <div className="absolute left-0 mt-6 w-[700px] bg-white text-black rounded-xl shadow-2xl z-50 p-6 grid grid-cols-3 gap-6">
                      {nav.content.map((sec, sIdx) => (
                        <div key={sIdx}>
                          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                            {sec.title}
                          </h4>
                          <ul className="space-y-2 text-sm font-medium">
                            {sec.items.map((it, i2) => (
                              <li
                                key={i2}
                                className="hover:bg-gray-100 rounded px-2 py-1"
                              >
                                <a href="#">{it}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={openSignIn}
                className="transform transition-transform duration-200 ease-in-out hover:scale-110"
              >
                Sign in
              </button>
            )}

        <Link href="/account" className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-5 py-1.5 text-sm font-semibold flex items-center gap-2">
          My Account
        </Link>
            <Search className="h-4 w-4" />
            <ShoppingBag className="h-5 w-5" />
            <Menu className="h-5 w-5 md:hidden" />
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 items-center pt-24 pb-12 gap-12 min-h-screen">
          <div className="max-w-xl text-white lg:text-left text-left">
            <h2 className="text-[4.9rem] lg:text-[6rem] font-extrabold leading-[1] tracking-[-0.05em] relative inline-block">
              <span className="relative z-10 text-black/90">
                Real-World <span className="text-white">Advertising</span>
                <br />
                Smarter<span className="text-black">&amp; Sharper</span>
              </span>
            </h2>
            <p className="mt-6 text-lg lg:text-xl text-black/90 max-w-lg">
              🎯 72% average uplift in QR scan-to-conversion
              <br />
              🧠 50% lower cost-per-lead vs digital ads
              <br />
              📍 900+ high-footfall locations activated
            </p>
<div className="mt-6 flex gap-4">

              <Link href="/request-invite">
                <button className="bg-[#0f172a] text-white rounded-full px-6 py-3 text-sm hover:bg-black">
                  Request an invite
                </button>
              </Link>

  <Link
    href="/choose-plan"
    className="bg-blue-600 text-white rounded-full px-6 py-3 text-sm hover:bg-blue-700 transition"
  >
    Choose the best Plan
  </Link>

<Link
  href="/generate-ad"
  className="bg-purple-600 text-white rounded-full px-6 py-3 text-sm hover:bg-purple-700 transition"
>
  Step 2: Generate Ad
</Link>

</div>
</div>

<div className="absolute top-0 right-0 h-full flex items-center pointer-events-none">
  <img
    src="/hero-image.png"
    alt="Hero"
    className="h-full object-contain shadow-2.5xl drop-shadow-xl"
  />
</div>

          </div>

          
        </section>
      </div>
      
<div className="relative min-h-screen overflow-hidden">
  <motion.div
    className="absolute top-0 left-0 w-full h-[100vh] z-0"
    style={{
      clipPath: "polygon(0% 35%, 100% 15%, 100% 80%, 0% 100%)",
      backgroundImage:
        "linear-gradient(-45deg,#00bcd4,rgb(236,128,255),#00c853,#ffd600,#1e90ff,#ff4081)",
      backgroundSize: "600% 600%",
    }}
    animate={{
      backgroundPosition: [
        "0% 50%",
        "50% 50%",
        "100% 50%",
        "50% 50%",
        "0% 50%",
      ],
    }}
    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
  />
        <HowItWorks />
      </div>

      <VideoShowcase />
      
      <AnalyticalDashboard />
      <USPPage />

      {modalType && (
        <SignInSignUp
          modalType={modalType}
          closeModal={closeModal}
          onAuthSuccess={handleAuthSuccess}
          switchModal={switchAuthModal}
        />
      )}
      
      <ContactUs/>
      <Footer />
    </div>
  );
}