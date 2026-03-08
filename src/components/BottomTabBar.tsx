import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Helpers ──────────────────────────────────────────────────────────────────

function isTabActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PredictionsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ResultsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
      <line x1="3"  y1="20" x2="21" y2="20" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS = [
  { label: "Home",        href: "/",            Icon: HomeIcon        },
  { label: "Picks",       href: "/predictions",  Icon: PredictionsIcon },
  { label: "Results",     href: "/results",      Icon: ResultsIcon     },
  { label: "News",        href: "/sports-news",  Icon: NewsIcon        },
  { label: "About",       href: "/about",        Icon: AboutIcon       },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function BottomTabBar() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    function onScroll() {
      setIsVisible(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          aria-label="Bottom navigation"
          className="md:hidden fixed z-[9999] flex"
          style={{
            bottom: 12,
            left: 16,
            right: 16,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "16px",
            boxShadow: "0 -4px 30px rgba(0,0,0,0.10), 0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid rgba(29,29,29,0.07)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          {TABS.map(({ label, href, Icon }) => {
            const active = isTabActive(href, location.pathname);
            const iconColor = active ? "#3DB157" : "#777777";

            return (
              <NavLink
                key={href}
                to={href}
                end={href === "/"}
                className="relative flex-1"
                style={{ textDecoration: "none" }}
              >
                <motion.div
                  className="relative flex flex-col items-center justify-center gap-0.5 py-2.5 px-1"
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {/* Active pill background */}
                  {active && (
                    <span
                      className="absolute inset-x-1 top-1 bottom-1 rounded-xl"
                      style={{ background: "rgba(61,177,87,0.08)" }}
                    />
                  )}

                  {/* Icon */}
                  <span
                    className="relative z-10 flex items-center justify-center"
                    style={{ color: iconColor }}
                  >
                    <Icon />
                  </span>

                  {/* Label */}
                  <span
                    className="relative z-10 text-[10px] leading-none"
                    style={{ color: iconColor, fontWeight: active ? 600 : 400 }}
                  >
                    {label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
