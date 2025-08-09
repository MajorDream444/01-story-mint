import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#3E2A72",
          gold: "#E1B955",
          green: "#0D3B2E",
          offwhite: "#F7F4ED"
        }
      }
    },
  },
  plugins: [],
}
export default config
