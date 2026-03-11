import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Firewatch / WPA National Park poster parallax hero.
 *
 * Design intent:
 *  - 300vh wrapper gives 200vh of scroll depth for a dramatic parallax effect.
 *  - Mountains fill ~85% of frame height (peaks at y≈30 in a 900-unit SVG).
 *  - Each layer is a bold flat-color silhouette — no gradients within shapes.
 *  - The Denver skyline is recognizable: Wells Fargo "Cash Register" arch
 *    (quadratic bezier crown) and Republic Plaza stepped rectangular tower.
 *  - Pixel-based parallax offsets create a wide speed differential between
 *    distant mountains (-80px total) and near foreground (-700px total).
 *
 * Layer order (back → front):
 *  Sky → Stars → Far Rockies → Foothills → Treeline → Denver skyline → River/foreground
 */
export default function ParallaxHero() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  })

  const r = (v: string) => (reduced ? '0px' : v)

  // Distant layers move very little; near layers fly upward dramatically.
  // Over 300vh wrapper (≈200vh of effective scroll), these create strong depth.
  const mountainY   = useTransform(scrollYProgress, [0, 1], ['0px', r('-80px')])
  const foothillY   = useTransform(scrollYProgress, [0, 1], ['0px', r('-220px')])
  const treelineY   = useTransform(scrollYProgress, [0, 1], ['0px', r('-420px')])
  const skylineY    = useTransform(scrollYProgress, [0, 1], ['0px', r('-160px')])
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0px', r('-700px')])
  const textY       = useTransform(scrollYProgress, [0, 1], ['0px', r('-260px')])

  return (
    <div ref={wrapperRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── SKY — bold WPA dawn gradient ── */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'linear-gradient(to bottom,',
              '#070E1A 0%,',       // pre-dawn, near black
              '#0E1E32 18%,',      // deep navy
              '#162C48 36%,',      // atmospheric blue
              '#2E3C5C 54%,',      // slate
              '#7A3E22 72%,',      // warm horizon begins
              '#C45818 86%,',      // deep orange alpenglow
              '#E07020 95%,',      // bright amber
              '#F08030 100%)',     // horizon glow
            ].join(' '),
          }}
          aria-hidden="true"
        />

        {/* ── STARS — pre-dawn sky ── */}
        <div className="absolute inset-0 opacity-60" aria-hidden="true">
          <svg viewBox="0 0 1440 900" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {[
              [88,30],[192,18],[315,44],[462,12],[588,34],[734,20],[876,42],[1024,28],[1162,48],[1302,16],[1408,38],
              [148,88],[395,72],[638,84],[862,66],[1098,80],[1338,68],
              [248,128],[502,110],[754,102],[994,122],[1245,108],
              [62,160],[328,152],[596,144],[860,158],[1124,148],[1388,162],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={i < 11 ? 2 : 1.5} fill="white"
                opacity={0.4 + (i % 4) * 0.15} />
            ))}
          </svg>
        </div>

        {/* ── LAYER 1: Far Rocky Mountains — dramatic peaks, WPA steel blue ──
              Peaks reach y≈22–160 (top 2–18% of frame).
              Jagged angular profile of the Front Range 14ers.             ── */}
        <motion.div className="absolute inset-0" style={{ y: mountainY }} aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice"
            className="absolute inset-0 w-full h-full">
            {/* Main range */}
            <path
              fill="#4A7BAA"
              d="
                M -100,900 V 480
                L 0,458 L 38,398 L 68,352 L 92,406
                L 124,344 L 168,258 L 196,302
                L 224,232 L 268,148 L 302,192
                L 342,122 L 388,70 L 412,106
                L 442,52 L 476,88 L 502,42
                L 534,68 L 562,36 L 602,22
                L 638,50 L 666,18 L 702,50
                L 732,78 L 762,40 L 796,76
                L 832,104 L 872,72 L 912,108
                L 952,136 L 988,104 L 1028,140
                L 1062,168 L 1098,136 L 1138,172
                L 1172,204 L 1208,172 L 1248,214
                L 1282,244 L 1322,218 L 1356,254
                L 1392,282 L 1422,308 L 1440,322
                V 900 Z
              "
            />
            {/* Snow caps — on the tallest central peaks */}
            <g fill="white" opacity="0.7">
              <polygon points="388,70  408,108  368,108" />
              <polygon points="442,52  464,96   420,96"  />
              <polygon points="502,42  526,88   478,88"  />
              <polygon points="562,36  588,82   536,82"  />
              <polygon points="602,22  630,72   574,72"  />
              <polygon points="666,18  696,64   636,64"  />
              <polygon points="702,50  730,88   674,88"  />
              <polygon points="762,40  790,80   734,80"  />
            </g>
            {/* Atmospheric secondary ridge — depth haze */}
            <path
              fill="#3A6590"
              opacity="0.55"
              d="
                M -100,900 V 600
                Q 160,565 340,575
                Q 520,585 700,558
                Q 880,531 1060,548
                Q 1240,564 1440,552
                V 900 Z
              "
            />
          </svg>
        </motion.div>

        {/* ── LAYER 2: Foothills — dark forest green mass ── */}
        <motion.div className="absolute inset-0" style={{ y: foothillY }} aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice"
            className="absolute inset-0 w-full h-full">
            <path
              fill="#264D32"
              d="
                M -100,900 V 590
                Q 60,556  200,565
                Q 380,574  540,552
                Q 700,530  840,546
                Q 980,562  1120,545
                Q 1260,528 1400,544
                Q 1430,547  1540,548
                V 900 Z
              "
            />
          </svg>
        </motion.div>

        {/* ── LAYER 3: Pine treeline — characteristic zigzag silhouette ── */}
        <motion.div className="absolute inset-0" style={{ y: treelineY }} aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice"
            className="absolute inset-0 w-full h-full">
            {/*
              The path traces a ridge with pointed pine-tree peaks.
              Each "L x,high L x+22,low" creates one tree tip.
              Ridge trends downward left→right then rises back.
            */}
            <path
              fill="#112618"
              d="
                M -100,900
                L -100,655
                L 0,642   L 22,618  L 44,642
                L 70,628  L 94,604  L 118,628
                L 148,614 L 172,590 L 196,614
                L 226,600 L 250,576 L 274,600
                L 308,586 L 332,562 L 356,586
                L 392,572 L 416,548 L 440,572
                L 478,558 L 502,534 L 526,558
                L 566,544 L 590,520 L 614,544
                L 654,530 L 678,506 L 702,530
                L 742,516 L 766,492 L 790,516
                L 830,502 L 854,478 L 878,502
                L 918,490 L 942,466 L 966,490
                L 1004,478 L 1028,456 L 1052,478
                L 1090,466 L 1114,448 L 1138,466
                L 1178,478 L 1218,495 L 1258,514
                L 1298,534 L 1338,556 L 1378,578
                L 1440,598
                V 900 Z
              "
            />
          </svg>
        </motion.div>

        {/* ── LAYER 4: Denver Skyline ──
              The two landmark buildings that define the Denver silhouette:

              WELLS FARGO CENTER "CASH REGISTER" (x≈437–497)
              — The body rises to y=320, then a two-part quadratic bezier
                creates the distinctive curved arch crown, peaking at y≈272.
              — Q 437,272 467,272  → left rising curve
              — Q 497,272 497,320  → right descending curve

              REPUBLIC PLAZA (x≈542–602, tallest)
              — Rises to y=264. Stepped setback at top: a small notch at
                y=252 represents the chamfered octagonal crown.
              — Clearly taller than Wells Fargo (~12px in SVG units).

              Approach buildings: staircase from y=680 up to y=372.
              Exit buildings: staircase from y=290 down to y=680.           ── */}
        <motion.div className="absolute inset-0" style={{ y: skylineY }} aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice"
            className="absolute inset-0 w-full h-full">
            <path
              fill="#004667"
              d="
                M 0,900
                L 0,680
                L 168,680
                L 168,670 L 196,670
                L 196,658 L 222,658
                L 222,644 L 247,644
                L 247,628 L 271,628
                L 271,610 L 294,610
                L 294,590 L 316,590
                L 316,568 L 337,568
                L 337,544 L 357,544
                L 357,518 L 376,518
                L 376,490 L 394,490
                L 394,461 L 411,461
                L 411,430 L 427,430
                L 427,398 L 437,398
                L 437,372
                L 437,320
                Q 437,272 467,272
                Q 497,272 497,320
                L 497,360
                L 506,360 L 506,342
                L 516,342 L 516,326
                L 526,326 L 526,312
                L 535,312 L 535,302
                L 542,302
                L 542,264
                L 548,264 L 548,252
                L 596,252 L 596,264
                L 602,264
                L 602,278
                L 610,278 L 610,294
                L 620,294 L 620,312
                L 631,312 L 631,332
                L 643,332 L 643,353
                L 656,353 L 656,376
                L 670,376 L 670,400
                L 685,400 L 685,425
                L 701,425 L 701,451
                L 718,451 L 718,477
                L 736,477 L 736,504
                L 755,504 L 755,531
                L 775,531 L 775,557
                L 796,557 L 796,582
                L 818,582 L 818,605
                L 841,605 L 841,626
                L 865,626 L 865,645
                L 890,645 L 890,662
                L 916,662 L 916,676
                L 944,676 L 944,680
                L 1440,680
                L 1440,900
                Z
              "
            />
            {/* Republic Plaza antenna — subtle spire */}
            <line x1="572" y1="252" x2="572" y2="232" stroke="#004667" strokeWidth="4" />
            {/* Wells Fargo — side fins suggestion */}
            <rect x="433" y="320" width="4" height="40" fill="#003550" />
            <rect x="497" y="320" width="4" height="40" fill="#003550" />
          </svg>
        </motion.div>

        {/* ── LAYER 5: South Platte River + dark foreground bank ── */}
        <motion.div
          className="absolute inset-x-0 bottom-0"
          style={{ y: foregroundY, height: '40%' }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice"
            className="absolute inset-0 w-full h-full">
            {/* River — brand blue, bright against dark bank */}
            <path
              fill="#009dd6"
              opacity="0.8"
              d="M 0,360 V 240
                Q 240,215 480,224
                Q 720,233 960,218
                Q 1200,203 1440,214
                V 360 Z"
            />
            {/* River surface shimmer */}
            <path fill="white" opacity="0.12"
              d="M 60,228 Q 220,218 380,225 Q 220,232 60,238 Z
                 M 560,219 Q 720,209 880,216 Q 720,223 560,229 Z
                 M 1060,215 Q 1220,205 1380,212 Q 1220,219 1060,225 Z" />
            {/* Near riverbank — dark foreground, very close */}
            <path
              fill="#080C08"
              d="M 0,360 V 290
                Q 180,272 360,280
                Q 540,288 720,274
                Q 900,260 1080,270
                Q 1260,280 1440,272
                V 360 Z"
            />
          </svg>
        </motion.div>

        {/* ── TEXT CONTENT ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6"
          style={{ y: textY }}
        >
          {/* Gradient scrim — ensures legibility over any landscape color */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(7,14,26,0.55) 0%, transparent 100%)' }}
            aria-hidden="true"
          />

          <div className="relative max-w-5xl mx-auto text-center">

            {/* Location/era badge */}
            <p className="font-display font-semibold text-xs md:text-sm uppercase tracking-poster text-cc-sky mb-5 md:mb-7">
              Denver, Colorado &nbsp;·&nbsp; Est. 2022
            </p>

            {/* WPA poster headline — massive, dominant */}
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

            {/* Mission statement */}
            <p
              className="font-body text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12"
              style={{ fontSize: 'clamp(1rem, 2.2vw, 1.35rem)' }}
            >
              {/* TODO: Replace with verbatim mission statement from Shane */}
              Connecting Denver's underserved youth to land, water, and community
              through environmental stewardship and outdoor education.
            </p>

            {/* CTAs */}
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
