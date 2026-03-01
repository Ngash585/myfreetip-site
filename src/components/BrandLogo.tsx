import { Link } from "react-router-dom";

type Props = {
  size?: "sm" | "md" | "lg";
  /** dark = white logo for dark backgrounds (default); light = blue logo for light backgrounds */
  variant?: "dark" | "light";
  className?: string;
};

const heightMap = { sm: "h-7", md: "h-9", lg: "h-11" };

export default function BrandLogo({ size = "md", variant = "dark", className = "" }: Props) {
  const src = variant === "light" ? "/brand/logo-primary.svg" : "/brand/logo-inverse.svg";

  return (
    <Link to="/" aria-label="MyFreeTip home" className={`inline-flex items-center ${className}`}>
      <img
        src={src}
        alt="MyFreeTip"
        className={`${heightMap[size]} w-auto`}
      />
    </Link>
  );
}
