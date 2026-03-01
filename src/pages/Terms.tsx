const SECTIONS = [
  {
    title: "1. No Guarantee of Winnings",
    body: "MyFreeTip provides football predictions, betting codes, and suggested slips generated using data analysis and expert judgement. While we strive for accuracy, betting always carries risk. We cannot and do not guarantee any winnings. Users accept full responsibility for the outcomes of their bets.",
  },
  {
    title: "2. Editing Bet Slips",
    body: "Our platform allows users to copy betting slips and booking codes from our predictions. You are free to edit, add, or remove selections before placing a bet. Once edited, the responsibility for the final slip lies solely with you. MyFreeTip is not liable for any changes you make to the recommended slip.",
  },
  {
    title: "3. Information Purposes Only",
    body: "All content on MyFreeTip.com is provided for informational and entertainment purposes only. We are not a bookmaker and do not take bets. Users must be of legal gambling age in their jurisdiction to engage with any betting services via third-party partners.",
  },
  {
    title: "4. Privacy & Data Use",
    items: [
      "Emails provided (support, tips, partnerships) are used only for direct communication with you.",
      "We may use cookies and analytics tools to improve site performance and user experience.",
      "We do not sell your personal data to third parties.",
      "By using our site, you consent to the limited collection and use of this data.",
    ],
    body: "We respect your privacy. When you contact us or use our services, we may collect limited information such as your name, email, or browsing behaviour (via analytics). This information is used only to improve our services and respond to your queries.",
  },
  {
    title: "5. Liability",
    body: "MyFreeTip is not responsible for any financial loss, damages, or consequences arising from the use of our predictions, codes, or partner links. Users are advised to bet responsibly and within their means.",
  },
  {
    title: "6. Third-Party Links & Affiliate Partners",
    body: "Our website contains links to third-party bookmaker sites including 1xBet, Paripesa, Melbet, and Sportsbet.io. We may earn commission when you register or deposit via these links. We do not control these platforms and are not responsible for their content, security, or practices. Always review their terms and conditions before placing bets.",
  },
  {
    title: "7. Changes to These Terms",
    body: "We may update these Terms & Conditions at any time to reflect changes in our services or legal requirements. Continued use of MyFreeTip.com after updates indicates your acceptance of the revised terms.",
  },
];

const CARD = {
  background: '#FFFFFF',
  boxShadow: 'rgba(29,29,29,0.08) 4px 16px 32px 0',
  borderRadius: '16px',
  padding: '20px',
} as const;

export default function Terms() {
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
          Terms &amp; Conditions
        </h1>
        <p className="leading-relaxed" style={{ color: '#777777' }}>
          Welcome to <span className="font-semibold" style={{ color: '#1D1D1D' }}>MyFreeTip.com</span>.
          By using our website you agree to the following terms. Please read
          them carefully before engaging with our services.
        </p>
      </div>

      {/* ── 18+ warning banner ── */}
      <div className="rounded-2xl px-5 py-4 flex gap-3 items-start mb-8"
        style={{ background: '#FFFBF0', border: '1px solid rgba(184,134,11,0.30)' }}>
        <span className="text-xl flex-shrink-0">⚠️</span>
        <p className="text-sm leading-relaxed" style={{ color: '#92650A' }}>
          You must be <strong>18 years or older</strong> to use this site and
          place bets with our partner bookmakers. Gambling may be illegal in
          your jurisdiction — it is your responsibility to check local laws.
        </p>
      </div>

      {/* ── Sections ── */}
      <div className="flex flex-col gap-4">
        {SECTIONS.map((s) => (
          <div key={s.title} style={CARD}>
            <h2 className="text-base font-bold mb-2" style={{ color: '#1D1D1D' }}>{s.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#777777' }}>{s.body}</p>
            {s.items && (
              <ul className="mt-3 space-y-1.5 list-none">
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

      {/* ── Footer note ── */}
      <p className="text-xs text-center mt-8" style={{ color: '#777777' }}>
        Last updated: March {new Date().getFullYear()}
      </p>

    </div>
  );
}
