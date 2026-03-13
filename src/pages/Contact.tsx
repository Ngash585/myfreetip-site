import { Link } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'

const EMAILS = [
  { label: "General",      address: "contact@myfreetip.com" },
  { label: "Support",      address: "support@myfreetip.com" },
  { label: "Partnerships", address: "partnerships@myfreetip.com" },
  { label: "Tips",         address: "tips@myfreetip.com" },
];

const CARD = {
  background: '#FFFFFF',
  boxShadow: 'rgba(29,29,29,0.08) 4px 16px 32px 0',
  borderRadius: '16px',
} as const;

const INPUT_STYLE = {
  background: '#F8F4EF',
  border: '1px solid rgba(29,29,29,0.12)',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  color: '#1D1D1D',
  outline: 'none',
  width: '100%',
} as const;

export default function Contact() {
  usePageMeta({
    title: 'Contact MyFreeTip \u2014 Football Analysis Platform',
    description: 'Get in touch with the MyFreeTip team. Questions, partnership enquiries, or feedback about our football predictions and match analysis platform.',
    canonical: 'https://myfreetip.com/contact',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" style={{ color: '#1D1D1D' }}>

      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://myfreetip.com/' },
              { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://myfreetip.com/contact' },
            ],
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-xs" style={{ color: '#777777' }}>
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li>»</li>
          <li style={{ color: '#1D1D1D' }}>Contact</li>
        </ol>
      </nav>

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#3DB157' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#2D9A47' }}>
            Get in touch
          </span>
        </div>
        <h1
          className="mb-3 leading-tight"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '2rem', fontWeight: 400 }}
        >
          Contact Us
        </h1>
        <p className="leading-relaxed" style={{ color: '#777777' }}>
          Questions, partnership enquiries, or just want to say hi — we're easy
          to reach. Pick the right email below or send us a message directly.
        </p>
      </div>

      {/* ── Email addresses ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold mb-3" style={{ color: '#1D1D1D' }}>Email</h2>
        <div style={{ ...CARD, overflow: 'hidden' }}>
          {EMAILS.map(({ label, address }, i) => (
            <div
              key={label}
              className="flex items-center justify-between px-5 py-4 gap-4"
              style={i < EMAILS.length - 1 ? { borderBottom: '1px solid rgba(29,29,29,0.08)' } : {}}
            >
              <span className="text-sm w-28 flex-shrink-0" style={{ color: '#777777' }}>{label}</span>
              <a
                href={`mailto:${address}`}
                className="text-sm font-medium hover:underline truncate"
                style={{ color: '#2D9A47' }}
              >
                {address}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Address & Phone ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold mb-3" style={{ color: '#1D1D1D' }}>Address &amp; Phone</h2>
        <div style={{ ...CARD, padding: '20px' }} className="flex flex-col sm:flex-row gap-6">
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">📍</span>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#1D1D1D' }}>Office</p>
              <p className="text-sm leading-relaxed" style={{ color: '#777777' }}>
                39 Thistle Street<br />
                Edinburgh, EH2 1DY<br />
                United Kingdom
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">📞</span>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#1D1D1D' }}>Phone</p>
              <a
                href="tel:+447964431106"
                className="text-sm hover:underline"
                style={{ color: '#2D9A47' }}
              >
                +44 7964 431 06
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact form ── */}
      <section>
        <h2 className="text-base font-bold mb-3" style={{ color: '#1D1D1D' }}>Send us a message</h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ ...CARD, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: '#777777' }}>Your name</label>
            <input
              type="text"
              placeholder="Moses"
              required
              style={INPUT_STYLE}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: '#777777' }}>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              style={INPUT_STYLE}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: '#777777' }}>Subject</label>
            <select style={INPUT_STYLE}>
              <option value="">Select a topic</option>
              <option value="support">Support</option>
              <option value="partnership">Partnership / Advertising</option>
              <option value="tips">Tips &amp; Predictions</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: '#777777' }}>Message</label>
            <textarea
              placeholder="Tell us how we can help…"
              rows={5}
              required
              style={{ ...INPUT_STYLE, resize: 'none' }}
            />
          </div>

          <button
            type="submit"
            className="w-full text-white font-bold py-3 rounded-xl transition-opacity hover:opacity-80 text-sm"
            style={{ background: '#080A2D' }}
          >
            Send Message
          </button>

          <p className="text-xs text-center" style={{ color: '#777777' }}>
            We typically reply within 24 hours on weekdays.
          </p>
        </form>
      </section>

    </div>
  );
}
