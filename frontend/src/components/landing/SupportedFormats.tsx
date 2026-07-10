"use client";

import { motion } from "framer-motion";

/* ─── Format Data ─── */

const formats = [
  { label: "PDF", color: "#FBBF24" },
  { label: "MD", color: "#F87171" },
  { label: "TXT", color: "#22D3EE" },
  { label: "CSV", color: "#34D399" },
  { label: "PY", color: "#60A5FA" },
  { label: "JS", color: "#FDE047" },
  { label: "TS", color: "#38BDF8" },
  { label: "JAVA", color: "#FB923C" },
  { label: "JSON", color: "#4ADE80" },
];

/* Double formats per set so each set fills wide viewports,
   then duplicate the set for a seamless CSS marquee loop. */
const singleRun = [...formats, ...formats];
const marqueeItems = [...singleRun, ...singleRun];

const revealEase = [0.16, 1, 0.3, 1] as const;

/* ─── Component ─── */

export default function SupportedFormats() {
  return (
    <section className="relative section-padding">
      {/* Section heading */}
      <div className="max-w-5xl mx-auto px-6 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: revealEase }}
          className="text-center"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8B93A1]/70 mb-4">
            Ecosystem
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F8]">
            Supported formats
          </h2>
        </motion.div>
      </div>

      {/* Marquee strip with edge fade */}
      <div className="edge-fade-mask overflow-hidden">
        <div
          className="flex gap-5"
          style={{
            width: "max-content",
            animation: "marquee 45s linear infinite",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {marqueeItems.map((fmt, i) => (
            <div
              key={`${fmt.label}-${i}`}
              className="flex items-center gap-2.5 px-5 py-3 bg-[#0A0B0F] border border-white/[0.06] rounded-xl flex-shrink-0 hover:border-white/[0.10] transition-colors duration-200 cursor-default"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 opacity-50"
                style={{ backgroundColor: fmt.color }}
              />
              <span
                className="font-mono text-sm font-bold opacity-70"
                style={{ color: fmt.color }}
              >
                {fmt.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
