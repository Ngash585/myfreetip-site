import { Link } from "react-router-dom";

const WHAT_WE_DO_DIFFERENTLY = [
  {
    icon: "📊",
    title: "We show every loss",
    body: "73% win rate sounds good. What makes it mean something is that the other 27% is right here, logged publicly. Every loss, every void. Brian in Lagos can verify every number we publish.",
  },
  {
    icon: "🤖",
    title: "We back every pick with data",
    body: "No gut feeling. No WhatsApp groups. Our analysis runs match data, form tables, head-to-head history and team news before a single pick is published. If the numbers don't back it, we don't post it.",
  },
  {
    icon: "🔑",
    title: "We make the code work for you",
    body: "Every pick comes with a match code ready to paste directly into 1xBet, Paripesa, Melbet and more. No searching. No manual slip building. One paste and your selections are loaded.",
  },
  {
    icon: "🎁",
    title: "We tell you about the bonuses",
    body: "Welcome offers exist on every platform. Most people never claim them. We show you which ones are worth using and how to combine them with today's pick — free money most leave on the table.",
  },
  {
    icon: "✅",
    title: "Everything here is free",
    body: "No premium tier. No locked picks. No subscription. Every tip, every code, every result — free.",
  },
];

const WHAT_WE_DONT_DO = [
  "Delete tips that lose",
  "Post codes we haven't verified",
  "Sell picks behind a paywall",
  "Guarantee results nobody can guarantee",
];

const STATS = [
  { label: "Overall Win Rate",  value: "73%" },
  { label: "Picks Published",    value: "63+" },
  { label: "Markets Covered",   value: "12+" },
  { label: "Partner Platforms", value: "4"   },
];

const PARTNERS = [
  { name: "1xBet",     logo: "/1xbet.png",    url: "https://1xbet.com"    },
  { name: "Paripesa",  logo: "/paripesa.png",  url: "https://paripesa.com" },
  { name: "Melbet",    logo: "/melbet.png",    url: "https://melbet.com"   },
  { name: "Sportsbet", logo: "/sportsbet.png", url: "https://sportsbet.io" },
];

const CARD = {
  background: '#FFFFFF',
  boxShadow: 'rgba(29,29,29,0.08) 4px 16px 32px 0',
  borderRadius: '16px',
  padding: '20px',
} as const;

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8" style={{ color: '#1D1D1D' }}>

      {/* ── Hero ── */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#3DB157' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#2D9A47' }}>
            About us
          </span>
        </div>
        <h1
          className="mb-4 leading-tight"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '2rem', fontWeight: 400, color: '#1D1D1D' }}
        >
          Stop guessing.<br />Start winning.
        </h1>
        <p className="leading-relaxed" style={{ color: '#777777' }}>
          Every day, our analysis finds the highest-confidence match and gives
          you a match code — just paste it into 1xBet, Paripesa, Melbet and
          more. It costs you nothing.
        </p>
      </section>

      {/* ── We know why you're here — white card, green left border ── */}
      <section className="mb-10">
        <div style={{ ...CARD, borderLeft: '3px solid #3DB157' }}>
          <h2 className="text-base font-bold mb-3" style={{ color: '#1D1D1D' }}>
            We know why you're here
          </h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#777777' }}>
            <p>
              You've followed analysts who disappeared after a bad week. You've
              seen win rates that never show the losses. You've copied a code
              that expired before you could use it. You've lost money you
              couldn't afford to lose and didn't fully understand why.
            </p>
            <p className="font-medium" style={{ color: '#1D1D1D' }}>
              That's not bad luck. That's a broken system. We built MyFreeTip
              to fix it.
            </p>
          </div>
        </div>
      </section>

      {/* ── What we do differently ── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">What we do differently</h2>
        <div className="flex flex-col gap-3">
          {WHAT_WE_DO_DIFFERENTLY.map((item) => (
            <div key={item.title} style={CARD} className="flex gap-4">
              <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="font-bold mb-1" style={{ color: '#1D1D1D' }}>{item.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#777777' }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What we don't do ── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">What we don't do</h2>
        <div style={CARD}>
          <ul className="space-y-3">
            {WHAT_WE_DONT_DO.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#777777' }}>
                <span className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(192,57,43,0.10)', color: '#C0392B' }}>
                  ✕
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Our record ── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">Our record</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {STATS.map((s) => (
            <div key={s.label} style={CARD} className="text-center">
              <p className="text-3xl font-extrabold" style={{ color: '#3DB157' }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: '#777777' }}>{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-center" style={{ color: '#777777' }}>
          Record updated as results are confirmed. Wins and losses both shown, always.
        </p>
      </section>

      {/* ── Our analyst ── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">Our analyst</h2>
        <div style={CARD} className="flex gap-4 items-start">
          <div className="w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center text-2xl border-2"
            style={{ background: '#F2EEE9', borderColor: 'rgba(61,177,87,0.30)' }}>
            🎯
          </div>
          <div>
            <p className="font-bold" style={{ color: '#1D1D1D' }}>TipMaster</p>
            <p className="text-xs mb-2" style={{ color: '#2D9A47' }}>Lead Analyst · 73% Win Rate</p>
            <p className="text-sm leading-relaxed" style={{ color: '#777777' }}>
              Six years analysing football data across the Premier League,
              Champions League, La Liga, and African leagues. Specialises in
              goals markets, Asian handicaps, and value accumulator builds.
              Every tip is backed by statistical evidence, not gut feeling.
            </p>
          </div>
        </div>
      </section>

      {/* ── Partner bookmakers ── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-1">Our partner bookmakers</h2>
        <p className="text-xs mb-4" style={{ color: '#777777' }}>
          We only partner with bookmakers we'd use ourselves.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-3 transition-shadow hover:shadow-md"
              style={CARD}
            >
              <img src={p.logo} alt={p.name} className="w-8 h-8 object-contain rounded" />
              <span className="text-sm font-semibold" style={{ color: '#1D1D1D' }}>{p.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Affiliate Disclosure ── */}
      <section className="mb-10">
        <div className="rounded-2xl p-5" style={{ background: '#FFFBF0', border: '1px solid rgba(184,134,11,0.25)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚠️</span>
            <h2 className="text-base font-bold" style={{ color: '#B8860B' }}>Affiliate Disclosure</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#777777' }}>
            <p>
              MyFreeTip earns commission when you register or deposit with our
              partner bookmakers through links on this site. This is how we fund
              the platform and keep all tips free.
            </p>
            <p>
              Our affiliate relationships do{" "}
              <strong style={{ color: '#1D1D1D' }}>not</strong> influence our
              predictions. Tips are selected on statistical merit only. We will
              never recommend a pick to benefit our affiliate revenue at the
              expense of your results.
            </p>
            <p>
              All listed platforms are licensed operators. Always verify local
              laws before registering.
            </p>
          </div>
        </div>
      </section>

      {/* ── Responsible Play ── */}
      <section className="mb-10">
        <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid rgba(29,29,29,0.08)', boxShadow: 'rgba(29,29,29,0.06) 4px 16px 32px 0' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🛡️</span>
            <h2 className="text-base font-bold" style={{ color: '#1D1D1D' }}>Responsible Play</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#777777' }}>
            <p>
              This should be entertainment, not a source of income. Never
              commit money you cannot afford to lose. Past results do not
              guarantee future returns — even a 73% win rate means losses happen.
            </p>
            <p>
              Set a budget and stick to it. If this is
              affecting your finances, relationships, or mental health, please
              seek help. You must be{" "}
              <strong style={{ color: '#1D1D1D' }}>18 years or older</strong> to use
              this site.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="text-center">
        <p className="text-sm mb-3" style={{ color: '#777777' }}>
          Have a question or partnership enquiry?
        </p>
        <Link
          to="/contact"
          className="inline-block text-white font-bold px-6 py-3 rounded-xl transition-opacity hover:opacity-80 text-sm"
          style={{ background: '#080A2D' }}
        >
          Contact us
        </Link>
      </section>

    </div>
  );
}
