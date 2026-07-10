"use client";

import { motion } from "framer-motion";

const revealEase = [0.16, 1, 0.3, 1] as const;

export default function FinalCTA() {
  return (
    <section className="relative section-padding px-6 pt-32 pb-40">
      {/* ─── Background Glow ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] pointer-events-none">
        <div className="absolute inset-0 bg-white/[0.02] blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: revealEase }}
        >
          {/* Tag */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
            <span className="text-[11px] font-medium tracking-wide uppercase text-[#8B93A1]">
              Ready to fly?
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#F7F7F8] mb-6 tracking-tight">
            Stop searching. <br className="hidden sm:block" />
            <span className="text-[#8B93A1]">Start building.</span>
          </h2>

          <p className="text-[#8B93A1] text-[16px] sm:text-[18px] leading-relaxed max-w-xl mx-auto mb-12">
            Join thousands of developers who have reclaimed hours of their week
            by letting DevPilot navigate their codebases.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-black text-[14px] font-semibold hover:bg-[#E5E7EB] hover:scale-[1.02] transition-all duration-200">
              Get started for free
            </button>
            <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-transparent border border-white/[0.1] text-white text-[14px] font-medium hover:bg-white/[0.03] transition-colors duration-200">
              View Documentation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
