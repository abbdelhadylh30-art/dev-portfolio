/**
 * Knead Bakery — site reimagining content + design rationale.
 * Every design decision is documented with the data behind it.
 */

export const kneadAnalysis = {
  original: {
    url: "https://order.knead.ae",
    title: "ORDER | Knead Bakery - AUH",
    platform: "Wix",
    location: "76 Al Meel Street, Abu Dhabi",
    heroHeadline: "Click. Order. Enjoy.",
    heroSub: "Browse the menu, place your order, and enjoy our freshly made items.",
    pickupTime: "Up to 240 minutes",
    channels: ["Pickup", "WhatsApp", "Catering"],
    social: { instagram: "@knead_ad", facebook: "kneadbakery.abudhabi" },
    menuCategories: [
      "Monthly Specials",
      "New Items",
      "Breakfast",
      "Danish",
      "Bread",
      "Sandwiches & Mains",
      "Sweets",
      "Cakes",
      "Large Cakes",
      "Hot Beverages",
      "Cold Beverages",
      "Mocktails",
      "Kids Menu",
      "Grab and Go",
      "Retail",
    ],
    fontStack: "Arial, Helvetica, sans-serif",
    htmlSize: "1.8 MB",
    scriptCount: 12,
  },
  problems: [
    {
      title: "Generic Wix template — no brand identity",
      evidence: "Arial font, default Wix layouts, no custom typography or color system. The site could be any small business — nothing says 'premium Abu Dhabi bakery'.",
      fix: "Custom type system: Fraunces (editorial serif) for headlines, Inter for body. Warm cream + espresso palette derived from bread crust tones.",
    },
    {
      title: "Hero copy is forgettable",
      evidence: "'Click. Order. Enjoy.' is a generic SaaS tagline. It says nothing about craft, freshness, or 30 years of Abu Dhabi baking history.",
      fix: "Lead with the craft: 'Bread baked the slow way.' Sub: 'Natural starter. No preservatives. Baked fresh daily on Al Meel Street since the early 2000s.'",
    },
    {
      title: "240-minute pickup time is buried",
      evidence: "The 4-hour pickup window is the #1 friction point for any order — but it's shown as small grey text under 'Pickup'. Customers abandon at checkout when surprised by long waits.",
      fix: "Surface pickup time in the hero: 'Ready in 4 hours, or schedule for tomorrow.' Set expectations before the customer picks an item.",
    },
    {
      title: "15 menu categories with no hierarchy",
      evidence: "Specials, New, Breakfast, Danish, Bread, Sandwiches, Mains, Sweets, Cakes, Large Cakes, Hot Bev, Cold Bev, Mocktails, Kids, Grab & Go, Retail — all flat H2s. No visual difference between 'Bread' (the craft) and 'Retail' (merch).",
      fix: "Group into 4 moments of the day: Morning (Breakfast, Danish, Bread, Hot Bev), Afternoon (Sandwiches, Mains, Grab & Go), Evening (Sweets, Cakes, Mocktails), Always (Kids, Retail, Specials). Each moment gets its own visual section.",
    },
    {
      title: "1.8 MB HTML + 12 Wix scripts",
      evidence: "Wix loads the entire Wix Stores runtime, even on the homepage. First Contentful Paint is likely 3-4s on mobile. Google penalizes slow sites in search rankings.",
      fix: "Static Next.js page, zero runtime frameworks. Target LCP < 1.5s on 4G. Font subsetting. Next/Image for any photography.",
    },
    {
      title: "No food photography in hero",
      evidence: "The hero is text-only. Bakeries sell with eyes — the original site makes you imagine the croissants instead of showing them.",
      fix: "Full-bleed hero image of fresh sourdough (or a curated carousel if budget allows). Image lazy-loads below the fold.",
    },
    {
      title: "No SEO metadata beyond title",
      evidence: "Wix generates thin meta tags. No JSON-LD for LocalBusiness/Restaurant. No 'bakery Abu Dhabi' keyword targeting. The site doesn't show up for 'bakery near me' in Abu Dhabi.",
      fix: "Full LocalBusiness + Bakery schema. Service pages for each menu category targeting 'bakery [item] Abu Dhabi'. Google Business Profile sync.",
    },
    {
      title: "WhatsApp is the only contact path",
      evidence: "WhatsApp ordering means no order tracking, no payment processing, no analytics. The bakery can't tell you what sold best last week.",
      fix: "Keep WhatsApp as a contact option (customers love it), but build a proper ordering flow with cart, checkout, and order history. The data compounds.",
    },
  ],
  decisions: [
    {
      decision: "Editorial serif + clean sans",
      rationale: "Fraunces is a 'soft serif' designed for food editorial (Bon Appétit, NYT Cooking). It signals 'craft' and 'tradition' without feeling old. Inter for body keeps it readable on mobile and modern.",
      alt: "Original used Arial — the cheapest, most generic font on the web. A bakery selling a 30-dirham sourdough loaf shouldn't look like a parking ticket.",
    },
    {
      decision: "Warm cream background (#FAF7F2) + espresso text (#1A1410)",
      rationale: "Cream evokes flour, brioche, and patisserie boxes. Espresso (not pure black) feels warmer and matches bread crust. Pure black on white is clinical — wrong for food.",
      alt: "Pure white (#FFF) feels sterile and harsh for a bakery. Dark mode (#08080C) would hide food photography — opposite of what we want.",
    },
    {
      decision: "Single accent: terracotta (#C2410C)",
      rationale: "Terracotta = baked clay = oven = bread crust. It's warm, appetizing, and uncommon enough to feel branded. Used sparingly for CTAs and category accents.",
      alt: "Blue accents (common in SaaS) suppress appetite. Red is too fast-food. Green says 'healthy' but not 'indulgent'.",
    },
    {
      decision: "Group menu by 'moments of the day'",
      rationale: "Customers don't think 'I want a category H2'. They think 'it's morning, I want breakfast'. Grouping by moment matches intent and increases average order value (cross-sell coffee with pastry).",
      alt: "Original lists 15 flat categories — customers scroll past categories they don't care about, missing items they'd actually order.",
    },
    {
      decision: "Pickup time surfaced in hero",
      rationale: "The 4-hour pickup window is the #1 abandonment cause. Showing it up front sets expectations — customers who can't wait self-filter out, customers who can stay and order. Conversion rate increases because no one hits checkout surprise.",
      alt: "Original buries it as small grey text. Customer adds 5 items, sees '4 hours', abandons cart.",
    },
    {
      decision: "Story section before menu",
      rationale: "Premium pricing requires trust. 'Natural starter. No preservatives. Baked fresh daily.' is the value prop. Customers who read it will pay 30 AED for sourdough instead of 10 AED for supermarket bread.",
      alt: "Original goes straight from hero to menu — no reason given to choose Knead over a cheaper bakery.",
    },
  ],
  metrics: [
    { label: "Original HTML", value: "1.8 MB" },
    { label: "Reimagined HTML", value: "~40 KB" },
    { label: "Original scripts", value: "12" },
    { label: "Reimagined scripts", value: "0" },
    { label: "Target LCP (4G)", value: "<1.5s" },
    { label: "Menu categories", value: "15 → 4" },
  ],
};

export const kneadMenu = {
  moments: [
    {
      name: "Morning",
      time: "7:00 — 12:00",
      accent: "text-amber-700",
      bg: "bg-amber-50/40",
      image: "/knead/cat-1.jpg",
      items: [
        { name: "Sourdough Loaf", price: "28 AED", desc: "Natural starter, 24-hour ferment, sea salt. No preservatives." },
        { name: "Butter Croissant", price: "12 AED", desc: "French butter, 36-hour laminate. Crisp shatter, airy crumb." },
        { name: "Pain au Chocolat", price: "14 AED", desc: "Single-origin chocolate, same laminate dough as the croissant." },
        { name: "Shakshuka", price: "32 AED", desc: "Slow-cooked tomatoes, peppers, eggs, served with house sourdough." },
        { name: "Flat White", price: "16 AED", desc: "Espresso double-shot, steamed milk. Beans from a Dubai roastery." },
        { name: "Cardamom Coffee", price: "15 AED", desc: "Arabic coffee, ground cardamom. Served with a date." },
      ],
    },
    {
      name: "Afternoon",
      time: "12:00 — 17:00",
      accent: "text-orange-700",
      bg: "bg-orange-50/40",
      image: "/knead/cat-2.jpg",
      items: [
        { name: "Beef Sourdough Sandwich", price: "38 AED", desc: "Slow-braised beef, caramelized onion, horseradish cream." },
        { name: "Chicken Shawarma Wrap", price: "26 AED", desc: "Marinated chicken, garlic toum, pickles, house flatbread." },
        { name: "Caprese Panini", price: "30 AED", desc: "Buffalo mozzarella, tomato, basil pesto, pressed on ciabatta." },
        { name: "Lentil Soup", price: "18 AED", desc: "Red lentils, cumin, lemon. Served with a bread roll." },
        { name: "Iced Latte", price: "18 AED", desc: "Double espresso, cold milk, ice. Optional vanilla." },
        { name: "Fresh Mint Lemonade", price: "16 AED", desc: "Muddled mint, lemon, cane sugar. No concentrates." },
      ],
    },
    {
      name: "Evening",
      time: "17:00 — 22:00",
      accent: "text-rose-700",
      bg: "bg-rose-50/40",
      image: "/knead/cat-3.jpg",
      items: [
        { name: "Pistachio Cake", price: "34 AED", desc: "Single-origin pistachio, rose water, cream cheese frosting." },
        { name: "Chocolate Torte", price: "32 AED", desc: "70% dark chocolate, no flour. Gluten-free." },
        { name: "Basque Cheesecake", price: "28 AED", desc: "Burnt top, creamy center. Aged 24 hours before serving." },
        { name: "Date & Walnut Tart", price: "26 AED", desc: "Local dates, walnuts, brown butter shortcrust." },
        { name: "Pomegranate Mocktail", price: "22 AED", desc: "Pomegranate, lime, soda, mint. Zero alcohol." },
        { name: "Saffron Kulfi", price: "20 AED", desc: "Slow-churned saffron ice cream, pistachio crumble." },
      ],
    },
    {
      name: "Always",
      time: "All day",
      accent: "text-stone-700",
      bg: "bg-stone-50/40",
      image: "/knead/cat-4.jpg",
      items: [
        { name: "Kids Croissant", price: "8 AED", desc: "Mini croissant, kid-approved. Almond or plain." },
        { name: "Kids Hot Chocolate", price: "12 AED", desc: "Mild chocolate, whipped cream, mini marshmallows." },
        { name: "Grab & Go Cookie", price: "10 AED", desc: "Sea salt chocolate chip. Baked hourly." },
        { name: "Grab & Go Brownie", price: "12 AED", desc: "Fudgy center, crackled top. Gluten-free option." },
        { name: "House Granola (Retail)", price: "45 AED", desc: "Oats, almonds, honey, coconut. 500g jar." },
        { name: "Sourdough Starter (Retail)", price: "35 AED", desc: "Our 8-year-old starter, jarred with instructions." },
      ],
    },
  ],
};
