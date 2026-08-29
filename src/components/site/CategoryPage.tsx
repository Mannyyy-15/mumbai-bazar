import { useMemo, useState, useEffect } from "react";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS, type Product } from "@/lib/site-data";
import { Check, X, ChevronDown, SlidersHorizontal, Sparkles, Filter } from "lucide-react";
import { useCatalog } from "@/lib/catalog-context";

type CatKey = Product["category"][number];
const CATEGORIES: { key: CatKey; label: string }[] = [
  { key: "new-arrivals", label: "New Arrivals" },
  { key: "wedding-sarees", label: "Wedding Sarees" },
  { key: "silk-sarees", label: "Silk Sarees" },
  { key: "festive-edit", label: "Festive Edit" },
  { key: "everyday-sarees", label: "Everyday" },
];

type Occasion = "wedding" | "festive" | "everyday" | "new";
const OCCASIONS: { key: Occasion; label: string; match: (p: Product) => boolean }[] = [
  { key: "wedding", label: "Wedding", match: (p) => p.category.includes("wedding-sarees") },
  { key: "festive", label: "Festive", match: (p) => p.category.includes("festive-edit") },
  { key: "everyday", label: "Everyday", match: (p) => p.category.includes("everyday-sarees") },
  { key: "new", label: "New Arrivals", match: (p) => p.category.includes("new-arrivals") },
];

const PRICE_BUCKETS: { key: string; label: string; min: number; max: number }[] = [
  { key: "u10", label: "Under ₹ 10,000", min: 0, max: 9999 },
  { key: "10-20", label: "₹ 10,000 – ₹ 20,000", min: 10000, max: 20000 },
  { key: "20-30", label: "₹ 20,000 – ₹ 30,000", min: 20000, max: 30000 },
  { key: "30p", label: "Above ₹ 30,000", min: 30000, max: Infinity },
];

type SortKey = "featured" | "new" | "price-asc" | "price-desc";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "new", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

const parsePrice = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;

export function CategoryPage({
  eyebrow,
  title,
  copy,
  crumb,
  heroImg,
  category,
  showHero = true,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  crumb: string;
  heroImg: string;
  category?: Product["category"][number];
  showHero?: boolean;
}) {
  const { products } = useCatalog();

  const inCategory = useMemo(
    () => (category ? products.filter((p) => p.category.includes(category)) : products),
    [category, products],
  );

  const fabrics = useMemo(
    () => Array.from(new Set(products.map((p) => p.weave))).sort(),
    [products],
  );

  const tags = ["New", "Bestseller"];

  const [selCat, setSelCat] = useState<Set<CatKey>>(new Set());
  const [selOcc, setSelOcc] = useState<Set<Occasion>>(new Set());
  const [selFab, setSelFab] = useState<Set<string>>(new Set());
  const [selPrice, setSelPrice] = useState<Set<string>>(new Set());
  const [selTag, setSelTag] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggle = <T,>(setter: (v: Set<T>) => void, set: Set<T>, v: T) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setter(next);
  };

  const filtered = useMemo(() => {
    let out = inCategory.slice();
    if (selCat.size) out = out.filter((p) => p.category.some((c) => selCat.has(c)));
    if (selOcc.size) {
      out = out.filter((p) =>
        Array.from(selOcc).some((k) => OCCASIONS.find((o) => o.key === k)!.match(p)),
      );
    }
    if (selFab.size) {
      out = out.filter((p) => selFab.has(p.weave));
    }
    if (selPrice.size) {
      out = out.filter((p) => {
        const v = parsePrice(p.price);
        return Array.from(selPrice).some((k) => {
          const b = PRICE_BUCKETS.find((x) => x.key === k)!;
          return v >= b.min && v <= b.max;
        });
      });
    }
    if (selTag.size) out = out.filter((p) => p.tag && selTag.has(p.tag));

    switch (sort) {
      case "new":
        out.sort((a, b) => Number(b.tag === "New") - Number(a.tag === "New"));
        break;
      case "price-asc":
        out.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "price-desc":
        out.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
    }
    return out;
  }, [inCategory, selCat, selOcc, selFab, selPrice, selTag, sort]);

  const activeCount = selCat.size + selOcc.size + selFab.size + selPrice.size + selTag.size;
  const clearAll = () => {
    setSelCat(new Set());
    setSelOcc(new Set());
    setSelFab(new Set());
    setSelPrice(new Set());
    setSelTag(new Set());
  };

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const sidebar = (
    <CategoryFilterPanel
      selCat={selCat}
      selOcc={selOcc}
      selFab={selFab}
      selPrice={selPrice}
      selTag={selTag}
      fabrics={fabrics}
      tags={tags}
      onCat={(k) => toggle(setSelCat, selCat, k)}
      onOcc={(k) => toggle(setSelOcc, selOcc, k)}
      onFab={(k) => toggle(setSelFab, selFab, k)}
      onPrice={(k) => toggle(setSelPrice, selPrice, k)}
      onTag={(k) => toggle(setSelTag, selTag, k)}
      clearAll={clearAll}
      activeCount={activeCount}
    />
  );

  return (
    <div className="w-full bg-ivory">
      {showHero && (
        <PageHero eyebrow={eyebrow} title={title} copy={copy} img={heroImg} crumb={crumb} />
      )}

      {/* Main Grid & Sticky Left Sidebar Section */}
      <section className="py-8 md:py-14">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-8 md:gap-10 lg:gap-12">
            {/* Left Sidebar: Sticky Scroll */}
            <aside className="hidden md:block self-start sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar md:border-r md:border-gold/50 md:pr-8 lg:pr-10">
              {sidebar}
            </aside>

            {/* Main Content Area */}
            <div>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/50 pb-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 bg-maroon/10 px-2.5 py-1 text-[11px] font-semibold text-maroon uppercase tracking-wider">
                    <Sparkles className="h-3 w-3 text-gold-deep" /> Handwoven
                  </span>
                  <p className="text-sm text-maroon/80">
                    Showing <span className="text-maroon font-semibold">{filtered.length}</span> of{" "}
                    {inCategory.length} pieces
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-maroon/30 text-[11px] tracking-[0.2em] uppercase text-maroon hover:bg-maroon hover:text-ivory transition-all md:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                    {activeCount > 0 && (
                      <span className="ml-1 grid h-4 w-4 place-items-center rounded-full bg-maroon text-[10px] text-ivory">
                        {activeCount}
                      </span>
                    )}
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setSortOpen((v) => !v)}
                      onBlur={() => setTimeout(() => setSortOpen(false), 150)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 bg-beige/30 text-[11px] tracking-[0.2em] uppercase text-maroon hover:border-maroon transition-all"
                    >
                      <span>Sort: {SORTS.find((s) => s.key === sort)!.label}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {sortOpen && (
                      <ul className="absolute right-0 top-full z-30 mt-2 w-56 rounded-2xl border border-gold/50 bg-ivory p-2 shadow-2xl">
                        {SORTS.map((s) => (
                          <li key={s.key}>
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSort(s.key);
                                setSortOpen(false);
                              }}
                              className={`flex w-full items-center justify-between px-4 py-2.5 rounded-xl text-left text-xs tracking-wider uppercase transition-colors ${
                                sort === s.key
                                  ? "bg-maroon text-ivory font-medium"
                                  : "text-ink hover:bg-beige/40"
                              }`}
                            >
                              {s.label}
                              {sort === s.key && <Check className="h-4 w-4 text-ivory" />}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeCount > 0 && (
                <div className="flex flex-wrap items-center gap-2.5 pt-5">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-maroon/60 font-medium">
                    Active Filters:
                  </span>
                  {Array.from(selCat).map((k) => (
                    <ActiveChip
                      key={"c-" + k}
                      label={CATEGORIES.find((c) => c.key === k)!.label}
                      onClear={() => toggle(setSelCat, selCat, k)}
                    />
                  ))}
                  {Array.from(selOcc).map((k) => (
                    <ActiveChip
                      key={"o-" + k}
                      label={OCCASIONS.find((o) => o.key === k)!.label}
                      onClear={() => toggle(setSelOcc, selOcc, k)}
                    />
                  ))}
                  {Array.from(selFab).map((k) => (
                    <ActiveChip
                      key={"f-" + k}
                      label={k}
                      onClear={() => toggle(setSelFab, selFab, k)}
                    />
                  ))}
                  {Array.from(selPrice).map((k) => (
                    <ActiveChip
                      key={"p-" + k}
                      label={PRICE_BUCKETS.find((b) => b.key === k)!.label}
                      onClear={() => toggle(setSelPrice, selPrice, k)}
                    />
                  ))}
                  {Array.from(selTag).map((k) => (
                    <ActiveChip
                      key={"t-" + k}
                      label={k}
                      onClear={() => toggle(setSelTag, selTag, k)}
                    />
                  ))}
                  <button
                    onClick={clearAll}
                    className="ml-auto text-[11px] tracking-[0.22em] uppercase text-maroon font-medium border-b border-maroon/40 hover:text-gold hover:border-gold transition-colors"
                  >
                    Clear All ({activeCount})
                  </button>
                </div>
              )}

              {/* Product Grid: 4 Cards per row on desktop */}
              <div className="mt-8">
                {filtered.length === 0 ? (
                  <div className="py-24 text-center rounded-2xl border border-dashed border-gold/50 bg-beige/10 p-8">
                    <p className="font-serif text-3xl text-maroon">
                      No sarees match your filter selection.
                    </p>
                    <p className="mt-3 text-sm text-maroon/70 max-w-md mx-auto">
                      Try resetting one of your selected filters or explore our full collection.
                    </p>
                    <button
                      onClick={clearAll}
                      className="mt-6 px-8 py-3.5 rounded-full bg-maroon text-ivory text-[11px] tracking-[0.25em] uppercase hover:bg-wine transition-all shadow-md"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4 lg:gap-8">
                    {filtered.map((p) => (
                      <ProductCard key={p.id} p={p} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Drawer Filter */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-xs bg-ivory p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-gold/50 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-maroon" />
                  <h3 className="font-serif text-lg text-maroon">Filter Sarees</h3>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-taupe hover:text-maroon"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {sidebar}
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="mt-8 w-full py-3.5 rounded-xl bg-maroon text-ivory text-xs uppercase tracking-[0.2em] font-medium"
            >
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryFilterPanel({
  selCat,
  selOcc,
  selFab,
  selPrice,
  selTag,
  fabrics,
  tags,
  onCat,
  onOcc,
  onFab,
  onPrice,
  onTag,
  clearAll,
  activeCount,
}: {
  selCat: Set<CatKey>;
  selOcc: Set<Occasion>;
  selFab: Set<string>;
  selPrice: Set<string>;
  selTag: Set<string>;
  fabrics: string[];
  tags: string[];
  onCat: (k: CatKey) => void;
  onOcc: (k: Occasion) => void;
  onFab: (k: string) => void;
  onPrice: (k: string) => void;
  onTag: (k: string) => void;
  clearAll: () => void;
  activeCount: number;
}) {
  return (
    <div className="space-y-6 text-sm">
      <div className="flex items-center justify-between border-b border-gold/50 pb-4">
        <h3 className="font-serif text-2xl text-maroon font-normal">Refine Selection</h3>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[11px] tracking-[0.2em] uppercase text-maroon font-medium border-b border-maroon/40 hover:text-gold transition-colors"
          >
            Reset ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup title="Category">
        {CATEGORIES.map((c) => (
          <CheckRow
            key={c.key}
            label={c.label}
            active={selCat.has(c.key)}
            onClick={() => onCat(c.key)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Occasion">
        {OCCASIONS.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            active={selOcc.has(o.key)}
            onClick={() => onOcc(o.key)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Fabric & Weave">
        {fabrics.map((f) => (
          <CheckRow key={f} label={f} active={selFab.has(f)} onClick={() => onFab(f)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range">
        {PRICE_BUCKETS.map((b) => (
          <CheckRow
            key={b.key}
            label={b.label}
            active={selPrice.has(b.key)}
            onClick={() => onPrice(b.key)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Highlights">
        {tags.map((t) => (
          <CheckRow key={t} label={t} active={selTag.has(t)} onClick={() => onTag(t)} />
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gold/50 pb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-[11px] uppercase tracking-[0.24em] text-maroon font-semibold"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-maroon/70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}

function CheckRow({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="group flex w-full items-center gap-3 text-left transition-colors cursor-pointer py-0.5"
    >
      <span
        className={`grid h-4 w-4 shrink-0 place-items-center rounded border transition-all ${
          active
            ? "border-maroon bg-maroon text-ivory shadow-sm"
            : "border-gold/50 bg-ivory group-hover:border-maroon"
        }`}
      >
        {active && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span
        className={`text-xs md:text-sm transition-colors ${active ? "text-maroon font-semibold" : "text-ink/80 group-hover:text-maroon font-medium"}`}
      >
        {label}
      </span>
    </button>
  );
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 border border-gold/40 bg-beige/40 px-3 py-1.5 rounded-full text-xs text-maroon font-medium shadow-sm">
      {label}
      <button
        onClick={onClear}
        aria-label={`Remove ${label}`}
        className="text-maroon/60 hover:text-maroon"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
