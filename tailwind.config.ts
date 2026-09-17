import type { Config } from "tailwindcss";

// Cores vêm dos tokens em globals.css (claro/escuro), por isso não há variantes `dark:` nos componentes.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        surface: {
          DEFAULT: token("surface"),
          2: token("surface-2"),
        },
        line: token("line"),
        ink: {
          DEFAULT: token("ink"),
          muted: token("ink-muted"),
        },
        brand: {
          DEFAULT: token("brand"),
          strong: token("brand-strong"),
          soft: token("brand-soft"),
          ink: token("brand-ink"),
        },
        accent: token("accent"),
        danger: {
          DEFAULT: token("danger"),
          soft: token("danger-soft"),
        },
      },
      boxShadow: {
        card: "0 24px 60px -24px rgb(15 23 42 / 0.28), 0 2px 8px rgb(15 23 42 / 0.06)",
        bubble: "0 1px 2px rgb(15 23 42 / 0.06)",
        float: "0 8px 24px -8px rgb(15 23 42 / 0.35)",
      },
      keyframes: {
        "message-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "message-in": "message-in 220ms ease-out both",
        "fade-in": "fade-in 300ms ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
