import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontSize: {
      '16': '16px',
      '14': '14px',
      '18': '18px',
      '24': '24px',
      '26': '26px',
      '32': '32px',
      '40': '40px',
    },
    colors: {
      'black-10': 'rgba(0,0,0,.4)',
      'white': '#ffffff',
      'gray-10': '#F6F6F6',
      'gray-20': '#ECECEC',
      'gray-30': '#D9D9D9',
      'gray-50': '#717171',
      'gray-60': '#3C3C3C',
      'green-10': '#EFF5F5',
      'green-20': '#D6E4E5',
      'green-50': '#497174',
      'orange-50': '#EB6440',
      'genre-red': '#932626',
      'genre-purple': '#710084',
      'genre-blue': '#111673',
      'genre-pink': '#9B0079',
      'genre-orange': '#C55301',
      'genre-cyan': '#059595',
    },
    extend: {
      maxWidth: {
        'desktop': '1440px',
        '94': '94px'
      },
      width: {
        '13': '50px'
      },
      height: {
        '13': '50px'
      },
      borderRadius: {
        '50p': '50%',
        '4px': '4px'
      },
      spacing: {
        '6p': '6px',
        '7p': '7px',
        '10l': '-10px'
      },
      flexBasis: {
        'auto': 'auto'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        scale: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        scaleReverse: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' },
        }
      },
      animation: {
        scale: 'scale .2s ease-in-out',
        scaleReverse: 'scaleReverse .2s ease-in-out',
      },
      boxShadow: {
        'card-15': '1px 1px 6px rgba(0,0,0,.15)'
      }
    },
  },
  plugins: [
  ],
}
export default config
