"use client";

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";

/* ─── Types ─── */

interface Feature {
  icon: string;
  title: string;
  description: string;
  large?: boolean;
  visual?: ReactNode;
}

/* ─── Feature Data ─── */

const features: Feature[] = [
  {
    icon: "</>",
    title: "Codebase Intelligence",
    description:
      "Understand unfamiliar repositories, functions, dependencies, and application logic.",
    large: true,
    visual: (
      <div className="mt-6 space-y-1.5 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
        {[
          "main.py",
          "├── auth.ts",
          "│   └── middleware.ts",
          "├── routes.py",
          "└── config.json",
        ].map((line) => (
          <div
            key={line}
            className="font-mono text-[11px] text-[#8B93A1] leading-relaxed"
          >
            {line}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: "◇",
    title: "Document Chat",
    description:
      "Ask questions across PDFs, Markdown, text files, CSV files, and technical documentation.",
    large: true,
    visual: (
      <div className="mt-6 space-y-2 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
        <div className="bg-[#12141A] rounded-lg px-3 py-2 border border-white/[0.04] max-w-[240px]">
          <p className="font-mono text-[10px] text-[#8B93A1] leading-relaxed">
            &quot;How does the auth flow work?&quot;
          </p>
        </div>
        <div className="bg-[#12141A] rounded-lg px-3 py-2 border border-white/[0.04] max-w-[280px] ml-4">
          <p className="font-mono text-[10px] text-[#8B93A1] leading-relaxed">
            JWT middleware validates tokens before routing to protected
            endpoints...
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: "↗",
    title: "Source-Grounded Answers",
    description:
      "Responses connect back to relevant source material with precise citations.",
  },
  {
    icon: "⊞",
    title: "Context-Aware Retrieval",
    description:
      "Relevant information is retrieved before generating answers.",
  },
  {
    icon: "⬡",
    title: "Multi-Format Support",
    description:
      "Work across documents, source files, structured data, and technical content.",
  },
  {
    icon: ">_",
    title: "Developer-First Experience",
    description:
      "A fast, minimal interface built around technical workflows.",
  },
];

const revealEase = [0.16, 1, 0.3, 1] as const;

/* ─── Feature Card ─── */

function FeatureCard({
  feature,
  className,
  index,
}: {
  feature: Feature;
  className?: string;
  index: number;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.1 + index * 0.08,
        duration: 0.6,
        ease: revealEase,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative overflow-hidden rounded-2xl bg-[#0A0B0F] border border-white/[0.06] p-6 sm:p-7 transition-all duration-300 hover:border-white/[0.10] hover:-translate-y-[2px] ${className ?? ""}`}
    >
      {/* Cursor-following spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.03), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-[#12141A] border border-white/[0.06] flex items-center justify-center mb-5">
          <span className="text-sm font-mono font-bold text-[#8B93A1]">
            {feature.icon}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-[16px] font-semibold text-[#F7F7F8] mb-2">
          {feature.title}
        </h3>
        <p className="text-[13px] sm:text-[14px] text-[#8B93A1]/80 leading-relaxed">
          {feature.description}
        </p>

        {/* Optional visual element (large cards only) */}
        {feature.visual}
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */

export default function CoreFeatures() {
  return (
    <section id="features" className="relative section-padding px-6">
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
            Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F8]">
            Core features
          </h2>
        </motion.div>

        {/* Bento Grid: 2 large (col-span-2) + 4 small (col-span-1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={i}
              className={feature.large ? "sm:col-span-2" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
