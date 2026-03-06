import { usePageMeta } from "@/hooks/usePageMeta";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "We may collect the following types of information:",
    items: [
      "Personal information (such as name and email) when you contact us or subscribe to updates.",
      "Usage data such as your IP address, browser type, and pages visited, collected via cookies and analytics tools.",
      "Communication data from emails you send to our support or partnership addresses.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: "We use the information we collect to:",
    items: [
      "Respond to your enquiries and provide customer support.",
      "Share partnership and promotional updates (only if you opt in).",
      "Improve our website, services, and user experience through analytics.",
      "Ensure legal compliance and protect against fraudulent activity.",
    ],
  },
  {
    title: "3. Sharing of Information",
    body: "We do not sell or trade your personal information to third parties. We may share limited information with:",
    items: [
      "Service providers (e.g. analytics, email hosting) who help us operate our platform.",
      "Legal authorities if required by law or to protect our rights.",
      "Affiliate partners — when you click a bookmaker link, limited tracking data may be shared to register your referral.",
    ],
  },
  {
    title: "4. Cookies & Analytics",
    body: "We use cookies and third-party analytics tools (such as Google Analytics) to track usage, improve performance, and personalise your experience. You can disable cookies in your browser settings, but some features of the website may not function correctly.",
  },
  {
    title: "5. Data Security",
    body: "We implement reasonable security measures to protect your personal information. However, no method of transmission or storage online is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    title: "6. Your Rights",
    body: "Depending on your location, you may have the right to:",
    items: [
      "Access the personal data we hold about you.",
      "Request corrections to your personal data.",
      "Request deletion of your personal data.",
      "Withdraw consent for data use where applicable.",
    ],
  },
  {
    title: "7. Third-Party Links",
    body: "Our site contains links to third-party bookmakers and affiliates including 1xBet, Paripesa, Melbet, and Sportsbet.io. We are not responsible for their privacy practices. Please review their policies before sharing personal information with them.",
  },
  {
    title: "8. Updates to This Policy",
    body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page. Continued use of the site after an update indicates your acceptance of the revised policy.",
  },
];

const CARD = {
  background: '#FFFFFF',
  boxShadow: 'rgba(29,29,29,0.08) 4px 16px 32px 0',
  borderRadius: '16px',
  padding: '20px',
} as const;

export default function Privacy() {
  usePageMeta({
    title: "Privacy Policy \u2014 MyFreeTip",
    description:
      "MyFreeTip\u2019s privacy policy covering how we collect, use, and protect information from users of our football predictions and analysis platform.",
    canonical: "https://myfreetip.com/privacy",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" style={{ color: '#1D1D1D' }}>

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#3DB157' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#2D9A47' }}>
            Legal
          </span>
        </div>
        <h1
          className="mb-3 leading-tight"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '2rem', fontWeight: 400 }}
        >
          Privacy Policy
        </h1>
        <p className="leading-relaxed" style={{ color: '#777777' }}>
          At <span className="font-semibold" style={{ color: '#1D1D1D' }}>MyFreeTip.com</span> we
          value your privacy and are committed to protecting your personal
          information. This policy explains how we collect, use, and safeguard
          your data when you visit or interact with our website.
        </p>
      </div>

      {/* ── Sections ── */}
      <div className="flex flex-col gap-4 mb-8">
        {SECTIONS.map((s) => (
          <div key={s.title} style={CARD}>
            <h2 className="text-base font-bold mb-2" style={{ color: '#1D1D1D' }}>{s.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#777777' }}>{s.body}</p>
            {s.items && (
              <ul className="mt-3 space-y-1.5">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm" style={{ color: '#777777' }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: '#3DB157' }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* ── Section 9: Contact ── */}
      <div style={CARD} className="mb-8">
        <h2 className="text-base font-bold mb-2" style={{ color: '#1D1D1D' }}>9. Contact Us</h2>
        <p className="text-sm leading-relaxed mb-3" style={{ color: '#777777' }}>
          If you have questions about this Privacy Policy or your data, please
          get in touch:
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex gap-2 items-center">
            <span style={{ color: '#3DB157' }}>·</span>
            <span style={{ color: '#777777' }}>Email: </span>
            <a href="mailto:contact@myfreetip.com" className="hover:underline" style={{ color: '#2D9A47' }}>
              contact@myfreetip.com
            </a>
          </div>
          <div className="flex gap-2">
            <span className="flex-shrink-0 mt-0.5" style={{ color: '#3DB157' }}>·</span>
            <span style={{ color: '#777777' }}>
              Address: 39 Thistle Street, Edinburgh, EH2 1DY, United Kingdom
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer note ── */}
      <p className="text-xs text-center" style={{ color: '#777777' }}>
        Last updated: March {new Date().getFullYear()}
      </p>

    </div>
  );
}
