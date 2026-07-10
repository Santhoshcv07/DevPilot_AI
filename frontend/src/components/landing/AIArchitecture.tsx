"use client";

import { motion } from "framer-motion";

const revealEase = [0.16, 1, 0.3, 1] as const;

export default function AIArchitecture() {
  return (
    <section className="relative section-padding px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: revealEase }}
          className="relative rounded-3xl border border-white/[0.08] bg-[#0A0B0F] p-8 sm:p-12 md:p-16 text-center shadow-[0_0_100px_rgba(255,255,255,0.015)]"
        >
          {/* Subtle background texture/gradient */}
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-transparent pointer-events-none" />

          {/* Glowing node at top */}
          <div className="mx-auto w-12 h-12 rounded-full bg-[#12141A] border border-white/[0.1] flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-white/[0.05] blur-md" />
            <span className="relative z-10 text-lg font-mono text-[#F7F7F8]">
              ∞
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F7F7F8] mb-6 max-w-2xl mx-auto">
            Powered by advanced <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F7F7F8] via-[#C8CDD5] to-[#8B93A1]">
              Retrieval-Augmented Generation
            </span>
          </h2>

          <p className="text-[#8B93A1] text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto mb-10">
            DevPilot doesn&apos;t just guess. It employs sophisticated semantic
            search across a highly optimized vector database to ground every
            response in your actual codebase truth.
          </p>

          {/* Simple tech stack pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
            {["Vector Search", "Semantic Chunking", "AST Parsing", "LLM Routing"].map(
              (tech) => (
                <div
                  key={tech}
                  className="px-4 py-2 rounded-full bg-[#12141A] border border-white/[0.05] text-[12px] font-mono text-[#8B93A1]"
                >
                  {tech}
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Decorative background grid behind the card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[600px] opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 20%, transparent 70%)",
        }}
      />
    </section>
  );
}
