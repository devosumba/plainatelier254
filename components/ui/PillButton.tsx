"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Variant = "cream" | "dark" | "outline";

const variantClasses: Record<Variant, string> = {
  cream: "bg-cream text-forest-950",
  dark: "bg-forest-950 text-cream",
  outline: "border border-cream/30 text-cream",
};

type PillButtonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function PillButton({
  variant = "cream",
  className = "",
  children,
  href,
  onClick,
  type = "button",
  disabled,
}: PillButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors disabled:opacity-40 ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={base}
    >
      {children}
    </motion.button>
  );
}
