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
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(29, 29, 29, 0.35)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          "fixed top-0 left-0 z-50 h-full w-72 flex flex-col",
          "transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ background: '#F8F4EF', borderRight: '1px solid rgba(29,29,29,0.08)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(29,29,29,0.08)' }}
        >
          <BrandLogo />
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="p-2 rounded-md transition-colors hover:bg-black/5"
            style={{ color: '#777777' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <HeaderNav orientation="vertical" onLinkClick={onClose} />
        </div>
      </div>
    </>
  );
}
