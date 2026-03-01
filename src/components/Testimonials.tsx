const TESTIMONIALS = [
  {
    name: "James O.",
    location: "Lagos, Nigeria",
    avatar: "JO",
    text: "I've been using MyFreeTip for 3 months and my win rate has gone from 40% to over 70%. The booking codes save me so much time.",
    rating: 5,
  },
  {
    name: "Amira K.",
    location: "Nairobi, Kenya",
    avatar: "AK",
    text: "Best free tips site I've found. The predictions are well researched and the Telegram channel gives updates instantly.",
    rating: 5,
  },
  {
    name: "Carlos M.",
    location: "London, UK",
    avatar: "CM",
    text: "Started with small stakes following their accumulators. The confidence rating really helps me decide how much to stake.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section aria-label="Testimonials" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-3">What Our Users Say</h2>
          <p className="text-[#8a9bb0] text-sm">
            Trusted by thousands of bettors across Africa and beyond.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-[#2a3a4a] bg-[#1a2634] p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < t.rating ? "#00c853" : "#2a3a4a"}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-[#e8edf2] leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00c853]/20 text-[#00c853] text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-[#8a9bb0]">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
