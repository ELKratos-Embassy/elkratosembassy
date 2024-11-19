import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD2A4',
        'primary-hover': '#F2C79B',
        secondary: '#0D0D0D',
        'secondary-black': '#161722',
        'secondary-orange': '#FFF5EB',
        grey: '#F5F2F0',
        'light-orange': '#FFF5EB',
      },
      backgroundColor: {
        gradient: 'linear-gradient(#A54E2B, DC9853)',
      },
      fontSize: {
        h1: '64px',
        h2: '48px',
        h3: '40px',
        h4: '32px',
        h5: '24px',
        h6: '16px',
        btn: ['16px', '16px'],
      },
      backdropBlur: {
        '4xl': '80px',
      },

      // borderRadius: {
      // 	lg: 'var(--radius)',
      // 	md: 'calc(var(--radius) - 2px)',
      // 	sm: 'calc(var(--radius) - 4px)'
      // }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
