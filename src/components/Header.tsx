import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import HeaderNav from "@/components/HeaderNav";
import SidebarDrawer from "@/components/SidebarDrawer";

const STRIP_LINKS = [
  { label: "Predictions", href: "/predictions" },
  { label: "Sports News", href: "/sports-news" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0f1923] border-b border-[#2a3a4a] supports-[backdrop-filter]:backdrop-blur-md bg-[#0f1923]/95">

        {/* ── Top bar ── */}
        <div className="grid grid-cols-3 items-center h-14 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

          {/* Left: hamburger (mobile) / wordmark logo (desktop) */}
          <div className="flex justify-start">
            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 -ml-2 text-white"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Desktop: full wordmark on the left */}
            <div className="hidden md:flex">
              <BrandLogo size="md" />
            </div>
          </div>

          {/* Center: logo (mobile only) */}
          <div className="flex justify-center">
            <div className="md:hidden">
              <BrandLogo size="md" />
            </div>
          </div>

          {/* Right: FREE BETS CTA (mobile) + desktop nav */}
          <div className="flex justify-end items-center gap-3">
            {/* Mobile CTA */}
            <Link
              to="/predictions"
              className="md:hidden px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition-colors whitespace-nowrap"
            >
              Free Bets
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex">
              <HeaderNav />
            </div>
          </div>
        </div>

        {/* ── Mobile nav strip ── */}
        <div
          className="md:hidden overflow-x-auto border-t border-[#2a3a4a]"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex items-center gap-1 px-3 min-w-max">
            {STRIP_LINKS.map(({ label, href }) => (
              <NavLink
                key={href}
                to={href}
                end={href === "/"}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive ? "text-[#00c853]" : "text-white hover:text-[#00c853]"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
