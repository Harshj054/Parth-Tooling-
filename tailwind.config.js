/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070A0F',
        graphite: '#0B111A',
        panel: '#111A26',
        'panel-2': '#0E1620',
        line: '#1E2C3B',
        'line-bright': '#2C3E52',
        arc: {
          DEFAULT: '#3DA0FF',
          bright: '#6FBBFF',
          dim: '#1E5C99',
          deep: '#0B2A47',
        },
        ember: {
          DEFAULT: '#FF6B2C',
          bright: '#FF8A54',
          dim: '#B24417',
        },
        fg: '#E7EDF6',
        muted: '#8A99AD',
        faint: '#586778',
        destructive: '#F2555A',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        container: '1200px',
        prose: '68ch',
      },
      boxShadow: {
        'glow-arc': '0 0 0 1px rgba(61,160,255,0.30), 0 12px 40px -12px rgba(61,160,255,0.40)',
        'glow-ember': '0 0 0 1px rgba(255,107,44,0.30), 0 12px 40px -10px rgba(255,107,44,0.35)',
        panel: '0 24px 60px -28px rgba(0,0,0,0.85)',
        'inset-line': 'inset 0 1px 0 0 rgba(255,255,255,0.04)',
      },
      backgroundImage: {
        'steel-panel':
          'linear-gradient(155deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 22%, rgba(0,0,0,0.20) 100%)',
        'arc-sheen':
          'linear-gradient(100deg, transparent 20%, rgba(61,160,255,0.10) 50%, transparent 80%)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spark-rise': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(-120px) scale(0.2)', opacity: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'sweep-y': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(220%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'drift-a': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(8%, -6%) scale(1.18)' },
        },
        'drift-b': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.12)' },
          '50%': { transform: 'translate(-7%, 6%) scale(1)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'pulse-soft': 'pulse-soft 3.2s ease-in-out infinite',
        'sweep-y': 'sweep-y 4.5s ease-in-out infinite',
        'spark-rise': 'spark-rise 3s ease-out infinite',
        float: 'float 6s ease-in-out infinite',
        'drift-a': 'drift-a 20s ease-in-out infinite',
        'drift-b': 'drift-b 26s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
