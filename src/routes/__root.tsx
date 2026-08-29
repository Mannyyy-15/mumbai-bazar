import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SITE, OG_IMAGE, jsonLd, verificationMeta } from "@/lib/seo";
import { organizationSchema, websiteSchema, localBusinessSchema } from "@/lib/structured-data";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CartProvider } from "@/lib/cart-context";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CatalogProvider } from "@/lib/catalog-context";
import { SareeExpertChatbot } from "@/components/site/SareeExpertChatbot";
import { WishlistProvider } from "@/lib/wishlist-context";
import { WishlistDrawer } from "@/components/site/WishlistDrawer";
import { PageTransition } from "@/components/site/PageTransition";
import { ScrollReveal } from "@/components/site/ScrollReveal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Root Error Boundary caught error:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ivory px-4 py-16">
      <div className="max-w-md text-center bg-white p-8 rounded-2xl border border-gold/40 shadow-xl">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-maroon">
          Mumbai Bazar
        </span>
        <h1 className="mt-3 font-serif text-2xl md:text-3xl font-semibold text-maroon">
          Reconnecting to Boutique
        </h1>
        <p className="mt-2 text-sm text-ink/75 leading-relaxed">
          We encountered a brief connection update. Please refresh or explore our collections.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              } else {
                router.invalidate();
                reset();
              }
            }}
            className="px-6 py-2.5 rounded-full bg-maroon text-ivory text-xs font-bold uppercase tracking-widest hover:bg-wine transition-colors shadow-md"
          >
            Refresh Page
          </button>
          <a
            href="/"
            className="px-6 py-2.5 rounded-full border border-maroon text-maroon text-xs font-bold uppercase tracking-widest hover:bg-maroon hover:text-ivory transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE.name} — ${SITE.tagline}` },
      { name: "description", content: SITE.description },
      { name: "author", content: SITE.name },
      { name: "publisher", content: SITE.name },
      // Let Google build full-size image previews and long snippets.
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "googlebot", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "format-detection", content: "telephone=no" },
      { name: "theme-color", content: "#641F2A" },
      { name: "geo.region", content: "IN-MH" },
      { name: "geo.placename", content: SITE.address.city },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: SITE.locale },
      { property: "og:type", content: "website" },
      { property: "og:title", content: `${SITE.name} — ${SITE.tagline}` },
      { property: "og:description", content: SITE.description },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:url", content: SITE.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@MumbaiBazar" },
      { name: "twitter:image", content: OG_IMAGE },
      // Search-engine ownership verification. Entries with an empty token are
      // filtered out so no blank meta tags ship before the accounts exist.
      ...verificationMeta(),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Warms the DNS/TLS handshake for the font host before the CSS request lands.
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
    ],
    // Site-wide entity graph: who we are, what the site is, where the store is.
    scripts: [
      // Google Preferred Sources library. Renders any
      // [google-add-preferred-source-btn] node on the page.
      { src: "https://news.google.com/swg/js/v1/publisher.js", async: true },
      jsonLd(organizationSchema()),
      jsonLd(websiteSchema()),
      jsonLd(localBusinessSchema()),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <CatalogProvider>
          <WishlistProvider>
            <SmoothScroll />
            <ScrollReveal />
            <div id="main-content" className="flex min-h-screen flex-col bg-ivory">
              <AnnouncementBar />
              <Header />
              <main className="flex-1">
                <PageTransition>
                  <Outlet />
                </PageTransition>
              </main>
              <Footer />
              <SareeExpertChatbot />
              <CartDrawer />
              <WishlistDrawer />
            </div>
          </WishlistProvider>
        </CatalogProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
