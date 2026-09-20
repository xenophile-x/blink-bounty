import { ReactNode } from "react";

interface AppleCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * AppleCard — elevated content block.
 * Layered gray in both modes + soft diffuse shadow. No hard borders.
 */
export function AppleCard({ title, subtitle, children, className = "", id }: AppleCardProps) {
  return (
    <section
      id={id}
      className={`bg-apple-bg-secondary rounded-apple-lg p-6 shadow-apple-soft transition-shadow duration-200 hover:shadow-apple-hover ${className}`}
    >
      {title && (
        <h3 className="text-xl font-semibold tracking-tight mb-1">{title}</h3>
      )}
      {subtitle && (
        <p className="text-apple-text-secondary text-sm mb-4">{subtitle}</p>
      )}
      {children}
    </section>
  );
}
