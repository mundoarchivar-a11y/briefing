/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: '#08080a',
        bg: '#0c0c10',
        surface: '#131318',
        elevated: '#1a1a20',
        subtle: '#22222a',
        hairline: '#26262e',
        accent: '#ff7a1a',
        pos: '#5fc081',
        alert: '#e57161',
        info: '#7aa9e6',
        cool: '#a994f0',
      },
      fontFamily: {
        serif: ['Newsreader_400Regular'],
        'serif-italic': ['Newsreader_400Regular_Italic'],
        'serif-semibold': ['Newsreader_600SemiBold'],
        sans: ['System'],
        mono: ['SpaceMono'],
      },
    },
  },
};
