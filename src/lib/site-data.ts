import colBanarasi from "@/assets/col-banarasi.jpg";
import colKanjivaram from "@/assets/col-kanjivaram.jpg";
import colWedding from "@/assets/col-wedding.jpg";
import colPuresilk from "@/assets/col-puresilk.jpg";
import colFestive from "@/assets/col-festive.jpg";
import craft from "@/assets/craft.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import look1 from "@/assets/look1.jpg";
import look2 from "@/assets/look2.jpg";
import look3 from "@/assets/look3.jpg";
import look4 from "@/assets/look4.jpg";
import t1 from "@/assets/t1.jpg";
import t2 from "@/assets/t2.jpg";
import t3 from "@/assets/t3.jpg";

export const IMG = {
  colBanarasi,
  colKanjivaram,
  colWedding,
  colPuresilk,
  colFestive,
  craft,
  p1,
  p2,
  p3,
  p4,
  look1,
  look2,
  look3,
  look4,
  t1,
  t2,
  t3,
};

export type NavItem = { label: string; to: string };
export const NAV: NavItem[] = [
  { label: "Shop", to: "/shop" },
  { label: "New Arrivals", to: "/new-arrivals" },

  { label: "Wedding Sarees", to: "/wedding-sarees" },
  { label: "Silk Sarees", to: "/silk-sarees" },
  { label: "Festive Edit", to: "/festive-edit" },
  { label: "Everyday Sarees", to: "/everyday-sarees" },
  { label: "Collections", to: "/collections" },
  { label: "Stores", to: "/stores" },
  { label: "Guides", to: "/guides" },
  { label: "Our Story", to: "/our-story" },
];

export type ProductDetails = {
  fabric: string;
  drape: string;
  blousePiece: string;
  length: string;
  border: string;
  palla: string;
  care: string[];
  description: string;
  gallery: string[];
};

export type Product = {
  id: string;
  img: string;
  secondaryImg?: string;
  name: string;
  weave: string;
  price: string;
  original?: string;
  tag?: "New" | "Bestseller";
  category: (
    "new-arrivals" | "wedding-sarees" | "silk-sarees" | "festive-edit" | "everyday-sarees"
  )[];
  shopifyProductId?: string;
  shopifyVariantId?: string;
  handle?: string;
  details?: ProductDetails;
};

const commonCare = [
  "Dry clean only for the first wash",
  "Store folded in a soft muslin cloth",
  "Avoid direct sunlight and perfume contact",
  "Iron on low heat with a cotton cloth",
];

export const PRODUCTS: Product[] = [
  {
    id: "meher-wine",
    img: p1,
    name: "Meher Wine Banarasi Silk Saree",
    weave: "Pure Banarasi Silk",
    price: "₹ 18,900",
    original: "₹ 24,500",
    tag: "Bestseller",
    category: ["wedding-sarees", "silk-sarees", "festive-edit"],
    details: {
      fabric: "Pure Katan Silk",
      drape: "Structured, sculpted pleats",
      blousePiece: "0.80 m unstitched, matching brocade",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Antique zari temple border",
      palla: "Kadhwa buti with meenakari motifs",
      care: commonCare,
      description:
        "A deep wine Banarasi hand-woven on pit looms in Varanasi. Real zari brocade catches candlelight beautifully, making it a heirloom worthy statement for weddings and receptions.",
      gallery: [],
    },
  },
  {
    id: "ira-gold",
    img: p2,
    name: "Ira Antique Gold Kanjivaram Saree",
    weave: "Kanjivaram Silk",
    price: "₹ 28,400",
    tag: "New",
    category: ["new-arrivals", "wedding-sarees", "silk-sarees"],
    details: {
      fabric: "Pure Mulberry Silk with tested zari",
      drape: "Regal, holds its own pleats",
      blousePiece: "0.85 m contrast maroon brocade",
      length: "5.5 m saree + 0.85 m blouse",
      border: "Traditional korvai temple border",
      palla: "Rich mayil chakram (peacock) motifs",
      care: commonCare,
      description:
        "An antique gold Kanjivaram woven in Kanchipuram using the three-shuttle korvai technique. A bridal heirloom passed on for generations.",
      gallery: [],
    },
  },
  {
    id: "noor-rose",
    img: p3,
    name: "Noor Rose Tissue Silk Saree",
    weave: "Tissue Silk",
    price: "₹ 12,600",
    original: "₹ 15,000",
    category: ["festive-edit", "silk-sarees", "everyday-sarees"],
    details: {
      fabric: "Handwoven Tissue Silk",
      drape: "Featherlight, fluid drape",
      blousePiece: "0.80 m self tissue",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Fine zari selvedge",
      palla: "Delicate floral zari buttis",
      care: commonCare,
      description:
        "A blush rose tissue saree with a whisper of gold shimmer. Effortless to drape, radiant under evening light.",
      gallery: [],
    },
  },
  {
    id: "vedika-emerald",
    img: p4,
    name: "Vedika Emerald Festive Saree",
    weave: "Soft Silk",
    price: "₹ 9,800",
    tag: "New",
    category: ["new-arrivals", "festive-edit", "everyday-sarees"],
    details: {
      fabric: "Soft Art Silk",
      drape: "Soft, easy to drape",
      blousePiece: "0.80 m matching silk",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Woven zari border",
      palla: "Traditional motifs with zari accents",
      care: commonCare,
      description:
        "An emerald green festive saree with subtle zari work. Comfortable enough for long celebrations, refined enough for photographs.",
      gallery: [],
    },
  },
  {
    id: "sitara-ivory",
    img: colPuresilk,
    name: "Sitara Blush Pure Silk Saree",
    weave: "Pure Silk",
    price: "₹ 14,200",
    tag: "Bestseller",
    category: ["silk-sarees", "everyday-sarees"],
    details: {
      fabric: "Pure Mulberry Silk",
      drape: "Refined, medium-weight fall",
      blousePiece: "0.80 m self silk",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Handwoven zari border",
      palla: "Understated motifs across the palla",
      care: commonCare,
      description:
        "A blush pure silk saree, minimal in ornament and endlessly wearable. Ideal for temple visits, family gatherings and quiet celebrations.",
      gallery: [],
    },
  },
  {
    id: "rani-maroon",
    img: colBanarasi,
    name: "Rani Maroon Handloom Banarasi",
    weave: "Handloom Banarasi",
    price: "₹ 22,100",
    category: ["wedding-sarees", "silk-sarees"],
    details: {
      fabric: "Katan Silk with real zari",
      drape: "Weighty, sculpted",
      blousePiece: "0.80 m brocade",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Wide zari border with jhallar",
      palla: "Dense jaal work across the palla",
      care: commonCare,
      description:
        "A rani maroon handloom Banarasi woven with generations-old motifs. A regal choice for wedding functions and grand receptions.",
      gallery: [],
    },
  },
  {
    id: "amber-glow",
    img: colFestive,
    name: "Amber Glow Tissue Saree",
    weave: "Tissue Silk",
    price: "₹ 11,900",
    tag: "New",
    category: ["new-arrivals", "festive-edit"],
    details: {
      fabric: "Handwoven Tissue",
      drape: "Airy, luminous",
      blousePiece: "0.80 m self tissue",
      length: "5.5 m saree + 0.8 m blouse",
      border: "Slim zari border",
      palla: "Scattered zari buttis",
      care: commonCare,
      description:
        "An amber tissue saree with a golden glow. Made for festive evenings, diyas and warm laughter.",
      gallery: [],
    },
  },
  {
    id: "leela-teal",
    img: look4,
    name: "Leela Teal Kanjivaram Saree",
    weave: "Kanjivaram Silk",
    price: "₹ 24,600",
    category: ["wedding-sarees", "silk-sarees", "festive-edit"],
    details: {
      fabric: "Pure Mulberry Silk",
      drape: "Firm, structured pleats",
      blousePiece: "0.85 m contrast brocade",
      length: "5.5 m saree + 0.85 m blouse",
      border: "Korvai contrast border",
      palla: "Traditional annam motifs",
      care: commonCare,
      description:
        "A deep teal Kanjivaram with a contrast maroon border, hand-woven in Kanchipuram. A collector's saree for milestone occasions.",
      gallery: [],
    },
  },
];

// Enrich each product with a small gallery derived from lookbook + collection assets.
const galleryPool = [
  look1,
  look2,
  look3,
  look4,
  colBanarasi,
  colKanjivaram,
  colWedding,
  colPuresilk,
  colFestive,
  craft,
];
PRODUCTS.forEach((p, i) => {
  if (p.details) {
    p.details.gallery = [
      p.img,
      galleryPool[i % galleryPool.length],
      galleryPool[(i + 3) % galleryPool.length],
      galleryPool[(i + 6) % galleryPool.length],
    ];
  }
});

export type Collection = { slug: string; name: string; tagline: string; img: string };
export const COLLECTIONS: Collection[] = [
  {
    slug: "banarasi",
    name: "Banarasi",
    tagline: "Woven in gold, wrapped in legacy",
    img: colBanarasi,
  },
  {
    slug: "kanjivaram",
    name: "Kanjivaram",
    tagline: "Temple borders, timeless pride",
    img: colKanjivaram,
  },
  {
    slug: "wedding",
    name: "Wedding Wear",
    tagline: "Statement silks for the biggest day",
    img: colWedding,
  },
  {
    slug: "pure-silk",
    name: "Pure Silk",
    tagline: "Soft luxury, effortless drape",
    img: colPuresilk,
  },
  {
    slug: "festive",
    name: "Festive Edit",
    tagline: "Celebrate every occasion in radiance",
    img: colFestive,
  },
];

export const CRAFT = craft;
export const LOOKS = [
  look1,
  colBanarasi,
  look2,
  look3,
  colFestive,
  look4,
  colKanjivaram,
  colPuresilk,
];
export const TESTIMONIAL_IMGS = { t1, t2, t3 };
