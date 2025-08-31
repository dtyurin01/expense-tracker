const config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./**/*.stories.@(ts|tsx|mdx)",
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        sm: "16px",
        md: "24px",
        lg: "48px",
        xl: "64px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-geist-sans)"],
        mono: ["var(--font-mono)", "var(--font-geist-mono)"],
      },
      fontSize: {
        display: ["3.167rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h1: ["2.333rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        h2: ["2rem", { lineHeight: "1.2" }],
        h3: ["1.667rem", { lineHeight: "1.25" }],
        h4: ["1.5rem", { lineHeight: "1.3" }],
        h5: ["1.333rem", { lineHeight: "1.35" }],
        h6: ["1.167rem", { lineHeight: "1.4" }],
        body: ["1rem", { lineHeight: "1.6" }],
      },
      screens: { "2xl": "1440px" },
      spacing: {
        "gutter-sm": "16px",
        "gutter-md": "24px",
      },
      maxWidth: { content: "1440px" },
      gridTemplateColumns: {
        2: "repeat(2, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};

export default config;
