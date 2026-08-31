/**
 * Per-category editorial copy.
 *
 * Why this file exists: before it, /shop, /silk-sarees, /wedding-sarees,
 * /festive-edit, /everyday-sarees and /new-arrivals were 98.7-99.1% identical
 * to one another. Each rendered the same <CategoryPage> with a one-line `copy`
 * string, so ~531 words of the page were the mega-menu and footer and none of
 * it was unique. Only the <title>, meta description and H1 differed.
 *
 * Those are the highest-commercial-intent URLs on the site. As built they
 * competed with each other for the same phrases and gave Google nothing to
 * rank. This file gives each one a genuine reason to exist.
 *
 * Two rules for anything added here:
 *
 * 1. NO claims the business cannot stand behind. No purity grades, no
 *    certification, no loom-hours, no "100% authentic". Those were removed
 *    from this codebase deliberately — see the Phase 1 audit work. Write about
 *    drape, occasion, care, fit and how the stores actually operate, all of
 *    which is true and is what customers actually ask.
 * 2. Genuinely different per category. Rephrasing the same paragraph six ways
 *    reproduces the problem this file was created to fix.
 */

export type CategoryCopy = {
  /** Short lead, rendered above the product grid. Keep to ~50 words. */
  intro: string;
  /** Buying guide below the grid. 3-5 blocks, ~250-350 words total. */
  guide: { heading: string; body: string }[];
};

export const CATEGORY_COPY: Record<string, CategoryCopy> = {
  "silk-sarees": {
    intro:
      "Silk and silk-blend drapes in Banarasi, Kanjivaram, Paithani and Chanderi styles. Every piece here can be unfolded, draped and seen in daylight at any of our stores before you decide — the part a photograph cannot do for you.",
    guide: [
      {
        heading: "Silk, silk-blend, and how to tell what you are holding",
        body: "Fabric names in the saree trade are loose, so it helps to know what you are actually comparing. Pure silk has weight and a soft rustle, warms in the hand, and its shine shifts colour as you turn it. Silk-blends and art silks are lighter, cooler to the touch, and hold a flatter, more even shine. Neither is wrong — a blend drapes more easily and costs far less — but they are different things and should be priced differently. We will tell you plainly which one a piece is, and you are welcome to compare two side by side on the counter.",
      },
      {
        heading: "Matching the weave to the occasion",
        body: "Banarasi katan and heavier brocades hold their shape and photograph well under indoor lighting, which is why they suit weddings and receptions. Kanjivaram-style weaves with contrast borders carry temple visits and daytime functions. Chanderi and tissue are far lighter, so they work for long events in Mumbai heat where a heavy drape becomes punishing by hour three. If you are buying for a specific function, tell us the venue and time of day — it narrows the choice faster than any filter.",
      },
      {
        heading: "Living with a silk saree",
        body: "Dry clean before the first wash. Store folded in soft muslin rather than plastic, which traps humidity — a real consideration on the western line during monsoon. Refold along different lines two or three times a year so the creases do not set into permanent weak points, and keep zari away from perfume and direct sunlight. Our care guide covers this in more detail, and the staff at any store will walk you through it when you buy.",
      },
    ],
  },

  "wedding-sarees": {
    intro:
      "Dulhan sarees, reception drapes and bridal lehengas, with blouse stitching and fittings handled in store. Bridal buying is rarely one visit — most families come two or three times, and that is entirely normal.",
    guide: [
      {
        heading: "Start earlier than feels necessary",
        body: "Blouse stitching and fall-and-pico take time, and the wedding season compresses everyone's schedule at once. Six to eight weeks before the function is comfortable; under three weeks means fewer alteration rounds and less room to change your mind. If your date is close, say so at the start and we will show you what can realistically be finished in time rather than what looks best on the shelf.",
      },
      {
        heading: "Dressing the whole function, not just the day",
        body: "Most brides need more than one drape: the pheras, the reception, the sangeet, and often haldi and mehendi. These have genuinely different requirements — the pheras drape sits for hours and needs to survive being sat in, while a reception piece is worn standing and photographed constantly. Buying them together also lets you coordinate the mother of the bride and the bridesmaids in one visit instead of chasing colour matches across three trips.",
      },
      {
        heading: "Bring the jewellery, or a photograph of it",
        body: "Gold reads differently against maroon than against wine or rust, and the difference only shows in person. The same is true of blouse contrast. Customers who bring their jewellery — or even a phone photo — decide faster and change their minds less afterwards. If you want a second opinion from family who cannot come, we will send photos and video over WhatsApp from the counter.",
      },
      {
        heading: "Trying before buying",
        body: "Every piece can be draped in store. For bridal, this matters more than for anything else we sell: fall, weight and how a border sits at the shoulder are all things you cannot judge from a folded stack. Our flagship in Nalasopara East carries the widest bridal range, and the Virar, Bhayandar and Goregaon stores can have a piece brought across if you have seen something you like.",
      },
    ],
  },

  "festive-edit": {
    intro:
      "Drapes for Diwali, Navratri, Ganesh Chaturthi and Karwa Chauth — the pieces that need to look considered in photographs and still be wearable through a long evening of visiting.",
    guide: [
      {
        heading: "Festive dressing has a different brief to bridal",
        body: "A festive saree is worn for hours of moving between homes, sitting on floors, serving food and being photographed without warning. That rules out anything that needs constant adjusting. Pre-stitched and ready-to-wear drapes have become genuinely popular for exactly this reason — they hold their pleats through the evening and take a minute to put on rather than twenty.",
      },
      {
        heading: "Colours that carry the season",
        body: "Navratri has its own colour discipline, with a shade assigned to each of the nine nights, and families often plan the full set in one visit. Diwali leans gold, deep red and jewel tones under artificial light. Ganesh Chaturthi tends toward traditional Maharashtrian palettes, where Paithani-style borders and green-and-gold combinations sit naturally. If you are buying for a specific night, tell us which one.",
      },
      {
        heading: "Buy ahead of the rush",
        body: "The four weeks before Diwali are the busiest of our year, and the best of any collection moves early. Stitching turnaround also stretches in that window. Coming in three or four weeks ahead means a fuller range and a blouse finished without pressure. If you cannot get to a store, message us on WhatsApp and we will send photos and video of what has just come in.",
      },
    ],
  },

  "everyday-sarees": {
    intro:
      "Soft silks, cottons and light blends for office, teaching, temple visits and ordinary days. Comfort in Mumbai humidity matters more here than anything else, and it is the thing most online listings never mention.",
    guide: [
      {
        heading: "What makes a saree comfortable to wear all day",
        body: "Weight and breathability decide this, not price. Cotton and soft-silk blends let air move and do not cling through a humid commute; heavy brocades trap heat and become a burden by the afternoon. A softer fabric also pleats more easily and stays pleated, which matters when you are draping yourself every morning without help. If you wear a saree daily, handle the fabric before you buy — it tells you more in ten seconds than any description.",
      },
      {
        heading: "Built for repeat washing",
        body: "Daily-wear sarees get washed far more than festive ones, so colourfastness and how a fabric behaves after several washes matter more than how it looks on day one. Cottons soften and improve with washing. Soft silks need gentler handling but hold colour well. Ask us how a specific piece should be washed — it varies, and getting it wrong the first time is how a good saree is lost.",
      },
      {
        heading: "Buying in threes",
        body: "Most of our regular customers buy two or three at a time in colours that share a blouse, which makes daily dressing considerably easier and stretches the wear of each piece. It is a practical way to shop rather than an upsell, and the staff will happily help you pick a set that works together.",
      },
    ],
  },

  "new-arrivals": {
    intro:
      "The most recent pieces to reach our counters, across every category. Stock moves through the stores continuously, so this is the fastest way to see what is genuinely new rather than what has been sitting.",
    guide: [
      {
        heading: "How stock reaches the stores",
        body: "New pieces arrive across our stores through the year, with the heaviest intake before the festive and wedding seasons. What appears here first is generally what has just been unpacked. If something catches your eye, it is worth asking which store currently holds it — pieces move between the Nalasopara, Virar, Bhayandar and Goregaon counters depending on what sells where.",
      },
      {
        heading: "Ask before you travel",
        body: "New arrivals are the fastest-moving stock we carry, and popular pieces can go within days. Message us on WhatsApp with what you have seen and we will confirm it is still there and which store has it before you make the trip. We will also send photos and video in better light than any listing image, including the reverse of the palla and the border up close.",
      },
      {
        heading: "Seeing it before deciding",
        body: "Everything here can be unfolded and draped in store. Colour in particular rarely survives a photograph intact — screens shift reds and golds more than any other shades, which is precisely the range most of this stock sits in. If you order online instead, our seven-day return window covers you.",
      },
    ],
  },

  shop: {
    intro:
      "The full range across all our stores — sarees, dress material, lehengas and ready-to-wear drapes. Use the filters to narrow by price, colour, fabric and occasion, or browse the edits if you would rather be led.",
    guide: [
      {
        heading: "Finding the right thing faster",
        body: "If you are buying for a specific event, start from the occasion edits rather than the full grid: the Wedding Edit for bridal and reception, the Festive Edit for Diwali and Navratri, Everyday for office and daily wear. If you are buying by budget, the price filter is the quickest route. If you know the weave you want — Banarasi, Kanjivaram, Paithani, Chanderi — the silk collection groups them together.",
      },
      {
        heading: "Online and in store are the same stock",
        body: "What you see here is what sits on our counters across Nalasopara, Virar, Bhayandar and Goregaon. You can order for delivery anywhere in India, or find a piece here and come see it in person before deciding. Most customers do the second — the stores exist precisely so that a drape can be handled, held against the light and tried before money changes hands.",
      },
      {
        heading: "If you would rather ask than browse",
        body: "Message us on WhatsApp with an occasion, a budget and a colour, and we will send back photos and video of what fits. It is usually faster than filtering, and it is how a good part of our business already runs. Blouse stitching, fall-and-pico and custom sizing are all handled in store.",
      },
    ],
  },
};
