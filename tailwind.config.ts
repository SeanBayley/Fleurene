import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ultra ultra soft pastels - barely there colors
        cream: "#FFF8F0",
        "pink-25": "#FFFEFE",
        "pink-50": "#FEFCFC",
        "pink-100": "#FEF7F7",
        "pink-200": "#FDEAEA",
        "pink-300": "#FBDDDD",

        "purple-25": "#FEFEFE",
        "purple-50": "#FDFCFF",
        "purple-100": "#FAF5FF",
        "purple-200": "#F5EAFF",
        "purple-300": "#EFDDFF",

        "blue-25": "#FEFFFE",
        "blue-50": "#FCFEFF",
        "blue-100": "#F0F9FF",
        "blue-200": "#E5F3FF",
        "blue-300": "#DAEEFF",

        // New wisteria and lilac colors
        "wisteria-50": "#F8F4FF",
        "wisteria-100": "#F0E6FF",
        "wisteria-200": "#E6D7FF",
        "wisteria-300": "#D4C5F0",
        "wisteria-400": "#B19CD9",
        "wisteria-500": "#9B8BC7",
        "wisteria-600": "#8B7BB8",

        "lilac-50": "#FAF7FF",
        "lilac-100": "#F3ECFF",
        "lilac-200": "#E8DAFF",
        "lilac-300": "#D8C4FF",
        "lilac-400": "#C8A8E9",
        "lilac-500": "#B8A9D9",
        "lilac-600": "#A394CC",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        "petal-fall": "petalFall 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.2)" },
        },
        petalFall: {
          "0%": { transform: "translateY(-100px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(360deg)", opacity: "0" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
