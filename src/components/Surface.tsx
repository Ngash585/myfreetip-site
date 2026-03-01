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
  style,
  ...props
}: Props) {
  const bg =
    variant === "flat" ? "#F2EEE9" : "#FFFFFF";

  const shadow =
    variant === "flat"
      ? undefined
      : "rgba(29, 29, 29, 0.08) 4px 16px 32px 0px";

  const radiusClass = rounded ?? "rounded-2xl";

  return (
    <div
      className={`${radiusClass} ${className}`}
      style={{ background: bg, boxShadow: shadow, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Surface;
