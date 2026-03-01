import { Link } from "react-router-dom";
import SocialButtons from "@/components/SocialButtons";

type FooterLink = { label: string; href: string };
type Section    = { heading: string; items: FooterLink[] };

type Props = {
  brand?:       string;
  description?: string;
  sections?:    Section[];
  showSocial?:  boolean;
  social?: {
    twitter?:   string;
    instagram?: string;
    telegram?:  string;
    facebook?:  string;
  };
  className?: string;
  compact?:   boolean;
  year?:      number;
};

const DEFAULT_SECTIONS: Section[] = [
  {
    heading: "Pages",
    items: [
      { label: "Home",        href: "/" },
      { label: "Predictions", href: "/predictions" },
      { label: "News",        href: "/sports-news" },
      { label: "About",       href: "/about" },
      { label: "Contact",     href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms",   href: "/terms" },
    ],
  },
];

export default function Footer({
  brand       = "MyFreeTip",
  description = "Free daily football tips. 18+ only — bet responsibly.",
  sections    = DEFAULT_SECTIONS,
  showSocial  = true,
  social = {
    twitter:   "https://x.com/Nganga_Kimingi",
    facebook:  "https://www.facebook.com/profile.php?id=61576700997754",
    instagram: "https://www.instagram.com/myfreetip?igsh=MWV2cGgzY2F2NHJ0Nw==",
    telegram:  "https://t.me/BetsmartTi",
  },
  className = "",
  compact   = false,
  year      = new Date().getFullYear(),
}: Props) {
  return (
    <footer
      role="contentinfo"
      className={className}
      style={{ borderTop: '1px solid rgba(29,29,29,0.08)', background: '#F8F4EF' }}
    >
      {!compact && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div
            className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-[2fr_1fr_1fr] rounded-2xl p-6 sm:p-8"
            style={{
              background: '#FFFFFF',
              boxShadow: 'rgba(29,29,29,0.06) 0 4px 24px 0',
            }}
          >
            {/* Brand */}
            <section aria-labelledby="footer-about" className="col-span-2 md:col-span-1">
              <h2
                id="footer-about"
                className="text-base tracking-[-0.02em]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1D1D1D', fontWeight: 400 }}
              >
                {brand}
              </h2>
              <p className="mt-2 text-sm leading-6" style={{ color: '#4F4841', fontWeight: 300 }}>
                {description}
              </p>
              <p className="mt-2 text-xs leading-5" style={{ color: '#777777', fontWeight: 300 }}>
                Predictions are opinions and not guaranteed. This site may earn commission through affiliate links.
              </p>
              {showSocial && (
                <div className="mt-5">
                  <SocialButtons
                    size={40}
                    twitter={social.twitter}
                    instagram={social.instagram}
                    telegram={social.telegram}
                    facebook={social.facebook}
                  />
                </div>
              )}
            </section>

            {/* Link sections */}
            {sections.map((section) => {
              const id = `footer-${section.heading.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <nav key={section.heading} aria-labelledby={id}>
                  <h2
                    id={id}
                    className="text-xs font-medium uppercase tracking-widest mb-3"
                    style={{ color: '#777777' }}
                  >
                    {section.heading}
                  </h2>
                  <ul className="space-y-2">
                    {section.items.map((it) => {
                      const cls = "block text-sm transition-colors hover:opacity-70";
                      const style = { color: '#4F4841', fontWeight: 300 };
                      return it.href.startsWith("http") ? (
                        <li key={it.label}>
                          <a href={it.href} target="_blank" rel="noreferrer" className={cls} style={style}>
                            {it.label}
                          </a>
                        </li>
                      ) : (
                        <li key={it.label}>
                          <Link to={it.href} className={cls} style={style}>
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

      <div
        className="py-4 text-center text-xs"
        style={{ borderTop: '1px solid rgba(29,29,29,0.08)', color: '#777777' }}
      >
        © {year} {brand}. All rights reserved.
      </div>
    </footer>
  );
}
