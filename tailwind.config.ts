import type { Config } from "tailwindcss";

export default {
  content: [
    "./look/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./look/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
} satisfies Config;