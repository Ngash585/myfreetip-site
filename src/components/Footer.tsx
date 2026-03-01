// src/components/Footer.tsx
import { Link } from "react-router-dom";
import SocialButtons from "@/components/SocialButtons";

type FooterLink = { label: string; href: string };
type Section = { heading: string; items: FooterLink[] };

type Props = {
  brand?: string;
  description?: string;
  sections?: Section[];
  showSocial?: boolean;
  social?: {
    twitter?: string;
    instagram?: string;
    telegram?: string;
    facebook?: string;
  };
  className?: string;
  compact?: boolean;
  year?: number;
};

/* -------------------- Default Sections (REAL PAGES ONLY) -------------------- */
const DEFAULT_SECTIONS: Section[] = [
  {
    heading: "Pages",
    items: [
      { label: "Home", href: "/" },
      { label: "Predictions", href: "/predictions" },
      { label: "Sports News", href: "/sports-news" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer({
  brand = "MyFreeTip",
  description = "Free daily football tips. 18+ only — bet responsibly.",
  sections = DEFAULT_SECTIONS,
  showSocial = true,
  social = {
    twitter: "https://x.com/Nganga_Kimingi",
    facebook: "https://www.facebook.com/profile.php?id=61576700997754",
    instagram: "https://www.instagram.com/myfreetip?igsh=MWV2cGgzY2F2NHJ0Nw==",
    telegram: "https://t.me/BetsmartTi",
  },
  className = "",
  compact = false,
  year = new Date().getFullYear(),
}: Props) {
  return (
    <footer
      role="contentinfo"
      className={[
        "mt-10 border-t border-[var(--border)]",
        "bg-[var(--surface)]/70 supports-[backdrop-filter]:backdrop-blur",
        "text-[color:var(--text)]",
        className,
      ].join(" ")}
    >
      {!compact && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div
            className="
              grid gap-x-6 gap-y-6
              grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
              rounded-3xl border border-[var(--border)]
              bg-[var(--surface)]/80 supports-[backdrop-filter]:backdrop-blur
              p-5 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]
            "
          >
            {/* Brand / Description */}
            <section aria-labelledby="footer-about" className="col-span-2 sm:col-span-1">
              <h2 id="footer-about" className="text-base font-bold tracking-tight">
                {brand}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[color:var(--text)]/80">
                {description}
              </p>

              <p className="mt-2 text-xs leading-5 text-[color:var(--text)]/70">
                Predictions are opinions and not guaranteed. This site may earn commission through affiliate links.
              </p>

              {showSocial && (
                <div className="mt-5">
                  <SocialButtons
                    size={45}
                    twitter={social.twitter}
                    instagram={social.instagram}
                    telegram={social.telegram}
                    facebook={social.facebook}
                  />
                </div>
              )}
            </section>

            {/* Link Sections */}
            {sections.map((section) => {
              const id = `footer-${section.heading.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <nav key={section.heading} className="sm:min-w-[12rem]" aria-labelledby={id}>
                  <h2 id={id} className="text-sm font-semibold mb-1">
                    {section.heading}
                  </h2>
                  <ul className="mt-1 space-y-1">
                    {section.items.map((it) => {
                      const classes =
                        "block text-sm leading-6 text-[color:var(--text)]/85 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded";
                      return it.href.startsWith("http") ? (
                        <li key={it.label}>
                          <a href={it.href} target="_blank" rel="noreferrer" className={classes}>
                            {it.label}
                          </a>
                        </li>
                      ) : (
                        <li key={it.label}>
                          <Link to={it.href} className={classes}>
                            {it.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[color:var(--text)]/70">
        © {year} {brand}. All rights reserved.
      </div>
    </footer>
  );
}