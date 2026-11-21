import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/data/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
    './src/i18n/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: 'rgb(var(--slate-950) / <alpha-value>)',
          925: 'rgb(var(--slate-925) / <alpha-value>)',
          900: 'rgb(var(--slate-900) / <alpha-value>)',
          850: 'rgb(var(--slate-850) / <alpha-value>)',
          800: 'rgb(var(--slate-800) / <alpha-value>)',
          700: 'rgb(var(--slate-700) / <alpha-value>)',
          600: 'rgb(var(--slate-600) / <alpha-value>)',
          500: 'rgb(var(--slate-500) / <alpha-value>)',
          400: 'rgb(var(--slate-400) / <alpha-value>)',
          300: 'rgb(var(--slate-300) / <alpha-value>)',
          200: 'rgb(var(--slate-200) / <alpha-value>)',
          100: 'rgb(var(--slate-100) / <alpha-value>)',
          50: 'rgb(var(--slate-50) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
