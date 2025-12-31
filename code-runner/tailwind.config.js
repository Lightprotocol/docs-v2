/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "ch-background": "var(--ch-background)",
        "ch-foreground": "var(--ch-foreground)",
        "ch-border": "var(--ch-border)",
        "ch-tabs-background": "var(--ch-tabs-background)",
        "ch-tab-active-foreground": "var(--ch-tab-active-foreground)",
        "ch-tab-inactive-foreground": "var(--ch-tab-inactive-foreground)",
        "ch-active-border": "var(--ch-active-border)",
        "ch-selection": "var(--ch-selection)",
      },
    },
  },
  plugins: [],
};
