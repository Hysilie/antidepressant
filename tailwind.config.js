/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

export const content = ['./src/renderer/src/**/*.{js,ts,jsx,tsx}', './index.html']
export const darkMode = 'class'
export const theme = {
  extend: {
    colors: {
      primary: 'var(--primary)',
      surface: 'var(--surface)',
      text: 'var(--text)',
      muted: 'var(--muted)',
      background: 'var(--bg)'
    }
  },
  fontFamily: {
    title: ['"Lilita One"', 'cursive'],
    body: ['"Quicksand"', 'sans-serif'],
    accent: ['"Patrick Hand"', 'cursive']
  }
}
export const plugins = [
  plugin(function ({ addUtilities }) {
    addUtilities({
      '.bg-primary': {
        backgroundColor: 'var(--primary)'
      },
      '.text-primary': {
        color: 'var(--primary)'
      },
      '.border-primary': {
        borderColor: 'var(--primary)'
      }
    })
  })
]
