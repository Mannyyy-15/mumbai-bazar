import { ChevronRight } from "lucide-react";
import type { Collection } from "@/lib/site-data";

export function CollectionCard({
  c,
  className = "",
}: {
  c: Collection;
  className?: string;
}) {
  return (
    <a href="#" className={`group relative block overflow-hidden bg-beige ${className}`}>
      <img
        src={c.img}
        alt={`${c.name} saree collection`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-wine/75 via-wine/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-ivory">
        <span className="text-[10px] tracking-[0.3em] uppercase text-ivory/80">The Collection</span>
        <h3 className="font-serif text-2xl md:text-3xl text-ivory">{c.name}</h3>
        <p className="text-sm text-ivory/85">{c.tagline}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.24em] uppercase text-ivory/90 border-b border-gold w-fit pb-1">
          Explore Collection <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}
