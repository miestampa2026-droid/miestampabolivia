import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1280px' }
    },
    extend: {
      colors: {
        coral: {
          DEFAULT: 'var(--color-coral)',
          dark: 'var(--color-coral-dark)',
          light: 'var(--color-coral-light)'
        },
        charcoal: 'var(--color-charcoal)',
        'gray-mid': 'var(--color-gray-mid)',
        'gray-light': 'var(--color-gray-light)',
        'off-white': 'var(--color-off-white)',
        'brand-success': 'var(--color-success)',
        'brand-warning': 'var(--color-warning)',
        'brand-error': 'var(--color-error)',
        'brand-info': 'var(--color-info)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        full: '999px'
      },
      boxShadow: {
        'card-sm': 'var(--shadow-sm)',
        'card-md': 'var(--shadow-md)',
        'card-lg': 'var(--shadow-lg)'
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.16, 1, 0.3, 1)'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        marquee: 'marquee 24s linear infinite',
        fadeUp: 'fadeUp 0.7s ease-out both'
      }
    }
  },
  plugins: [animate]
}

export default config
