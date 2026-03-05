import { NavLink } from "react-router-dom";

const TABS = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Predictions",
    href: "/predictions",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    label: "News",
    href: "/sports-news",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6Z" />
      </svg>
    ),
  },
  {
    label: "About",
    href: "/about",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "/contact",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function BottomTabBar() {
  return (
    <nav
      aria-label="Bottom navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
      style={{
        background: '#F8F4EF',
        borderTop: '1px solid rgba(29,29,29,0.10)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ label, href, icon }) => (
        <NavLink
          key={href}
          to={href}
          end={href === "/"}
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
              isActive ? "text-[#3DB157]" : "text-[#777777]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                style={{
                  color: isActive ? '#3DB157' : '#777777',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </span>
              <span
                className="text-[10px] font-medium leading-none"
                style={{ color: isActive ? '#3DB157' : '#777777' }}
              >
                {label}
              </span>
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: '#3DB157' }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
