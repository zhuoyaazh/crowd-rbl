import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FDFFF4",
        lemon: "#F6F3C8",
        blush: "#F5ABA4",
        vanilla: "#EAD392",
        gold: "#BAAB35",
      },
    },
  },
  plugins: [],
} satisfies Config;