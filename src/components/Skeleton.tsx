import clsx from "clsx";

type Props = {
  className?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
};

const roundedClass = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export function Skeleton({ className, rounded = "md" }: Props) {
  return <div className={clsx("skeleton", roundedClass[rounded], className)} />;
}
