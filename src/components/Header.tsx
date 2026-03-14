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
        <div className="flex items-center h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-2 -ml-2 mr-2"
            style={{ color: '#1D1D1D' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo — centred on mobile, left on desktop */}
          <div className="flex-1 flex md:flex-none justify-center md:justify-start">
            <BrandLogo size="md" />
          </div>

          {/* Desktop: nav + CTA — pushed to the right */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <HeaderNav />
            <Link
              to="/predictions"
              className="ml-4 text-sm font-medium text-white whitespace-nowrap transition-opacity hover:opacity-80 px-5 py-2"
              style={{ background: '#080A2D', borderRadius: '10px' }}
            >
              Today's Tips
            </Link>
          </div>

          {/* Mobile CTA */}
          <Link
            to="/predictions"
            className="md:hidden text-[11px] font-medium text-white whitespace-nowrap transition-opacity hover:opacity-80 px-3 py-1.5"
            style={{ background: '#080A2D', borderRadius: '8px' }}
          >
            Today's Tips
          </Link>
        </div>

      </header>

      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
