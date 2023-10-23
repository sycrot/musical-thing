import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

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
      '36': '36px',
      '40': '40px',
    },
    colors: {
      'transparent': 'transparent',
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
        '94': '94px',
        '190': '190px',
        '195': '195px',
      },
      width: {
        '13': '50px',
        '15p': '15px',
        '17p': '17px',
        '170': '170px',
        '120': '120px',
        '430': '430px',
        '60': '60px',
        '70': '70px',
      },
      height: {
        '13': '50px',
        '170': '170px',
        '120': '120px',
        '190': '190px',
        '600': '600px',
        '70': '70px',
      },
      borderRadius: {
        '50p': '50%',
        '4px': '4px',
        '5px': '5px'
      },
      spacing: {
        '6p': '6px',
        '7p': '7px',
        '10l': '-10px',
        '10p': '10px',
        '50p': '50%',
      },
      flexBasis: {
        'auto': 'auto'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      keyframes: {
        scale: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        scaleReverse: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' },
        },
        buttonPlaylist: {
          '0%': { transform: 'translateY(60px)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideText: {
          '0%': { transform: 'translateX(0)' },
          '30%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        buttonFollow: {
          '0%': { 
            transform: 'scale(1) rotate(0)'
          },
          '10%': { 
            transform: 'rotate(-0.04turn)'
          },
          '20%': { 
            transform: 'rotate(0.04turn)'
          },
          '30%': { 
            transform: 'scale(1.1) rotate(-0.04turn)'
          },
          '40%': { 
            transform: 'scale(1.1) rotate(0.04turn)'
          },
          '50%': { 
            transform: 'scale(1.1) rotate(-0.04turn)'
          },
          '60%': { 
            transform: 'scale(1.1) rotate(0.04turn)'
          },
          '70%': { 
            transform: 'rotate(-0.04turn)'
          },
          '80%': { 
            transform: 'rotate(0.04turn)'
          },
          '100%': { 
            transform: 'scale(1) rotate(0)'
          },
        },
      },
      animation: {
        scale: 'scale .2s ease-in-out',
        scaleReverse: 'scaleReverse .2s ease-in-out',
        buttonPlaylist: 'buttonPlaylist .2s ease-in-out',
        slideText: 'slideText 7s infinite linear',
        buttonFollow: 'buttonFollow .8s',
      },
      boxShadow: {
        'card-15': '1px 1px 6px rgba(0,0,0,.15)'
      },
      gridTemplateColumns: {
        'playlist': '3.5rem auto',
        'musicItem': '2.75rem auto',
        'playlistSlide': '15rem auto',
        'player': '7.5rem auto auto',
        'playlistPage': '10.625rem auto'
      },
      padding: {
        '10p': '10px',
      },
      textShadow: {
        'sm': '0 1px 10px var(--tw-shadow-color)',
      },
      dropShadow: {
        'icon': '0 1px 4px rgba(0,0,0,.7)'
      },
      inset: {
        '34': '8.2rem'
      }
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}
export default config
