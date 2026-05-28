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
        'cc-sky':   '#009dd6', // River Blue — large display/decorative + brand accents
        'cc-orange':'#b44b00', // Burnt Copper — donate button, highlights
        // Accessible River Blue shades for small text (cc-sky is too mid-tone to meet
        // AA at body sizes against either white or navy).
        'cc-sky-ink':    '#006d94', // sky text on light backgrounds (AA ≥ 4.5:1)
        'cc-sky-bright': '#5cc3ea', // sky text on navy/dark backgrounds (AA ≥ 4.5:1)
        // Complementary palette — Colorado landscape
        'cc-sage':  '#6B8F71', // Sage — nature/growth accents (large/decorative)
        'cc-sage-ink': '#4a6b51', // sage text on light backgrounds (AA ≥ 4.5:1)
        'cc-clay':  '#7a4a28', // Clay — earthy brown (Public Health/urban-ag area); AA both ways on light
        'cc-sand':  '#F5E6D3', // Sandstone — card backgrounds, warm neutral
        'cc-slate': '#2C3E50', // Slate — dark sections, footer
        'cc-warm':  '#F8F4F0', // Warm Gray — alternate section backgrounds
        'cc-dark':  '#1A1A2E', // Dark — high-contrast text
        'cc-stone': '#5b626e', // Mid Gray — secondary text, captions (AA on white/warm/sand)
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
