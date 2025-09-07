'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicked/hovered outside
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        menuRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative inline-block">
      {/* Text trigger only */}
      <div
        ref={triggerRef}
        className="inline-flex items-center gap-1 font-semibold text-white cursor-pointer"
        onMouseEnter={() => setOpen(true)}
      >
        <span>Solutions</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Strict hover control dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 top-8 w-[720px] bg-white text-black shadow-xl rounded-xl p-6 grid grid-cols-2 gap-6 z-50"
          >
            {/* Column 1 */}
            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-medium">BY STAGE</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="hover:text-blue-600 cursor-pointer">🏢 Enterprises</span>
                <span className="hover:text-blue-600 cursor-pointer">🚀 Startups</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">BY BUSINESS MODEL</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>🛒 E-commerce</span>
                <span>📦 Platforms</span>
                <span>💻 SaaS</span>
                <span>🏬 Marketplaces</span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-medium">BY USE CASE</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>🏦 Finance automation</span>
                <span>🪙 Crypto</span>
                <span>🔌 Embedded finance</span>
                <span>🎨 Creator economy</span>
                <span>🌍 Global businesses</span>
                <span>🤖 AI companies</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">ECOSYSTEM</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>🛍 Stripe App Marketplace</span>
                <span>👥 Partners</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
