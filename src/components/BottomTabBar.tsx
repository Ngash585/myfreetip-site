import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function isTabActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

// ── Icon render functions — receive active state ──────────────────────────────

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PredictionsIcon({ active }: { active: boolean }) {
  return (
    <Lightbulb
      width={22}
      height={22}
      stroke={active ? "#F59E0B" : "#FACC15"}
      fill={active ? "rgba(245,158,11,0.18)" : "none"}
      strokeWidth={2}
    />
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

function ContactIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS = [
  { label: "Home",        href: "/",            isPredictions: false },
  { label: "Predictions", href: "/predictions",  isPredictions: true  },
  { label: "News",        href: "/sports-news",  isPredictions: false },
  { label: "About",       href: "/about",        isPredictions: false },
  { label: "Contact",     href: "/contact",      isPredictions: false },
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
          {TABS.map(({ label, href, isPredictions }) => {
            const active = isTabActive(href, location.pathname);

            const iconColor = isPredictions
              ? active ? "#F59E0B" : "#FACC15"
              : active ? "#3DB157" : "#777777";

            const activePillBg = isPredictions
              ? "rgba(245,158,11,0.08)"
              : "rgba(61,177,87,0.08)";

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
                      style={{ background: activePillBg }}
                    />
                  )}

                  {/* Icon */}
                  <span
                    className="relative z-10 flex items-center justify-center"
                    style={{
                      color: iconColor,
                      filter: active && isPredictions
                        ? "drop-shadow(0 0 5px rgba(245,158,11,0.55))"
                        : undefined,
                    }}
                  >
                    {isPredictions ? (
                      <PredictionsIcon active={active} />
                    ) : href === "/" ? (
                      <HomeIcon />
                    ) : href === "/sports-news" ? (
                      <NewsIcon />
                    ) : href === "/about" ? (
                      <AboutIcon />
                    ) : (
                      <ContactIcon />
                    )}
                  </span>

                  {/* Label */}
                  <span
                    className="relative z-10 text-[10px] leading-none"
                    style={{
                      color: iconColor,
                      fontWeight: active ? 600 : 400,
                    }}
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
