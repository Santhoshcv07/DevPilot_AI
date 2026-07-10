"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface DevPilotLogoProps {
  className?: string;
  showWordmark?: boolean;
  animated?: boolean;
}

export const DevPilotLogo: React.FC<DevPilotLogoProps> = ({ 
  className = "", 
  showWordmark = true,
  animated = false
}) => {
  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Option A: Standalone Geometric Monogram */}
      <div className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-105" style={{ perspective: '1000px' }}>
        <motion.div
          animate={animated ? { rotateY: [0, 360] } : {}}
          transition={animated ? { repeat: Infinity, duration: 8, ease: "linear" } : {}}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Image 
            src="/logo.png" 
            alt="DevPilot Logo" 
            width={40} 
            height={40} 
            className="drop-shadow-sm rounded-md object-contain"
          />
        </motion.div>
      </div>
      
      {/* Wordmark */}
      {showWordmark && (
        <span className="text-white font-semibold text-[17px] tracking-[-0.03em] leading-none pt-0.5">
          Devpilot
        </span>
      )}
    </div>
  );
};

