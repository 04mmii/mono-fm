import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F5F5",
        foreground: "#1A1A1A",
        primary: "#1A1A1A",
        secondary: "#666666",
        accent: "#000000",
        border: "#E0E0E0",
        card: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Pretendard", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 1.8s linear infinite",
        "spin-lp": "spin var(--lp-duration, 1.8s) linear infinite",
      },
      boxShadow: {
        turntable: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
