"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { DevPilotLogo } from "@/components/ui/DevPilotLogo";

/* ─── Data ─── */

const files = [
  { name: "README.md", ext: "md", color: "#F87171" },
  { name: "auth.py", ext: "py", color: "#60A5FA", active: true },
  { name: "middleware.ts", ext: "ts", color: "#38BDF8" },
  { name: "api/routes.py", ext: "py", color: "#A78BFA" },
  { name: "config.json", ext: "json", color: "#FBBF24" },
];

const userQuestion = "How does authentication work in this codebase?";

const aiResponseText =
  "Authentication is handled through JWT-based middleware. Requests first pass through middleware.ts, where the token is validated before protected routes are executed. The validateToken() function on line 24 decodes the JWT, checks expiration, and attaches the user context to the request object.";

const citations = [
  { file: "middleware.ts", line: "Line 24", color: "#38BDF8" },
  { file: "auth.py", line: "Line 61", color: "#60A5FA" },
];

const revealEase = [0.16, 1, 0.3, 1] as const;

/* ─── Component ─── */

export default function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const [phase, setPhase] = useState<
    "idle" | "thinking" | "streaming" | "done"
  >("idle");
  const [displayedWords, setDisplayedWords] = useState(0);

  const words = aiResponseText.split(" ");

  /* Sequence: entrance → thinking → streaming → citations */
  useEffect(() => {
    if (!isInView) return;

    const t1 = setTimeout(() => setPhase("thinking"), 1000);
    const t2 = setTimeout(() => setPhase("streaming"), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isInView]);

  /* Word-by-word streaming */
  useEffect(() => {
    if (phase !== "streaming") return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedWords(i);
      if (i >= words.length) {
        clearInterval(interval);
        setPhase("done");
      }
    }, 45);

    return () => clearInterval(interval);
  }, [phase, words.length]);

  return (
    <section id="product" className="relative section-padding px-6">
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
            Product
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F8] mb-4">
            See it in action
          </h2>
          <p className="text-[#8B93A1] max-w-lg mx-auto leading-relaxed text-[15px]">
            Ask questions about your codebase. Get answers grounded in your
            actual source code.
          </p>
        </motion.div>

        {/* Product Window */}
        <div ref={containerRef} className="relative">
          {/* Ambient glow underneath */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-white/[0.015] blur-[80px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ y: 80, scale: 0.94, opacity: 0, filter: "blur(8px)" }}
            animate={
              isInView
                ? { y: 0, scale: 1, opacity: 1, filter: "blur(0px)" }
                : {}
            }
            transition={{ duration: 0.9, ease: revealEase }}
            className="relative rounded-2xl border border-[#1A1D25] bg-[#0A0B0F] shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* ─── Window Chrome ─── */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-[#0C0D12] border-b border-[#1A1D25]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBD2F]/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]/20" />
              </div>
              <span className="ml-3 text-[11px] font-medium text-[#8B93A1]/50 tracking-wide">
                DevPilot AI
              </span>
            </div>

            {/* ─── Content ─── */}
            <div className="flex min-h-[360px] sm:min-h-[400px]">
              {/* Sidebar — desktop only */}
              <div className="hidden md:flex flex-col w-52 bg-[#0C0D12]/80 border-r border-[#1A1D25] p-3">
                <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B93A1]/40 px-2.5 mb-2.5 mt-1">
                  Files
                </p>
                <div className="flex flex-col gap-0.5">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors duration-150 cursor-default ${
                        file.active
                          ? "bg-white/[0.05] text-[#F7F7F8]"
                          : "text-[#8B93A1]/80 hover:bg-white/[0.03] hover:text-[#8B93A1]"
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: file.color }}
                      />
                      <span className="font-mono text-[12px] truncate">
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversation Area */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col gap-5 overflow-hidden">
                {/* User Message */}
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-lg bg-[#1A1D25] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-[#8B93A1]">
                      U
                    </span>
                  </div>
                  <div className="bg-[#12141A] rounded-xl px-4 py-3 max-w-lg border border-white/[0.03]">
                    <p className="text-[14px] text-[#F7F7F8] leading-relaxed">
                      {userQuestion}
                    </p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <DevPilotLogo showWordmark={false} />
                  </div>
                  <div className="flex-1 max-w-xl min-h-[80px]">
                    {/* Thinking indicator */}
                    {phase === "thinking" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 py-3"
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-[#8B93A1]/40"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}

                    {/* Streamed response */}
                    {(phase === "streaming" || phase === "done") && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-[14px] text-[#C8CDD5] leading-[1.75]">
                          {words.slice(0, displayedWords).join(" ")}
                          {phase === "streaming" && (
                            <motion.span
                              className="inline-block w-[2px] h-[14px] bg-[#8B93A1] ml-0.5 align-text-bottom rounded-full"
                              animate={{ opacity: [1, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                              }}
                            />
                          )}
                        </p>

                        {/* Source Citations */}
                        {phase === "done" && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.04]"
                          >
                            <span className="text-[10px] font-medium tracking-wide uppercase text-[#8B93A1]/40 self-center mr-1">
                              Sources
                            </span>
                            {citations.map((cite) => (
                              <div
                                key={cite.file}
                                className="flex items-center gap-2 bg-[#12141A] border border-[#1E2230] rounded-lg px-3 py-1.5 hover:border-white/[0.08] transition-colors duration-200 cursor-default"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: cite.color }}
                                />
                                <span className="text-[11px] font-mono text-[#8B93A1]">
                                  {cite.file}{" "}
                                  <span className="text-[#8B93A1]/50">·</span>{" "}
                                  {cite.line}
                                </span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
