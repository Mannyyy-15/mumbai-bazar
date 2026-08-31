import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./site-data";
import { fetchShopifyProducts } from "./shopify";

const CatalogContext = createContext<{ products: Product[]; loading: boolean }>({
  products: [],
  loading: true,
});

/**
 * @param initialProducts Catalogue fetched server-side by the root route loader.
 *
 * Why this prop exists: this provider used to fetch only inside useEffect, which
 * never runs during SSR. Every grid therefore server-rendered empty, so /shop
 * and the category pages shipped ZERO `/products/*` links in their HTML. Product
 * pages had no internal links pointing at them at all and were discoverable only
 * via sitemap.xml — no internal PageRank, low crawl priority, and Googlebot had
 * to reach the render queue to see any product at all.
 *
 * With the loader supplying products, the grid is in the initial HTML and the
 * client fetch only runs as a fallback when the server had nothing.
 */
export function CatalogProvider({
  children,
  initialProducts = [],
}: {
  children: ReactNode;
  initialProducts?: Product[];
}) {
  const hasServerData = initialProducts.length > 0;

  // Client fallback, used only when the loader returned nothing (e.g. the
  // Shopify fetch failed server-side).
  const [clientProducts, setClientProducts] = useState<Product[]>([]);
  const [clientLoading, setClientLoading] = useState(!hasServerData);

  useEffect(() => {
    if (hasServerData) return;

    let cancelled = false;
    fetchShopifyProducts(50)
      .then((remote) => {
        if (!cancelled) setClientProducts(remote);
      })
      .catch(() => {
        if (!cancelled) setClientProducts([]);
      })
      .finally(() => {
        if (!cancelled) setClientLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hasServerData]);

  // Read loader data directly rather than mirroring it into state. Copying it
  // via an effect would re-render on every identity change of the loader array,
  // and a revalidation could then churn indefinitely.
  const products = hasServerData ? initialProducts : clientProducts;
  const loading = hasServerData ? false : clientLoading;

  const value = useMemo(() => ({ products, loading }), [products, loading]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
