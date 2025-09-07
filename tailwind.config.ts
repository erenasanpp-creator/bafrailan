import type { Config } from "tailwindcss"
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#0ea5e9", 600:"#0284c7" } },
      boxShadow: { soft: "0 10px 20px -10px rgba(2,132,199,0.15)" }
    }
  },
  plugins: []
} satisfies Config
