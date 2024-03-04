import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  corePlugins: {
    // xoá container
    container: false
  },
  theme: {
    extend: {
      colors: {
        primary: '#3BB77E',
        secondary: '#253D4E'
      },
      screens: {
        xs: '480px'
      },
      keyframes: {
        loadingFade: {
          '0%': { opacity: 0 },
          '50%': { opacity: 0.8 },
          '100%': { opacity: 0 }
        }
      },
      animation: {
        loadingFade: 'loadingFade 1s infinite'
      },
      dropShadow: {
        1: '0px 1px 0px #E2E8F0',
        2: '0px 1px 4px rgba(0, 0, 0, 0.12)'
      },
      zIndex: {
        999999: '999999',
        99999: '99999',
        9999: '9999',
        999: '999',
        99: '99',
        9: '9',
        1: '1'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
    })
  ]
}
