import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        graphite: "#293241",
        mineral: "#64748b",
        steel: "#0f5e83",
        basalt: "#111827",
        copper: "#b7791f",
        mist: "#f5f7f9"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 33, 47, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
