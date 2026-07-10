"use client";

import { motion } from "framer-motion";

/* ─── Data ─── */

const withoutSteps = [
  "Open dozens of files",
  "Use Ctrl + F repeatedly",
  "Switch between tabs",
  "Lose context",
  "Manually trace dependencies",
];

const withSteps = [
  "Upload or connect",
  "Ask one question",
  "Receive a contextual answer",
  "Inspect cited sources",
];

const revealEase = [0.16, 1, 0.3, 1] as const;

/* ─── Step List Renderer ─── */

function StepList({
  steps,
  muted,
}: {
  steps: string[];
  muted?: boolean;
}) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step}>
          <div className="flex items-start gap-3 py-2">
            <span
              className={`text-[11px] font-mono mt-0.5 w-4 flex-shrink-0 tabular-nums ${
                muted ? "text-[#8B93A1]/25" : "text-[#F7F7F8]/30"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`text-[14px] leading-relaxed ${
                muted ? "text-[#8B93A1]/50" : "text-[#F7F7F8]"
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`ml-[7px] h-4 w-[1px] ${
                muted ? "bg-white/[0.03]" : "bg-white/[0.06]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Component ─── */

export default function WhyDevPilot() {
  return (
    <section id="why-devpilot" className="relative section-padding px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: revealEase }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8B93A1]/70 mb-4">
            Compare
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F8] mb-4">
            Why DevPilot?
          </h2>
          <p className="text-[#8B93A1] max-w-lg mx-auto leading-relaxed text-[15px]">
            Stop manually searching through files. Let AI navigate your
            codebase.
          </p>
        </motion.div>

        {/* Comparison container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: revealEase }}
          className="relative rounded-2xl border border-white/[0.06] bg-[#0A0B0F] overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            {/* ─── Without DevPilot ─── */}
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-2.5 mb-7">
                <span className="w-2 h-2 rounded-full bg-[#8B93A1]/20" />
                <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#8B93A1]/40">
                  Without DevPilot
                </h3>
              </div>
              <StepList steps={withoutSteps} muted />
            </div>

            {/* Metallic divider — desktop */}
            <div className="hidden md:block absolute top-8 bottom-8 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />

            {/* Horizontal divider — mobile */}
            <div className="md:hidden h-[1px] mx-8 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* ─── With DevPilot ─── */}
            <div className="p-8 sm:p-10 md:bg-white/[0.01]">
              <div className="flex items-center gap-2.5 mb-7">
                <span className="w-2 h-2 rounded-full bg-[#F7F7F8]/40" />
                <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#F7F7F8]/60">
                  With DevPilot
                </h3>
              </div>
              <StepList steps={withSteps} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
