import { Link } from "react-router-dom";

type Props = {
  size?: "sm" | "md" | "lg";
  /** dark = white text (admin/dark surfaces); light = dark text (default, public site) */
  variant?: "light" | "dark";
  className?: string;
};

const sizeMap = { sm: "text-lg", md: "text-[22px]", lg: "text-2xl" };

export default function BrandLogo({ size = "md", variant = "light", className = "" }: Props) {
  const color = variant === "dark" ? "#FFFFFF" : "#1D1D1D";

  return (
    <Link to="/" aria-label="MyFreeTip home" className={`inline-flex items-center ${className}`}>
      <span
        className={`${sizeMap[size]} leading-none tracking-[-0.03em]`}
        style={{ fontFamily: "'DM Serif Display', Georgia, serif", color, fontWeight: 400 }}
      >
        My<em>FreeTip</em>
      </span>
    </Link>
  );
}
