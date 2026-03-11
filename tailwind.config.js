/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Derived directly from the Confluence Colorado logo
        'cc-navy':  '#004667', // primary — nav, footer, headings
        'cc-sky':   '#009dd6', // secondary — CTAs, links, accents
        'cc-orange':'#b44b00', // accent — highlights, donate button
        // Supporting palette derived from the logo colors + Colorado landscape
        'cc-sage':  '#4A6741', // foothills green
        'cc-sand':  '#F5E6D3', // warm neutral — card backgrounds
        'cc-mist':  '#E8F4F9', // very light sky — section backgrounds
        'cc-dark':  '#0D2137', // near-black navy — deep backgrounds, hero sky
        'cc-stone': '#6B7280', // muted grey — secondary text
      },
      fontFamily: {
        display: ['Jost', 'sans-serif'],
        body:    ['"Source Sans 3"', 'sans-serif'],
        accent:  ['Bitter', 'serif'],
      },
      letterSpacing: {
        display: '0.08em',
        poster:  '0.15em',
      },
      backgroundImage: {
        'dawn-sky': 'linear-gradient(to bottom, #0D2137 0%, #1B3A52 30%, #7A5C4A 65%, #C4754A 85%, #E8A870 100%)',
        'dusk-sky': 'linear-gradient(to bottom, #0D2137 0%, #1B2E4A 40%, #4A2E5C 70%, #8A4A3A 90%, #C47050 100%)',
      },
    },
  },
  plugins: [],
}
