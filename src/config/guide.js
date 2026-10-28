// Pages where the guide keeps clear of the content: it only travels near section boundaries,
// finishes its hop when scrolling stops, and parks in free space beside the content (smaller, or
// without its bubble, when space is tight; tucked in the bottom corner when there is none).
// Opt-in only; empty so every page (CMMS included) runs the same travelling animation as Home.
export const guideAvoidPaths = [];

// Steps for the AI guide that travels the page. The key matches a section's data-guide attribute.
// side: which edge of the screen the guide parks on; mood: idle animation while it is there.
export const guideSteps = {
  hero: {
    side: "left",
    mood: "wave",
    text: "Hi, I'm your TZI AI guide! Let me show you how we turn big dreams into bigger products.",
  },
  // Used by the e-commerce page hero (data-guide="ecommerceHero"). Parks on the left so it
  // never covers the shopper and product cards on the right.
  ecommerceHero: {
    side: "left",
    mood: "wave",
    text: "Hi, I'm your TZI AI guide! Let's build an online store your customers will love to shop.",
  },
  // Used by the e-commerce services section (data-guide="ecommerceServices"). Opposite side from
  // "ecommerceHero" so the guide sweeps across, and clear of the cart image on the left.
  ecommerceServices: {
    side: "right",
    mood: "point",
    text: "From product pages to secure checkout, we build stores that help you sell more.",
  },
  // The rest of the e-commerce page, in scroll order. Sides keep alternating (hero left, services
  // right, ... CTA right, then the site-wide testimonials left and footer right), so the guide
  // sweeps across the screen at every step.
  ecommerceOfferings: {
    side: "left",
    mood: "hop",
    text: "Custom platform, mobile app, integrations or a migration, tell me where you're starting!",
  },
  ecommerceSolutions: {
    side: "right",
    mood: "point",
    text: "Global reach, smarter data and room to scale, here's what a TZI store gives you.",
  },
  ecommerceProcess: {
    side: "left",
    mood: "point",
    text: "From the first idea to going live and beyond, this is how we'll build your store together.",
  },
  ecommerceWhyChoose: {
    side: "right",
    mood: "boost",
    text: "Practical business sense plus modern tech, that's why brands across India choose TZI.",
  },
  ecommerceIndustries: {
    side: "left",
    mood: "hop",
    text: "Fashion, food, retail or home goods, we build for every shelf. Hover or tap a card to zoom in!",
  },
  ecommerceCta: {
    side: "right",
    mood: "wave",
    text: "Ready when you are! Start a project or book a free demo, I'll be right here.",
  },
  // Blockchain page, in scroll order (data-guide on each section). Sides alternate and end on
  // "right" before the site-wide testimonials ("left"), so the guide sweeps across at every step.
  // The short "What is" intro keeps the hero's line. Tapping the guide opens the TZI Assistant chat,
  // so the lines point visitors to it.
  bcHero: {
    side: "left",
    mood: "wave",
    text: "Hi, I'm your TZI AI guide! Tap me anytime to ask about blockchain, tokenization and smart contracts.",
  },
  bcServices: {
    side: "right",
    mood: "point",
    text: "BaaS, consulting, custom networks and full platforms, the wheel keeps turning with everything we build.",
  },
  bcWhyChoose: {
    side: "left",
    mood: "hop",
    text: "With TZI you never just hand over an idea, we work through every question and decision with you.",
  },
  bcBenefits: {
    side: "right",
    mood: "boost",
    text: "Blockchain plus AI: safer transactions, smarter automation and data you can trust.",
  },
  bcCrypto: {
    side: "left",
    mood: "point",
    text: "Exchanges, wallets, payment gateways and RWA tokenization. Tap a row to open it!",
  },
  bcTech: {
    side: "right",
    mood: "hop",
    text: "Ethereum, Polygon, Solana, BNB Smart Chain, Cardano and Hyperledger, we pick the right chain for you.",
  },
  bcRoadmap: {
    side: "left",
    mood: "point",
    text: "Six clear steps from consultation to launch and support, as transparent as blockchain itself.",
  },
  bcFaq: {
    side: "right",
    mood: "wave",
    text: "Still curious? Open a question below, or tap me to chat with our AI.",
  },
  // LMS page hero (data-guide="lmsHero"). Parks on the left, clear of the dashboard on the right.
  lmsHero: {
    side: "left",
    mood: "wave",
    text: "Hi, I'm your TZI AI guide! Let's build training your team will actually enjoy.",
  },
  lmsWhiteLabel: {
    side: "right",
    mood: "point",
    text: "Your brand, your courses, your analytics, a white label LMS built around how your team learns.",
  },
  lmsTailorMade: {
    side: "left",
    mood: "hop",
    text: "Keep scrolling, there's more to a tailor-made LMS than meets the eye!",
  },
  lmsFeatureDrive: {
    side: "right",
    mood: "boost",
    text: "Buckle up! Scroll faster and watch nine LMS features race by.",
  },
  lmsWhyChoose: {
    side: "left",
    mood: "point",
    text: "Built for your users, ready to scale. Open a point to see why teams choose TZI.",
  },
  lmsWhichFits: {
    side: "right",
    mood: "hop",
    text: "Your own brand or ready to go? Compare White-Label and SaaS LMS side by side.",
  },
  lmsCta: {
    side: "right",
    mood: "wave",
    text: "Ready to build your LMS? Start a project or book a free demo, I'll be right here.",
  },
  // CRM page hero (data-guide="crmHero"). Parks on the left, clear of the dashboard on the right.
  crmHero: {
    side: "left",
    mood: "wave",
    text: "Hi, I'm your TZI AI guide! Let's turn every client inquiry into a lasting relationship.",
  },
  crmCustomDevelopment: {
    side: "left",
    mood: "point",
    text: "A CRM built around how you sell, not the other way round. Take a look at the dashboard!",
  },
  crmOneStop: {
    side: "right",
    mood: "hop",
    text: "Custom, mobile, enterprise or startup, six ways we build a CRM that fits your business.",
  },
  crmFeatures: {
    side: "left",
    mood: "boost",
    text: "Deals, wins, leaderboards, tasks and chat. Scroll and watch the CRM come into focus!",
  },
  crmWhy: {
    side: "right",
    mood: "wave",
    text: "Ready-made or built from scratch, with AI and ongoing support. Here's why teams pick TZI CRM.",
  },
  crmIndustries: {
    side: "left",
    mood: "hop",
    text: "IT, training, finance and more. Keep scrolling to see how TZI CRM fits each industry!",
  },
  crmTech: {
    side: "right",
    mood: "point",
    text: "PHP, Laravel, AWS and more. Hover a tile to see the tech behind TZI CRM.",
  },
  crmBenefits: {
    side: "left",
    mood: "point",
    text: "Better relationships, smoother workflows, higher ROI, six reasons a custom CRM pays off.",
  },
  // CMMS page hero (data-guide="cmmsHero"). Parks on the left, clear of the dashboard on the right.
  // The CMMS steps alternate sides like the Home page (after the site-wide "clients", right), so the
  // guide sweeps across at every step; FAQ and the site-wide testimonials share the left.
  cmmsHero: {
    side: "left",
    mood: "wave",
    text: "Hi, I'm your TZI AI guide! Let's keep your equipment running and your maintenance on schedule.",
  },
  cmmsAppDevelopment: {
    side: "left",
    mood: "point",
    text: "Preventive, breakdown and spares, three ways our CMMS keeps your maintenance on track.",
  },
  cmmsServices: {
    side: "right",
    mood: "point",
    text: "From custom builds to asset integration, here's how we shape a CMMS around your maintenance.",
  },
  cmmsFeatures: {
    side: "left",
    mood: "boost",
    text: "Six key CMMS features, always in motion. Scroll faster and watch them spin!",
  },
  cmmsBenefits: {
    side: "right",
    mood: "point",
    text: "Five gains for your maintenance team. Hover or tap a card to bring it to the front!",
  },
  cmmsDataAction: {
    side: "left",
    mood: "point",
    text: "Reliability, longer-lasting equipment, safety and savings, that's what your data turns into.",
  },
  cmmsWhyChoose: {
    side: "right",
    mood: "wave",
    text: "Custom-built, future-ready and cost-effective, here's why teams choose TZI for their CMMS.",
  },
  cmmsFaq: {
    side: "left",
    mood: "wave",
    text: "Still curious about CMMS? Open a question below, or tap me to chat with our AI.",
  },
  // ERP page hero (data-guide="erpHero"). Parks on the left, clear of the dashboard on the right.
  erpHero: {
    side: "left",
    mood: "wave",
    text: "Hi, I'm your TZI AI guide! Let's bring your teams, data and daily operations into one place.",
  },
  erpServices: {
    side: "right",
    mood: "point",
    text: "Five ways we build ERP. Hover or tap a card to bring it to the front!",
  },
  erpFeatures: {
    side: "left",
    mood: "boost",
    text: "Six power-packed features, always in motion. Scroll faster and watch them spin!",
  },
  erpBenefits: {
    side: "right",
    mood: "point",
    text: "Lower costs, faster ROI and data you can trust, that's what a TZI ERP delivers.",
  },
  erpEstimator: {
    side: "left",
    mood: "point",
    text: "Four quick steps and our team will send you a personalized ERP cost estimate.",
  },
  erpTech: {
    side: "right",
    mood: "hop",
    text: "Laravel, PHP, AWS, Google Cloud and more. Hover a logo to see what we build with!",
  },
  erpFaq: {
    side: "left",
    mood: "wave",
    text: "Still curious about ERP? Open a question below, or tap me to chat with our AI.",
  },
  clients: {
    side: "right",
    mood: "hop",
    text: "400+ clients across 15+ countries already trust TZI with their digital journey.",
  },
  welcome: {
    side: "left",
    mood: "point",
    text: "Web, Mobility, IoT, AI & Managed Services, all in one place. Try tapping the rocket!",
  },
  flight: {
    side: "right",
    mood: "boost",
    text: "From digitization to talent on demand, pick a service and we'll launch it together.",
  },
  // Sits opposite the preceding TZI intro step ("water", side: "right") so the
  // guide visibly sweeps right-to-left as you scroll into this section.
  devServices: {
    side: "left",
    mood: "point",
    text: "Web, mobile, or blockchain, whatever you're building next, this is where we build it.",
  },
  // Used by the AI Solutions section (add data-guide="ai" to it).
  ai: {
    side: "left",
    mood: "wave",
    text: "That's my family! Voice, RAG, agents, workflows and multimodal AI. Got an AI vision? Book a free demo.",
  },
  // Used by the TZI intro section (data-guide="water"): hovers over the ripples.
  water: {
    side: "right",
    mood: "hop",
    text: "Every big change starts with one small ripple. Let's make waves together!",
  },
  // Used by the "What Sets Our Solutions Apart?" section (add data-guide="solutions" to it).
  solutions: {
    side: "right",
    mood: "point",
    text: "Six reasons every TZI build stands apart, from the first sketch to the last deploy.",
  },
  // Used by the site-wide testimonials section (data-guide="testimonials"). Rendered from the
  // root layout on every page — opposite side from "solutions" so it still sweeps in, even on
  // pages with no earlier steps.
  testimonials: {
    side: "left",
    mood: "wave",
    text: "Don't just take our word for it, here's what real TZI clients have to say.",
  },
  // Used by the site-wide Contact Us section (data-guide="contact"), between the testimonials and
  // the footer on every page. Parks on the right, just above the chat launcher.
  // bubbleMinWidth: below tablet width the bubble would sit over the form, so the guide just parks
  // there quietly.
  contact: {
    side: "right",
    mood: "point",
    text: "Ready to talk? Fill in the form, or tap me to chat with our AI.",
    bubbleMinWidth: 768,
  },
  // Used by the site-wide footer (data-guide="footer"): the last stop on every page. Opposite
  // side from "testimonials" so the guide sweeps across one final time to say goodbye.
  footer: {
    side: "right",
    mood: "wave",
    text: "Thanks for exploring TZI! Tap me or 'Chat with AI' anytime, I'm always here to help.",
  },
};
