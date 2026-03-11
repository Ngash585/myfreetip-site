import { Link } from "react-router-dom";
import SocialButtons from "@/components/SocialButtons";

type FooterLink = { label: string; href: string };
type Section    = { heading: string; items: FooterLink[] };

type Props = {
  brand?:      string;
  sections?:   Section[];
  showSocial?: boolean;
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
  brand      = "MyFreeTip",
  sections   = DEFAULT_SECTIONS,
  showSocial = true,
  social = {
    twitter:   "https://x.com/MyFreeTip_",
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
      style={{ background: '#080A2D' }}
    >
      {!compact && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── 1. Social icons — full-width centred row ── */}
          {showSocial && (
            <div className="py-10 flex justify-center">
              <SocialButtons
                size={48}
                branded
                twitter={social.twitter}
                instagram={social.instagram}
                telegram={social.telegram}
                facebook={social.facebook}
                className="gap-4"
              />
            </div>
          )}

          {/* ── 2. Navigation columns ── */}
          <div className="pb-10 grid grid-cols-2 gap-x-6 gap-y-8 max-w-xs sm:max-w-sm">
            {sections.map((section) => {
              const id = `footer-${section.heading.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <nav key={section.heading} aria-labelledby={id}>
                  <h2
                    id={id}
                    className="text-xs font-medium uppercase tracking-widest mb-3"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    {section.heading}
                  </h2>
                  <ul className="space-y-2">
                    {section.items.map((it) => {
                      const cls = "block text-sm transition-opacity hover:opacity-60";
                      const st  = { color: 'rgba(255,255,255,0.70)', fontWeight: 300 };
                      return it.href.startsWith("http") ? (
                        <li key={it.label}>
                          <a href={it.href} target="_blank" rel="noreferrer" className={cls} style={st}>
                            {it.label}
                          </a>
                        </li>
                      ) : (
                        <li key={it.label}>
                          <Link to={it.href} className={cls} style={st}>
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

      {/* ── 3. Copyright / disclaimer strip ── */}
      <div
        className="py-6 text-center space-y-1"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.30)' }}
      >
        <p className="text-xs">Free daily football predictions. Play responsibly.</p>
        <p className="text-xs">Predictions are opinions and not guaranteed. This site may earn commission through affiliate links.</p>
        <p className="text-xs">© {year} {brand}. All rights reserved.</p>
      </div>
    </footer>
  );
}
