import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Full-viewport parallax hero with 5 stacked SVG landscape layers.
 * Visual style: WPA/National Park poster meets Colorado Front Range at dawn.
 *
 * Layer order (back → front):
 *  1. Sky — CSS gradient (dawn colors)
 *  2. Far mountains — Rocky Mountain 14ers silhouette, steel blue
 *  3. Foothills — Front Range rolling hills, sage pine
 *  4. Treeline — ponderosa pine ridge, dark green
 *  5. City skyline — simplified Denver silhouette, brand navy
 *  6. Foreground — South Platte riverbank, near-black
 *
 * Parallax: layers further away translate less on scroll (slower),
 * creating the Firewatch depth illusion. Disabled for prefers-reduced-motion.
 */
export default function ParallaxHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  })

  // Each layer moves upward as user scrolls. Far layers move least (slower).
  const mountainY  = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-8%'])
  const foothillY  = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-16%'])
  const treelineY  = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-26%'])
  const skylineY   = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-20%'])
  const foregroundY= useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-38%'])
  const textY      = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-25%'])

  return (
    // Wrapper creates scroll room; hero sticks to top within it
    <div ref={wrapperRef} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-cc-dark">

        {/* ── Sky — CSS dawn gradient ── */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #0D2137 0%, #1B3A52 25%, #4A6A7A 50%, #7A5A42 75%, #C4754A 90%, #E8A060 100%)',
          }}
          aria-hidden="true"
        />

        {/* ── Stars / pre-dawn atmosphere ── */}
        <div className="absolute inset-0 opacity-40" aria-hidden="true">
          <svg viewBox="0 0 1440 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {/* A handful of stars in the upper sky */}
            {[
              [120,60],[280,35],[440,80],[620,25],[750,55],[920,40],[1080,70],[1250,30],[1380,60],
              [200,120],[500,100],[840,90],[1150,115],[350,145],[700,130],[1050,140],[180,180],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="1.5" fill="white" opacity={0.6 + (i % 3) * 0.15} />
            ))}
          </svg>
        </div>

        {/* ── Layer 1: Far mountains — Rocky Mountain 14ers ── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{ y: mountainY }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 w-full h-full"
          >
            <path
              fill="#5B7A94"
              opacity="0.9"
              d="M0,900 V440 Q60,390 110,360 Q170,325 210,290 Q250,255 290,230 Q335,200 380,180 Q425,155 465,175 Q510,195 545,165 Q590,130 635,105 Q685,75 730,100 Q770,120 810,90 Q858,55 905,80 Q950,105 990,75 Q1035,42 1085,70 Q1130,95 1175,75 Q1220,52 1265,85 Q1310,115 1350,100 Q1390,85 1440,130 V900 Z"
            />
            {/* Snow caps on tallest peaks */}
            <path
              fill="white"
              opacity="0.35"
              d="M625,105 Q650,90 670,100 Q660,115 645,120 Z M720,100 Q745,78 765,88 Q755,105 735,110 Z M895,80 Q920,58 940,70 Q930,88 912,92 Z M1075,70 Q1098,48 1118,60 Q1108,78 1090,82 Z"
            />
          </svg>
        </motion.div>

        {/* ── Layer 2: Foothills — Front Range rolling hills ── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{ y: foothillY }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 w-full h-full"
          >
            <path
              fill="#3D5E42"
              d="M0,900 V560 Q120,520 250,530 Q380,540 480,510 Q580,480 680,495 Q780,510 900,498 Q1020,485 1140,500 Q1260,515 1360,508 Q1400,505 1440,515 V900 Z"
            />
          </svg>
        </motion.div>

        {/* ── Layer 3: Treeline — ponderosa pine ridge ── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{ y: treelineY }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 w-full h-full"
          >
            {/* Main ridge base */}
            <path
              fill="#1E3620"
              d="M0,900 V640 Q60,630 120,620 Q180,610 240,620 Q300,630 360,615 Q420,600 480,610 Q540,620 600,608 Q660,596 720,606 Q780,616 840,604 Q900,592 960,602 Q1020,612 1080,600 Q1140,588 1200,598 Q1260,608 1320,598 Q1380,588 1440,600 V900 Z"
            />
            {/* Pine tree silhouettes along the ridge */}
            <g fill="#162B18">
              {/* Groups of 3 trees at varying heights */}
              <polygon points="80,640 95,600 110,640" />
              <polygon points="100,640 118,595 136,640" />
              <polygon points="125,640 140,608 155,640" />

              <polygon points="220,625 235,582 250,625" />
              <polygon points="245,625 262,578 279,625" />

              <polygon points="370,618 385,575 400,618" />
              <polygon points="395,618 412,570 429,618" />
              <polygon points="420,618 435,580 450,618" />

              <polygon points="530,612 548,565 566,612" />
              <polygon points="558,612 575,568 592,612" />

              <polygon points="680,608 698,562 716,608" />
              <polygon points="710,608 727,568 744,608" />
              <polygon points="735,608 750,575 765,608" />

              <polygon points="840,605 858,558 876,605" />
              <polygon points="868,605 885,562 902,605" />

              <polygon points="990,602 1008,555 1026,602" />
              <polygon points="1018,602 1035,560 1052,602" />
              <polygon points="1045,602 1060,570 1075,602" />

              <polygon points="1150,598 1168,552 1186,598" />
              <polygon points="1178,598 1195,558 1212,598" />

              <polygon points="1300,598 1318,552 1336,598" />
              <polygon points="1330,598 1347,558 1364,598" />
              <polygon points="1358,598 1375,562 1392,598" />
            </g>
          </svg>
        </motion.div>

        {/* ── Layer 4: Denver city skyline ── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{ y: skylineY }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 w-full h-full"
          >
            {/* Simplified Denver skyline silhouette — rises toward center (downtown) */}
            <path
              fill="#004667"
              d="
                M0,900 V760
                H60 V740 H80 V720 H100 V710 H120 V695 H140 V680 H160 V660
                H175 V645 H190 V628 H205 V610 H220 V595 H235 V578
                H248 V560 H260 V540 H272 V520 H284 V505
                H295 V490 H305 V475 H315 V458
                H325 V440 H332 V420 H339 V400 H346 V382
                H353 V362 H360 V340 H367 V320
                H374 V300 H381 V280
                H388 V265 H394 V250 H400 V235
                H404 V222 H408 V210
                H412 V222 H416 V235
                H422 V250 H428 V265
                H434 V280
                H440 V300 H447 V320
                H454 V340 H461 V362
                H468 V380 H475 V400
                H482 V420 H490 V440
                H498 V460 H508 V478
                H518 V495 H530 V510
                H545 V525 H562 V540
                H580 V555 H600 V568
                H622 V580 H645 V592
                H670 V605 H698 V618
                H728 V630 H760 V643
                H798 V658 H840 V672
                H890 V686 H945 V700
                H1005 V715 H1065 V728
                H1130 V742 H1200 V752
                H1270 V762 H1340 V772
                H1440 V900 Z
              "
            />
          </svg>
        </motion.div>

        {/* ── Layer 5: Foreground — South Platte riverbank ── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[30%]"
          style={{ y: foregroundY }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 280"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 w-full h-full"
          >
            {/* River — bright blue strip */}
            <path
              fill="#009dd6"
              opacity="0.7"
              d="M0,280 V200 Q180,180 360,188 Q540,196 720,182 Q900,168 1080,178 Q1260,188 1440,180 V280 Z"
            />
            {/* River shimmer */}
            <path
              fill="white"
              opacity="0.15"
              d="M80,192 Q200,184 320,190 Q240,196 80,200 Z M600,183 Q720,175 840,181 Q760,187 600,191 Z M1100,180 Q1220,172 1340,178 Q1260,184 1100,188 Z"
            />
            {/* Dark foreground bank */}
            <path
              fill="#0A1A0C"
              d="M0,280 V230 Q200,218 400,225 Q600,232 720,220 Q840,208 1040,218 Q1240,228 1440,222 V280 Z"
            />
          </svg>
        </motion.div>

        {/* ── Hero text content ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
          style={{ y: textY }}
        >
          {/* Subtle dark overlay for text legibility */}
          <div className="absolute inset-0 bg-cc-dark/30" aria-hidden="true" />

          <div className="relative max-w-4xl mx-auto">
            {/* Pre-heading label */}
            <p className="font-display font-semibold text-xs md:text-sm uppercase tracking-poster text-cc-sky mb-4 md:mb-6">
              Denver, Colorado · Est. 2022
            </p>

            {/* Main headline */}
            <h1 className="font-display font-bold uppercase text-white leading-none mb-4 md:mb-6"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', letterSpacing: '0.06em' }}
            >
              {/* TODO: Replace with verbatim mission statement from Shane */}
              At the{' '}
              <span className="text-cc-sky">Confluence</span>
              <br />
              of People &amp; Place
            </h1>

            {/* Mission statement */}
            <p className="font-body text-white/85 text-base md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10">
              {/* TODO: Replace with verbatim mission from confluenceco.org */}
              Connecting Denver's underserved youth to land, water, and community
              through environmental stewardship and outdoor education.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/programs"
                className="btn-white text-base px-8 py-4"
              >
                Explore Programs
              </Link>
              <Link
                to="/donate"
                className="bg-cc-orange text-white font-display font-bold uppercase tracking-display text-base px-8 py-4 rounded transition-all duration-200 hover:bg-white hover:text-cc-orange"
              >
                Support Our Work
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2" aria-hidden="true">
          <span className="font-display text-xs uppercase tracking-poster text-white/50">Scroll</span>
          <motion.div
            animate={reduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
