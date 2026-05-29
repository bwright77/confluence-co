import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const LAST_UPDATED = 'May 28, 2026'
const EMAIL = 'shane@confluenceco.org'

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy · Confluence Colorado'
  }, [])

  return (
    <section className="section-pad bg-cc-warm pt-32 md:pt-40">
      <div className="container-site max-w-3xl">
        <p className="font-display text-xs font-semibold uppercase tracking-poster text-cc-sky-ink">
          Legal
        </p>
        <h1 className="heading-display mt-3 text-4xl text-cc-navy md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 font-body text-sm text-cc-stone">Last updated: {LAST_UPDATED}</p>

        <div className="mt-10 space-y-10 font-body text-base leading-relaxed text-cc-navy/90">
          <p>
            Confluence Colorado (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a
            Denver-based 501(c)(3) nonprofit. We respect your privacy and collect only the
            information we need to run our programs, process donations, and stay in touch. This
            policy explains what we collect, how we use it, and the choices you have.
          </p>

          <div>
            <h2 className="heading-display text-2xl text-cc-navy">Information we collect</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                <strong>Donations.</strong> When you make a gift, our payment processor collects
                your name, email, billing address, and payment details. Card numbers are handled
                directly by Stripe &mdash; we never see or store your full card information.
              </li>
              <li>
                <strong>Email sign-ups.</strong> If you subscribe to updates, we collect your email
                address (and any name you provide) so we can send you news about our work.
              </li>
              <li>
                <strong>Messages you send us.</strong> If you email us or fill out a contact form,
                we keep what you share so we can respond.
              </li>
              <li>
                <strong>Basic site analytics.</strong> We use Plausible, a privacy-friendly,
                cookieless analytics tool that reports aggregate traffic only. It does not track you
                across sites or collect personal information.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="heading-display text-2xl text-cc-navy">How we use your information</h2>
            <p className="mt-4">We use the information above to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Process your donation and send a tax receipt;</li>
              <li>Respond to your questions and requests;</li>
              <li>Send program updates and newsletters, if you&rsquo;ve opted in;</li>
              <li>Understand, in aggregate, how the site is used so we can improve it.</li>
            </ul>
          </div>

          <div>
            <h2 className="heading-display text-2xl text-cc-navy">Payment processing</h2>
            <p className="mt-4">
              Donations are processed by{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cc-sky-ink underline underline-offset-2 hover:text-cc-navy"
              >
                Stripe
              </a>
              , a PCI-compliant payment provider. Your payment is entered on Stripe&rsquo;s secure
              checkout and governed by Stripe&rsquo;s privacy policy. We receive only a confirmation
              and the non-sensitive details needed to issue your receipt.
            </p>
          </div>

          <div>
            <h2 className="heading-display text-2xl text-cc-navy">How we share information</h2>
            <p className="mt-4">
              <strong>We do not sell or rent your personal information.</strong> We share it only
              with the service providers that help us operate &mdash; such as our payment processor
              (Stripe) and, when active, our email provider (Mailchimp) &mdash; and only as needed to
              provide those services. We may also disclose information if required by law.
            </p>
          </div>

          <div>
            <h2 className="heading-display text-2xl text-cc-navy">Your privacy rights</h2>
            <p className="mt-4">
              If you live in California (under the CCPA/CPRA), Colorado (under the CPA), or another
              state with similar laws, you have the right to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Know what personal information we hold about you;</li>
              <li>Request a copy of it;</li>
              <li>Ask us to correct or delete it;</li>
              <li>Opt out of the sale or sharing of your personal information.</li>
            </ul>
            <p className="mt-4">
              Because we do not sell your information, there is nothing to opt out of on that front.
              To exercise any of these rights, email us at{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="text-cc-sky-ink underline underline-offset-2 hover:text-cc-navy"
              >
                {EMAIL}
              </a>
              . We will not discriminate against you for exercising your privacy rights.
            </p>
          </div>

          <div>
            <h2 className="heading-display text-2xl text-cc-navy">Data retention &amp; security</h2>
            <p className="mt-4">
              We keep personal information only as long as needed for the purposes above or as
              required by law (for example, donation records for tax and accounting). We use
              reasonable safeguards to protect your information, though no method of transmission or
              storage is completely secure.
            </p>
          </div>

          <div>
            <h2 className="heading-display text-2xl text-cc-navy">Children&rsquo;s privacy</h2>
            <p className="mt-4">
              This website is not directed at children under 13, and we do not knowingly collect
              personal information from them through the site. Information about youth who enroll in
              our programs is collected separately, with appropriate parental or guardian consent.
            </p>
          </div>

          <div>
            <h2 className="heading-display text-2xl text-cc-navy">Changes to this policy</h2>
            <p className="mt-4">
              We may update this policy from time to time. When we do, we&rsquo;ll revise the
              &ldquo;Last updated&rdquo; date above.
            </p>
          </div>

          <div>
            <h2 className="heading-display text-2xl text-cc-navy">Contact us</h2>
            <p className="mt-4">
              Questions about this policy or your information? Reach us at:
            </p>
            <address className="mt-3 not-italic" translate="no">
              Confluence Colorado<br />
              3000 Lawrence Street, Denver, CO 80205<br />
              <a
                href={`mailto:${EMAIL}`}
                className="text-cc-sky-ink underline underline-offset-2 hover:text-cc-navy"
              >
                {EMAIL}
              </a>
              {' · '}
              <a
                href="tel:+13038157613"
                className="text-cc-sky-ink underline underline-offset-2 hover:text-cc-navy"
              >
                (303) 815-7613
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-cc-navy/15 pt-8">
          <Link to="/" className="font-display text-sm font-semibold uppercase tracking-display text-cc-sky-ink hover:text-cc-navy">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}
