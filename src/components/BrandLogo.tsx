import { Link } from "react-router-dom";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = { sm: "text-lg", md: "text-xl", lg: "text-2xl" };
const imgMap = { sm: "h-6", md: "h-8", lg: "h-10" };

export default function BrandLogo({ size = "md", className = "" }: Props) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img
        src="/brand/logo-primary.svg"
        alt=""
        aria-hidden="true"
        className={`${imgMap[size]} w-auto`}
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      <span className={`font-heading font-bold text-white ${sizeMap[size]}`}>
        MyFree<span className="text-[#00c853]">Tip</span>
      </span>
    </Link>
  );
}
