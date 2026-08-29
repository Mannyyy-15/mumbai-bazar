/**
 * Google "Add to Preferred Sources" button.
 *
 * When a reader opts in, Google favours mumbaibaazar.com for *that reader* in
 * Top Stories, Discover, AI Overviews and AI Mode. Google reports opted-in users
 * are roughly twice as likely to click through to a preferred source.
 *
 * Two things worth knowing:
 * - It is a personalised signal, not a ranking factor. It changes what opted-in
 *   readers see; it does not lift rankings for everyone else.
 * - Only domain and subdomain level sites are eligible, so this must render on
 *   mumbaibaazar.com itself — a subdirectory cannot participate.
 *
 * The library is loaded once from the root route rather than per-instance, so
 * several buttons on a page share a single script.
 */

export function PreferredSourceButton({
  label = "Follow Mumbai Bazar on Google",
  hint = "See our new arrivals and guides first in Google Search and Discover.",
  theme = "light",
  className = "",
}: {
  label?: string;
  hint?: string;
  theme?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gold/45 bg-beige/20 p-6 ${className}`}
      // Google's script mutates the div below; keeping our own copy outside it
      // means a failed script load still leaves a coherent block on the page.
    >
      <p className="font-serif text-lg text-maroon">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{hint}</p>
      <div className="mt-4">
        {/* Google replaces this node with the rendered button. */}
        <div google-add-preferred-source-btn="" data-theme={theme} data-lang="en" />
      </div>
    </div>
  );
}
