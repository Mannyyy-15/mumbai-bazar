import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,

    // Preload on intent.
    //
    // Nothing preloaded before this: `defaultPreload` was unset, so every tap
    // paid a full round-trip to the server before anything rendered. That is
    // tolerable on desktop broadband and awful in the native app, where the
    // shell loads the live site over mobile data — it was the main reason
    // opening a product felt slow next to a real app.
    //
    // "intent" starts the load on hover (desktop) or touchstart (phone). A
    // touch-to-release is ~100ms, and the loader gets that head start, which is
    // most of the difference between "laggy" and "instant".
    defaultPreload: "intent",

    // Wait 40ms before acting, so scrolling a grid past twenty product cards
    // does not fire twenty loads. Long enough to filter out a scroll, short
    // enough that a deliberate press still gets the head start.
    defaultPreloadDelay: 40,

    // Was 0 — meaning a preloaded route was considered stale the instant it
    // arrived, so tapping the link fetched it AGAIN. Thirty seconds makes the
    // preload actually count while keeping prices fresh; the catalogue is
    // re-fetched on its own five-minute cycle regardless.
    defaultPreloadStaleTime: 30_000,
  });

  return router;
};
