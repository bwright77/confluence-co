/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors — from the Confluence Colorado logo
        'cc-navy':  '#004667', // Deep Teal — nav, footer, headings
        'cc-sky':   '#009dd6', // River Blue — CTAs, links, accents
        'cc-orange':'#b44b00', // Burnt Copper — donate button, highlights
        // Complementary palette — Colorado landscape
        'cc-sage':  '#6B8F71', // Sage — nature/growth accents
        'cc-sand':  '#F5E6D3', // Sandstone — card backgrounds, warm neutral
        'cc-slate': '#2C3E50', // Slate — dark sections, footer
        'cc-warm':  '#F8F4F0', // Warm Gray — alternate section backgrounds
        'cc-dark':  '#1A1A2E', // Dark — high-contrast text
        'cc-stone': '#6B7280', // Mid Gray — secondary text, captions
      },
      fontFamily: {
        display: ['Jost', 'sans-serif'],
        body:    ['Jost', 'sans-serif'],
        accent:  ['Merriweather', 'Georgia', 'serif'],
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
