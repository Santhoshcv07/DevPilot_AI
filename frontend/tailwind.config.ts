import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dev: {
          bg: "#050506",
          sidebar: "#090A0D",
          surface: "#0D0E12",
          elevated: "#111217",
          hover: "#161820",
          border: "rgba(255,255,255,0.10)",
          borderSubtle: "rgba(255,255,255,0.06)",
          textPrimary: "#F1F3F7",
          textSecondary: "#8B93A1",
          textMuted: "#667085",
          accent: "#7C6CF2",
          accentHover: "#9185F7",
          accentSoft: "rgba(124, 108, 242, 0.12)",
        }
      }
    },
  },
  plugins: [],
};
export default config;
