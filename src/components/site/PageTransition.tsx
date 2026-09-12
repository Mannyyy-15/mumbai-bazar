import { useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";

/**
 * Re-keys the page on navigation so each route mounts fresh, and carries the
 * `app-page` class that drives the native slide-and-fade.
 *
 * The component already existed and already re-keyed, but it applied no class,
 * so every navigation replaced the content instantly — correct for a website,
 * and a large part of why the native app "felt like a website": real apps move
 * between screens, they do not cut.
 *
 * The animation itself lives in styles.css under `.native-app .app-page`, so it
 * runs ONLY inside the Capacitor webview. On the web this component behaves
 * exactly as it did before — the class is inert there, and nothing about the
 * website changes.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div key={pathname} className="app-page w-full">
      {children}
    </div>
  );
}
