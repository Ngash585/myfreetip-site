import { useEffect } from "react";
import BrandLogo from "@/components/BrandLogo";
import HeaderNav from "@/components/HeaderNav";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SidebarDrawer({ open, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          "fixed top-0 left-0 z-50 h-full w-72 bg-[#1a2634] border-r border-[#2a3a4a]",
          "flex flex-col transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2a3a4a]">
          <BrandLogo />
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="p-2 rounded-md text-[#8a9bb0] hover:text-white hover:bg-[#2a3a4a] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <HeaderNav orientation="vertical" onLinkClick={onClose} />
        </div>
      </div>
    </>
  );
}
