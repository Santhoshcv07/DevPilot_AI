"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ─── Custom SVG Icons ─── */
const Icons = {
  Document: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Code: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Workflow: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <path d="M9 6h4a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2" />
    </svg>
  ),
  Sparkle: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3c.132 5.826 3.75 9.444 9.576 9.576-5.826.132-9.444 3.75-9.576 9.576-0.132-5.826-3.75-9.444-9.576-9.576 5.826-.132 9.444-3.75 9.576-9.576z" />
    </svg>
  ),
  PDF: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15v-4" />
      <path d="M12 15v-4" />
      <path d="M15 15v-4" />
    </svg>
  ),
  Question: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Network: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
      <path d="M12 8v3" />
    </svg>
  ),
  Arrow: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

/* ─── Navigation Sections ─── */
const sections = [
  { id: "hero", label: "Hero", icon: Icons.Document },
  { id: "showcase", label: "Product Preview", icon: Icons.Code },
  { id: "how-it-works", label: "How It Works", icon: Icons.Workflow },
  { id: "features", label: "Core Features", icon: Icons.Sparkle },
  { id: "formats", label: "Supported Formats", icon: Icons.PDF },
  { id: "why-devpilot", label: "Why DevPilot?", icon: Icons.Question },
  { id: "use-cases", label: "Engineering Use Cases", icon: Icons.Code },
  { id: "architecture", label: "RAG Architecture", icon: Icons.Network },
  { id: "cta", label: "Get Started", icon: Icons.Arrow },
];

export default function ScrollNavRail() {
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  /* Track Active Section via IntersectionObserver */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting entries
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // If multiple sections are visible, pick the one taking up the most screen real estate
          // or simply sort by top position. For simplicity, we can just grab the first intersecting one with a high threshold,
          // or sort by intersection ratio.
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -40% 0px", // triggers when element is roughly in middle of screen
        threshold: [0, 0.25, 0.5, 0.75, 1], // multiple thresholds for better ratio calculation
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="hidden lg:flex fixed left-8 top-0 bottom-0 z-40 flex-col items-center justify-center pointer-events-none">
      
      {/* Background Track */}
      <div className="absolute top-1/2 -translate-y-1/2 h-[60vh] w-[1px] bg-white/[0.04]" />
      
      {/* Fill Progress Line */}
      <motion.div 
        className="absolute top-[20vh] w-[1px] bg-gradient-to-b from-[#8B93A1]/40 via-white to-transparent origin-top shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        style={{ scaleY, height: "60vh" }}
      />

      {/* Nav Markers */}
      <div className="relative h-[60vh] w-12 flex flex-col justify-between items-center z-10 pointer-events-auto">
        {sections.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          
          return (
            <div key={id} className="relative group">
              {/* Tooltip */}
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
                <div className="bg-[#0D0E11] border border-white/[0.08] text-white text-[11px] font-medium px-3 py-1.5 rounded-md whitespace-nowrap shadow-xl">
                  {label}
                </div>
              </div>
              
              {/* Button */}
              <button
                onClick={() => scrollTo(id)}
                aria-label={`Scroll to ${label}`}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? "bg-[#12141A] border border-white/[0.25] text-white scale-[1.08] shadow-[0_0_12px_rgba(255,255,255,0.08)]" 
                    : "bg-[#0A0B0F] border border-white/[0.06] text-[#8B93A1]/40 hover:text-white/80 hover:border-white/[0.15]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors duration-300 ${isActive ? "text-white" : "text-current"}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
