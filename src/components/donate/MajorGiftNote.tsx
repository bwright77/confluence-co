import { Handshake } from '@phosphor-icons/react'
import type { FundContact } from '../../lib/donate'

interface Props {
  contacts: FundContact[]
}

export default function MajorGiftNote({ contacts }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-cc-navy/10 bg-white px-4 py-3">
      <Handshake size={20} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0 text-cc-sage" />
      <p className="font-body text-sm leading-relaxed text-cc-navy">
        Making a larger one-time gift, or interested in a partnership or sponsorship? Please reach
        out directly —{' '}
        {contacts.map((contact, i) => (
          <span key={contact.email}>
            {i > 0 && (i === contacts.length - 1 ? ', or ' : ', ')}
            <a
              href={`mailto:${contact.email}`}
              className="font-semibold text-cc-sky-ink underline underline-offset-2 hover:text-cc-orange"
            >
              {contact.name}
            </a>{' '}
            at {contact.org}
          </span>
        ))}
        .
      </p>
    </div>
  )
}
