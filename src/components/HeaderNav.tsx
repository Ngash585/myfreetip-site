import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Predictions", href: "/predictions" },
  { label: "Sports News", href: "/sports-news" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
      className={`flex ${orientation === "vertical" ? "flex-col gap-1" : "items-center gap-1"} ${className}`}
    >
      {NAV_LINKS.map(({ label, href }) => (
        <NavLink
          key={href}
          to={href}
          end={href === "/"}
          onClick={onLinkClick}
          className={({ isActive }) =>
            [
              "px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "text-[#00c853] bg-[#00c853]/10"
                : "text-[#8a9bb0] hover:text-white hover:bg-[#2a3a4a]",
            ].join(" ")
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
