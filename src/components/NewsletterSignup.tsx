import { useState } from "react";
import { saveNewsletterEmail } from "@/lib/api";

type Status = "idle" | "loading" | "ok" | "duplicate" | "invalid" | "error";

type Props = {
  /** Visual variant — 'banner' is a full-width section, 'inline' is a compact row for the footer */
  variant?: "banner" | "inline";
  source?: string;
};

export function NewsletterSignup({ variant = "banner", source = "website" }: Props) {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    const result = await saveNewsletterEmail(trimmed, source);
    if (result === "ok") setEmail("");
    setStatus(result);
  }

  if (variant === "inline") {
    return (
      <div>
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#777777' }}>
          Get Daily Tips
        </p>
        {status === "ok" ? (
          <p className="text-sm" style={{ color: '#3DB157' }}>
            You're in! Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="your@email.com"
              className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm outline-none"
              style={{
                background: '#F2EEE9',
                border: `1px solid ${status === "invalid" ? '#C0392B' : 'rgba(29,29,29,0.12)'}`,
                color: '#1D1D1D',
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: '#080A2D' }}
            >
              {status === "loading" ? "…" : "Subscribe"}
            </button>
          </form>
        )}
        {status === "invalid" && (
          <p className="mt-1 text-xs" style={{ color: '#C0392B' }}>Enter a valid email address.</p>
        )}
        {status === "duplicate" && (
          <p className="mt-1 text-xs" style={{ color: '#777777' }}>Already subscribed — you're good!</p>
        )}
        {status === "error" && (
          <p className="mt-1 text-xs" style={{ color: '#C0392B' }}>Something went wrong. Try again.</p>
        )}
      </div>
    );
  }

  // ── Banner variant ──────────────────────────────────────────────────────────
  return (
    <div
      className="rounded-2xl px-6 py-10 sm:px-10 text-center"
      style={{ background: '#080A2D' }}
    >
      <p
        className="text-2xl tracking-tight"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#FAFAEB', fontWeight: 400 }}
      >
        Get tomorrow's tip in your inbox
      </p>
      <p className="mt-2 text-sm" style={{ color: 'rgba(250,250,235,0.55)' }}>
        Free daily predictions, booking codes, and results — straight to you. No spam, ever.
      </p>

      {status === "ok" ? (
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3" style={{ background: 'rgba(61,177,87,0.15)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#3DB157" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <span className="text-sm font-medium" style={{ color: '#3DB157' }}>You're subscribed!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder="Enter your email address"
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${status === "invalid" ? '#e87070' : 'rgba(255,255,255,0.12)'}`,
              color: '#FAFAEB',
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: '#3DB157', color: '#FFFFFF' }}
          >
            {status === "loading" ? "Subscribing…" : "Subscribe — it's free"}
          </button>
        </form>
      )}

      {status === "invalid" && (
        <p className="mt-3 text-xs" style={{ color: '#e87070' }}>
          Please enter a valid email address.
        </p>
      )}
      {status === "duplicate" && (
        <p className="mt-3 text-xs" style={{ color: 'rgba(250,250,235,0.45)' }}>
          That email is already subscribed — you're all set!
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-xs" style={{ color: '#e87070' }}>
          Something went wrong. Please try again.
        </p>
      )}

      <p className="mt-4 text-xs" style={{ color: 'rgba(250,250,235,0.3)' }}>
        Unsubscribe any time · No spam
      </p>
    </div>
  );
}
