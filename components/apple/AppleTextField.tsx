import { InputHTMLAttributes, forwardRef } from "react";

interface AppleTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

/**
 * AppleTextField — quiet grouped input.
 * Layered fill, squircle corners, blue focus ring. No heavy borders.
 */
export const AppleTextField = forwardRef<HTMLInputElement, AppleTextFieldProps>(
  function AppleTextField({ label, hint, className = "", id, ...props }, ref) {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className="text-[13px] font-medium text-apple-text-secondary uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full bg-apple-bg-secondary rounded-apple-md px-4 py-3 text-[17px] tracking-tight placeholder:text-apple-text-secondary/70 outline-none transition-all duration-200 focus:bg-apple-bg-tertiary/60 focus:ring-2 focus:ring-apple-blue/60 ${className}`}
          {...props}
        />
        {hint && <p className="text-[13px] text-apple-text-secondary">{hint}</p>}
      </div>
    );
  }
);
