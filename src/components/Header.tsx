import { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import HeaderNav from "@/components/HeaderNav";
import SidebarDrawer from "@/components/SidebarDrawer";

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
            {/* Mobile — smaller so logo stays dominant */}
            <Link
              to="/predictions"
              className="md:hidden text-[11px] font-medium text-white whitespace-nowrap transition-opacity hover:opacity-80 px-3 py-1.5"
              style={{ background: '#080A2D', borderRadius: '8px' }}
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

      </header>

      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
