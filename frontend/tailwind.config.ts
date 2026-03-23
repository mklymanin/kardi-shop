import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10212b",
        sand: "#f4ede3",
        rust: "#c65b3d",
        pine: "#1e5a4e",
        mist: "#dae6e2"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

