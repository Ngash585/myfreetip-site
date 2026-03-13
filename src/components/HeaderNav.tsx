import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home",        href: "/" },
  { label: "Predictions", href: "/predictions" },
  { label: "Results",     href: "/results" },
  { label: "News",        href: "/sports-news" },
  { label: "Promos",      href: "/promo-codes" },
  { label: "Bookmakers",  href: "/bookmakers" },
  { label: "About",       href: "/about" },
  { label: "Contact",     href: "/contact" },
];

type Props = {
  orientation?: "horizontal" | "vertical";
  onLinkClick?: () => void;
  className?: string;
};

export default function HeaderNav({
  orientation = "horizontal",
  onLinkClick,
  className = "",
}: Props) {
  return (
    <nav
      aria-label="Main navigation"
      className={`flex ${orientation === "vertical" ? "flex-col" : "items-center gap-0"} ${className}`}
    >
      {NAV_LINKS.map(({ label, href }) => (
        <NavLink
          key={href}
          to={href}
          end={href === "/"}
          onClick={onLinkClick}
          className={({ isActive }) =>
            `group relative px-3 py-2 text-sm transition-colors ${
              isActive
                ? "text-[#1D1D1D] font-medium"
                : "text-[#777777] hover:text-[#1D1D1D]"
            } ${
              orientation === "vertical"
                ? "block border-b border-[rgba(29,29,29,0.06)] px-4 py-3"
                : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              {label}
              {orientation === "horizontal" && (
                <span
                  className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-opacity duration-150 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-30"
                  }`}
                  style={{ background: isActive ? "#3DB157" : "#1D1D1D" }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
