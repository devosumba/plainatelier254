"use client";

import { motion } from "framer-motion";

type Variant = "cream" | "dark" | "outlineOnDark" | "outlineOnLight";

const variantClasses: Record<Variant, string> = {
  cream: "bg-cream text-forest-950",
  dark: "bg-forest-950 text-cream",
  outlineOnDark: "border border-cream/25 text-cream",
  outlineOnLight: "border border-forest-950/20 text-forest-950",
};

type CircleIconButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  label: string;
  className?: string;
  disabled?: boolean;
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export default function CircleIconButton({
  children,
  onClick,
  variant = "cream",
  size = "md",
  label,
  className = "",
  disabled = false,
}: CircleIconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      className={`flex shrink-0 items-center justify-center rounded-full disabled:opacity-30 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
