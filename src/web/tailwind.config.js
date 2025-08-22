const config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border))",

        brand: {
          DEFAULT: "hsl(var(--brand))",
          300: "hsl(var(--brand-300))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          foreground: "hsl(var(--brand-foreground))",
        },

        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        info: "hsl(var(--info))",
        muted: {
          foreground: "hsl(var(--muted-foreground))",
        },
      },

      borderColor: { DEFAULT: "hsl(var(--border))" },
      ringColor: { brand: "hsl(var(--brand))" },

      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-geist-sans)"],
        mono: ["var(--font-mono)", "var(--font-geist-mono)"],
      },

      fontSize: {
        // 38pt ≈ 50.666px ≈ 3.167rem
        display: ["3.167rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        // 28pt ≈ 37.333px ≈ 2.333rem
        h1: ["2.333rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        // 24pt = 32px = 2rem
        h2: ["2rem", { lineHeight: "1.2" }],
        // 20pt ≈ 26.667px ≈ 1.667rem
        h3: ["1.667rem", { lineHeight: "1.25" }],
        // 18pt = 24px = 1.5rem
        h4: ["1.5rem", { lineHeight: "1.3" }],
        // 16pt ≈ 21.333px ≈ 1.333rem
        h5: ["1.333rem", { lineHeight: "1.35" }],
        // 14pt ≈ 18.667px ≈ 1.167rem
        h6: ["1.167rem", { lineHeight: "1.4" }],
        // base paragraph
        body: ["1rem", { lineHeight: "1.6" }],
      },
    },
  },
  plugins: [],
};

export default config;
