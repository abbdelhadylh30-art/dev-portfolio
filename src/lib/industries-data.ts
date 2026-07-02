/**
 * Industry landing pages — content for each industry I serve.
 * Each industry gets its own SEO-optimized landing page at /{slug}.
 */

export type Industry = {
  slug: string;
  name: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  painPoints: { title: string; body: string }[];
  features: { title: string; body: string }[];
  metrics: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
  accent: string; // tailwind color class for subtle accent
  keywords: string[];
  metaTitle: string;
  metaDescription: string;
};

export const industries: Industry[] = [
  {
    slug: "dental",
    name: "Dental Clinics",
    tagline: "Websites for dental practices",
    heroTitle: "Dental websites that fill your appointment book.",
    heroSubtitle:
      "Most dental clinic websites were built in 2015, don't work on mobile, and make patients call during business hours to book. I build modern dental sites that book patients online — even while you're in surgery.",
    ctaText: "Get a dental website that books patients",
    accent: "text-sky-300",
    metaTitle: "Dental Clinic Website Designer Egypt | Abdelhady Gabriel",
    metaDescription:
      "Custom dental clinic websites with online booking, service pages, before/after galleries, and Google reviews. Built by Abdelhady Gabriel — full-stack developer in Egypt.",
    keywords: [
      "dental clinic website",
      "dentist website designer Egypt",
      "dental website development Cairo",
      "online appointment booking dental",
      "dental practice web design",
    ],
    painPoints: [
      {
        title: "Patients can't book online",
        body: "They call during surgery hours, get voicemail, and book with the clinic that answers. You're losing patients every day your phone goes unanswered.",
      },
      {
        title: "Your services aren't clear",
        body: "Implants, whitening, orthodontics, emergency care — if patients can't see what you offer in 5 seconds, they leave. A PDF price list doesn't count.",
      },
      {
        title: "No Google reviews integration",
        body: "Patients trust reviews more than your credentials. If your 4.8-star Google rating isn't front and center on your site, you're leaving trust on the table.",
      },
      {
        title: "Your site looks dated",
        body: "A website from 2015 tells patients your practice might be dated too. First impressions matter — especially in healthcare.",
      },
    ],
    features: [
      {
        title: "Online appointment booking",
        body: "Patients pick a time slot, enter their details, and get a confirmation — synced with your calendar. No phone calls, no back-and-forth.",
      },
      {
        title: "Service pages that rank",
        body: "Individual pages for implants, whitening, orthodontics, cleaning, emergency care — each optimized for 'dental [service] [city]' so you show up when patients search.",
      },
      {
        title: "Before/after gallery",
        body: "Showcase your best work with a fast-loading, swipeable gallery. Patients choose dentists based on results they can see.",
      },
      {
        title: "Google reviews widget",
        body: "Your latest 5-star reviews pulled live from Google. Social proof that converts visitors into patients — without you lifting a finger.",
      },
      {
        title: "Patient forms online",
        body: "New patient intake forms, medical history, consent forms — all fillable online. Patients arrive prepared, you spend less time on paperwork.",
      },
      {
        title: "Mobile-first design",
        body: "80% of patients search for dentists on their phone. Your site loads in under 2 seconds on mobile and is as easy to use as your favorite app.",
      },
    ],
    metrics: [
      { label: "Booking conversion", value: "3x" },
      { label: "Mobile load time", value: "<2s" },
      { label: "Google ranking", value: "Page 1" },
      { label: "Patient forms", value: "Online" },
    ],
    faqs: [
      {
        q: "How long does it take to build a dental website?",
        a: "2–3 weeks from our first call to launch. I handle everything — design, development, booking system setup, Google Maps, reviews integration, and mobile optimization.",
      },
      {
        q: "Can you integrate with my existing booking system?",
        a: "Yes. I work with most dental practice management systems. If you don't have one, I set up a standalone booking system that emails you and texts the patient.",
      },
      {
        q: "Will my site show up on Google when patients search 'dentist near me'?",
        a: "Yes. Every site I build includes local SEO — Google Business Profile optimization, service pages targeting 'dentist [city]', schema markup for dental practices, and fast load times (a Google ranking factor).",
      },
      {
        q: "What does it cost?",
        a: "Pricing depends on scope. A standard dental clinic website with online booking starts at a fraction of what you'd pay a dental-specific agency. Book a free call for a quote.",
      },
    ],
  },
  {
    slug: "medical",
    name: "Medical Clinics",
    tagline: "Websites for medical practices",
    heroTitle: "Medical websites that patients find and trust.",
    heroSubtitle:
      "Patients Google their symptoms before they call a doctor. If your clinic isn't showing up — or your site looks outdated — they go to the clinic that does show up. I build medical websites that rank, convert, and make patients trust you before they walk in.",
    ctaText: "Get a medical website that patients trust",
    accent: "text-emerald-300",
    metaTitle: "Medical Clinic Website Developer Egypt | Abdelhady Gabriel",
    metaDescription:
      "Custom medical practice websites with appointment booking, doctor profiles, telehealth, and patient education. Built by Abdelhady Gabriel — full-stack developer in Egypt.",
    keywords: [
      "medical clinic website",
      "doctor website designer Egypt",
      "medical website development Cairo",
      "telehealth website",
      "patient portal development",
    ],
    painPoints: [
      {
        title: "Patients find WebMD, not you",
        body: "When someone searches 'chest pain specialist Cairo', they find WebMD or a hospital directory — not your clinic. You're invisible to the patients who need you.",
      },
      {
        title: "No online appointment booking",
        body: "Patients expect to book online like they book restaurants. If they have to call during business hours, they'll book with a clinic that lets them book at 11 PM.",
      },
      {
        title: "Doctor profiles are missing",
        body: "Patients choose doctors based on credentials, specialties, and reviews. If your doctors don't have proper profile pages, patients can't make an informed choice.",
      },
      {
        title: "No patient education",
        body: "After an appointment, patients Google their condition and find scary forum posts. Your site should be the trusted source — with condition pages written by your doctors.",
      },
    ],
    features: [
      {
        title: "Online appointment scheduling",
        body: "Patients book by specialty, doctor, and availability. Automated reminders reduce no-shows by 40%+.",
      },
      {
        title: "Doctor profile pages",
        body: "Each doctor gets a dedicated page with specialties, credentials, bio, photo, and patient reviews. Patients choose the right doctor before they call.",
      },
      {
        title: "Condition & service pages",
        body: "SEO-optimized pages for each condition you treat ('diabetes management Cairo', 'heart specialist Egypt'). Patients find you when they search their symptoms.",
      },
      {
        title: "Telehealth integration",
        body: "Secure video consultations built into your site. Patients book, pay, and meet you online — without third-party apps.",
      },
      {
        title: "Patient education resources",
        body: "Condition guides, pre/post-op instructions, and FAQ pages — written by your doctors, branded to your clinic. Patients trust your site over random forums.",
      },
      {
        title: "HIPAA-compliant forms",
        body: "Patient intake, medical history, and consent forms — encrypted, secure, and HIPAA-compliant. No more clipboards and paper.",
      },
    ],
    metrics: [
      { label: "Online bookings", value: "24/7" },
      { label: "No-show reduction", value: "40%" },
      { label: "Google ranking", value: "Page 1" },
      { label: "Patient trust", value: "High" },
    ],
    faqs: [
      {
        q: "Are the websites HIPAA compliant?",
        a: "The contact forms and patient intake forms are built to be HIPAA-compliant — encrypted in transit and at rest. For full HIPAA compliance (including BAA), I'll guide you through the hosting setup.",
      },
      {
        q: "Can you integrate with our electronic health records (EHR)?",
        a: "I can integrate with most popular EHR systems via their APIs. If your EHR doesn't have an API, I build a standalone booking system that your front desk can sync manually.",
      },
      {
        q: "Do you build telehealth functionality?",
        a: "Yes. I integrate secure, encrypted video consultation directly into your website. Patients book, pay (if needed), and join the video call — all from your site, no app download required.",
      },
      {
        q: "How do you handle multiple doctors and specialties?",
        a: "Each doctor gets a profile page, and the booking system lets patients filter by specialty, doctor, and availability. The site scales from 1 doctor to 50+.",
      },
    ],
  },
  {
    slug: "restaurants",
    name: "Restaurants & Bakeries",
    tagline: "Websites for food businesses",
    heroTitle: "Restaurant websites that fill your tables.",
    heroSubtitle:
      "Your customers search 'restaurants near me' on their phone. If your menu is a PDF, your hours are wrong on Google, and there's no way to order online — they go to the place that makes it easy. I build restaurant sites that turn searches into reservations and orders.",
    ctaText: "Get a restaurant website that fills tables",
    accent: "text-amber-300",
    metaTitle: "Restaurant Website Designer Egypt | Abdelhady Gabriel",
    metaDescription:
      "Custom restaurant and bakery websites with online menus, ordering, reservations, and Instagram integration. Built by Abdelhady Gabriel — full-stack developer in Egypt.",
    keywords: [
      "restaurant website designer Egypt",
      "bakery website Cairo",
      "online ordering website",
      "restaurant menu website",
      "food business web design",
    ],
    painPoints: [
      {
        title: "Your menu is a PDF",
        body: "Customers on their phone don't want to download a 5MB PDF just to see your menu. They bounce to the next restaurant that has a proper mobile menu.",
      },
      {
        title: "No online ordering",
        body: "If customers can't order from your website, they open Deliveroo or Talabat — and you pay 25%+ in commissions. Your own ordering system keeps that margin.",
      },
      {
        title: "Wrong hours on Google",
        body: "If your Google Business Profile shows you're open when you're closed, customers show up and leave angry. Your website should be the single source of truth.",
      },
      {
        title: "Food photos don't do it justice",
        body: "Your dishes are Instagram-worthy. Your website should make customers hungry — not show tiny, compressed thumbnails that look like they were taken in 2010.",
      },
    ],
    features: [
      {
        title: "Mobile-optimized menu",
        body: "Fast-loading, searchable, categorized menu — no PDF, no pinch-to-zoom. Customers find what they want in seconds. Update prices and items yourself anytime.",
      },
      {
        title: "Online ordering system",
        body: "Customers order directly from your site — pickup or delivery. You keep 100% of the revenue. No Deliveroo, no Talabat, no 25% commissions.",
      },
      {
        title: "Reservation system",
        body: "Customers book a table online, you get a notification. No more phone calls during dinner rush. Automatic SMS reminders reduce no-shows.",
      },
      {
        title: "Google Maps + hours",
        body: "Live Google Maps integration with directions. Your hours sync with Google Business Profile so customers always know if you're open.",
      },
      {
        title: "Food photography gallery",
        body: "Full-screen, fast-loading photo galleries that make customers hungry. Instagram feed integration so your latest posts show up automatically.",
      },
      {
        title: "Special offers & events",
        body: "Promote specials, holiday menus, and events. Schedule them in advance — they go live and come down automatically.",
      },
    ],
    metrics: [
      { label: "Menu load time", value: "<1s" },
      { label: "Commission saved", value: "100%" },
      { label: "Mobile orders", value: "3x" },
      { label: "No-show reduction", value: "50%" },
    ],
    faqs: [
      {
        q: "Can I update the menu myself?",
        a: "Yes. I build a simple admin panel where you can add, edit, and remove menu items, update prices, and mark items as sold out — no technical skills needed.",
      },
      {
        q: "Does the online ordering integrate with my kitchen?",
        a: "Orders can be sent to your kitchen printer, a tablet at the counter, or your POS system. You choose how you want to receive them.",
      },
      {
        q: "Can you handle multiple locations?",
        a: "Yes. Each location gets its own page with hours, menu (can be shared or unique), and ordering. Customers pick their nearest location automatically.",
      },
      {
        q: "What about payment processing?",
        a: "I integrate Stripe, Paymob, or your local payment processor. Customers pay online for pickup/delivery orders, or pay in person — your choice.",
      },
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    tagline: "Websites for property agencies",
    heroTitle: "Real estate websites that close deals.",
    heroSubtitle:
      "Property hunters search online before they call an agent. If your listings are slow, your photos are tiny, and there's no way to filter by budget or location — they go to Property Finder or OLX. I build real estate sites that showcase properties and capture leads.",
    ctaText: "Get a real estate website that closes deals",
    accent: "text-violet-300",
    metaTitle: "Real Estate Website Developer Egypt | Abdelhady Gabriel",
    metaDescription:
      "Custom real estate websites with property search, virtual tours, mortgage calculators, and lead capture. Built by Abdelhady Gabriel — full-stack developer in Egypt.",
    keywords: [
      "real estate website designer Egypt",
      "property website development Cairo",
      "real estate CRM website",
      "property listing website",
      "real estate web design Egypt",
    ],
    painPoints: [
      {
        title: "Listings are slow and clunky",
        body: "If your property pages take 5 seconds to load, buyers leave. Property Finder loads in 1 second — you're losing to them on speed alone.",
      },
      {
        title: "No way to filter properties",
        body: "Buyers want to filter by price, location, bedrooms, and type. If they have to scroll through 200 listings to find 3-bedroom apartments in Maadi, they'll use OLX instead.",
      },
      {
        title: "Photos don't show the property",
        body: "Tiny thumbnail photos don't sell properties. Buyers want full-screen galleries, floor plans, and virtual tours — or they won't even schedule a viewing.",
      },
      {
        title: "No online viewing requests",
        body: "If buyers have to call to schedule a viewing, you lose the ones who browse at midnight. They should be able to request a viewing with one click.",
      },
    ],
    features: [
      {
        title: "Fast property search",
        body: "Filter by price, location, bedrooms, bathrooms, type, and features. Results load instantly. Buyers find what they want in seconds, not minutes.",
      },
      {
        title: "Full-screen photo galleries",
        body: "High-resolution, fast-loading photo galleries with swipe navigation. Floor plans, 360° views, and virtual tour integration.",
      },
      {
        title: "Mortgage calculator",
        body: "Built-in mortgage calculator so buyers can estimate monthly payments. Keeps them on your site instead of bouncing to a bank's calculator.",
      },
      {
        title: "Schedule a viewing online",
        body: "Buyers pick a time slot, enter their details, and get a confirmation. You get an instant notification. No phone tag.",
      },
      {
        title: "Agent profiles",
        body: "Each agent gets a profile with their listings, contact info, and reviews. Buyers build trust with the agent before they call.",
      },
      {
        title: "Lead capture & CRM",
        body: "Every viewing request, contact form, and property inquiry is captured in a simple CRM. Follow up with leads before they go cold.",
      },
    ],
    metrics: [
      { label: "Listing load time", value: "<1s" },
      { label: "Lead capture", value: "24/7" },
      { label: "Search filters", value: "10+" },
      { label: "Mobile-friendly", value: "100%" },
    ],
    faqs: [
      {
        q: "Can I add and edit listings myself?",
        a: "Yes. I build an admin panel where you can add properties, upload photos, set prices, and mark properties as sold/rented — no developer needed.",
      },
      {
        q: "Can you import my existing listings?",
        a: "Yes. If you have listings on Property Finder, OLX, or a spreadsheet, I can import them into your new site. The format doesn't matter — I'll handle the conversion.",
      },
      {
        q: "Does it integrate with my CRM?",
        a: "I can integrate with most CRMs (HubSpot, Salesforce, or custom). If you don't have one, I build a simple lead management dashboard into your site.",
      },
      {
        q: "Can you handle both sales and rentals?",
        a: "Yes. The search system supports both for-sale and for-rent listings, with separate filters and pricing displays. Buyers and renters each get a tailored experience.",
      },
    ],
  },
];

export const industrySlugs = industries.map((i) => i.slug);
