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
    body: "Every tip comes with a booking code ready to paste directly into 1xBet, Paripesa, Melbet and more. No searching. No manual slip building. One paste and your selections are loaded.",
  },
  {
    icon: "🎁",
    title: "We tell you about the bonuses",
    body: "Welcome offers exist on every platform. Most bettors never claim them. We show you which ones are worth using and how to combine them with today's pick — free money most people leave on the table.",
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
  { label: "Tips Published",    value: "63+" },
  { label: "Markets Covered",   value: "12+" },
  { label: "Partner Bookies",   value: "4"   },
];

const PARTNERS = [
  { name: "1xBet",     logo: "/1xbet.png",    url: "https://1xbet.com"    },
  { name: "Paripesa",  logo: "/paripesa.png",  url: "https://paripesa.com" },
  { name: "Melbet",    logo: "/melbet.png",    url: "https://melbet.com"   },
  { name: "Sportsbet", logo: "/sportsbet.png", url: "https://sportsbet.io" },
];

export default function About() {
  return (
    <div className="text-white max-w-2xl mx-auto px-4 py-8">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            About us
          </span>
        </div>
        <h1 className="text-3xl font-extrabold mb-4 leading-tight">
          Stop guessing.<br />Start winning.
        </h1>
        <p className="text-[#8a9bb0] leading-relaxed">
          Every day, our analysis finds the highest-confidence match and gives
          you a booking code — just paste it into 1xBet, Paripesa, Melbet and
          more. It costs you nothing.
        </p>
      </section>

      {/* ── We know why you're here ──────────────────────────────── */}
      <section className="mb-10">
        <div className="bg-[#1a2634] border-l-4 border-emerald-500 rounded-2xl p-5">
          <h2 className="text-base font-bold text-white mb-3">
            We know why you're here
          </h2>
          <div className="space-y-3 text-sm text-[#8a9bb0] leading-relaxed">
            <p>
              You've followed tipsters who disappeared after a bad week. You've
              seen win rates that never show the losses. You've copied a code
              that expired before you could use it. You've lost money you
              couldn't afford to lose and didn't fully understand why.
            </p>
            <p className="text-white font-medium">
              That's not bad luck. That's a broken system. We built MyFreeTip
              to fix it.
            </p>
          </div>
        </div>
      </section>

      {/* ── What we do differently ───────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">What we do differently</h2>
        <div className="flex flex-col gap-3">
          {WHAT_WE_DO_DIFFERENTLY.map((item) => (
            <div key={item.title} className="bg-[#1a2634] rounded-2xl p-5 flex gap-4">
              <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="font-bold text-white mb-1">{item.title}</p>
                <p className="text-sm text-[#8a9bb0] leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What we don't do ─────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">What we don't do</h2>
        <div className="bg-[#1a2634] rounded-2xl p-5">
          <ul className="space-y-3">
            {WHAT_WE_DONT_DO.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[#8a9bb0]">
                <span className="w-5 h-5 flex-shrink-0 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center text-xs font-bold">
                  ✕
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Our record ───────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">Our record</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#1a2634] rounded-2xl p-5 text-center">
              <p className="text-3xl font-extrabold text-emerald-400">{s.value}</p>
              <p className="text-xs text-[#8a9bb0] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#8a9bb0] text-center">
          Record updated as results are confirmed. Wins and losses both shown, always.
        </p>
      </section>

      {/* ── Our analyst ──────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">Our analyst</h2>
        <div className="bg-[#1a2634] rounded-2xl p-5 flex gap-4 items-start">
          <div className="w-14 h-14 flex-shrink-0 rounded-full bg-[#0f1923] border-2 border-emerald-500/40 flex items-center justify-center text-2xl">
            🎯
          </div>
          <div>
            <p className="font-bold text-white">TipMaster</p>
            <p className="text-xs text-emerald-400 mb-2">Lead Analyst · 73% Win Rate</p>
            <p className="text-sm text-[#8a9bb0] leading-relaxed">
              Six years analysing football data across the Premier League,
              Champions League, La Liga, and African leagues. Specialises in
              goals markets, Asian handicaps, and value accumulator builds.
              Every tip is backed by statistical evidence, not gut feeling.
            </p>
          </div>
        </div>
      </section>

      {/* ── Partner bookmakers ───────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-1">Our partner bookmakers</h2>
        <p className="text-xs text-[#8a9bb0] mb-4">
          We only partner with bookmakers we'd use ourselves.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-[#1a2634] rounded-2xl p-4 flex items-center gap-3 hover:ring-1 hover:ring-emerald-500/40 transition"
            >
              <img src={p.logo} alt={p.name} className="w-8 h-8 object-contain rounded" />
              <span className="text-sm font-semibold text-white">{p.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Affiliate Disclosure (legally required) ──────────────── */}
      <section className="mb-10">
        <div className="bg-[#1a2634] border border-amber-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-lg">⚠️</span>
            <h2 className="text-base font-bold text-amber-400">Affiliate Disclosure</h2>
          </div>
          <div className="space-y-3 text-sm text-[#8a9bb0] leading-relaxed">
            <p>
              MyFreeTip earns commission when you register or deposit with our
              partner bookmakers through links on this site. This is how we fund
              the platform and keep all tips free.
            </p>
            <p>
              Our affiliate relationships do{" "}
              <strong className="text-white">not</strong> influence our
              predictions. Tips are selected on statistical merit only. We will
              never recommend a bet to benefit our affiliate revenue at the
              expense of your results.
            </p>
            <p>
              All listed bookmakers are licensed operators. Always check that
              online betting is legal in your country before registering.
            </p>
          </div>
        </div>
      </section>

      {/* ── Responsible Gambling ─────────────────────────────────── */}
      <section className="mb-10">
        <div className="bg-[#1a2634] border border-[#2a3a4a] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🛡️</span>
            <h2 className="text-base font-bold text-white">Responsible Gambling</h2>
          </div>
          <div className="space-y-3 text-sm text-[#8a9bb0] leading-relaxed">
            <p>
              Betting should be entertainment, not a source of income. Never
              stake money you cannot afford to lose. Past results do not
              guarantee future returns — even a 73% win rate means losses happen.
            </p>
            <p>
              Set a budget before you bet and stick to it. If gambling is
              affecting your finances, relationships, or mental health, please
              seek help. You must be{" "}
              <strong className="text-white">18 years or older</strong> to use
              this site.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────────── */}
      <section className="text-center">
        <p className="text-sm text-[#8a9bb0] mb-3">
          Have a question or partnership enquiry?
        </p>
        <Link
          to="/contact"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
        >
          Contact us
        </Link>
      </section>

    </div>
  );
}
