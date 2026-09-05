/**
 * ==============================================================================
 * Restaurant Digital Platform — Centralized Mock Data
 * ==============================================================================
 * Note: All data structures here are decoupled from the UI rendering layer.
 * Any fictional metrics, pricing, and quotes are explicitly labeled as demo/illustrative.
 * In future stages, these will be supplied by central PHP/MySQL backend APIs.
 * ==============================================================================
 */

const PLATFORM_DATA = {
  // Brand & Company Information
  company: {
    name: "RestoOS",
    shortName: "RestoOS",
    tagline: "The Digital Experience Platform for Modern Restaurants",
    valueProposition: "We make your restaurant look better online and make managing it easier.",
    heroHeadline: "Your restaurant deserves a better digital experience.",
    heroSubhead: "Beautiful websites and digital menus designed for modern restaurants — managed entirely from one simple platform.",
    contactEmail: "hello@restoos.demo",
    contactPhone: "+1 (555) 234-5678",
    statusBadge: "Platform Preview • Stage 1 Frontend"
  },

  // Core Platform Features (Hospitality-focused, no ERP/POS bloating)
  features: [
    {
      id: "websites",
      icon: "globe",
      title: "Beautiful Restaurant Websites",
      description: "Professionally designed websites crafted for phones, table dining, and fast mobile browsing with zero lag.",
      badge: "Mobile-First"
    },
    {
      id: "menu-management",
      icon: "edit",
      title: "Simple Menu Management",
      description: "Update dishes, adjust prices, edit descriptions, and toggle 86'd availability in seconds without needing a web developer.",
      badge: "Self-Serve"
    },
    {
      id: "qr-menu",
      icon: "qrcode",
      title: "Fast QR Menu",
      description: "Guests scan your bespoke QR code and instantly browse your complete digital menu on their own smartphone with no app download.",
      badge: "Instant Access"
    },
    {
      id: "whatsapp-ordering",
      icon: "message-circle",
      title: "Direct WhatsApp Ordering",
      description: "Guests assemble their order into a clean digital cart and send a clear, formatted message straight to your restaurant's WhatsApp line.",
      badge: "Order Direct"
    },
    {
      id: "custom-branding",
      icon: "palette",
      title: "Custom Restaurant Branding",
      description: "Showcase your restaurant's unique atmosphere with tailored color palettes, warm typography, custom photography, and logo placement.",
      badge: "Your Identity"
    },
    {
      id: "always-updated",
      icon: "refresh-cw",
      title: "Always Up to Date",
      description: "Any change you make in your private partner dashboard synchronizes across your website instantly once live with central data.",
      badge: "Live Sync"
    }
  ],

  // 4-Step Process
  howItWorks: [
    {
      step: "01",
      title: "We build your restaurant website",
      description: "Our hospitality design team crafts a custom, high-impact digital experience that reflects your kitchen's ambiance, cuisine, and brand character."
    },
    {
      step: "02",
      title: "You manage your menu",
      description: "Easily update seasonal dishes, mark sold-out items, change daily prices, and organize categories directly through your private partner portal."
    },
    {
      step: "03",
      title: "Customers scan your QR code",
      description: "Diners at your tables, bar, or sidewalk scan your elegant printed QR codes and view your rich digital menu on iOS or Android instantly."
    },
    {
      step: "04",
      title: "Customers browse and contact/order",
      description: "Guests explore mouthwatering food photography, check dietary tags, build their order, and send it directly to your staff via WhatsApp."
    }
  ],

  // Showcase Restaurants (LUMÉ is the working reference implementation)
  showcase: [
    {
      id: "lume",
      name: "LUMÉ",
      cuisine: "Modern Mediterranean Dining",
      location: "Beirut, Lebanon",
      description: "Warm Mediterranean ivory tones, serif typography, open fire dishes, dietary filters, and direct WhatsApp table orders.",
      demoUrl: "restaurants/lume/index.html",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
      isLiveReference: true,
      tags: ["Mediterranean", "Fine Casual", "WhatsApp Order", "Active Reference"]
    },
    {
      id: "kohi",
      name: "Kōhī & Co.",
      cuisine: "Specialty Roastery & Minimalist Cafe",
      location: "Kyoto / Shoreditch",
      description: "A serene, minimalist design showcasing single-origin filter roasts, seasonal pastries, and quick morning collection orders.",
      demoUrl: "#",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",
      isLiveReference: false,
      tags: ["Cafe & Bakery", "Minimalist", "Illustrative Concept"]
    },
    {
      id: "fuego",
      name: "Fuego Taquería",
      cuisine: "Artisanal Mexican & Mezcal Bar",
      location: "Oaxaca / Austin",
      description: "Bold rustic textures, wood-fired taco selections, hand-crafted cocktail pairings, and direct outdoor patio seating requests.",
      demoUrl: "#",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
      isLiveReference: false,
      tags: ["Taquería", "Cocktail Bar", "Illustrative Concept"]
    }
  ],

  // Illustrative Partner Dashboard Preview Metrics (Explicitly marked as demo)
  dashboardPreview: {
    isDemo: true,
    restaurantName: "LUMÉ — Beirut",
    planLabel: "Professional Partner",
    stats: [
      { label: "Menu Items", value: "42", note: "Active on digital menu" },
      { label: "Website Visits", value: "1,248", note: "Simulated monthly traffic" },
      { label: "WhatsApp Inquiries", value: "183", note: "Simulated direct contacts" },
      { label: "QR Code Scans", value: "492", note: "Simulated table scans" }
    ],
    recentUpdates: [
      { item: "Burrata", change: "Updated price to $12.00", time: "2 hours ago", status: "Active" },
      { item: "Grilled Sea Bass", change: "Restocked from kitchen", time: "5 hours ago", status: "In Stock" },
      { item: "Truffle Pizza", change: "Highlighted with 'Popular' tag", time: "Yesterday", status: "Featured" }
    ]
  },

  // Pricing Plans (Explicitly marked as illustrative/demonstration pricing)
  pricing: {
    disclaimer: "Example pricing shown for demonstration purposes. Subject to customization upon launch.",
    discountAnnualPercent: 20,
    plans: [
      {
        id: "starter",
        name: "Starter",
        tagline: "Essential digital presence for independent bistros and cafes.",
        priceMonthly: 49,
        priceAnnual: 39,
        featured: false,
        features: [
          "Custom restaurant website",
          "Mobile-optimized digital menu",
          "High-resolution printable QR code",
          "Location, hours & contact info",
          "Cloud hosting included",
          "Standard email support"
        ],
        ctaText: "Select Starter",
        ctaAction: "request-demo.html?plan=starter"
      },
      {
        id: "professional",
        name: "Professional",
        tagline: "Full-featured digital dining and customer ordering for modern restaurants.",
        priceMonthly: 89,
        priceAnnual: 71,
        featured: true,
        featuredBadge: "Most Popular",
        features: [
          "Everything in Starter",
          "WhatsApp cart-to-order integration",
          "Self-serve Menu Management dashboard",
          "Custom brand colors & typography",
          "Special dietary tags & allergens",
          "Illustrative visitor & QR scan analytics",
          "Priority hospitality support"
        ],
        ctaText: "Request Demo with Pro",
        ctaAction: "request-demo.html?plan=professional"
      },
      {
        id: "custom",
        name: "Custom",
        tagline: "Tailored hospitality solutions for multi-location groups and premier venues.",
        priceMonthly: "Custom",
        priceAnnual: "Custom",
        featured: false,
        features: [
          "Everything in Professional",
          "Multi-location restaurant management",
          "Custom domain configuration & SSL",
          "Dedicated photography integration",
          "Custom multi-language menu options",
          "Dedicated hospitality onboarding specialist",
          "Direct phone & WhatsApp emergency support"
        ],
        ctaText: "Talk to Us",
        ctaAction: "schedule.html?plan=custom"
      }
    ]
  },

  // Demo / Illustrative Testimonials (Clearly documented as fictional)
  testimonials: {
    isDemo: true,
    label: "Illustrative Partner Experiences (Demo Showcase)",
    items: [
      {
        quote: "The digital menu gives our guests an elegant dining preview before they even sit down. Managing daily specials from a phone takes less than two minutes during pre-shift prep.",
        author: "Chef Karim Mansour",
        role: "Executive Chef & Founder",
        restaurant: "LUMÉ (Demo Partner)",
        avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300&auto=format&fit=crop"
      },
      {
        quote: "Our guests love how quickly the QR code opens with zero clunky downloads. It made our table turnover smoother and eliminated expensive reprints every time our wine list changed.",
        author: "Elena Rostova",
        role: "General Manager",
        restaurant: "The Brass Brasserie (Demo Partner)",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
      },
      {
        quote: "A rare technology platform that genuinely respects hospitality aesthetics. It doesn't look like an off-the-shelf corporate template—it looks and feels like our restaurant.",
        author: "Marcus Vance",
        role: "Director of Operations",
        restaurant: "Vance Hospitality Group (Demo Partner)",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop"
      }
    ]
  },

  // Frequently Asked Questions
  faqs: [
    {
      q: "How does the restaurant website work?",
      a: "Each restaurant receives a high-speed, mobile-first website tailored with their unique branding, photography, and menu. Guests can browse dishes, filter by dietary preferences, view opening hours, and locate the restaurant effortlessly on any device."
    },
    {
      q: "Can I update my menu myself?",
      a: "Yes. You get access to a private Partner Portal where you can change prices, add seasonal dishes, update descriptions, and toggle items on or off in real time without writing any code or waiting for a web designer."
    },
    {
      q: "Do I need technical knowledge?",
      a: "Not at all. The platform was created specifically for busy restaurant owners and floor managers. If you know how to send a text message or post a photo, you can effortlessly manage your digital menu and restaurant details."
    },
    {
      q: "Can customers order through WhatsApp?",
      a: "Yes. Customers can add menu items to their digital cart, customize items where available, and tap a single button to generate a clean, itemized order message sent directly to your restaurant's designated WhatsApp phone line."
    },
    {
      q: "Can I use my own domain?",
      a: "Yes. In the full platform deployment, your restaurant website can connect to your own custom domain (e.g., yourrestaurant.com) or use a dedicated custom subdomain provided by the platform."
    },
    {
      q: "Do you provide QR codes?",
      a: "Yes. You receive high-resolution, print-ready QR codes designed for table stands, menus, window decals, or receipts that link guests directly to your fast mobile digital menu."
    },
    {
      q: "Can I change my restaurant's colors and branding?",
      a: "Absolutely. The platform gives you control over your brand accent colors, logo, typography styling, hero photography, and social links to ensure your digital presence is completely faithful to your physical restaurant atmosphere."
    },
    {
      q: "How quickly can my website be launched?",
      a: "Once we have your menu content, photos, and basic restaurant information, your complete digital experience can be configured and live in as little as 48 to 72 hours."
    }
  ]
};

// Expose globally for vanilla browser scripts
if (typeof window !== "undefined") {
  window.PLATFORM_DATA = PLATFORM_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PLATFORM_DATA };
}
