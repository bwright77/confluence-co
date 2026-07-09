import type { Fund } from '../../lib/donate'

// Kady Youth Sheep Camp's own lockup, reproduced per its brand guide: the ram
// sits left of the wordmark at the height of both text lines together; the
// wordmark is Alfa Slab One in caps, APPRENTICESHIP beneath it in wide-tracked
// Space Mono. Those two families are loaded in index.html and used nowhere else,
// so they're set inline rather than promoted into the Tailwind theme — these are
// the partner's brand tokens, not Confluence's.
//
// Colourway is the light-background variant (night mark, night wordmark, rust
// subline), drawn straight onto the page's cream section rather than the bone
// panel the brand page uses to demo it.
const NIGHT = '#122634'
const RUST = '#BC5A32'

interface Props {
  lockup: Fund['lockup']
}

export default function FundLockup({ lockup }: Props) {
  return (
    // A logo is a name, not copy — Google Translate must leave it alone.
    <div className="flex items-center justify-center gap-4" translate="no">
      <img src={lockup.mark} alt="" aria-hidden="true" className="h-[74px] w-auto shrink-0" />
      <div className="flex flex-col gap-1">
        <span
          className="text-[22px] uppercase leading-none"
          style={{ fontFamily: "'Alfa Slab One', Rockwell, Georgia, serif", color: NIGHT }}
        >
          {lockup.wordmark}
        </span>
        <span
          className="text-[11px] uppercase"
          style={{
            fontFamily: "'Space Mono', ui-monospace, monospace",
            letterSpacing: '0.32em',
            color: RUST,
          }}
        >
          {lockup.subline}
        </span>
      </div>
    </div>
  )
}
