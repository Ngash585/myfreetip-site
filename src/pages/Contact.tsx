const EMAILS = [
  { label: "General",      address: "contact@myfreetip.com" },
  { label: "Support",      address: "support@myfreetip.com" },
  { label: "Partnerships", address: "partnerships@myfreetip.com" },
  { label: "Tips",         address: "tips@myfreetip.com" },
];

export default function Contact() {
  return (
    <div className="text-white max-w-2xl mx-auto px-4 py-8">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Get in touch
          </span>
        </div>
        <h1 className="text-3xl font-extrabold mb-3 leading-tight">Contact Us</h1>
        <p className="text-[#8a9bb0] leading-relaxed">
          Questions, partnership enquiries, or just want to say hi — we're easy
          to reach. Pick the right email below or send us a message directly.
        </p>
      </div>

      {/* ── Email addresses ─────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">Email</h2>
        <div className="bg-[#1a2634] rounded-2xl divide-y divide-[#2a3a4a] overflow-hidden">
          {EMAILS.map(({ label, address }) => (
            <div key={label} className="flex items-center justify-between px-5 py-4 gap-4">
              <span className="text-sm text-[#8a9bb0] w-28 flex-shrink-0">{label}</span>
              <a
                href={`mailto:${address}`}
                className="text-sm font-medium text-emerald-400 hover:underline truncate"
              >
                {address}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Address & Phone ─────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">Address &amp; Phone</h2>
        <div className="bg-[#1a2634] rounded-2xl p-5 flex flex-col sm:flex-row gap-6">
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">📍</span>
            <div>
              <p className="text-sm font-semibold text-white mb-1">Office</p>
              <p className="text-sm text-[#8a9bb0] leading-relaxed">
                39 Thistle Street<br />
                Edinburgh, EH2 1DY<br />
                United Kingdom
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">📞</span>
            <div>
              <p className="text-sm font-semibold text-white mb-1">Phone</p>
              <a
                href="tel:+447964431106"
                className="text-sm text-emerald-400 hover:underline"
              >
                +44 7964 431 06
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact form ────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold mb-3">Send us a message</h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-[#1a2634] rounded-2xl p-5 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a9bb0] font-semibold">Your name</label>
            <input
              type="text"
              placeholder="Moses"
              required
              className="bg-[#0f1923] border border-[#2a3a4a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5a6a] focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a9bb0] font-semibold">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="bg-[#0f1923] border border-[#2a3a4a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5a6a] focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a9bb0] font-semibold">Subject</label>
            <select
              className="bg-[#0f1923] border border-[#2a3a4a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="">Select a topic</option>
              <option value="support">Support</option>
              <option value="partnership">Partnership / Advertising</option>
              <option value="tips">Tips &amp; Predictions</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a9bb0] font-semibold">Message</label>
            <textarea
              placeholder="Tell us how we can help…"
              rows={5}
              required
              className="bg-[#0f1923] border border-[#2a3a4a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a5a6a] focus:outline-none focus:border-emerald-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition text-sm"
          >
            Send Message
          </button>

          <p className="text-xs text-[#8a9bb0] text-center">
            We typically reply within 24 hours on weekdays.
          </p>
        </form>
      </section>

    </div>
  );
}
