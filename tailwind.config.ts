import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
        discord: {
          darkest: "#1e1f22",
          dark: "#2b2d31",
          medium: "#313338",
          light: "#383a40",
          accent: "#5865f2",
          text: "#ffffff",
          muted: "#949ba4",
        }
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;