const STEPS = [
  {
    step: "01",
    title: "Browse Predictions",
    description: "Browse our daily football predictions across top leagues worldwide.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Pick Your Bookmaker",
    description: "Choose from our recommended bookmakers and claim your welcome bonus.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Use the Booking Code",
    description: "Enter the booking code directly into your bookmaker — no manual selection needed.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 10h16M4 14h8" />
        <rect x="14" y="12" width="8" height="8" rx="1" />
        <path d="m17 16 2 2 3-3" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Win & Repeat",
    description: "Track your results with our analyst stats and keep stacking wins.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

export default function Howitworks() {
  return (
    <section aria-label="How it works" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-3">How It Works</h2>
          <p className="text-[#8a9bb0] max-w-lg mx-auto text-sm">
            Get started with free football predictions in 4 simple steps.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, title, description, icon }) => (
            <div key={step} className="rounded-2xl border border-[#2a3a4a] bg-[#1a2634] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00c853]/10 text-[#00c853]">
                  {icon}
                </div>
                <span className="font-mono text-2xl font-bold text-[#2a3a4a]">{step}</span>
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-[#8a9bb0] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
