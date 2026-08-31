import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "../utils/cn";

const sizeClass = {
  small: "px-3 py-1.5 text-base",
  large: "px-5 py-3 text-xl",
} as const;

const roundClass = {
  small: "rounded-[10px]",
  large: "rounded-[50px]",
} as const;

const variantClass = {
  primary: "bg-brand-primary text-bg-white",
  outlined: "bg-bg-white border border-2 border-scale-100 text-scale-600",
  gray: "bg-scale-100 text-scale-500",
  darkgray: "bg-scale-200 text-scale-300",
  kakao: "bg-point-kakao text-scale-600",
  disabled: "bg-brand-secondary text-[#C5B6AD] cursor-not-allowed",
} as const;

type Size = keyof typeof sizeClass;
type Variant = keyof typeof variantClass;

interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: Variant;
  size?: Size;
  isRounded?: boolean;
}

export function Button({
  children,
  className,
  disabled = false,
  variant = "primary",
  size = "large",
  isRounded = false,
  ...props
}: ButtonProps) {
  const buttonClass = cn(
    "font-bold cursor-pointer",
    className,
    sizeClass[size],
    isRounded ? roundClass["large"] : roundClass["small"],
    variantClass[disabled ? "disabled" : variant],
  );

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
