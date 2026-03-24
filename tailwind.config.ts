import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cor primária: ouro — inspirado na identidade XP Investimentos
        primary: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F5C518",  // gold principal
          600: "#D4A017",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },
        // Superfícies escuras
        surface: {
          50:  "#3F3F46",
          100: "#323238",
          200: "#27272A",
          300: "#1F1F23",
          400: "#18181B",
          500: "#131316",
          600: "#0E0E11",
          700: "#09090B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "gold-sm": "0 0 0 1px rgba(245, 197, 24, 0.15)",
        "gold":    "0 0 20px rgba(245, 197, 24, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
