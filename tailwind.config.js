/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta Dark Cyber-Chicano
        background: {
          DEFAULT: '#0D0D0D', // Grafite envelhecido principal
          deep: '#070707',
          surface: '#141414',
        },
        card: {
          DEFAULT: 'rgba(10, 10, 10, 0.85)', // Cinza esfumado opaco (Glassmorphism)
          border: '#262626', // Neutral-800
          hover: 'rgba(23, 23, 23, 0.90)',
        },
        chrome: {
          light: '#F5F5F5',
          DEFAULT: '#C0C0C0', // Prata metálico / Cromo
          dark: '#737373',
          border: '#404040',
        },
        cyber: {
          red: '#8A0303', // Tinta carmesim / Sangue
          gold: '#C5A059', // Ouro envelhecido Lowrider
          cyan: '#00F0FF', // Detalhe Cyber sutil
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        blackletter: ['"UnifrakturMaguntia"', '"Pirata One"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'lowrider': '0 10px 30px -10px rgba(0, 0, 0, 0.8), inset 0 1px 1px 0 rgba(192, 192, 192, 0.15)',
        'chrome-glow': '0 0 15px rgba(192, 192, 192, 0.25), 0 0 5px rgba(255, 255, 255, 0.1)',
        'cyber-red-glow': '0 0 20px rgba(138, 3, 3, 0.4)',
        'inner-metallic': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 0 rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'metallic-gradient': 'linear-gradient(135deg, #262626 0%, #0D0D0D 50%, #1A1A1A 100%)',
        'chrome-shine': 'linear-gradient(90deg, transparent, rgba(192, 192, 192, 0.15), transparent)',
      },
      transitionTimingFunction: {
        'm3-standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'm3-emphasized': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        'm3-decelerate': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.05, 0.7, 0.1, 1) forwards',
        'fade-in-up': 'fade-in-up 0.25s cubic-bezier(0.2, 0, 0, 1) forwards',
        'pulse-glow': 'pulse-glow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
