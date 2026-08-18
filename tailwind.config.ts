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
        cream: {
          50: "#FDFCFB",
          100: "#FAF8F4",
          200: "#F5F2EB",
          300: "#E8E2D9",
          400: "#D3C9BD",
        },
        charcoal: {
          900: "#1C1917",
          800: "#2B2724",
          700: "#443E38",
          600: "#5A534C",
          500: "#736B63",
          400: "#948B82",
        },
        roast: {
          50: "#FAF5F0",
          100: "#F3E8DC",
          200: "#E4CFBC",
          500: "#8C532B",
          600: "#764320",
          700: "#5C3317",
          800: "#432410",
        },
        sage: {
          100: "#EBF0ED",
          500: "#4A6B5D",
          700: "#314A40",
        },
        wine: {
          100: "#F5EBEB",
          500: "#7B3B3B",
          700: "#572626",
        },
        // 2026年トレンド追加：Mocha Mousse
        mocha: {
          100: "#F3EAE5",
          300: "#D4AFA0",
          500: "#A47764",
          700: "#7A5249",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: [
          "DM Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Noto Sans JP"',
          "sans-serif",
        ],
      },
      boxShadow: {
        premium: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "premium-hover": "0 10px 20px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)",
        "inner-highlight": "inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        widest: "0.15em",
      },
      animation: {
        "gradient-shift": "gradient-shift 10s ease infinite",
        "fade-in": "fade-in 400ms ease-out forwards",
        "slide-up": "slide-up 400ms cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
