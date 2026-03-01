const SOCIAL = [
  { label: "Telegram", href: "https://t.me/BetsmartTi", color: "#229ed9" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/myfreetip?igsh=MWV2cGgzY2F2NHJ0Nw==",
    color: "#e1306c",
  },
];

export default function UtilityBar() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="w-full bg-[#0a1219] border-b border-[#2a3a4a] text-xs text-[#8a9bb0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
        <span>
          <span className="text-[#00c853] mr-1">●</span>
          Tips updated:{" "}
          <strong className="text-[#e8edf2]">{today}</strong>
        </span>
        <div className="flex items-center gap-4">
          {SOCIAL.map(({ label, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              style={{ color }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
