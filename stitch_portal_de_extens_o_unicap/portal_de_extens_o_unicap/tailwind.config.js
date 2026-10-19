import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * A paleta do portal vive no index.html (:root { --color-*: #hex }).
 * Ler de lá mantém uma fonte única para o CSS puro e para o Tailwind e, ao usar
 * os valores hexadecimais (em vez de var()), habilita utilitários com opacidade
 * como `bg-error-container/40` e `bg-surface-container-lowest/90`, que o Tailwind
 * descarta quando a cor é uma variável sem <alpha-value>.
 */
function readColorPalette() {
  const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
  const palette = {};
  for (const match of html.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8});/g)) {
    palette[match[1]] = match[2];
  }
  if (Object.keys(palette).length === 0) {
    throw new Error(
      "Paleta --color-* não encontrada em index.html: verifique os tokens do :root."
    );
  }
  return palette;
}

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: readColorPalette(),
      borderRadius: {
        DEFAULT: "var(--radius-DEFAULT)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)"
      },
      spacing: {
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        "headline-xl": ["var(--font-headline-xl)"],
        "headline-xl-mobile": ["var(--font-headline-xl-mobile)"],
        "headline-lg": ["var(--font-headline-lg)"],
        "headline-md": ["var(--font-headline-md)"],
        "headline-sm": ["var(--font-headline-sm)"],
        "body-lg": ["var(--font-body-lg)"],
        "body-md": ["var(--font-body-md)"],
        "body-sm": ["var(--font-body-sm)"],
        "label-lg": ["var(--font-label-lg)"],
        "label-md": ["var(--font-label-md)"],
        "label-sm": ["var(--font-label-sm)"]
      },
      fontSize: {
        display: ["var(--font-size-display)"],
        "headline-xl": ["var(--font-size-headline-xl)"],
        "headline-xl-mobile": ["var(--font-size-headline-xl-mobile)"],
        "headline-lg": ["var(--font-size-headline-lg)"],
        "headline-md": ["var(--font-size-headline-md)"],
        "headline-sm": ["var(--font-size-headline-sm)"],
        "body-lg": ["var(--font-size-body-lg)"],
        "body-md": ["var(--font-size-body-md)"],
        "body-sm": ["var(--font-size-body-sm)"],
        "label-lg": ["var(--font-size-label-lg)"],
        "label-md": ["var(--font-size-label-md)"],
        "label-sm": ["var(--font-size-label-sm)"]
      }
    }
  },
  plugins: []
};
