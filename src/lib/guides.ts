/**
 * Editorial guide content — the topical-authority cluster.
 *
 * Structure follows answer-first formatting: every section leads with a direct
 * 40-60 word answer (rendered in `.answer-first`, which is also what the
 * `speakable` schema points at), then expands. AI answer engines extract that
 * opening passage, so it carries specifics — prices, measurements, place names —
 * because vague copy is never cited.
 *
 * Each guide maps to one commercial category via `relatedPath`, so the cluster
 * links down to money pages rather than dead-ending.
 */

export type GuideSection = {
  /** Phrased as the question a searcher actually types. */
  heading: string;
  /** The direct answer. Kept to ~40-60 words. */
  answer: string;
  /** Supporting detail paragraphs. */
  body: string[];
  /** Optional comparison table — AI engines lift these near-verbatim. */
  table?: { caption: string; headers: string[]; rows: string[][] };
};

export type GuideStep = { name: string; text: string };

export type Guide = {
  slug: string;
  /** Search-intent title. Becomes the <title> and H1. */
  title: string;
  h1: string;
  description: string;
  /** ISO date. Update `modified` whenever the copy is revised. */
  published: string;
  modified: string;
  author: { name: string; title: string };
  readMinutes: number;
  /** Commercial page this guide should funnel to. */
  relatedPath: string;
  relatedLabel: string;
  keywords: string[];
  /** Opening summary, shown under the H1 and marked speakable. */
  standfirst: string;
  sections: GuideSection[];
  /** Present only on procedural guides; drives HowTo schema. */
  howTo?: {
    name: string;
    description: string;
    totalTime: string;
    supplies: string[];
    steps: GuideStep[];
  };
  faqs: { q: string; a: string }[];
};

/**
 * Guide byline.
 *
 * Attributed to the business, not an invented individual — a fabricated expert
 * name in Article schema is an E-E-A-T risk if anyone checks. Replace `name`
 * and `title` with a real member of staff whenever one is willing to be
 * credited; a named person with stated experience is a materially stronger
 * signal than a house byline.
 */
const AUTHOR_CURATOR = {
  name: "The Mumbai Bazar Team",
  title: "Saree buyers, Mumbai Bazar",
};

export const GUIDES: Guide[] = [
  {
    slug: "banarasi-saree-guide",
    title: "Banarasi Saree Guide | How to Identify a Real Handloom Banarasi",
    h1: "The Banarasi Saree Guide",
    description:
      "How to identify a genuine handloom Banarasi, what Katan, Organza and Georgette actually mean, realistic price bands, and which weave suits which occasion.",
    published: "2026-08-29",
    modified: "2026-08-29",
    author: AUTHOR_CURATOR,
    readMinutes: 9,
    relatedPath: "/silk-sarees",
    relatedLabel: "Shop pure silk sarees",
    keywords: [
      "how to identify real banarasi saree",
      "banarasi saree types",
      "katan silk vs organza",
      "banarasi saree price",
      "pure banarasi silk saree",
    ],
    standfirst:
      "Varanasi has woven silk for more than five centuries. It has also, more recently, become the centre of a large powerloom copy trade. This guide covers what separates a genuine handloom Banarasi from a machine-made imitation, and what you should expect to pay.",
    sections: [
      {
        heading: "How can you tell if a Banarasi saree is real?",
        answer:
          "A genuine handloom Banarasi shows small irregularities in the weave, loose thread floats across the reverse of the palla, and carries a Silk Mark hologram. Powerloom copies have a perfectly uniform reverse with the threads machine-trimmed. The burn test is definitive: real silk smells of burnt hair and crumbles to ash.",
        body: [
          "Turn the saree over. On a handloom piece the reverse of the palla and border shows floating threads where the weaver carried the zari between motifs — untrimmed, slightly uneven, and impossible to fake at powerloom speed. A machine-made saree has a flat, clean reverse because the floats are cut mechanically.",
          "The second check is the motif edge. Hand-woven kadhwa motifs have a slightly soft outline because each one is woven separately; printed or powerloom motifs have a hard, photographic edge and repeat at an exact fixed interval down the length.",
          "Ask for the Silk Mark tag. It is issued by the Central Silk Board and certifies pure silk content — not handloom status, but it rules out art silk and polyester blends immediately. Any seller should be able to tell you plainly whether a piece carries one.",
        ],
      },
      {
        heading: "What are the different types of Banarasi saree?",
        answer:
          "The four principal Banarasi fabrics are Katan (pure twisted silk, the heaviest and most formal), Organza or Kora (sheer, lightweight), Georgette (fluid, drapes closest to the body) and Shattir (softer, contemporary cuts). Katan is the bridal choice; Georgette and Organza suit receptions and festive wear.",
        body: [
          "The name refers to the base fabric, not the motif. The same kadhwa or jangla brocade can appear on any of them, which is why two sarees described as 'Banarasi' can feel completely different in the hand.",
        ],
        table: {
          caption: "Banarasi fabrics compared",
          headers: ["Fabric", "Weight", "Drape", "Best for", "Typical price"],
          rows: [
            [
              "Katan silk",
              "600–900 g",
              "Structured, holds pleats",
              "Bridal, reception",
              "₹18,000–₹60,000",
            ],
            ["Organza / Kora", "350–500 g", "Sheer, airy", "Festive, daytime", "₹9,000–₹22,000"],
            [
              "Georgette",
              "400–600 g",
              "Fluid, body-skimming",
              "Cocktail, sangeet",
              "₹12,000–₹30,000",
            ],
            ["Shattir", "350–450 g", "Soft, casual", "Everyday, office", "₹6,000–₹14,000"],
          ],
        },
      },
      {
        heading: "What is the difference between kadhwa and cutwork?",
        answer:
          "Kadhwa motifs are woven individually into the fabric, so the reverse has no cut threads and the motif can be lifted at the edge. Cutwork floats a continuous thread across the back and trims it afterwards, leaving clipped ends. Kadhwa takes far longer and costs roughly double for the same design.",
        body: [
          "This single distinction accounts for most of the price gap between two visually similar sarees. If a seller cannot tell you which technique was used, that itself is informative.",
        ],
      },
      {
        heading: "How much should a real Banarasi saree cost?",
        answer:
          "A genuine handloom Katan silk Banarasi with real zari starts around ₹18,000 and rises past ₹60,000 for dense jangla work. Anything advertised as 'pure Banarasi silk' below ₹5,000 is art silk, powerloom, or both. Tested-zari bridal pieces from established Varanasi workshops sit between ₹25,000 and ₹45,000.",
        body: [
          "Price is driven by three things: the silk itself, whether the zari is real metal or polyester-coated, and the loom hours the motif density demands. A dense jangla saree can take two weavers three months.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Banarasi silk the same as pure silk?",
        a: "Not necessarily. 'Banarasi' describes where and how the saree was woven, not the fibre. Banarasi sarees are made in Katan silk, but also in organza, georgette and art silk. Look for the Silk Mark hologram to confirm pure silk content specifically.",
      },
      {
        q: "Can a Banarasi saree be worn casually?",
        a: "Yes — Shattir and lighter georgette Banarasi sarees are made for exactly that. Reserve heavy Katan with dense zari for weddings; it weighs close to a kilogram and is not comfortable for a long working day.",
      },
      {
        q: "How long does a Banarasi saree last?",
        a: "A well-stored handloom Banarasi lasts generations — most heirloom sarees in Indian families are Banarasi or Kanjivaram. Real zari tarnishes but can be cleaned; the silk itself outlasts the wearer if kept away from direct light and refolded a few times a year.",
      },
    ],
  },

  {
    slug: "kanjivaram-saree-guide",
    title: "Kanjivaram Saree Guide | Korvai, Zari Purity & Bridal Weight",
    h1: "The Kanjivaram Saree Guide",
    description:
      "What korvai actually means, how to test zari purity, how Kanjivaram compares to Banarasi for a bride, and what weight to expect at each price band.",
    published: "2026-08-29",
    modified: "2026-08-29",
    author: AUTHOR_CURATOR,
    readMinutes: 8,
    relatedPath: "/wedding-sarees",
    relatedLabel: "Shop bridal & wedding sarees",
    keywords: [
      "kanjivaram saree guide",
      "what is korvai kanjivaram",
      "kanjivaram vs banarasi",
      "pure zari kanjivaram",
      "kanchipuram silk saree",
    ],
    standfirst:
      "A Kanjivaram is woven in Kanchipuram from pure mulberry silk, and its defining feature is structural: the border and body are woven separately and interlocked. That join is what makes a real Kanjivaram unusually durable — and it is also the easiest way to spot one.",
    sections: [
      {
        heading: "What is korvai in a Kanjivaram saree?",
        answer:
          "Korvai is the technique where the border is woven on a separate warp from the body and physically interlocked, rather than woven continuously. It needs three shuttles and often two weavers working in tandem. You can identify it by stretching the border join: a korvai saree shows a fine zigzag interlock and will not separate.",
        body: [
          "Because the border uses its own warp, a korvai Kanjivaram can carry a contrast border in a completely different colour from the body — the classic mustard body with a deep maroon border, for instance. On a non-korvai saree that contrast is printed or woven into the same warp and looks flatter.",
          "Korvai roughly doubles loom time, which is why two Kanjivarams of the same silk weight can differ by ₹10,000 or more.",
        ],
      },
      {
        heading: "How do you test if Kanjivaram zari is pure?",
        answer:
          "Real Kanjivaram zari is silver wire electroplated with gold, wound on a silk core. Pull a thread from an inconspicuous edge and burn it: pure zari leaves a silver-grey metallic residue, while polyester-coated tested zari melts into a dark bead. Reputable sellers also state the zari's silver and gold content on the bill.",
        body: [
          "The industry terms matter. 'Pure zari' means real silver and gold. 'Half-fine zari' means reduced silver content. 'Tested zari' usually means an electroplated copper or polyester substitute — perfectly acceptable at lower price points, but it should be disclosed, and it should be reflected in the price.",
          "Ask which one you are buying before you pay. A shop that will not answer that question directly is telling you something.",
        ],
      },
      {
        heading: "Kanjivaram or Banarasi for a bride?",
        answer:
          "Choose Kanjivaram for South Indian ceremonies and a heavier, structured drape that holds sculpted pleats — typically 700–900 g. Choose Banarasi for North Indian weddings and a softer drape with finer, more intricate brocade at 500–700 g. Both are heirloom-grade; the decision is regional convention and how much weight you want to carry.",
        body: [
          "In practice many brides buy both: a Kanjivaram for the ceremony itself and a lighter Banarasi or georgette for the reception, when they will be standing for several hours.",
        ],
        table: {
          caption: "Kanjivaram vs Banarasi for bridal wear",
          headers: ["", "Kanjivaram", "Banarasi"],
          rows: [
            ["Origin", "Kanchipuram, Tamil Nadu", "Varanasi, Uttar Pradesh"],
            ["Silk", "Pure mulberry, thicker filament", "Katan, finer twist"],
            [
              "Signature",
              "Korvai contrast border, temple motifs",
              "Kadhwa brocade, meenakari, jaal",
            ],
            ["Weight", "700–900 g", "500–700 g"],
            ["Drape", "Structured, sculptural", "Softer, more fluid"],
            ["Bridal price", "₹25,000–₹80,000", "₹18,000–₹60,000"],
          ],
        },
      },
    ],
    faqs: [
      {
        q: "Why are Kanjivaram sarees so expensive?",
        a: "Three inputs: pure mulberry silk at roughly three times the weight of a lighter saree, real silver-and-gold zari, and loom time. A korvai bridal Kanjivaram with dense pallu work can take two weavers 45 to 60 days.",
      },
      {
        q: "How heavy is a bridal Kanjivaram?",
        a: "Typically 700–900 g, and a heavily zari-worked pallu can push past a kilogram. If you are wearing it for a long ceremony, ask for the exact weight before buying — it is the single most common regret we hear about.",
      },
      {
        q: "Can Kanjivaram sarees be washed at home?",
        a: "No. Dry clean only, and use a cleaner who handles zari specifically. Water causes the silk to lose its stiffness and can tarnish real zari permanently.",
      },
    ],
  },

  {
    slug: "paithani-saree-guide",
    title: "Paithani Saree Guide | Yeola vs Paithan, Motifs & Nauvari Draping",
    h1: "The Paithani Saree Guide",
    description:
      "The difference between Yeola and Paithan weaving, what the peacock and lotus motifs mean, how to drape a Nauvari, and which Paithani suits Gudi Padwa and Ganesh Chaturthi.",
    published: "2026-08-29",
    modified: "2026-08-29",
    author: AUTHOR_CURATOR,
    readMinutes: 8,
    relatedPath: "/festive-edit",
    relatedLabel: "Shop the festive edit",
    keywords: [
      "paithani saree guide",
      "yeola paithani",
      "nauvari saree draping",
      "paithani motifs meaning",
      "gudi padwa saree",
    ],
    standfirst:
      "The Paithani is Maharashtra's own weave, and in the Vasai-Virar belt it is the saree most families reach for at Gudi Padwa and Ganesh Chaturthi. It is also the one most often imitated, because the tapestry technique that defines it is slow and expensive.",
    sections: [
      {
        heading: "What makes a Paithani saree authentic?",
        answer:
          "A true Paithani is woven in the tapestry technique: the pallu motifs are built thread by thread with no floating threads behind them, so the design is identical on both sides and fully reversible. Turn the pallu over — if the reverse shows a mirror image with no loose threads, it is genuine Paithani work.",
        body: [
          "This reversibility is the single reliable test. Powerloom imitations produce a recognisable front and a messy back, because the machine floats the coloured threads across and trims them.",
          "A handwoven Paithani pallu takes between one and eight months depending on motif density. That is why authentic pieces start around ₹12,000 and bridal-grade Yeola work runs well past ₹1,00,000.",
        ],
      },
      {
        heading: "What is the difference between Yeola and Paithan Paithani?",
        answer:
          "Paithan, the original town near Aurangabad, produces a small volume of highly traditional pieces. Yeola in Nashik district is now the largest production centre and makes most of the Paithani sold today, in a wider colour and motif range. Yeola quality at the upper end matches Paithan; the difference is volume and variety, not skill.",
        body: [
          "For most buyers Yeola is the practical choice — better availability, more colour options, and a broader price ladder. Paithan pieces carry more collector prestige and usually a premium.",
        ],
      },
      {
        heading: "What do Paithani motifs mean?",
        answer:
          "Paithani motifs are drawn from Ajanta cave art and Maharashtrian temple iconography. The peacock (morbangdi) signifies grace and is the most prized pallu motif; the lotus (kamal) means purity; the parrot (tota-maina) represents love; and the coconut or asavali vine border stands for prosperity.",
        body: [
          "Motif choice traditionally tracks the occasion. Peacock pallus are the bridal and Gudi Padwa choice. Simpler lotus or plain-gold pallus are worn for temple visits and everyday festive occasions.",
        ],
      },
    ],
    howTo: {
      name: "How to drape a Nauvari saree",
      description:
        "The traditional nine-yard Maharashtrian drape, worn for Gudi Padwa, Ganesh Chaturthi and wedding ceremonies. Allow 15 minutes the first few times.",
      totalTime: "PT15M",
      supplies: [
        "Nine-yard (nauvari) saree",
        "Fitted blouse",
        "Safety pins",
        "Waist cord or thin belt",
      ],
      steps: [
        {
          name: "Tie the base knot",
          text: "Hold the saree lengthwise behind you and bring both ends to the front at waist level. Tie a firm knot at the centre of your waist, leaving roughly equal lengths on each side.",
        },
        {
          name: "Form and pass the kaccha",
          text: "Gather the left-hand length into pleats, pass the gathered bunch between your legs, and tuck it firmly into the waist at the centre back. This kaccha is what makes the nauvari a trouser-like drape.",
        },
        {
          name: "Pleat the front",
          text: "Take the remaining front fabric and make five to seven even pleats, roughly four inches wide. Tuck them into the waist at the centre front, with the fold facing left.",
        },
        {
          name: "Wrap the lower drape",
          text: "Bring the right-hand length around your waist once, keeping the lower edge at ankle height, and tuck it in along the waistline.",
        },
        {
          name: "Set the pallu",
          text: "Bring the remaining length diagonally across your torso from the right hip to the left shoulder. Pleat the pallu to about five inches wide and pin it at the shoulder.",
        },
        {
          name: "Secure and check movement",
          text: "Pin the kaccha at the back and the pleats at the waist. Walk a few steps and sit down once — the nauvari should allow a full stride. Adjust the kaccha tuck if it feels tight.",
        },
      ],
    },
    faqs: [
      {
        q: "How much does a real Paithani saree cost?",
        a: "Authentic handwoven Paithani starts around ₹12,000 for a simple pallu and semi-silk body. Full silk with a dense peacock pallu runs ₹35,000 to ₹80,000, and bridal Yeola pieces exceed ₹1,00,000. Anything under ₹5,000 is a powerloom semi-Paithani.",
      },
      {
        q: "What is the difference between a Paithani and a Nauvari?",
        a: "They describe different things. Paithani is a weave from Maharashtra; nauvari is a nine-yard draping style. You can drape a Paithani as a nauvari, and many families do for Gudi Padwa, but a nauvari can be any fabric.",
      },
      {
        q: "Which Paithani colour is right for Gudi Padwa?",
        a: "Traditionally yellow, green or gold — the colours associated with new beginnings and the spring harvest. Deep magenta and peacock blue are equally common now and remain within convention.",
      },
    ],
  },

  {
    slug: "silk-saree-care",
    title: "How to Wash & Store Silk Sarees | Zari, Monsoon & Stain Care",
    h1: "Caring for Silk Sarees",
    description:
      "Whether silk sarees can be washed at home, how to stop zari tarnishing, how to store silk through a Mumbai monsoon, and how to treat stains without damaging the weave.",
    published: "2026-08-29",
    modified: "2026-08-29",
    author: AUTHOR_CURATOR,
    readMinutes: 7,
    relatedPath: "/care-guide",
    relatedLabel: "See the full care guide",
    keywords: [
      "how to wash silk saree at home",
      "how to store silk sarees",
      "zari tarnish removal",
      "silk saree monsoon storage",
      "saree stain removal",
    ],
    standfirst:
      "Mumbai's humidity is the single biggest threat to a silk saree. Sarees that would last generations in a dry climate develop mildew, tarnished zari and fold-line cracks within a few monsoons here. Everything below is written for coastal Maharashtrian conditions specifically.",
    sections: [
      {
        heading: "Can you wash a silk saree at home?",
        answer:
          "Do not wash a zari or heavily worked silk saree at home — water tarnishes real zari permanently and strips the silk's natural stiffness. Plain silk with no metallic work can be hand-washed once in cold water with a pH-neutral detergent, but the first wash of any silk saree should always be professional dry cleaning.",
        body: [
          "If you must spot-clean, dab with a barely damp cloth and never rub — friction breaks the surface fibres and leaves a permanent dull patch.",
          "Choose a dry cleaner who handles zari specifically and tell them the saree contains real metal thread. Standard solvent cycles are fine for silk but can dull electroplated zari.",
        ],
      },
      {
        heading: "How do you stop zari from tarnishing?",
        answer:
          "Zari tarnishes through contact with moisture, perfume and sulphur in the air. Store sarees wrapped in unbleached muslin, never in plastic, and keep perfume and deodorant off the fabric entirely — spray before dressing. Refold along different lines every three to four months so the same crease never sits on a zari line.",
        body: [
          "Light tarnish can be lifted by a professional cleaner. Heavy tarnish, where the zari has gone brown-black, is usually permanent, which is why prevention matters more here than remedy.",
          "Silica gel sachets in the storage box are worth adding through the monsoon. Replace them each season.",
        ],
      },
      {
        heading: "How should silk sarees be stored in the monsoon?",
        answer:
          "Wrap each saree in unbleached cotton muslin, store flat rather than on a hanger, and keep the stack in a cupboard away from an exterior wall. Add silica gel and dried neem leaves, never naphthalene balls, which leave residue on silk. Air the sarees in indirect light for an hour every two months.",
        body: [
          "Plastic covers and vacuum bags are the most common mistake — they trap moisture against the fibre and create exactly the conditions mildew needs.",
          "Hangers are the second mistake. The weight of a 900 g Kanjivaram pulling on one fold line for a year will crack the silk along that crease.",
        ],
      },
    ],
    howTo: {
      name: "How to store a silk saree for the monsoon",
      description:
        "A seasonal routine for coastal humidity. Do this at the start of the monsoon and check once mid-season.",
      totalTime: "PT20M",
      supplies: [
        "Unbleached cotton muslin",
        "Silica gel sachets",
        "Dried neem leaves",
        "Flat storage box or shelf",
      ],
      steps: [
        {
          name: "Air the saree first",
          text: "Hang the saree in indirect light for an hour. Never in direct sun, which fades natural dyes and weakens silk fibres.",
        },
        {
          name: "Check for damp and stains",
          text: "Run your hand across the fabric for cool damp patches, and check the folds for early mildew spotting. Send anything questionable for cleaning before storing.",
        },
        {
          name: "Refold along new lines",
          text: "Fold so the creases fall differently from last season, and keep folds off the zari where possible. Zari cracks along repeated fold lines.",
        },
        {
          name: "Wrap in muslin",
          text: "Wrap the saree completely in unbleached cotton muslin. Never plastic, and never a vacuum bag — both trap moisture against the silk.",
        },
        {
          name: "Add desiccant, not naphthalene",
          text: "Tuck silica gel sachets and dried neem leaves into the wrap. Naphthalene leaves an oily residue on silk and the smell never fully lifts.",
        },
        {
          name: "Store flat, away from walls",
          text: "Stack flat with the heaviest saree at the bottom, on a shelf away from an exterior wall. Re-check and re-air once mid-monsoon.",
        },
      ],
    },
    faqs: [
      {
        q: "How often should silk sarees be dry cleaned?",
        a: "Only when actually soiled — over-cleaning wears silk faster than wearing it does. For occasional wear, once every two or three wears is ample. Always air the saree after wearing and store it clean.",
      },
      {
        q: "How do you remove a stain from a silk saree?",
        a: "Blot immediately with a dry cloth, never rub, and do not apply water to a zari saree. Take it to a dry cleaner within 48 hours and tell them what caused the stain — oil, turmeric and wine each need different treatment.",
      },
      {
        q: "Can silk sarees be ironed?",
        a: "Yes, on low heat with a cotton cloth between the iron and the saree, and always on the reverse. Never iron directly over zari — it flattens and dulls the metal thread permanently.",
      },
    ],
  },

  {
    slug: "bridal-trousseau-guide",
    title: "Bridal Saree Trousseau Guide | Checklist, Colours & Budget by Ceremony",
    h1: "The Bridal Trousseau Guide",
    description:
      "How many sarees a trousseau needs, which colour suits each ceremony, realistic budget tiers, and the buying timeline that avoids last-minute compromises.",
    published: "2026-08-29",
    modified: "2026-08-29",
    author: AUTHOR_CURATOR,
    readMinutes: 10,
    relatedPath: "/trousseau-builder",
    relatedLabel: "Build your trousseau",
    keywords: [
      "bridal trousseau saree checklist",
      "wedding saree colours by ceremony",
      "bridal saree budget",
      "how many sarees for wedding",
      "trousseau planning timeline",
    ],
    standfirst:
      "Most brides we work with start six to eight months out and still feel rushed at the end. The bottleneck is rarely choosing the saree — it is blouse stitching and, for anything handwoven to order, loom time. This guide works backwards from the wedding date.",
    sections: [
      {
        heading: "How many sarees does a bridal trousseau need?",
        answer:
          "A typical Indian bridal trousseau holds six to ten sarees: one heirloom-grade ceremony saree, two to three for the surrounding functions (haldi, mehendi, sangeet), one reception piece, and three to four lighter sarees for post-wedding occasions and early married life. Fewer, better sarees consistently outlast a larger number of mid-range ones.",
        body: [
          "The one place not to economise is the ceremony saree — it is the one that appears in every photograph and is usually kept for a daughter. The post-wedding sarees are where a smaller budget goes furthest, because they will be worn often and casually.",
        ],
        table: {
          caption: "Trousseau structure by ceremony",
          headers: ["Occasion", "Weave", "Colour convention", "Budget band"],
          rows: [
            [
              "Wedding ceremony",
              "Kanjivaram or Katan Banarasi",
              "Red, maroon, deep magenta",
              "₹25,000–₹80,000",
            ],
            ["Reception", "Georgette or tissue silk", "Gold, ivory, pastel", "₹12,000–₹30,000"],
            ["Sangeet", "Organza, lightweight silk", "Jewel tones", "₹9,000–₹20,000"],
            ["Mehendi", "Cotton silk, soft silk", "Green, yellow", "₹6,000–₹14,000"],
            ["Haldi", "Cotton, chanderi", "Yellow", "₹4,000–₹9,000"],
            ["Post-wedding", "Soft silk, tissue", "Any", "₹6,000–₹15,000 each"],
          ],
        },
      },
      {
        heading: "When should you start buying a bridal trousseau?",
        answer:
          "Begin six to eight months before the wedding. Handwoven sarees ordered to a custom colour need eight to twelve weeks of loom time, and blouse stitching with fittings needs a further three to four weeks. Starting later means buying from ready stock, which sharply narrows the choice at the bridal end.",
        body: [
          "A workable sequence: months 6–5 for the ceremony saree, months 4–3 for reception and function sarees, months 3–2 for blouse stitching and first fittings, and the final month for the second fitting and accessories.",
          "If you are commissioning a custom Kanjivaram or Paithani, add two months. Loom time is not compressible.",
        ],
      },
      {
        heading: "What colour should a bride wear to each ceremony?",
        answer:
          "Regional convention still holds: red or maroon for the North Indian ceremony, gold and deep jewel tones for a South Indian muhurtham, green for Maharashtrian and Bengali ceremonies, yellow for haldi, and green or orange for mehendi. Ivory, gold and pastels are now standard for receptions across all regions.",
        body: [
          "The one convention worth checking with family is white and black, which are avoided at ceremonies in most Indian traditions but are entirely acceptable at a reception or cocktail evening.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is a reasonable total bridal trousseau budget?",
        a: "For a trousseau of handwoven sarees, ₹1,20,000 to ₹2,50,000 is typical, with the ceremony saree usually a third of it. It can be done well at ₹80,000 by choosing fewer sarees and lighter weaves for the surrounding functions.",
      },
      {
        q: "Should the bride's mother match the bride's saree?",
        a: "Coordinate rather than match. Pick a shade from the bride's saree and echo it in the border or pallu — an antique gold tissue or a regal Paithani in a complementary tone photographs far better than the same colour twice.",
      },
      {
        q: "Can bridal sarees be customised in a different colour?",
        a: "Yes, for handwoven pieces ordered directly from the weaving cluster. Allow eight to twelve weeks of loom time, and expect a small variance from the reference shade — natural dye lots are never identical.",
      },
    ],
  },

  {
    slug: "mumbai-saree-shopping-guide",
    title: "Best Saree Shops in Mumbai | Local Buying Guide to Nalasopara, Virar & Suburbs",
    h1: "The Mumbai Saree Shopping Guide",
    description:
      "Where to buy authentic bridal, silk, and everyday sarees in Mumbai without South Mumbai markups. A neighbourhood breakdown of Nalasopara, Virar, Vasai, Bhayandar, and Goregaon.",
    published: "2026-08-31",
    modified: "2026-08-31",
    author: AUTHOR_CURATOR,
    readMinutes: 9,
    relatedPath: "/stores",
    relatedLabel: "Explore our 8 Mumbai stores",
    keywords: [
      "best saree shop in mumbai",
      "saree shop nalasopara east",
      "saree market virar",
      "bhayandar saree shopping",
      "wedding saree shopping western line mumbai",
    ],
    standfirst:
      "While Dadar and Kalbadevi draw crowds, experienced Mumbai shoppers increasingly head to the Western Suburbs — Nalasopara, Virar, Vasai, and Bhayandar. Here, lower retail rents allow boutiques to offer authentic handlooms at 20% to 35% lower markups. This guide details where to shop, pricing standards, and store etiquette.",
    sections: [
      {
        heading: "Where are the best areas to shop for sarees in Mumbai?",
        answer:
          "The top saree shopping areas in Mumbai span two tiers: traditional heritage markets in South/Central Mumbai (Kalbadevi, Dadar Hindmata, and Marine Lines) and high-value suburban hubs along the Western Railway line (Nalasopara East, Virar West, Bhayandar East, and Goregaon). Suburban hubs provide equivalent authentic weaves with 25% lower overhead markups.",
        body: [
          "Dadar Hindmata is renowned for sheer volume, but narrow lanes and high customer density make in-depth draping and personal consultation difficult on weekends.",
          "The Western Suburbs — specifically Nalasopara and Virar — have emerged as the primary wedding trousseau destination for families across MMR. Stores like Mumbai Bazar maintain large physical inventories where brides can compare multiple sarees under natural and warm light without being hurried.",
          "For accessibility, all major suburban shopping clusters sit within 2 to 7 minutes walking distance from their respective Western Line railway stations.",
        ],
        table: {
          caption: "Mumbai Saree Shopping Hubs Compared",
          headers: ["Shopping District", "Signature Strengths", "Typical Price Markup", "Draping & Trial Experience"],
          rows: [
            ["Nalasopara & Virar Hubs", "Direct loom bridal silks, heavy lehengas, personalized attention", "Lowest (Direct weaver rates)", "Spacious private trial lounges, unhurried"],
            ["Bhayandar & Vasai Markets", "Festive silks, ready-to-wear drapes, family budget packages", "Low to Moderate", "Family-friendly, friendly local service"],
            ["Dadar Hindmata / Charni Rd", "Mass wholesale varieties, cottons, fast retail turnover", "Moderate (15–25% higher rents)", "High crowd density, quick turnover pressure"],
            ["South Mumbai Designer Boutiques", "Celebrity couture labels, bespoke machine embroideries", "Highest (50–200% brand premium)", "By-appointment only, premium consultation fee"],
          ],
        },
      },
      {
        heading: "Why do brides travel to Nalasopara and the Western Suburbs for bridal shopping?",
        answer:
          "Brides choose the Western Suburbs because boutique spaces are larger, retail markups are modest, and stores source directly from weaving clusters in Varanasi and Kanchipuram. A bridal Kanjivaram costing ₹45,000 in town typically retails between ₹28,000 and ₹34,000 in Nalasopara with identical Silk Mark certification.",
        body: [
          "Wedding shopping in Mumbai typically involves buying between 6 and 15 sarees for the bride, mother, and immediate family. Saving ₹5,000 to ₹15,000 per heirloom drape creates substantial overall savings without compromising silk grade.",
          "At Mumbai Bazar's flagship on Tulinj Road (Nalasopara East), brides can also access custom blouse tailoring, fall-pico finishing, and video calls for out-of-town family members during trials.",
        ],
      },
      {
        heading: "What are the store timings and best times to visit Mumbai saree markets?",
        answer:
          "Most saree stores across Mumbai and the Western Suburbs open between 10:00 AM and 9:00 PM daily. Tuesday through Friday mornings (10:30 AM to 2:00 PM) offer the quietest hours for bridal consultations. Avoid weekend post-lunch hours (4:00 PM to 8:00 PM) if you want dedicated styling attention.",
        body: [
          "Unlike weekly markets that close on Mondays, Mumbai Bazar outlets remain open 7 days a week, including festive bank holidays.",
          "If travelling by Western local train, take a semi-fast or fast train from Churchgate/Andheri to Borivali, then change or continue to Nalasopara/Virar outside peak commute hours (9:00–11:00 AM and 6:00–8:30 PM).",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I request live WhatsApp video tours before visiting the stores?",
        a: "Yes. Mumbai Bazar offers dedicated WhatsApp video appointments at +91 89566 64631. A saree expert will drape selected pieces and demonstrate borders and pallus under live boutique lighting before you travel.",
      },
      {
        q: "Do suburban Mumbai stores offer authentic Silk Mark certified sarees?",
        a: "Yes. Authentic boutiques in the Western Suburbs source directly from registered master looms and attach original Central Silk Board holograms with QR codes on all pure silk sarees.",
      },
      {
        q: "Is parking available near Mumbai Bazar stores?",
        a: "Our flagship at Tiwari Nagar, Tulinj Road has convenient drop-off points and nearby street parking, located just 5 minutes by auto from Nalasopara East railway station.",
      },
    ],
  },

  {
    slug: "pure-silk-vs-art-silk-test",
    title: "Pure Silk vs Art Silk | 5 Tests to Identify Real Silk Sarees (Burn, Ring & Touch)",
    h1: "How to Test Pure Silk vs Art Silk",
    description:
      "How to tell real pure silk from artificial polyester or viscose silk. Complete testing guide including the burn test, wedding ring test, touch warmth, and Central Silk Board verification.",
    published: "2026-08-31",
    modified: "2026-08-31",
    author: AUTHOR_CURATOR,
    readMinutes: 8,
    relatedPath: "/silk-sarees",
    relatedLabel: "Shop silk & silk-blend sarees",
    keywords: [
      "pure silk vs art silk",
      "how to test pure silk saree at home",
      "silk burn test result",
      "silk mark label verification",
      "identify fake kanjivaram banarasi",
    ],
    standfirst:
      "With high-speed powerlooms producing near-identical chemical finishes, 'art silk' (artificial polyester/rayon) frequently masquerades as pure mulberry silk. A difference in manufacturing cost of ₹15,000 can be hidden behind synthetic glaze. Here are the 5 definitive tests to verify silk purity before you invest.",
    sections: [
      {
        heading: "What is the fundamental difference between pure silk and art silk?",
        answer:
          "Pure silk is a natural protein fiber produced by silkworms (Bombyx mori), renowned for breathability, subtle triangular prism luster, and thermal adaptability. Art silk is a synthetic petroleum or cellulose derivative (polyester, rayon, or viscose) that feels slippery, traps body heat, and lacks tensile heirloom durability.",
        body: [
          "Pure silk fibers refract light at diverse angles because of their natural triangular prism structure, producing an iridescent glow that shifts as the drape moves.",
          "Synthetic art silk possesses a single, high-gloss plastic sheen that reflects light harshly and uniformly. Under studio flash or sunlight, art silk photographs with a glassy glare.",
        ],
        table: {
          caption: "Pure Silk vs Art Silk Comparison",
          headers: ["Attribute", "Pure Handloom Silk", "Art Silk (Polyester/Viscose)"],
          rows: [
            ["Fiber Origin", "Natural Bombyx mori protein filament", "Synthetic petrochemical or wood pulp"],
            ["Luster & Sheen", "Prismatic, multi-angle iridescent sheen", "High-gloss uniform synthetic reflection"],
            ["Touch & Warmth", "Warms quickly when rubbed between palms", "Remains cool and static-prone to touch"],
            ["Burn Test Reaction", "Burns slowly, smells of burnt hair, leaves soft ash", "Melts rapidly, smells of burnt plastic, hard bead"],
            ["Wear Longevity", "50+ years, heirlooms passed between generations", "3–5 years, threads fray and stiffen after dry wash"],
          ],
        },
      },
      {
        heading: "How does the silk burn test work?",
        answer:
          "Pull a single thread from the loose warp/weft fringe at the inner end of the saree. Hold it with tweezers and ignite with a match. Real silk burns slowly, extinguishes the instant the flame is removed, smells like burning hair, and leaves a brittle black ash. Synthetic fibers melt into a hard, non-crushable bead.",
        body: [
          "The smell test is foolproof because silk is pure keratin protein, identical to human hair and sheep wool.",
          "If the thread smells like chemical fumes or burnt paper, it is either polyester (plastic) or viscose (wood cellulose).",
          "Reputable saree boutiques will gladly trim a 1-inch thread from the unstitched blouse allowance to let you test before high-value bridal purchases.",
        ],
      },
      {
        heading: "What is the wedding ring test for silk sarees?",
        answer:
          "The ring test checks filament fineness and density. A pure lightweight silk saree (such as Chanderi, Kora Organza, or fine Mulberry Silk) can be gently pulled completely through a smooth wedding finger ring. Heavier bridal brocades may not pass entirely due to metallic zari, but the pure silk body glides smoothly without catching.",
        body: [
          "Artificial silks tend to bunch, catch, and exhibit static cling against metal or smooth surfaces.",
          "Another simple tactile check is rubbing the fabric briskly between your palms for 10 seconds: pure natural silk generates instant thermal warmth; artificial fibers stay cold or produce static electricity.",
        ],
      },
      {
        heading: "How do you verify the Silk Mark tag in India?",
        answer:
          "Look for the official purple and green Silk Mark hologram issued by the Central Silk Board (Ministry of Textiles, Government of India). Every genuine Silk Mark label contains a unique alphanumeric license code and a scannable QR code that verifies the registered manufacturer on the official Silk Mark portal.",
        body: [
          "Beware of generic labels that say '100% Silk Touch' or 'Pure Silk Look' without the official Silk Mark butterfly logo.",
          "At Mumbai Bazar, every pure silk saree carries an authenticated Silk Mark tag, providing complete certification and peace of mind.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is 'art silk' legal to sell as silk in India?",
        a: "Consumer protection rules mandate that sellers clearly disclose synthetic content. Selling polyester or art silk as pure silk without disclosure violates the Consumer Protection Act, 2019.",
      },
      {
        q: "Why do pure silk sarees cost significantly more than art silk?",
        a: "Pure silk requires silkworm rearing (sericulture), hand-reeling of raw filaments, and manual pit loom weaving that takes 10 to 40 days per drape. Art silk is mass-produced in powerloom factories in hours.",
      },
      {
        q: "Can art silk sarees be dry cleaned?",
        a: "Yes, but solvent dry cleaning often dissolves synthetic finishes and glues used in art silk zari, resulting in loss of luster and stiffness after 2–3 washes.",
      },
    ],
  },

  {
    slug: "wedding-saree-trends-2026",
    title: "2026 Indian Wedding Saree Trends | Colors, Weaves, Fabrics & Silhouette Guide",
    h1: "Top 2026 Wedding Saree Trends",
    description:
      "The definitive trend forecast for 2026 Indian weddings: metallic tissue silks, pastel korvai Kanjivarams, sculpted contrast blouses, and modern heirloom draping.",
    published: "2026-08-31",
    modified: "2026-08-31",
    author: AUTHOR_CURATOR,
    readMinutes: 8,
    relatedPath: "/wedding-sarees",
    relatedLabel: "Shop the 2026 Bridal Saree Collection",
    keywords: [
      "wedding saree trends 2026",
      "bridal saree colors 2026",
      "tissue silk saree trend",
      "pastel kanjivaram wedding saree",
      "latest indian bride saree designs",
    ],
    standfirst:
      "Indian bridal fashion in 2026 is moving decisively away from mass-embroidered, 15-kilogram synthetic lehengas toward weightless, light-catching handwoven silks. Brides want mobility, breathable comfort, and timeless drapes that can be re-worn for decades. Here is what leading brides, stylists, and weaving clusters are crafting for the 2026 season.",
    sections: [
      {
        heading: "What are the biggest wedding saree trends for the 2026 season?",
        answer:
          "The defining 2026 wedding saree trends are metallic tissue silks with tested silver-gold zari, pastel korvai Kanjivarams with jewel-toned borders, featherweight Katan Banarasi brocades (under 600g), and architectural contrast blouse tailoring. Brides prioritize light-reactive fabrics that look luminous in 4K photography and evening candlelight.",
        body: [
          "Tissue silk has replaced heavy velvet and netting for wedding receptions and sangeet nights. Woven by interlacing pure mulberry silk with ultra-fine metallic thread, tissue sarees glow without excessive surface weight.",
          "Handloom revivalism is stronger than ever: brides are commissioning regional heritage motifs such as the Gandaberunda (two-headed eagle), Mayil (peacock chakram), and Shikargah hunting scenes rather than generic machine florals.",
        ],
        table: {
          caption: "2026 Wedding Saree Styling vs Traditional Norms",
          headers: ["Element", "Traditional Standard", "2026 Modern Bridal Trend"],
          rows: [
            ["Base Fabric", "Heavy rigid 900g+ silks or layered velvet", "Fluid metallic tissue, soft mulberry silk, 500g Katan"],
            ["Color Palette", "Strict crimson red and bright maroon", "Rose gold, champagne, sage green, and lavender paired with jewel borders"],
            ["Blouse Silhouette", "Matching fabric with heavy all-over zardozi", "Contrasting jewel velvet, structured corsetry, or minimal handloom brocade"],
            ["Pallu Draping", "Pinned rigid pleats down the shoulder", "Flowing floating drape or scalloped Gujarati front pallu"],
          ],
        },
      },
      {
        heading: "Which bridal saree colors are dominating 2026 wedding palettes?",
        answer:
          "While royal sindoor red and deep wine remain sacred ceremony classics, 2026 bridal palettes are dominated by champagne gold, antique rose, pistachio green, and iced lilac. South Indian muhurthams feature sunset mango yellow contrasted with emerald green korvai borders.",
        body: [
          "For cocktail and reception nights, jewel tones like peacock teal, midnight navy, and molten metallic copper are outperforming standard monochrome silvers.",
          "Brides are also adopting tone-on-tone dressing: pairing an antique gold tissue saree with uncut polki jewelry and gold zari threadwork rather than contrasting stones.",
        ],
      },
      {
        heading: "How are 2026 brides styling contrast blouses?",
        answer:
          "Modern brides pair muted saree bodies with rich, jewel-toned contrast blouses: a champagne tissue saree with a deep emerald green raw silk blouse, or an antique gold Kanjivaram with an oxblood wine velvet blouse. Elbow-length sleeves with delicate border cutwork and sweetheart necklines remain favorites.",
        body: [
          "The trend is to let the saree's handloom weave take center stage, using the blouse as an architectural frame rather than overwhelming it with chunky stones.",
          "At Mumbai Bazar stores, our in-house master tailors provide custom measurements, bustier boning, and matching contrast fabric matching during your showroom trial.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are tissue silk sarees difficult to drape?",
        a: "Traditional tissue was stiff, but 2026 soft metallic tissue weaves use blended mulberry silk warps that drape fluidly and hold sharp, structured waist pleats effortlessly.",
      },
      {
        q: "Can a handwoven wedding saree be re-worn after the wedding?",
        a: "Yes. Unlike bridal lehengas that sit in suitcases, an heirloom Banarasi or Kanjivaram can be restyled with different blouses, shirts, or jackets for festive celebrations, anniversaries, and family weddings for decades.",
      },
    ],
  },

  {
    slug: "kalamkari-saree-styling-guide",
    title: "Kalamkari Saree Guide | Authentic Natural Dyes, Motifs & Daily Styling",
    h1: "The Authentic Kalamkari Saree Guide",
    description:
      "A complete guide to hand-painted Srikalahasti and block-printed Machilipatnam Kalamkari sarees. Learn about natural vegetable dyes, sacred mythological motifs, and contemporary styling.",
    published: "2026-08-31",
    modified: "2026-08-31",
    author: AUTHOR_CURATOR,
    readMinutes: 7,
    relatedPath: "/everyday-sarees",
    relatedLabel: "Shop everyday & artisan sarees",
    keywords: [
      "kalamkari saree guide",
      "srikalahasti vs machilipatnam kalamkari",
      "natural vegetable dye saree",
      "artisan handblock saree",
      "office wear cotton silk saree",
    ],
    standfirst:
      "Originating from the Persian words 'Kalam' (pen) and 'Kari' (craftsmanship), Kalamkari represents one of India's most ancient organic textile traditions. Using natural tamarind pens, buffalo milk, and herbal dyes, each saree undergoes up to seventeen manual river-washing steps. Here is how to appreciate, style, and care for authentic Kalamkari.",
    sections: [
      {
        heading: "What is an authentic Kalamkari saree?",
        answer:
          "An authentic Kalamkari saree is crafted using 100% natural vegetable dyes derived from madder roots, indigo, pomegranate rinds, and myrobalan nuts on handloom cotton or silk. It features freehand pen drawings or carved wooden block prints depicting tree of life motifs, mythological epics, and floral vines.",
        body: [
          "The craft utilizes buffalo milk as an organic mordant to prevent natural dyes from bleeding. Authentic Kalamkari has a characteristic, comforting earthy aroma and softened organic tones that chemical dyes cannot mimic.",
          "Unlike screen-printed factory imitations, hand-block Kalamkari displays delightful micro-variations where wooden blocks overlap organically along borders and pallus.",
        ],
        table: {
          caption: "Srikalahasti vs Machilipatnam Kalamkari",
          headers: ["Feature", "Srikalahasti Style", "Machilipatnam Style"],
          rows: [
            ["Technique", "100% Freehand pen drawing using bamboo/tamarind kalam", "Hand-carved teak wood block printing with hand detailing"],
            ["Motifs", "Epics, Ramayana/Mahabharata scenes, temple deities", "Tree of life, floral creepers, Persian paisleys, jali work"],
            ["Base Fabric", "Pure cotton canvas, Tussar silk, Mangalgiri", "Cotton silk, lightweight Chanderi, pure modal"],
            ["Best For", "Art collectors, temple festivals, cultural functions", "Daily elegance, smart office wear, academic conferences"],
          ],
        },
      },
      {
        heading: "How should a Kalamkari saree be styled for work and everyday wear?",
        answer:
          "Pair an earthy Kalamkari saree with a solid, structured black, indigo, or terracotta sleeveless blouse. Accentuate with oxidized silver jewelry, Kolhapuri flats or leather juttis, and a structured tote. Keep hair in a relaxed low bun to highlight the narrative pallu.",
        body: [
          "Because Kalamkari motifs are visually rich, avoid printed or embroidered blouses. A crisp linen or cotton blouse provides the perfect contrast.",
          "For formal meetings, a raw silk Kalamkari drape provides refined, intellectual sophistication that commands respect without being overly flashy.",
        ],
      },
      {
        heading: "How do you wash and preserve natural vegetable dye sarees?",
        answer:
          "For the first three washes, dry clean your Kalamkari saree to set the organic vegetable dyes. For subsequent washes, hand wash separately in cold water with mild rock salt and soapnut (reetha) or pH-neutral shampoo. Never soak, and dry strictly in shaded, airy spaces away from direct sun.",
        body: [
          "Natural indigo and madder red may release a slight tint during initial rinses — this is typical of vegetable dyes and stabilizes after washing.",
          "Store folded in a breathable cotton bag. Avoid spraying deodorants or perfumes directly onto the fabric, as alcohol stains natural dye compounds.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why does my Kalamkari saree have an earthy smell?",
        a: "Authentic Kalamkari is treated with myrobalan paste and buffalo milk to fix natural colors. This earthy fragrance is proof of organic processing and fades naturally after airing.",
      },
      {
        q: "Are Kalamkari sarees suitable for Mumbai's humid climate?",
        a: "They are ideal. Handloom cotton and cotton-silk Kalamkari are highly breathable, wick moisture naturally, and keep you remarkably cool throughout coastal summers and monsoons.",
      },
    ],
  },
];

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
