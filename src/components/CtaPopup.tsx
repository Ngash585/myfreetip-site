import { useState, useEffect } from "react";

type Props = {
  delayMs?: number;
  telegramUrl?: string;
};

export default function CtaPopup({
  delayMs = 8000,
  telegramUrl = "https://t.me/BetsmartTi",
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("cta-dismissed")) return;
    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("cta-dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Join our Telegram"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={dismiss} aria-hidden="true" />

      {/* Panel */}
      <div className="relative w-full max-w-sm rounded-3xl border border-[#2a3a4a] bg-[#1a2634] p-8 shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-full p-1 text-[#8a9bb0] hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00c853]/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#00c853">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </div>
          <h2 className="text-xl font-heading font-bold text-white mb-2">Get Tips Instantly!</h2>
          <p className="text-sm text-[#8a9bb0] mb-6">
            Join our Telegram channel to receive daily predictions, booking codes, and winning alerts for free.
          </p>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={dismiss}
            className="block w-full rounded-xl bg-[#00c853] hover:bg-[#00b849] text-[#0f1923] font-bold py-3 transition-colors"
          >
            Join Telegram Channel
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="mt-3 text-sm text-[#8a9bb0] hover:text-white transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
