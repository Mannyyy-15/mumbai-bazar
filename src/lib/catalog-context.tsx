import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./site-data";
import { fetchShopifyProducts, shopifyConfigured } from "./shopify";

const CatalogContext = createContext<{ products: Product[]; loading: boolean }>({ products: PRODUCTS, loading: false });

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(shopifyConfigured);

  useEffect(() => {
    if (!shopifyConfigured) return;
    fetchShopifyProducts(50)
      .then((remote) => { if (remote.length) setProducts(remote); })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({ products, loading }), [products, loading]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
