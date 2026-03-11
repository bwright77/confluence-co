import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * WPA / Olly Moss-style poster hero — static, full-viewport landscape composition.
 *
 * Compositional layers (back → front):
 *   Dawn sky gradient
 *   Stars (upper sky)
 *   Rocky Mountain peaks with snow (Front Range 14ers)
 *   Mid forest ridge — dark pine silhouette
 *   South Platte River — bright blue winding path
 *   Dark foothills
 *   Denver skyline silhouette — dominant foreground
 *     · Wells Fargo Center "Cash Register": arch crown peaks at y≈460
 *     · Republic Plaza: tallest tower, flat top at y=452
 *
 * Text sits in the sky zone (upper ~40% of frame).
 * No parallax — static poster composition per PRD § 3.5.
 */
export default function ParallaxHero() {
  const reduced = useReducedMotion()

  return (
    <section
      className="relative h-screen min-h-[600px] overflow-hidden"
      aria-labelledby="hero-heading"
    >

      {/* ── SKY — alpenglow dawn ── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(to bottom,',
            '#040A14 0%,',
            '#091522 14%,',
            '#10213A 28%,',
            '#1C3050 44%,',
            '#3A2840 58%,',
            '#7A3818 74%,',
            '#C05015 88%,',
            '#E07828 100%)',
          ].join(' '),
        }}
        aria-hidden="true"
      />

      {/* ── STARS ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 900"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity: 0.45 }}
        >
          {[
            [88,40],[192,22],[315,54],[462,16],[588,38],[734,24],[876,46],
            [1024,30],[1162,52],[1302,18],[1408,42],
            [148,92],[395,74],[638,86],[862,66],[1098,80],[1338,68],
            [248,130],[502,112],[754,104],[994,124],[1245,108],
            [64,162],[330,154],[598,146],[862,160],[1126,150],[1390,164],
          ].map(([cx, cy], i) => (
            <circle
              key={i} cx={cx} cy={cy}
              r={i < 11 ? 2 : 1.5}
              fill="white"
              opacity={0.3 + (i % 4) * 0.15}
            />
          ))}
        </svg>
      </div>

      {/* ── LAYER 1: Rocky Mountains — Front Range peaks ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 w-full h-full"
        >
          {/* Atmospheric ghost ridge — depth haze */}
          <path
            fill="#4A6880"
            opacity="0.5"
            d="M 0,900 V 500 Q 180,470 360,484 Q 540,498 720,470 Q 900,442 1080,460 Q 1260,478 1440,465 V 900 Z"
          />
          {/* Main Front Range peaks */}
          <path
            fill="#6A8EA8"
            d="M -60,900 V 520
              L 0,500 L 48,456 L 88,406 L 118,360 L 148,390
              L 182,325 L 218,262 L 252,298
              L 288,235 L 324,172 L 360,196
              L 394,140 L 430,88 L 456,124
              L 478,68 L 504,38 L 530,62
              L 556,28 L 582,48 L 614,20
              L 640,44 L 668,16 L 695,48
              L 720,82 L 750,48 L 780,86
              L 812,112 L 848,76 L 885,114
              L 920,144 L 957,110 L 995,148
              L 1032,175 L 1070,142 L 1110,178
              L 1150,208 L 1192,176 L 1232,215
              L 1272,245 L 1312,218 L 1354,255
              L 1398,282 L 1440,308
              V 900 Z"
          />
          {/* Snow caps on the tallest central 14ers */}
          <g fill="white" opacity="0.82">
            <polygon points="478,68  506,118  450,118" />
            <polygon points="504,38  534,92   474,92"  />
            <polygon points="556,28  588,84   524,84"  />
            <polygon points="614,20  646,78   582,78"  />
            <polygon points="668,16  700,74   636,74"  />
            <polygon points="720,82  752,124  688,124" />
            <polygon points="750,48  782,102  718,102" />
          </g>
        </svg>
      </div>

      {/* ── LAYER 2: Dark pine forest ridge ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 w-full h-full"
        >
          {/* Fog separator — atmospheric depth between layers */}
          <path
            fill="#1A3222"
            opacity="0.38"
            d="M 0,645 Q 360,618 720,632 Q 1080,646 1440,632 V 690 Q 1080,676 720,690 Q 360,704 0,690 Z"
          />
          {/* Pine-tooth silhouette — spruce/fir characteristic of CO mountains */}
          <path
            fill="#122018"
            d="M -60,900 V 658
              L 0,644   L 18,620  L 36,644
              L 58,630  L 76,606  L 94,630
              L 118,617 L 136,591 L 154,617
              L 180,603 L 198,577 L 216,603
              L 244,589 L 264,563 L 284,589
              L 316,575 L 338,547 L 360,575
              L 395,561 L 417,533 L 439,561
              L 477,547 L 499,519 L 521,547
              L 563,533 L 585,505 L 607,533
              L 651,519 L 673,491 L 695,519
              L 741,505 L 763,477 L 785,505
              L 833,491 L 855,463 L 877,491
              L 927,477 L 949,451 L 971,477
              L 1021,463 L 1043,439 L 1065,463
              L 1115,451 L 1137,431 L 1159,451
              L 1207,463 L 1257,480 L 1307,498
              L 1362,518 L 1412,540 L 1440,555
              V 900 Z"
          />
        </svg>
      </div>

      {/* ── LAYER 3: South Platte River — winding valley floor ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 w-full h-full"
        >
          <path
            fill="#009dd6"
            opacity="0.62"
            d="M 0,710
              Q 100,696 200,703
              Q 320,710 420,695
              Q 540,680 660,689
              Q 780,698 880,683
              Q 1000,668 1120,677
              Q 1280,686 1440,672
              L 1440,692
              Q 1280,706 1120,697
              Q 1000,688 880,703
              Q 780,718 660,709
              Q 540,700 420,715
              Q 320,730 200,723
              Q 100,716 0,730
              Z"
          />
          <path fill="white" opacity="0.18"
            d="M 180,700 Q 380,694 580,700 Q 380,706 180,710 Z" />
          <path fill="white" opacity="0.14"
            d="M 660,689 Q 860,683 1060,689 Q 860,695 660,699 Z" />
        </svg>
      </div>

      {/* ── LAYER 4: Dark foothills ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 w-full h-full"
        >
          <path
            fill="#091410"
            d="M -60,900 V 726
              Q 80,702 200,710
              Q 340,718 480,700
              Q 620,682 760,694
              Q 900,706 1040,690
              Q 1180,674 1320,686
              Q 1400,692 1500,694
              V 900 Z"
          />
        </svg>
      </div>

      {/* ── LAYER 5: Denver Skyline — dominant foreground silhouette ──
            Landmarks:
            WELLS FARGO CENTER "CASH REGISTER" (x 520–582)
              Body at y=535. Arch crown: two quadratic beziers, peak ≈y=460.
              Q (520,460) (551,460) → Q (582,460) (582,535)

            REPUBLIC PLAZA (x 602–656, tallest at y=452)
              Flat top with chamfered crown (y=444 from x=608–648).
              Antenna from y=444 to y=422.
      ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 w-full h-full"
        >
          <path
            fill="#001420"
            d="M 0,900
              V 836 L 68,836
              V 820 L 112,820
              V 804 L 150,804
              V 788 L 188,788
              V 771 L 228,771
              V 754 L 268,754
              V 736 L 308,736
              V 717 L 348,717
              V 697 L 388,697
              V 676 L 428,676
              V 655 L 462,655
              V 635 L 490,635
              V 616 L 506,616
              V 600 L 516,600
              V 582 L 520,582
              V 535
              Q 520,460 551,460
              Q 582,460 582,535
              V 548
              L 590,548
              V 533 L 598,533
              V 518 L 605,518
              V 503
              L 602,503
              V 452
              L 608,452
              V 444 L 648,444
              V 452 L 656,452
              V 465
              L 670,465
              V 482 L 687,482
              V 500 L 706,500
              V 519 L 727,519
              V 540 L 750,540
              V 562 L 775,562
              V 584 L 802,584
              V 607 L 831,607
              V 630 L 862,630
              V 651 L 895,651
              V 671 L 931,671
              V 690 L 970,690
              V 708 L 1013,708
              V 724 L 1061,724
              V 739 L 1115,739
              V 753 L 1175,753
              V 766 L 1243,766
              V 778 L 1319,778
              V 790 L 1440,790
              V 900 Z"
          />
          {/* Republic Plaza antenna/spire */}
          <line x1="628" y1="444" x2="628" y2="420" stroke="#001420" strokeWidth="5" />
          {/* Wells Fargo — subtle side pilasters at arch base */}
          <rect x="516" y="535" width="6" height="52" fill="#00101A" />
          <rect x="580" y="535" width="6" height="52" fill="#00101A" />
        </svg>
      </div>

      {/* ── TEXT — in the sky zone above the city ── */}
      <div
        className="absolute inset-0 flex flex-col items-center z-10 px-6"
        style={{ paddingTop: '10vh' }}
      >
        {/* Soft radial scrim — improves text legibility over landscape */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 58% at 50% 34%, rgba(4,10,20,0.65) 0%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        <motion.div
          className="relative max-w-5xl mx-auto text-center"
          style={{ marginTop: '4vh' }}
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
        >
          <p className="font-display font-semibold text-xs md:text-sm uppercase tracking-poster text-cc-sky mb-5 md:mb-7">
            Denver, Colorado &nbsp;·&nbsp; Est. 2022
          </p>

          <h1
            id="hero-heading"
            className="font-display font-bold uppercase text-white leading-none mb-5 md:mb-7"
            style={{ fontSize: 'clamp(2.8rem, 8.5vw, 6.5rem)', letterSpacing: '0.07em' }}
          >
            At the{' '}
            <span style={{ color: '#009dd6' }}>Confluence</span>
            <br />
            <span style={{ fontSize: '0.68em', letterSpacing: '0.12em' }}>
              of People &amp; Place
            </span>
          </h1>

          <p
            className="font-body text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12"
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}
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
        </motion.div>
      </div>

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
          animate={reduced ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </div>

    </section>
  )
}
