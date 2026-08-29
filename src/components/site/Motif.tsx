export function Motif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <path
        d="M20 3c3 6 8 8 14 8-6 2-11 6-14 12-3-6-8-10-14-12 6 0 11-2 14-8Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="20" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`}>
      <span className="h-px w-10 bg-gold/60" />
      <Motif className="h-3 w-3" />
      <span className="h-px w-10 bg-gold/60" />
    </div>
  );
}
