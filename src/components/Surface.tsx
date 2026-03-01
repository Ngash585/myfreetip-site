import type { ReactNode, HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  variant?: "default" | "raised" | "flat";
  noPadding?: boolean;
  rounded?: string;
};

export function Surface({
  children,
  variant = "default",
  noPadding: _noPadding,
  rounded,
  className = "",
  ...props
}: Props) {
  const base =
    variant === "raised"
      ? "border border-[#2a3a4a] bg-[#1a2634] shadow-lg"
      : variant === "flat"
      ? "bg-[#1a2634]"
      : "border border-[#2a3a4a] bg-[#1a2634]";

  const radiusClass = rounded ? `rounded-${rounded}` : "rounded-2xl";

  return (
    <div className={`${base} ${radiusClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Surface;
