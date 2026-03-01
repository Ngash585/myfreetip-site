import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home",        href: "/" },
  { label: "Predictions", href: "/predictions" },
  { label: "News",        href: "/sports-news" },
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
          className="relative px-3 py-2 text-sm transition-colors"
          style={({ isActive }) => ({
            color: isActive ? "#1D1D1D" : "#777777",
            fontWeight: isActive ? 500 : 400,
            ...(orientation === "vertical" && {
              borderBottom: "1px solid rgba(29,29,29,0.06)",
              padding: "12px 16px",
              display: "block",
            }),
          })}
        >
          {({ isActive }) => (
            <>
              {label}
              {isActive && orientation === "horizontal" && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                  style={{ background: "#3DB157" }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
