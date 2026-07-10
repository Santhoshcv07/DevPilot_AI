"use client";

import { motion } from "framer-motion";

/* ─── Stage Data ─── */

const stages = [
  {
    number: "01",
    title: "Upload",
    description:
      "Upload PDFs, Markdown, text files, CSV, technical documentation, or source code.",
  },
  {
    number: "02",
    title: "Understand",
    description:
      "DevPilot parses, chunks, embeds, and intelligently indexes your content.",
  },
  {
    number: "03",
    title: "Ask",
    description:
      "Ask natural-language questions about your documents or codebase.",
  },
  {
    number: "04",
    title: "Discover",
    description:
      "Receive contextual, source-grounded answers with relevant references.",
  },
];

const revealEase = [0.16, 1, 0.3, 1] as const;

/* ─── Component ─── */

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative section-padding px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: revealEase }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8B93A1]/70 mb-4">
            Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F8]">
            How it works
          </h2>
        </motion.div>

        {/* ─── Desktop Pipeline ─── */}
        <div className="hidden md:grid grid-cols-4 gap-0 relative">
          {/* Base connecting line */}
          <div className="absolute top-6 left-[12.5%] right-[12.5%] h-[1px] bg-white/[0.04]" />

          {/* Animated signal beam */}
          <motion.div
            className="absolute top-6 left-[12.5%] right-[12.5%] h-[1px] origin-left"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 100%)",
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.8,
              delay: 0.4,
              ease: revealEase,
            }}
          />

          {/* Stages */}
          {stages.map((stage, i) => (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2 + i * 0.15,
                duration: 0.6,
                ease: revealEase,
              }}
              className="flex flex-col items-center text-center px-4"
            >
              {/* Stage circle — shadow ring masks the line behind it */}
              <div className="w-12 h-12 rounded-full bg-[#0D0E11] border border-white/[0.08] flex items-center justify-center mb-6 relative z-10 shadow-[0_0_0_5px_#050506]">
                <span className="text-xs font-mono font-bold text-[#8B93A1]">
                  {stage.number}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold text-[#F7F7F8] mb-2.5">
                {stage.title}
              </h3>
              <p className="text-[13px] text-[#8B93A1]/80 leading-relaxed max-w-[200px]">
                {stage.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ─── Mobile Pipeline ─── */}
        <div className="md:hidden">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                ease: revealEase,
              }}
              className="flex gap-5"
            >
              {/* Left: circle + vertical connector */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0D0E11] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-mono font-bold text-[#8B93A1]">
                    {stage.number}
                  </span>
                </div>
                {i < stages.length - 1 && (
                  <div className="w-[1px] flex-1 bg-white/[0.06] mt-3 min-h-[32px]" />
                )}
              </div>

              {/* Right: content */}
              <div className="pt-2 pb-8">
                <h3 className="text-[15px] font-semibold text-[#F7F7F8] mb-1.5">
                  {stage.title}
                </h3>
                <p className="text-[13px] text-[#8B93A1]/80 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
