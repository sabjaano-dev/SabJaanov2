"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Github, Dribbble, Briefcase, Info, LifeBuoy } from "lucide-react";

// Add type declarations to inform TypeScript about the GSAP objects on the window
declare global {
  interface Window {
    gsap: any;
    MorphSVGPlugin: any;
  }
}

export default function Footer() {
  const footerLinks = {
    company: ["About", "Features", "Pricing"],
    resources: ["Blog", "Documentation", "Help Center"],
    legal: ["Terms of Service", "Privacy Policy"],
  };

  const socialLinks = [
    { Icon: Twitter, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Dribbble, href: "#" },
    { Icon: Github, href: "#" },
  ];

  // This effect dynamically loads the GSAP scripts and runs the animation
  useEffect(() => {
    const gsapCdn = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    const morphCdn = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/MorphSVGPlugin.min.js";
    
    let scriptsLoaded = 0;
    const scripts: HTMLScriptElement[] = [];

    const runAnimation = () => {
      if (window.gsap && window.MorphSVGPlugin) {
        window.gsap.registerPlugin(window.MorphSVGPlugin);
        window.gsap.to("#squiggle", {
          duration: 4, // A smooth, fluid animation duration
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          morphSVG: "#squiggleAlt"
        });
      }
    };

    const handleScriptLoad = () => {
      scriptsLoaded++;
      if (scriptsLoaded === 2) {
        runAnimation();
      }
    };

    const gsapScript = document.createElement('script');
    gsapScript.src = gsapCdn;
    gsapScript.onload = handleScriptLoad;
    document.body.appendChild(gsapScript);
    scripts.push(gsapScript);

    const morphScript = document.createElement('script');
    morphScript.src = morphCdn;
    morphScript.onload = handleScriptLoad;
    document.body.appendChild(morphScript);
    scripts.push(morphScript);

    // Cleanup function to remove the scripts when the component unmounts
    return () => {
      scripts.forEach(script => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* --- GSAP WAVE STYLES --- */
        .wave-divider-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          transform: translateY(-100%);
        }

        .wave-divider-container svg {
          position: relative;
          display: block;
          width: calc(150% + 1.3px);
          height: 150px;
        }

        #squiggleAlt {
          visibility: hidden;
        }

        /* --- Waving Bunny Animation --- */
        @keyframes wave-animation {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(25deg);
          }
        }
        .waving-bunny__arm {
          animation: wave-animation 1.5s ease-in-out infinite;
          transform-origin: 50% 90%; /* Set rotation pivot to the shoulder */
        }
      `}</style>
      
      <footer className="relative bg-gray-900 text-white pt-32 pb-12">
        
        {/* --- GSAP MORPHING WAVE SEPARATOR --- */}
        <div className="wave-divider-container">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-gradient-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" /> 
                <stop offset="100%" stopColor="#facc15" /> 
              </linearGradient>
            </defs>
            <path 
              id="squiggle" 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="url(#wave-gradient-fill)"
            ></path>
            <path 
              id="squiggleAlt" 
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-16.82-168-15.7-250.45.39-58.02,10.79-114.16,30.13-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V35.8C1132.19,29.85,1055.71,21.34,985.66,92.83Z"
            ></path>
          </svg>
        </div>

        {/* The footer content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-3"><Briefcase size={20} className="text-cyan-400" />Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map(link => <li key={link}><Link href="#" className="text-gray-400 hover:text-white transition">{link}</Link></li>)}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-3"><Info size={20} className="text-cyan-400" />Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map(link => <li key={link}><Link href="#" className="text-gray-400 hover:text-white transition">{link}</Link></li>)}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-3"><LifeBuoy size={20} className="text-cyan-400" />Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map(link => <li key={link}><Link href="#" className="text-gray-400 hover:text-white transition">{link}</Link></li>)}
              </ul>
            </div>

            {/* MODIFICATION: Replaced "Contact Us" box with a waving bunny */}
            <div className="flex items-center justify-center col-span-2 md:col-span-1">
              <svg className="w-48 h-48 text-gray-700" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g className="fill-current">
                  {/* Left Ear */}
                  <path d="M40,30 C35,10 40,0 45,15 C50,30 45,35 40,30 Z" />
                  {/* Right Ear */}
                  <path d="M60,30 C65,10 60,0 55,15 C50,30 55,35 60,30 Z" />
                  {/* Head */}
                  <circle cx="50" cy="40" r="15" />
                  {/* Body */}
                  <path d="M50,55 C30,55 30,95 50,95 C70,95 70,55 50,55 Z" />
                  {/* Waving Arm */}
                  <g className="waving-bunny__arm">
                    <path d="M35,65 C25,55 20,70 30,80 C40,90 45,75 35,65 Z" />
                  </g>
                  {/* Other Arm */}
                  <path d="M65,65 C75,55 80,70 70,80 C60,90 55,75 65,65 Z" />
                </g>
              </svg>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} SabJaano. All Rights Reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {socialLinks.map(({ Icon, href }, index) => (
                <a key={index} href={href} className="text-gray-400 hover:text-white transition"><Icon size={20} /></a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

