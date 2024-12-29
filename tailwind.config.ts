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
        grey: '#F5F2F099',
        'light-orange': '#FFF5EB',
        'gradient-100': '#A54E2B',
        'gradient-200': '#DC9853',
      },
      backgroundColor: {
        gradient: 'linear-gradient(#A54E2B, DC9853)',
      },
      fontSize: {
        h1: ['clamp(2.5rem, 4vw, 4rem)', '1.2'], // 40px to 64px
        h2: ['clamp(2rem, 3.5vw, 3rem)', '1.2'], // 32px to 48px
        h3: ['clamp(1.75rem, 3vw, 2.5rem)', '1.2'], // 28px to 40px
        h4: ['clamp(1.5rem, 2.5vw, 2rem)', '1.2'], // 24px to 32px
        h5: ['clamp(1.25rem, 2vw, 1.5rem)', '1.2'], // 20px to 24px
        h6: ['clamp(1rem, 1.5vw, 1rem)', '1.2'], // 16px fixed
        btn: ['1rem', '1.2'], // Fixed 16px
      },
      backdropBlur: {
        '4xl': '80px',
      },
      backgroundImage: {
        cta: "url('/cta/bg.svg')",
        'hero-about': "url('/about/hero.png')",
        'hero-sermon': "url('/sermons/hero.png')",
        'hero-contact': "url('/contact/hero.png')",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
