type IconProps = { className?: string };

export function ArrowUpRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDownIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 5v14M12 19l-6-6M12 19l6-6"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CartIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="21" r="1.4" fill="currentColor" />
      <circle cx="17" cy="21" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function HeartIcon({
  className = "h-4 w-4",
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className={className}>
      <path
        d="M12 20.5s-7.5-4.6-10-9.3C0.4 8 2 4.5 5.6 4c2-.3 3.9.7 5 2.3a1 1 0 0 0 1.8 0c1.1-1.6 3-2.6 5-2.3 3.6.5 5.2 4 3.6 7.2-2.5 4.7-10 9.3-10 9.3z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MinusIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TrashIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DiscIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.6} />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}
