/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--bg) / <alpha-value>)',
        canvas2: 'rgb(var(--bg-secondary) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
        ink: 'rgb(var(--text) / <alpha-value>)',
        'ink-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-2': 'rgb(var(--accent-secondary) / <alpha-value>)',
        'accent-contrast': 'rgb(var(--accent-contrast) / <alpha-value>)',
        line: 'rgb(var(--border) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        danger: 'rgb(var(--error) / <alpha-value>)',
        signal: 'rgb(var(--signal) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        theme: 'var(--shadow)',
      },
    },
  },
  plugins: [],
};
