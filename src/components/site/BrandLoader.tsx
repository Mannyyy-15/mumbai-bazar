/**
 * Branded loading state.
 *
 * Shown while a route's loader is in flight. Before this there was no pending
 * component at all, so a navigation that had to wait for the network showed
 * nothing — a blank area under the header, which on a phone reads as a broken
 * tap rather than as loading.
 *
 * Two sizes, one component:
 *
 *   `page`    fills the content area during route navigation. Used as the
 *             router's defaultPendingComponent.
 *   `inline`  small, for a section waiting on its own data.
 *
 * The mark is the MB monogram from public/logo.png, breathing rather than
 * spinning. A spinner is generic; the logo is the one thing on screen that
 * says whose app this is, which matters most in the first seconds after a tap.
 */

export function BrandLoader({
  variant = "page",
  label = "Loading",
}: {
  variant?: "page" | "inline";
  label?: string;
}) {
  const isPage = variant === "page";

  return (
    <div
      className={
        isPage
          ? "flex min-h-[60vh] w-full flex-col items-center justify-center gap-5 bg-ivory"
          : "flex w-full flex-col items-center justify-center gap-3 py-10"
      }
      // Announced to screen readers without hijacking focus. `polite` because a
      // loading state should not interrupt whatever is being read.
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={isPage ? "relative h-16 w-16" : "relative h-10 w-10"}>
        {/* The ring: a slow rotation in brand gold, so there is honest motion
            even on a slow connection where the pulse alone could look frozen. */}
        <span className="absolute inset-0 rounded-full border-2 border-gold/25 border-t-gold animate-brand-spin" />

        {/* The monogram, gently breathing inside the ring. */}
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          width={isPage ? 40 : 24}
          height={isPage ? 27 : 16}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain animate-brand-pulse ${
            isPage ? "w-10" : "w-6"
          }`}
          // Eager: this is the thing the customer is waiting to see. Lazy
          // loading the indicator that says "loading" defeats the purpose.
          loading="eager"
          decoding="async"
        />
      </div>

      {isPage && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-taupe">{label}</p>
      )}

      {/* Visible text is decorative above; this is what is actually announced. */}
      <span className="sr-only">{label}</span>
    </div>
  );
}
