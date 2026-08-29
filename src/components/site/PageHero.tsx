import { Link } from "@tanstack/react-router";
import { GoldRule } from "@/components/site/Motif";

export function PageHero({
  eyebrow,
  title,
  copy,
  img,
  crumb,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  img: string;
  crumb: string;
}) {
  return (
    <section className="relative bg-beige/30">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-stretch gap-0 px-0 md:grid-cols-12 md:gap-10 md:px-8 md:py-16">
        <div className="order-2 flex flex-col justify-center px-4 py-10 md:order-1 md:col-span-5 md:px-0 md:py-0">
          <nav className="mb-6 text-[11px] tracking-[0.22em] uppercase text-taupe">
            <Link to="/" className="hover:text-maroon">
              Home
            </Link>
            <span className="mx-2 text-gold">/</span>
            <span className="text-ink">{crumb}</span>
          </nav>
          <GoldRule />
          <span className="eyebrow mt-4">{eyebrow}</span>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-md text-taupe leading-relaxed">{copy}</p>
        </div>
        <div className="order-1 md:order-2 md:col-span-7">
          <div className="aspect-[4/3] md:aspect-[5/4] w-full overflow-hidden">
            <img src={img} alt={title} className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
