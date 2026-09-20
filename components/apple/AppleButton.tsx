import { ButtonHTMLAttributes, forwardRef } from "react";

type AppleButtonVariant = "primary" | "secondary" | "destructive";
type AppleButtonSize = "medium" | "large";

interface AppleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppleButtonVariant;
  size?: AppleButtonSize;
}

const variantStyles: Record<AppleButtonVariant, string> = {
  primary: "bg-apple-blue text-white hover:opacity-90",
  secondary: "bg-apple-bg-secondary text-apple-blue hover:bg-apple-bg-tertiary",
  destructive: "bg-apple-red text-white hover:opacity-90",
};

const sizeStyles: Record<AppleButtonSize, string> = {
  medium: "px-5 py-2.5 text-[15px]",
  large: "px-6 py-3 text-base",
};

/**
 * AppleButton — borderless HIG button.
 * Pill shape, solid accent fill, press-down micro-interaction.
 */
export const AppleButton = forwardRef<HTMLButtonElement, AppleButtonProps>(
  function AppleButton(
    { variant = "primary", size = "large", className = "", type = "button", ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={`inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);
