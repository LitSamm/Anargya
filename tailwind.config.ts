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
        "main-dark": "#121212",
        "secondary-dark": "#181818",
        "secondary-gray": "#282828",
        "main-green": "#29D970",
        "dark-green": "#153020",
        "main-red": "#EB413F",
        "main-gray": "#B3B3B3",
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        'codec-cold': ['var(--font-codec-cold)'],
        sfui: ['var(--font-sans)'],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        heavy: "900",
      },
      boxShadow: {
        "anargya-green": "0 0 20px rgba(41, 217, 112, 0.25)",
        "anargya-card": "0 4px 20px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
