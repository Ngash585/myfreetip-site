import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import HeaderNav from "@/components/HeaderNav";
import SidebarDrawer from "@/components/SidebarDrawer";

const STRIP_LINKS = [
  { label: "Predictions", href: "/predictions" },
  { label: "News",        href: "/sports-news" },
  { label: "About",       href: "/about" },
  { label: "Contact",     href: "/contact" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full"
        style={{ background: '#F8F4EF', borderBottom: '1px solid rgba(29,29,29,0.08)' }}
      >
        {/* ── Top bar ── */}
        <div className="grid grid-cols-3 items-center h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

          {/* Left: hamburger (mobile) / logo (desktop) */}
          <div className="flex justify-start">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 -ml-2"
              style={{ color: '#1D1D1D' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="hidden md:flex">
              <BrandLogo size="md" />
            </div>
          </div>

          {/* Center: logo (mobile only) */}
          <div className="flex justify-center md:hidden">
            <BrandLogo size="md" />
          </div>

          {/* Right: CTA */}
          <div className="flex justify-end items-center gap-4">
            {/* Mobile */}
            <Link
              to="/predictions"
              className="md:hidden text-xs font-medium text-white whitespace-nowrap transition-opacity hover:opacity-80 px-4 py-2"
              style={{ background: '#080A2D', borderRadius: '10px' }}
            >
              Get Started
            </Link>
            {/* Desktop nav + CTA */}
            <div className="hidden md:flex items-center gap-2">
              <HeaderNav />
              <Link
                to="/predictions"
                className="ml-4 text-sm font-medium text-white whitespace-nowrap transition-opacity hover:opacity-80 px-5 py-2"
                style={{ background: '#080A2D', borderRadius: '10px' }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mobile nav strip ── */}
        <div
          className="md:hidden overflow-x-auto"
          style={{ borderTop: '1px solid rgba(29,29,29,0.08)', scrollbarWidth: 'none' }}
        >
          <div className="flex items-center px-3 min-w-max">
            {STRIP_LINKS.map(({ label, href }) => (
              <NavLink
                key={href}
                to={href}
                end={href === "/"}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive ? 'text-[#3DB157]' : 'text-[#777777] hover:text-[#1D1D1D]'
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
