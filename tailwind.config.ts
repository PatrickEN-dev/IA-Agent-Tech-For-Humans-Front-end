import type { Config } from "tailwindcss";

// Cores vêm dos tokens em globals.css.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "IBM Plex Sans", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        canvas: token("canvas"),
        surface: {
          DEFAULT: token("surface"),
          muted: token("surface-muted"),
        },
        line: {
          DEFAULT: token("line"),
          strong: token("line-strong"),
        },
        ink: {
          DEFAULT: token("ink"),
          muted: token("ink-muted"),
        },
        navy: {
          DEFAULT: token("navy"),
          hover: token("navy-hover"),
          tint: token("navy-tint"),
        },
        accent: token("accent"),
        success: token("success"),
        danger: {
          DEFAULT: token("danger"),
          tint: token("danger-tint"),
        },
      },
      borderRadius: {
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 160ms ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
