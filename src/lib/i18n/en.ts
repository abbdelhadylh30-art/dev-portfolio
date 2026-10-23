import type {
  Service,
  ClientResult,
  ClientProcessStep,
  PricingTier,
  Guarantee,
  Faq,
} from "@/lib/portfolio-data";

/**
 * English content — the reference shape for every client-mode string.
 * `ClientContent` is DERIVED from this object (typeof), so `ar.ts` is
 * compile-time-guaranteed to match: miss a string and the build fails.
 *
 * Voice: one developer talking to one business owner. Plain words,
 * short sentences, no agency vocabulary. If a line sounds like a
 * brochure, rewrite it until it sounds like a person.
 */

export type Head = {
  eyebrow: string;
  title: { pre: string; grad: string; post: string };
  description: string;
};

const en = {
  /** Document direction + language applied to <html> while active. */
  dir: "ltr" as "ltr" | "rtl",
  lang: "en" as "en" | "ar",

  /** How the owner's name renders in this language. */
  ownerName: "Abdelhady Gabriel",

  /** Localised page labels (ids/icons stay language-neutral in site-pages.ts). */
  pages: {
    home: { label: "Home", kicker: "Start here", blurb: "Websites that work as hard as you do." },
    services: { label: "What I do", kicker: "Services", blurb: "Fixed-price websites, booking systems and Google visibility." },
    results: { label: "Results", kicker: "Proof", blurb: "Real businesses, real numbers — loads, ranks, bookings." },
    process: { label: "How it works", kicker: "Process", blurb: "From free 15-minute chat to launch in 2–4 weeks." },
    pricing: { label: "Pricing", kicker: "Packages", blurb: "Real prices, task by task — from $149 one-pagers to full builds." },
    about: { label: "About", kicker: "Your developer", blurb: "Who you're actually working with — no agency middlemen." },
    faq: { label: "FAQ", kicker: "Questions", blurb: "Prices, ownership, timelines — answered plainly." },
    contact: { label: "Contact", kicker: "Say hello", blurb: "WhatsApp, email or the form — replies within a day." },
  },

  nav: {
    backHome: "Back to home page",
    menu: "Toggle navigation menu",
    home: "Home",
    github: "GitHub",
    githubAria: "GitHub profile",
    viewGroup: "Choose audience view",
    viewTitle: "Business view for clients · Developer view for the full technical portfolio",
    viewClient: "Business",
    viewDev: "Developer",
    langGroup: "Choose language",
    langTitle: "Switch the site between English and Arabic",
    paletteGroup: "Choose a colour palette",
    paletteTitle: "Three hand-tuned colour variants for the business view",
    paletteNames: { sunset: "Sunset (warm cream & coral)", royal: "Royal (deep teal & gold)", midnight: "Midnight (dark & gold)" } as Record<string, string>,
  },

  hero: {
    badge: "Now booking new projects",
    nameRole: "Web developer for businesses · Cairo — working across Egypt & the Gulf",
    title: { pre: "A website that ", grad: "works as hard", post: " as you do." },
    sub: "I build fast, beautiful websites for clinics, restaurants, salons and real-estate teams — sites that load instantly, show up on Google, and quietly turn visitors into paying customers.",
    subEm: "In Arabic and English.",
    ctaPrimary: "Get your free website audit",
    ctaSecondary: "See real client results",
    auditNote:
      "Free 15-minute audit · You'll see exactly what's costing you customers and what it takes to fix it — whether you hire me or not.",
    trustChips: ["Fixed-price quotes", "You own everything", "Launch in 2–4 weeks"],
  },

  stats: [
    { label: "Every site loads in", value: "<2s", hint: "on a phone, on 3G" },
    { label: "Google rank for a client", value: "#1", hint: "one week after launch" },
    { label: "Faster than their old site", value: "45×", hint: "Knead Bakery · Wix rebuild" },
    { label: "Languages, done properly", value: "AR+EN", hint: "Arabic & English, built right" },
  ],

  index: {
    kicker: "Where to next?",
    title: "Take a look around",
    hint: "Every section is its own page — flip with the arrows below or the keys",
  },

  pager: {
    pagesAria: "Pages",
    allPages: "All pages",
    prevSr: (label: string) => `Previous page: ${label}`,
    nextSr: (label: string) => `Next page: ${label}`,
    backToStart: "Back to start",
    flipHint: "← → to flip",
  },

  services: {
    head: {
      eyebrow: "What I do",
      title: { pre: "Websites that ", grad: "pay for themselves", post: "." },
      description:
        "Four things I do for businesses like yours — described the way I'd describe them over coffee, not in tech-speak.",
    },
    notSurePre: "Not sure which one you need? ",
    notSureLink: "Tell me what's bothering you about your business right now",
    notSurePost: " — I'll map it to the right fix in the free 15-minute chat.",
    items: [
      {
        title: "Business websites",
        body: "Think of it as your business's front door. It should look sharp, open fast, and feel right on a phone — not like a template a thousand other shops already use.",
        bullets: [
          "Menus, services, and prices that are easy to update",
          "WhatsApp ordering & click-to-call built in",
          "Works perfectly on every phone",
        ],
        outcome: "Visitors become customers.",
        icon: "globe",
      },
      {
        title: "Booking & management systems",
        body: "Stop running the day from a notebook and a pile of WhatsApp chats. Appointments, reminders, and customer records — one place, always open.",
        bullets: [
          "Online booking — even at 2am",
          "Automatic WhatsApp reminders",
          "Customer history at a glance",
        ],
        outcome: "Hours of admin back, every week.",
        icon: "calendar",
      },
      {
        title: "Getting found on Google",
        body: "When someone searches for what you sell, you show up. Every site I build ships with the fundamentals Google actually rewards — nothing gimmicky.",
        bullets: [
          "Google Business & search setup",
          "Fast pages (speed is ranking)",
          "Arabic & English search terms",
        ],
        outcome: "More calls, more visits, more orders.",
        icon: "search",
      },
      {
        title: "Care after launch",
        body: "I don't disappear once the site is live. Need to change a price, add a service, or fix something? One WhatsApp message.",
        bullets: [
          "Free tweaks in the first month",
          "Same-day replies on WhatsApp",
          "Monthly care plans if you want them",
        ],
        outcome: "A website that stays healthy.",
        icon: "shield",
      },
    ] as Service[],
  },

  results: {
    head: {
      eyebrow: "Results",
      title: { pre: "What businesses ", grad: "actually got", post: "." },
      description:
        "No client cares about the tech behind it. Here's what changed for real businesses — in numbers they care about.",
    },
    startChat: "Start your free chat",
    items: [
      {
        client: "Knead Bakery",
        headline: "A slow website was losing them orders",
        story:
          "\u201cCustomers give up before the menu even loads.\u201d That's what the owner of a bakery in Abu Dhabi told me about their old Wix site — and every abandoned load was an order that walked out the door. We rebuilt it around how customers actually order: food grouped by time of day, pickup times shown up front.",
        metrics: [
          { value: "45×", label: "faster than the old site" },
          { value: "15→4", label: "clearer menu categories" },
          { value: "<1.5s", label: "loads on a phone" },
        ],
        icon: "store",
      },
      {
        client: "Mohamed Medhat",
        headline: "From invisible to #1 on Google",
        story:
          "A marketing professional in Cairo had no web presence at all. We built him a portfolio that matches the quality of his own brand audits — dark, editorial, mobile-perfect.",
        metrics: [
          { value: "#1", label: "on Google for his name" },
          { value: "1 wk", label: "from launch to ranking" },
          { value: "6", label: "polished sections" },
        ],
        icon: "search",
      },
      {
        client: "A salon chain, Qatar",
        headline: "Bookings that run themselves",
        story:
          "A luxury salon was running appointments over the phone — and losing bookings every time a call rang out during rush hour. We built them online booking with automatic WhatsApp reminders, in Arabic and English, so the chair fills itself even when the front desk is busy.",
        metrics: [
          { value: "24/7", label: "online booking" },
          { value: "Auto", label: "WhatsApp reminders" },
          { value: "AR+EN", label: "both languages, properly" },
        ],
        icon: "scissors",
      },
      {
        client: "Your business",
        headline: "The next story could be yours",
        story:
          "Every project above started the same way: a free 15-minute chat. No pressure, no jargon — I'll look at what you have now and tell you honestly what's worth fixing.",
        metrics: [
          { value: "Free", label: "15-minute chat" },
          { value: "Fixed", label: "price before we start" },
          { value: "2–4 wks", label: "typical launch time" },
        ],
        icon: "cta",
      },
    ] as ClientResult[],
  },

  process: {
    head: {
      eyebrow: "How it works",
      title: { pre: "No mystery. ", grad: "No jargon", post: ". No surprises." },
      description:
        "Hiring a developer feels risky when you can't see the code. Here's exactly how working together goes — start to finish.",
    },
    footerPre: "The whole first step costs you 15 minutes and nothing else. ",
    footerLink: "Start with the free chat",
    items: [
      {
        num: "01",
        title: "A free 15-minute chat",
        body: "WhatsApp or a call — you tell me about your business, I look at what you have now. I'll tell you honestly if you need a full rebuild or just a few fixes.",
        icon: "chat",
      },
      {
        num: "02",
        title: "One fixed price, in writing",
        body: "You know exactly what you'll pay before any work begins. No hourly meters, no surprise invoices, no \u201cit grew in scope\u201d.",
        icon: "quote",
      },
      {
        num: "03",
        title: "Progress you can watch",
        body: "You get a private preview link from day one. Watch your site grow, tell me what to adjust — while it's cheap to adjust.",
        icon: "build",
      },
      {
        num: "04",
        title: "Launch — and I stay",
        body: "Your site goes live with your domain and hosting sorted. Then I stay on WhatsApp: free tweaks in the first month, fast replies always.",
        icon: "launch",
      },
    ] as ClientProcessStep[],
  },

  pricing: {
    head: {
      eyebrow: "Pricing",
      title: { pre: "Real prices. ", grad: "Real timelines", post: ". No mystery quotes." },
      description:
        "Every package, every task, every dollar — out in the open. Pick what fits today, start small, and upgrade later: you only ever pay the difference.",
    },
    mostChosen: "Most chosen",
    oneTime: "one-time",
    deposit: (deposit: number, rest: number) => ({
      strong: `$${deposit.toLocaleString("en-US")} deposit to start`,
      rest: ` · $${rest.toLocaleString("en-US")} on launch day`,
    }),
    bookChat: "Book the free 15-minute chat",
    afterDeposit: { pre: "What happens after ", grad: "the deposit", post: "" },
    paymentFlow: [
      {
        num: "01",
        title: "50% deposit books your slot",
        body: "You get an invoice and a welcome checklist — photos, text, colors, domain access. I start within 48 hours of receiving your content.",
      },
      {
        num: "02",
        title: "First design within 72 hours",
        body: "A homepage concept in your brand, Arabic + English. Revision rounds are included — you react, I refine.",
      },
      {
        num: "03",
        title: "You approve, then I build",
        body: "A private preview link from day one. Watch the site grow and test it on your own phone before anything is final.",
      },
      {
        num: "04",
        title: "Final 50% at launch",
        body: "Your site goes live on your own domain within 48 hours of the last payment — training video and all passwords handed over.",
      },
      {
        num: "05",
        title: "14-day fix warranty",
        body: "Anything that's my code and misbehaves in the first two weeks is fixed free — and the first month of small tweaks is on me too.",
      },
    ],
    upgradeNote:
      "Start small, upgrade with zero risk: move up to a bigger package within 30 days and you only pay the difference — your one-pager or Launch site counts as credit.",
    notSurePre: "Not sure which package fits? That's exactly what the free chat is for. ",
    notSureLink: "Pin your number in 15 minutes",
    extras: {
      title: "The honesty section",
      lead: "Everything above is the full price. Here is what sits outside it — priced openly, no surprises later.",
      items: [
        {
          label: "Domain + hosting",
          detail: "Your own account, ~$5–10/month. I set it up in your name — you own everything.",
        },
        {
          label: "Extra revision round",
          detail: "$30 flat, any package. The revision rounds listed inside each package are included.",
        },
        {
          label: "Care plan (optional)",
          detail: "$19/month: updates, daily backups, small edits within 48 hours. Cancel anytime.",
        },
      ],
      custom: {
        title: "Bigger than a storefront?",
        body: "Custom dashboards, multi-branch systems, members' areas, internal tools — if it doesn't fit a package, it gets a custom quote in the same 15-minute chat.",
        cta: "Ask for a custom quote",
      },
    },
    tiers: [
      {
        id: "onepager",
        name: "One-Pager",
        tagline: "One page, one goal, live this week.",
        price: 149,
        deposit: 75,
        duration: "2–4 days",
        tasks: [],
        variants: [
          {
            name: "Portfolio",
            blurb: "Who I am, what I do, contact me — for personal brands.",
            price: 149,
            deposit: 75,
            duration: "2–3 days",
            tasks: [
              { task: "Kickoff", detail: "15-minute call or voice note — we scope the page.", when: "Day 1" },
              { task: "Design", detail: "Hero → proof → offer → contact flow, 1 revision round.", when: "Day 1" },
              { task: "Build", detail: "Single page, mobile-first, AR + EN, WhatsApp & call buttons.", when: "Days 1–2" },
              { task: "Launch", detail: "Google indexing, loads under 1.5s, domain connected.", when: "Days 2–3" },
            ],
          },
          {
            name: "Landing page",
            blurb: "Runs under a boosted post or ad — built to convert.",
            price: 199,
            deposit: 100,
            duration: "3–4 days",
            tasks: [
              { task: "Kickoff", detail: "We define the ONE action: book, call, or order.", when: "Day 1" },
              { task: "Conversion copy", detail: "Headline + offer written to sell, Arabic or English.", when: "Days 1–2" },
              { task: "Build", detail: "Page + WhatsApp flow + thank-you state, 1 revision round.", when: "Days 2–3" },
              { task: "Tracking", detail: "Facebook Pixel / GA event — so you know the ad worked.", when: "Day 3" },
              { task: "Launch", detail: "Domain or subdomain, live and measured.", when: "Days 3–4" },
            ],
          },
        ],
      },
      {
        id: "launch",
        name: "Launch",
        tagline: "The full business website — your online front door.",
        price: 349,
        deposit: 175,
        duration: "5–7 days",
        tasks: [
          { task: "Discovery & structure", detail: "15-minute call, sitemap of up to 5 pages.", when: "Day 1" },
          { task: "Design", detail: "Homepage concept in your brand, 2 revision rounds.", when: "Days 1–2" },
          { task: "Build", detail: "3–5 pages, mobile-first, Arabic + English.", when: "Days 2–4" },
          { task: "SEO & speed", detail: "Google indexing, meta tags, loads under 2 seconds.", when: "Days 4–5" },
          { task: "Launch & handover", detail: "Domain connected, live, training video, all passwords.", when: "Days 5–7" },
        ],
      },
      {
        id: "business",
        name: "Business",
        tagline: "The site plus the machinery that books and sells.",
        price: 649,
        deposit: 325,
        duration: "10–14 days",
        popular: true,
        buildsOn: "Everything in Launch, plus:",
        tasks: [
          { task: "Booking / menu / WhatsApp", detail: "Appointment form, menu, or WhatsApp ordering — wired to your phone.", when: "+2–3 days" },
          { task: "Analytics & tracking", detail: "Google Analytics + Search Console + conversion events.", when: "+1 day" },
          { task: "Copy polish (AR + EN)", detail: "Headlines rewritten to sell, not just describe.", when: "+1 day" },
          { task: "Google Business Profile", detail: "Maps listing set up and optimized.", when: "+1 day" },
        ],
      },
      {
        id: "advanced",
        name: "Advanced",
        tagline: "E-commerce and custom builds with real payments.",
        price: 1199,
        deposit: 600,
        duration: "3–4 weeks",
        buildsOn: "Everything in Business, plus:",
        tasks: [
          { task: "E-commerce or custom", detail: "Online store with payments (Paymob / Stripe / cash on delivery) or a custom feature.", when: "+1–2 weeks" },
          { task: "Security & performance", detail: "SSL, backups, hardening, 90+ Lighthouse score.", when: "+2–3 days" },
          { task: "Live training", detail: "1-on-1 call + recorded video for your team.", when: "+1 day" },
        ],
      },
    ] as PricingTier[],
  },

  guarantees: [
    {
      title: "Fixed price, agreed up front",
      body: "The number in the quote is the number you pay. If I misjudge the work, that's my cost — not yours.",
      icon: "price",
    },
    {
      title: "You own everything",
      body: "Your domain, your hosting, your content, your code. If we ever part ways, it's all yours — no hostage-taking.",
      icon: "own",
    },
    {
      title: "On-time, in writing",
      body: "The launch date is part of the quote. You'll know what \u201cdone\u201d means before we start.",
      icon: "time",
    },
    {
      title: "Support after launch",
      body: "Free tweaks in the first month, same-day WhatsApp replies after that. A website is a living thing — it needs a caretaker.",
      icon: "support",
    },
  ] as Guarantee[],

  faq: {
    head: {
      eyebrow: "Straight answers",
      title: { pre: "The things you'd ", grad: "ask anyway", post: "." },
      description: "Money, timing, Arabic, and what happens after launch — answered plainly.",
    },
    items: [
      {
        q: "How much does a website cost?",
        a: "One-page sites start at $149, full business websites at $349, and booking or e-commerce builds at $649 — every package with its task list, timeline and deposit is laid out on the Pricing page. Whatever you pick, you get one fixed number before any work begins, and that number won't change.",
      },
      {
        q: "How do payments work?",
        a: "Split in two, matched to the timeline: a 50% deposit books your slot and unlocks the first design within 72 hours. The second half is due at launch — after you've seen the full site working on your own phone. Nothing goes live until you say so, and every launch carries a 14-day fix warranty.",
      },
      {
        q: "I already have a website — do I need a rebuild?",
        a: "Not necessarily. Half the time the right move is a few targeted fixes — speed, mobile layout, a clearer call-to-action — not a full rebuild. That's exactly what the free 15-minute audit is for: I'll look at what you have and tell you honestly which one you need, even if the answer means you don't hire me.",
      },
      {
        q: "How long until my site is live?",
        a: "Most business websites launch in 2–4 weeks. Larger systems (booking, ordering, customer accounts) take 4–8 weeks. The timeline is written into the quote — and you can watch progress on a live preview link from day one.",
      },
      {
        q: "Can my site be in Arabic?",
        a: "Yes, absolutely. Your site can be Arabic, English, or both — with proper right-to-left layout designed in from the start, not a machine-flipped afterthought. This matters for how professional your business looks to Arabic-first customers.",
      },
      {
        q: "What if I need changes later?",
        a: "Small tweaks in the first month are free. After that, I'm one WhatsApp message away — either a quick one-off fix or a monthly care plan if you expect regular updates. You'll never be left with a website nobody can change.",
      },
      {
        q: "Will customers find me on Google?",
        a: "Every site I ship includes what Google actually rewards: fast pages, mobile-first design, proper structure, and clean Arabic/English content. One client reached #1 for his own name within a week of launch. No honest developer promises rankings — but the fundamentals will be right.",
      },
    ] as Faq[],
  },

  about: {
    head: {
      eyebrow: "About",
      title: { pre: "The person you'll ", grad: "actually talk to", post: "." },
      description: "No agency middlemen, no account managers. When you message me, you get me.",
    },
    paragraphs: [
      "Yes, that's a real photo — Abdelhady Gabriel, web developer in Cairo, and the only person you'll deal with on your project. For the last three years I've built websites for businesses across Egypt and the Gulf: a bakery in Abu Dhabi, a salon chain in Qatar, a marketing consultant in Cairo. Different industries, same job every time: look credible online, get found on Google, and turn visitors into paying customers.",
      "I work in Arabic and English, I answer my own WhatsApp, and I treat your budget like it's my own. No account managers, no \u201clet me check with the team\u201d — when you ask who is actually building your site, the answer is the person in this photo. A clear plan, one fixed price, and a website that does its job. That's the whole pitch.",
    ],
    promise: {
      label: "My promise:",
      body: "you'll always understand what you're paying for. If I ever need to explain something technical, I'll explain it like you're the client — because you are.",
    },
    sayHello: "Say hello on WhatsApp — I answer myself",
    photoAlt: "Abdelhady Gabriel — web developer for businesses, Cairo",
    namePlateRole: "Web developer for businesses · Cairo",
    available: "Available now",
    facts: [
      { label: "Based in", value: "Cairo, Egypt" },
      { label: "Working with", value: "Egypt & the Gulf" },
      { label: "Languages", value: "Arabic & English" },
      { label: "Replies", value: "Same day, on WhatsApp" },
    ],
  },

  contact: {
    head: {
      eyebrow: "Contact",
      title: { pre: "Let's talk about ", grad: "your website", post: "." },
      description: "WhatsApp is fastest — I usually reply within a few hours, same day at the latest.",
    },
    whatsappTitle: "WhatsApp — fastest",
    repliesNote: "Usually replies within a few hours",
    callMe: "Call me",
    email: "Email",
    audit: {
      title: "What happens in the free 15-minute chat",
      bullets: [
        "I look at your current website (or your competitor's) with you",
        "I tell you what's worth fixing and what isn't",
        "You get a fixed-price quote — with zero obligation",
      ],
    },
    formTitle: "Or send a message — I'll reply on WhatsApp",
    sameDay: "Same-day reply",
  },

  footer: {
    nameRole: "Websites for businesses · Egypt & the Gulf",
    whatsapp: "WhatsApp",
    email: "Email",
    backToTop: "Back to top",
    tagline: "Websites that work as hard as you do.",
    takingNew: "Taking on new projects",
  },

  form: {
    name: "Name",
    namePh: "Your name",
    email: "Email",
    emailPh: "you@example.com",
    subject: "Subject",
    subjectOptional: "(optional)",
    subjectPh: "What's this about?",
    whatNeed: "What do you need?",
    projectTypes: ["New site", "Redesign", "Web app", "Free audit", "Other"],
    message: "Message",
    messagePh: "Tell me about your project, role or idea…",
    note: "Straight to my inbox — usually replied to within 24h.",
    send: "Send message",
    sending: "Sending…",
    sentTitle: "Message sent",
    sentBody: "Thanks for reaching out. I'll get back to you at the email you provided.",
    sendAnother: "Send another message",
    waToo: "Send via WhatsApp too — fastest reply",
    errorTitle: "Could not send",
    genericError: "Something went wrong.",
    networkTitle: "Network error",
    networkBody: "Please check your connection and try again.",
    successToast: {
      emailed: "Thanks — it just landed in my inbox. I'll reply to your email shortly.",
      fallback: "Thanks! For the fastest reply, also tap \u201cSend via WhatsApp\u201d below.",
    },
    validations: {
      nameMin: "Name must be at least 2 characters",
      email: "Enter a valid email",
      messageMin: "Message must be at least 10 characters",
    },
  },
};

export type ClientContent = typeof en;
export const enContent: ClientContent = en;
