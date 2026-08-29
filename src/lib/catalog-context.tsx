import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./site-data";
import { fetchShopifyProducts } from "./shopify";

const CatalogContext = createContext<{ products: Product[]; loading: boolean }>({ products: [], loading: true });

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopifyProducts(50)
      .then((remote) => {
        setProducts(remote);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({ products, loading }), [products, loading]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
