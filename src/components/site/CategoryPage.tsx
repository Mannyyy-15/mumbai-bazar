import { useMemo, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Check, X, ChevronDown, SlidersHorizontal, Sparkles, Filter, IndianRupee, RotateCcw } from "lucide-react";
import { useCatalog } from "@/lib/catalog-context";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import type { Product } from "@/lib/site-data";
import {
  COLOR_OPTIONS,
  TYPE_OPTIONS,
  FABRIC_OPTIONS,
  PRICE_PRESETS,
  matchesColor,
  parsePriceNumber,
} from "@/lib/filters";

type SortKey = "featured" | "new" | "price-asc" | "price-desc";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "new", label: "Newest Arrivals" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

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

  // Filter States
  const [selColors, setSelColors] = useState<Set<string>>(new Set());
  const [selTypes, setSelTypes] = useState<Set<string>>(new Set());
  const [selFabrics, setSelFabrics] = useState<Set<string>>(new Set());
  const [selPricePreset, setSelPricePreset] = useState<string | null>(null);
  const [customPriceMin, setCustomPriceMin] = useState<string>("");
  const [customPriceMax, setCustomPriceMax] = useState<string>("");
  const [appliedPriceRange, setAppliedPriceRange] = useState<{ min: number; max: number } | null>(
    null,
  );

  const [sort, setSort] = useState<SortKey>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggle = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, set: Set<T>, v: T) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setter(next);
  };

  const applyPricePreset = (presetKey: string) => {
    if (selPricePreset === presetKey) {
      setSelPricePreset(null);
      setAppliedPriceRange(null);
      setCustomPriceMin("");
      setCustomPriceMax("");
    } else {
      setSelPricePreset(presetKey);
      const preset = PRICE_PRESETS.find((p) => p.key === presetKey);
      if (preset) {
        setAppliedPriceRange({ min: preset.min, max: preset.max });
        setCustomPriceMin(preset.min > 0 ? String(preset.min) : "");
        setCustomPriceMax(preset.max < Infinity ? String(preset.max) : "");
      }
    }
  };

  const applyCustomPrice = () => {
    const min = customPriceMin ? Number(customPriceMin) : 0;
    const max = customPriceMax ? Number(customPriceMax) : Infinity;
    setAppliedPriceRange({ min, max });
    setSelPricePreset(null);
  };

  const clearAll = () => {
    setSelColors(new Set());
    setSelTypes(new Set());
    setSelFabrics(new Set());
    setSelPricePreset(null);
    setAppliedPriceRange(null);
    setCustomPriceMin("");
    setCustomPriceMax("");
  };

  const activeCount =
    selColors.size +
    selTypes.size +
    selFabrics.size +
    (appliedPriceRange || selPricePreset ? 1 : 0);

  const filtered = useMemo(() => {
    let list = inCategory.slice();

    // 1. Color filter
    if (selColors.size > 0) {
      list = list.filter((p) => Array.from(selColors).some((cKey) => matchesColor(p, cKey)));
    }

    // 2. Type filter
    if (selTypes.size > 0) {
      list = list.filter((p) =>
        Array.from(selTypes).some((tKey) => {
          const opt = TYPE_OPTIONS.find((t) => t.key === tKey);
          return opt ? opt.match(p) : false;
        }),
      );
    }

    // 3. Fabric filter
    if (selFabrics.size > 0) {
      list = list.filter((p) =>
        Array.from(selFabrics).some((fKey) => {
          const opt = FABRIC_OPTIONS.find((f) => f.key === fKey);
          return opt ? opt.match(p) : false;
        }),
      );
    }

    // 4. Price range filter
    if (appliedPriceRange) {
      list = list.filter((p) => {
        const val = parsePriceNumber(p.price);
        return val >= appliedPriceRange.min && val <= appliedPriceRange.max;
      });
    }

    // 5. Sorting
    switch (sort) {
      case "new":
        list.sort((a, b) => Number(b.tag === "New") - Number(a.tag === "New"));
        break;
      case "price-asc":
        list.sort((a, b) => parsePriceNumber(a.price) - parsePriceNumber(b.price));
        break;
      case "price-desc":
        list.sort((a, b) => parsePriceNumber(b.price) - parsePriceNumber(a.price));
        break;
    }

    return list;
  }, [inCategory, selColors, selTypes, selFabrics, appliedPriceRange, sort]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const sidebarContent = (
    <div className="space-y-6 text-sm">
      <div className="flex items-center justify-between border-b border-gold/40 pb-4">
        <h3 className="font-serif text-xl font-bold text-maroon">Refine Collection</h3>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs uppercase tracking-wider text-maroon font-bold hover:text-gold-deep transition-colors underline"
          >
            Reset ({activeCount})
          </button>
        )}
      </div>

      {/* 1. Price Range */}
      <FilterGroup title="Price Range" defaultOpen={true}>
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 gap-2">
            {PRICE_PRESETS.map((preset) => {
              const active = selPricePreset === preset.key;
              return (
                <button
                  key={preset.key}
                  onClick={() => applyPricePreset(preset.key)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all text-left ${
                    active
                      ? "border-maroon bg-maroon text-white shadow-sm"
                      : "border-gold/40 bg-[#FAF7F2] text-ink hover:border-maroon"
                  }`}
                >
                  <span>{preset.label}</span>
                  {active && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gold/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-maroon block mb-2">
              Custom Range (₹)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={customPriceMin}
                onChange={(e) => setCustomPriceMin(e.target.value)}
                className="w-1/2 px-3 py-2 text-xs font-medium border border-gold/50 rounded-lg bg-[#FAF8F5] text-ink focus:border-maroon focus:outline-none"
              />
              <span className="text-xs text-taupe font-bold">–</span>
              <input
                type="number"
                placeholder="Max"
                value={customPriceMax}
                onChange={(e) => setCustomPriceMax(e.target.value)}
                className="w-1/2 px-3 py-2 text-xs font-medium border border-gold/50 rounded-lg bg-[#FAF8F5] text-ink focus:border-maroon focus:outline-none"
              />
            </div>
            <button
              onClick={applyCustomPrice}
              className="mt-2.5 w-full py-2 rounded-lg bg-maroon text-white text-[11px] font-bold uppercase tracking-wider hover:bg-wine transition-colors"
            >
              Apply Price
            </button>
          </div>
        </div>
      </FilterGroup>

      {/* 2. Color Palette Swatches */}
      <FilterGroup title="Color Palette" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {COLOR_OPTIONS.map((col) => {
            const active = selColors.has(col.key);
            return (
              <button
                key={col.key}
                onClick={() => toggle(setSelColors, selColors, col.key)}
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs font-semibold transition-all text-left ${
                  active
                    ? "border-maroon bg-maroon/10 text-maroon shadow-sm"
                    : "border-gold/40 bg-[#FAF7F2] text-ink hover:border-maroon"
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border shrink-0 relative grid place-items-center"
                  style={{
                    backgroundColor: col.hex,
                    borderColor: col.border || "rgba(0,0,0,0.15)",
                  }}
                >
                  {active && <Check className="h-3 w-3 text-white drop-shadow-sm" />}
                </span>
                <span className="truncate text-xs font-medium">{col.label}</span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* 3. Saree Type */}
      <FilterGroup title="Saree Type" defaultOpen={true}>
        <div className="space-y-2 pt-1">
          {TYPE_OPTIONS.map((t) => {
            const active = selTypes.has(t.key);
            return (
              <button
                key={t.key}
                onClick={() => toggle(setSelTypes, selTypes, t.key)}
                className={`group flex w-full items-center justify-between p-2 rounded-xl text-left transition-colors border ${
                  active
                    ? "border-maroon bg-maroon/10 text-maroon font-bold"
                    : "border-transparent text-ink hover:bg-[#FAF7F2] font-medium"
                }`}
              >
                <span className="text-xs">{t.label}</span>
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded border transition-all ${
                    active
                      ? "border-maroon bg-maroon text-white"
                      : "border-gold/60 bg-white group-hover:border-maroon"
                  }`}
                >
                  {active && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* 4. Fabric & Craft Weave */}
      <FilterGroup title="Fabric & Weave" defaultOpen={true}>
        <div className="space-y-2 pt-1">
          {FABRIC_OPTIONS.map((f) => {
            const active = selFabrics.has(f.key);
            return (
              <button
                key={f.key}
                onClick={() => toggle(setSelFabrics, selFabrics, f.key)}
                className={`group flex w-full items-center justify-between p-2 rounded-xl text-left transition-colors border ${
                  active
                    ? "border-maroon bg-maroon/10 text-maroon font-bold"
                    : "border-transparent text-ink hover:bg-[#FAF7F2] font-medium"
                }`}
              >
                <span className="text-xs">{f.label}</span>
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded border transition-all ${
                    active
                      ? "border-maroon bg-maroon text-white"
                      : "border-gold/60 bg-white group-hover:border-maroon"
                  }`}
                >
                  {active && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="w-full bg-[#FAF7F2] text-ink min-h-screen">
      {showHero ? (
        <PageHero eyebrow={eyebrow} title={title} copy={copy} img={heroImg} crumb={crumb} />
      ) : (
        <div className="border-b border-gold/30 bg-white/70 backdrop-blur-sm py-4 px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="w-full">
            <nav className="text-xs tracking-[0.14em] uppercase text-maroon font-bold flex items-center gap-2">
              <Link to="/" className="hover:text-gold-deep transition-colors">
                Home
              </Link>
              <span className="text-gold-deep font-normal">/</span>
              <span className="text-ink">{crumb}</span>
            </nav>
            <h1 className="mt-1 font-serif text-2xl sm:text-3xl md:text-4xl text-maroon font-bold">
              {title}
            </h1>
          </div>
        </div>
      )}

      {/* Main Grid & Sticky Left Sidebar Section */}
      <section className="pt-6 pb-16 md:pt-8 md:pb-24">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-8 md:gap-10 lg:gap-12 items-start">
            {/* Left Sidebar */}
            <aside className="hidden md:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar rounded-2xl border border-gold/40 bg-white p-6 shadow-sm">
              {sidebarContent}
            </aside>

            {/* Main Content Area */}
            <div className="min-w-0">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/40 pb-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 bg-maroon/10 px-3 py-1 rounded-full text-xs font-bold text-maroon uppercase tracking-wider">
                    <Sparkles className="h-3 w-3 text-gold-deep" /> Handwoven
                  </span>
                  <p className="text-xs sm:text-sm text-ink/80 font-medium">
                    Showing <strong className="text-maroon font-bold">{filtered.length}</strong> of{" "}
                    {inCategory.length} drapes
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-maroon bg-white text-xs tracking-wider uppercase text-maroon font-bold hover:bg-maroon hover:text-white transition-all md:hidden shadow-sm"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeCount > 0 && (
                      <span className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-maroon text-white text-[10px] font-bold">
                        {activeCount}
                      </span>
                    )}
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setSortOpen((v) => !v)}
                      onBlur={() => setTimeout(() => setSortOpen(false), 200)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gold-deep/50 bg-white text-xs tracking-wider uppercase text-maroon font-bold hover:border-maroon transition-all shadow-sm"
                    >
                      <span>Sort: {SORTS.find((s) => s.key === sort)!.label}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {sortOpen && (
                      <ul className="absolute right-0 top-full z-30 mt-2 w-56 rounded-2xl border border-gold-deep/40 bg-white p-2 shadow-2xl">
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
                                  ? "bg-maroon text-white font-bold"
                                  : "text-ink hover:bg-[#FAF7F2] font-medium"
                              }`}
                            >
                              {s.label}
                              {sort === s.key && <Check className="h-4 w-4 text-white" />}
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
                <div className="flex flex-wrap items-center gap-2.5 pt-4 pb-2">
                  <span className="text-[11px] uppercase tracking-wider text-maroon font-bold mr-1">
                    Active Filters:
                  </span>

                  {(appliedPriceRange || selPricePreset) && (
                    <span className="inline-flex items-center gap-1.5 border border-gold-deep/40 bg-white px-3 py-1.5 rounded-full text-xs text-maroon font-bold shadow-sm">
                      <IndianRupee className="h-3 w-3 text-gold-deep" />
                      {selPricePreset
                        ? PRICE_PRESETS.find((p) => p.key === selPricePreset)!.label
                        : `₹ ${appliedPriceRange?.min.toLocaleString("en-IN")} – ${appliedPriceRange?.max === Infinity ? "Above" : "₹ " + appliedPriceRange?.max.toLocaleString("en-IN")}`}
                      <button
                        onClick={() => {
                          setSelPricePreset(null);
                          setAppliedPriceRange(null);
                          setCustomPriceMin("");
                          setCustomPriceMax("");
                        }}
                        className="text-maroon/60 hover:text-maroon ml-0.5"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}

                  {Array.from(selColors).map((cKey) => {
                    const cOpt = COLOR_OPTIONS.find((c) => c.key === cKey);
                    return (
                      <span
                        key={cKey}
                        className="inline-flex items-center gap-1.5 border border-gold-deep/40 bg-white px-3 py-1.5 rounded-full text-xs text-maroon font-bold shadow-sm"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: cOpt?.hex }}
                        />
                        {cOpt?.label}
                        <button
                          onClick={() => toggle(setSelColors, selColors, cKey)}
                          className="text-maroon/60 hover:text-maroon ml-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    );
                  })}

                  {Array.from(selTypes).map((tKey) => {
                    const tOpt = TYPE_OPTIONS.find((t) => t.key === tKey);
                    return (
                      <span
                        key={tKey}
                        className="inline-flex items-center gap-1.5 border border-gold-deep/40 bg-white px-3 py-1.5 rounded-full text-xs text-maroon font-bold shadow-sm"
                      >
                        {tOpt?.label}
                        <button
                          onClick={() => toggle(setSelTypes, selTypes, tKey)}
                          className="text-maroon/60 hover:text-maroon ml-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    );
                  })}

                  {Array.from(selFabrics).map((fKey) => {
                    const fOpt = FABRIC_OPTIONS.find((f) => f.key === fKey);
                    return (
                      <span
                        key={fKey}
                        className="inline-flex items-center gap-1.5 border border-gold-deep/40 bg-white px-3 py-1.5 rounded-full text-xs text-maroon font-bold shadow-sm"
                      >
                        {fOpt?.label}
                        <button
                          onClick={() => toggle(setSelFabrics, selFabrics, fKey)}
                          className="text-maroon/60 hover:text-maroon ml-0.5"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    );
                  })}

                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-maroon hover:text-gold-deep transition-colors ml-auto underline underline-offset-4"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset All ({activeCount})
                  </button>
                </div>
              )}

              {/* Product Grid: 4 Cards per row on desktop */}
              <div className="mt-6">
                {filtered.length === 0 ? (
                  <div className="py-20 text-center rounded-3xl border-2 border-dashed border-gold/60 bg-white p-8">
                    <Sparkles className="h-10 w-10 text-gold-deep mx-auto mb-3" />
                    <h3 className="font-serif text-2xl md:text-3xl text-maroon font-bold">
                      No Sarees Match Your Selected Filters
                    </h3>
                    <p className="mt-2 text-sm text-ink/75 max-w-md mx-auto">
                      Try widening your price range, selecting alternative colors or fabrics, or
                      reset all filters.
                    </p>
                    <button
                      onClick={clearAll}
                      className="mt-6 px-8 py-3 rounded-full bg-maroon text-white text-xs font-bold uppercase tracking-widest hover:bg-wine transition-all shadow-md"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 xl:grid-cols-4 lg:gap-8">
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
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter Sarees"
        >
          <button
            aria-label="Close filters"
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[90%] max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gold/40 px-6 py-5 bg-[#FAF7F2]">
              <div className="flex items-center gap-2.5">
                <Filter className="h-5 w-5 text-maroon" />
                <h2 className="font-serif text-xl font-bold text-maroon">Filter Catalog</h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-ink hover:text-maroon p-1.5 rounded-lg border border-gold/40"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">{sidebarContent}</div>

            <div className="flex gap-3 border-t border-gold/40 p-5 bg-[#FAF7F2]">
              <button
                onClick={clearAll}
                className="flex-1 py-3 rounded-xl border border-maroon text-maroon text-xs font-bold uppercase tracking-wider hover:bg-maroon/5 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 py-3 rounded-xl bg-maroon text-white text-xs font-bold uppercase tracking-wider hover:bg-wine transition-colors shadow-md"
              >
                Show {filtered.length} Sarees
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gold/40 pb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs uppercase tracking-wider text-maroon font-bold"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-maroon transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3.5">{children}</div>}
    </div>
  );
}
