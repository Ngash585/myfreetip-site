import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import HeaderNav from "@/components/HeaderNav";
import SidebarDrawer from "@/components/SidebarDrawer";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#2a3a4a] bg-[#0f1923]/95 supports-[backdrop-filter]:backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <BrandLogo />

            {/* Desktop nav */}
            <div className="hidden md:flex">
              <HeaderNav />
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 rounded-md text-[#8a9bb0] hover:text-white hover:bg-[#2a3a4a] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <SidebarDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
