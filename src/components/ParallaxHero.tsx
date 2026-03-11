import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Firewatch-style parallax hero.
 *
 * Composition (back → front), inspired by Firewatch key art:
 *   Sky → Rocky Mountain peaks (background) → Mid forest ridge →
 *   Dark foothills → South Platte River (middle ground) →
 *   Denver skyline silhouette (FOREGROUND — replaces "guy on ledge")
 *
 * Denver skyline key landmarks:
 *   Wells Fargo Center "Cash Register": x≈520–582, arch crown at y≈475
 *   Republic Plaza (tallest): x≈602–662, peak at y≈452 with stepped crown
 *
 * Text floats in the sky zone (upper ~40% of frame) above the city silhouette.
 */
export default function ParallaxHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  })

  const r = (v: string) => (reduced ? '0px' : v)

  // Distant layers barely move; the foreground city flies upward on scroll.
  const mountainY = useTransform(scrollYProgress, [0, 1], ['0px', r('-45px')])
  const midRidgeY = useTransform(scrollYProgress, [0, 1], ['0px', r('-130px')])
  const foothillY = useTransform(scrollYProgress, [0, 1], ['0px', r('-250px')])
  const riverY    = useTransform(scrollYProgress, [0, 1], ['0px', r('-370px')])
  const skylineY  = useTransform(scrollYProgress, [0, 1], ['0px', r('-560px')])
  const textY     = useTransform(scrollYProgress, [0, 1], ['0px', r('-200px')])

  return (
    <div ref={wrapperRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── SKY — dawn alpenglow gradient ── */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'linear-gradient(to bottom,',
              '#040A14 0%,',
              '#091522 12%,',
              '#10213A 26%,',
              '#1A2E50 40%,',
              '#3A2840 56%,',
              '#7A3818 72%,',
              '#C05015 86%,',
              '#E07828 100%)',
            ].join(' '),
          }}
          aria-hidden="true"
        />

        {/* ── STARS ── */}
        <div className="absolute inset-0 opacity-50" aria-hidden="true">
          <svg viewBox="0 0 1440 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {[
              [88,40],[192,22],[315,54],[462,16],[588,38],[734,24],[876,46],[1024,30],[1162,52],[1302,18],[1408,42],
              [148,92],[395,74],[638,86],[862,66],[1098,80],[1338,68],
              [248,130],[502,112],[754,104],[994,124],[1245,108],
              [64,162],[330,154],[598,146],[862,160],[1126,150],[1390,164],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i < 11 ? 2 : 1.5} fill="white"
                opacity={0.3 + (i % 4) * 0.15} />
            ))}
          </svg>
        </div>

        {/* ── LAYER 1: Far Rocky Mountains — Front Range 14ers ── */}
        <motion.div className="absolute inset-0" style={{ y: mountainY }} aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
            {/* Atmospheric haze — furthest ghost ridge */}
            <path
              fill="#4A6E88"
              opacity="0.55"
              d="M 0,900 V 490 Q 180,458 360,472 Q 540,486 720,460 Q 900,434 1080,452 Q 1260,470 1440,458 V 900 Z"
            />
            {/* Main peaks */}
            <path
              fill="#6A8EA8"
              d="M -60,900 V 510
                L 0,490 L 48,448 L 88,398 L 118,355 L 148,384
                L 182,322 L 218,260 L 252,298
                L 288,235 L 324,175 L 360,198
                L 394,144 L 430,95 L 456,128
                L 478,76 L 504,46 L 530,70
                L 556,38 L 582,56 L 614,28
                L 640,52 L 668,24 L 695,56
                L 720,88 L 750,56 L 780,92
                L 812,118 L 848,84 L 885,122
                L 920,152 L 957,118 L 995,155
                L 1032,182 L 1070,150 L 1110,185
                L 1150,215 L 1192,184 L 1232,222
                L 1272,252 L 1312,225 L 1354,262
                L 1398,288 L 1440,312
                V 900 Z"
            />
            {/* Snow caps on tallest central peaks */}
            <g fill="white" opacity="0.78">
              <polygon points="478,76  506,124  450,124" />
              <polygon points="504,46  534,98   474,98"  />
              <polygon points="556,38  588,92   524,92"  />
              <polygon points="614,28  646,84   582,84"  />
              <polygon points="668,24  700,80   636,80"  />
              <polygon points="720,88  752,130  688,130" />
              <polygon points="750,56  782,106  718,106" />
            </g>
          </svg>
        </motion.div>

        {/* ── LAYER 2: Mid Forest Ridge — dark pine silhouette ── */}
        <motion.div className="absolute inset-0" style={{ y: midRidgeY }} aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
            {/* Fog band — atmospheric separation between layers */}
            <path
              fill="#1C3A28"
              opacity="0.35"
              d="M 0,630 Q 360,608 720,622 Q 1080,636 1440,622 V 670 Q 1080,656 720,670 Q 360,684 0,670 Z"
            />
            {/* Pine-tooth silhouette — characteristic spruce/fir */}
            <path
              fill="#162E1E"
              d="M -60,900 V 648
                L 0,634   L 18,612  L 36,634
                L 58,620  L 76,598  L 94,620
                L 118,607 L 136,583 L 154,607
                L 180,593 L 198,569 L 216,593
                L 244,579 L 264,555 L 284,579
                L 316,565 L 338,539 L 360,565
                L 395,551 L 417,525 L 439,551
                L 477,537 L 499,511 L 521,537
                L 563,523 L 585,497 L 607,523
                L 651,509 L 673,483 L 695,509
                L 741,495 L 763,469 L 785,495
                L 833,481 L 855,455 L 877,481
                L 927,467 L 949,443 L 971,467
                L 1021,453 L 1043,431 L 1065,453
                L 1115,441 L 1137,423 L 1159,441
                L 1207,453 L 1257,470 L 1307,490
                L 1362,512 L 1412,536 L 1440,553
                V 900 Z"
            />
          </svg>
        </motion.div>

        {/* ── LAYER 3: Dark Foothills ── */}
        <motion.div className="absolute inset-0" style={{ y: foothillY }} aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
            <path
              fill="#0C1810"
              d="M -60,900 V 718
                Q 80,694 200,702
                Q 340,710 480,692
                Q 620,674 760,686
                Q 900,698 1040,682
                Q 1180,666 1320,678
                Q 1400,684 1500,686
                V 900 Z"
            />
          </svg>
        </motion.div>

        {/* ── LAYER 4: South Platte River — bright mid-ground band ── */}
        <motion.div className="absolute inset-0" style={{ y: riverY }} aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
            {/* River glow band */}
            <path
              fill="#009dd6"
              opacity="0.7"
              d="M 0,900 V 778
                Q 240,758 480,768
                Q 720,778 960,762
                Q 1200,746 1440,758
                V 800
                Q 1200,788 960,804
                Q 720,820 480,810
                Q 240,800 0,812
                Z"
            />
            {/* Shimmer highlights */}
            <path fill="white" opacity="0.20"
              d="M 80,770 Q 240,762 400,768 Q 240,774 80,780 Z" />
            <path fill="white" opacity="0.18"
              d="M 560,762 Q 720,754 880,760 Q 720,766 560,772 Z" />
            <path fill="white" opacity="0.16"
              d="M 1040,756 Q 1200,748 1360,754 Q 1200,760 1040,766 Z" />
          </svg>
        </motion.div>

        {/* ── LAYER 5: Denver Skyline — DOMINANT FOREGROUND ──
              The skyline is the closest element, like the ledge+figure in Firewatch.
              It dominates the lower half of the frame as a near-black silhouette.

              Key landmarks (centered around x 520–700):

              WELLS FARGO CENTER "CASH REGISTER" (x 520–582)
              — Body rises to y=535, then two quadratic beziers form the iconic
                curved arch crown, peaking at y≈475 at center x=551.

              REPUBLIC PLAZA (x 602–662, tallest at y=452)
              — Rectangular tower with a small chamfered crown step at y=443.
              — Antenna: 4px line from y=452 up to y=430.
        ── */}
        <motion.div className="absolute inset-0" style={{ y: skylineY }} aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
            <path
              fill="#001420"
              d="M 0,900
                V 828 L 72,828 V 812 L 118,812 V 798
                L 156,798 V 784 L 194,784 V 768
                L 232,768 V 750 L 270,750 V 730
                L 308,730 V 710 L 348,710 V 688
                L 388,688 V 665 L 428,665 V 640
                L 462,640 V 616 L 490,616 V 594
                L 510,594 V 574 L 524,574 V 558
                L 534,558 V 544

                L 520,544 V 535
                Q 520,475 551,475
                Q 582,475 582,535
                V 548 L 592,548 V 534
                L 600,534 V 520 L 608,520 V 508

                L 602,508 V 452
                L 608,452 V 443
                L 614,443 V 452
                L 648,452 V 443
                L 655,443 V 452
                L 662,452 V 462

                L 674,462 V 480 L 690,480 V 498
                L 708,498 V 518 L 727,518 V 539
                L 748,539 V 560 L 770,560 V 582
                L 794,582 V 604 L 820,604 V 625
                L 848,625 V 646 L 878,646 V 665
                L 910,665 V 684 L 945,684 V 701
                L 982,701 V 717 L 1022,717 V 732
                L 1068,732 V 746 L 1120,746 V 759
                L 1178,759 V 772 L 1244,772 V 784
                L 1318,784 V 796 L 1400,796 V 810
                L 1440,810

                V 900 Z"
            />
            {/* Republic Plaza antenna */}
            <line x1="633" y1="452" x2="633" y2="428" stroke="#001420" strokeWidth="5" />
            {/* Wells Fargo — side pilasters at arch base */}
            <rect x="516" y="535" width="6" height="50" fill="#000E18" />
            <rect x="580" y="535" width="6" height="50" fill="#000E18" />
          </svg>
        </motion.div>

        {/* ── TEXT — floats in sky zone above the city silhouette ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center z-10 px-6"
          style={{ y: textY, paddingTop: '10vh' }}
        >
          {/* Radial scrim centered on text area */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 75% 55% at 50% 36%, rgba(4,10,20,0.62) 0%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-5xl mx-auto text-center mt-[4vh]">
            <p className="font-display font-semibold text-xs md:text-sm uppercase tracking-poster text-cc-sky mb-5 md:mb-7">
              Denver, Colorado &nbsp;·&nbsp; Est. 2022
            </p>

            <h1
              className="font-display font-bold uppercase text-white leading-none mb-5 md:mb-7"
              style={{ fontSize: 'clamp(3rem, 9vw, 7rem)', letterSpacing: '0.07em' }}
            >
              At the{' '}
              <span style={{ color: '#009dd6' }}>Confluence</span>
              <br />
              <span style={{ fontSize: '0.7em', letterSpacing: '0.12em' }}>
                of People &amp; Place
              </span>
            </h1>

            <p
              className="font-body text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12"
              style={{ fontSize: 'clamp(1rem, 2.2vw, 1.35rem)' }}
            >
              {/* TODO: Replace with verbatim mission statement from Shane */}
              Connecting Denver's underserved youth to land, water, and community
              through environmental stewardship and outdoor education.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
              <Link
                to="/programs"
                className="font-display font-bold uppercase tracking-display text-cc-navy bg-white px-8 py-4 rounded text-sm md:text-base transition-all duration-200 hover:bg-cc-sand hover:scale-105 shadow-lg"
              >
                Explore Programs
              </Link>
              <Link
                to="/donate"
                className="font-display font-bold uppercase tracking-display text-white px-8 py-4 rounded text-sm md:text-base transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#b44b00' }}
              >
                Support Our Work
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── SCROLL INDICATOR ── */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="font-display font-semibold text-xs uppercase tracking-poster text-white/40">
            Scroll
          </span>
          <motion.svg
            className="w-6 h-6 text-white/30"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
            animate={reduced ? {} : { y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>

      </div>
    </div>
  )
}
