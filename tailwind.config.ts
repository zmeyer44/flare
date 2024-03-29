/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./containers/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        "media-brand": "hsl(var(--primary))",
        "media-focus": "hsl(var(--primary))",
      },
      fontFamily: {
        condensed: ["var(--font-inter-tight)"],
        dm: ["var(--font-dm-sans)"],
        main: ["var(--font-main)"],
        "major-mono": ["var(--font-major-mono)"],
        audiowide: ["var(--font-audiowide)"],
      },
      width: {
        sidebar: "var(--sidebar-width)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },

      zIndex: {
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        99: 99,
        mobileTabs: 900,
        "header-": 919,
        header: 920,
        "header+": 921,
        headerDialog: 922,
        "overlay-": 929,
        overlay: 930,
        "overlay+": 931,
        "modal-": 939,
        modal: 940,
        "modal+": 941,
        "toast-": 949,
        toast: 950,
        "toast+": 951,
        "top-": 959,
        top: 960,
        "top+": 961,
      },
      flex: {
        2: 2,
        3: 3,
        4: 4,
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    require("tailwind-scrollbar"),
    require("@tailwindcss/typography"),
    require("@vidstack/react/tailwind.cjs")({
      selector: ".media-player",
      prefix: "media",
    }),
    customVariants,
  ],
};

function customVariants({
  addVariant,
  matchVariant,
}: {
  addVariant: (label: string, classes: string[]) => void;
  matchVariant: (label: string, func: (val: string) => string) => void;
}) {
  // Strict version of `.group` to help with nesting.
  matchVariant("parent-data", (value) => `.parent[data-${value}] > &`);

  addVariant("hocus", ["&:hover", "&:focus-visible"]);
  addVariant("group-hocus", [".group:hover &", ".group:focus-visible &"]);
}
